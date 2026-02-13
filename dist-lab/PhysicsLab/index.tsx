import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, StatsGl, Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { logAction } from '../components/lab/GradingSystem';
import { useCollaboration } from '../lib/collaboration';

interface PhysicsLabProps {
  experimentId: string;
}

function DraggableBox({ onMove }: { onMove: (pos: THREE.Vector3) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { camera, raycaster, pointer } = useThree();
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  
  useCursor(hovered);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setDragging(true);
    // 捕获时禁用控制器
    const controls = (camera as any).controls;
    if (controls) controls.enabled = false;
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    setDragging(false);
    const controls = (camera as any).controls;
    if (controls) controls.enabled = true;
    onMove(meshRef.current!.position.clone());
  };

  const handlePointerMove = (e: any) => {
    if (dragging && meshRef.current) {
      raycaster.setFromCamera(pointer, camera);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(planeRef.current, target);
      if (target) {
        // 限制移动范围
        target.y = 1;
        meshRef.current.position.copy(target);
        onMove(target);
      }
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[0, 1, 0]}
      castShadow
      receiveShadow
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "#60a5fa" : "#3b82f6"} />
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="black">
        拖拽我
      </Text>
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#f1f5f9" />
      <gridHelper args={[50, 50, 0xcbd5e1, 0xe2e8f0]} rotation-x={Math.PI / 2} />
    </mesh>
  );
}

// 协同位置同步器
function CollaborationSync({ experimentId }: { experimentId: string }) {
  const { broadcastPosition } = useCollaboration(experimentId);
  const { camera } = useThree();

  // 每 100ms 广播一次视角中心或鼠标位置
  useEffect(() => {
    const interval = setInterval(() => {
      // 这里简化为广播摄像机位置，实际应广播鼠标在 3D 世界的投影
      broadcastPosition(50, 50, 0); 
    }, 100);
    return () => clearInterval(interval);
  }, [broadcastPosition]);

  return null;
}

export const PhysicsLab: React.FC<PhysicsLabProps> = ({ experimentId }) => {
  const handleObjectMove = (pos: THREE.Vector3) => {
    logAction(experimentId, 'move_object', { x: pos.x.toFixed(2), z: pos.z.toFixed(2) });
    
    // 简单的触发判定
    if (Math.abs(pos.x) > 4 || Math.abs(pos.z) > 4) {
      logAction(experimentId, 'complete', { reason: 'reached_boundary' });
    }
  };

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'physics_lab' });
  }, [experimentId]);

  return (
    <div className="w-full h-full bg-slate-900">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white">加载 3D 物理引擎...</div>}>
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <Ground />
          <DraggableBox onMove={handleObjectMove} />
          
          <OrbitControls makeDefault />
          <StatsGl />
          <CollaborationSync experimentId={experimentId} />
        </Canvas>
      </Suspense>
      
      <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded text-xs text-white pointer-events-none">
        操作指南：左键拖拽方块，右键旋转视角，滚轮缩放
      </div>
    </div>
  );
};

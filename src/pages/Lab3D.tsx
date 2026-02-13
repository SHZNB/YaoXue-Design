import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, StatsGl } from '@react-three/drei'
import * as THREE from 'three'

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[50, 50, 1, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
  )
}

function Box() {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const [drag, setDrag] = React.useState(false)

  return (
    <mesh
      ref={meshRef}
      position={[0, 1, 0]}
      castShadow
      onPointerDown={() => setDrag(true)}
      onPointerUp={() => setDrag(false)}
      onPointerMove={(e) => {
        if (!drag) return
        meshRef.current?.position.copy(e.point)
        meshRef.current!.position.y = 1
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}

export const Lab3D: React.FC = () => {
  return (
    <div className="h-[70vh] bg-white rounded-xl shadow">
      <Suspense fallback={<div className="p-4 text-sm">加载实验环境...</div>}>
        <Canvas shadows camera={{ position: [6, 6, 6], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[6, 10, 6]} angle={0.25} penumbra={1} castShadow />
          <Ground />
          <Box />
          <OrbitControls />
          <StatsGl />
        </Canvas>
      </Suspense>
    </div>
  )
}

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { logAction } from '../components/lab/GradingSystem';
import { Sprout, Sun, CloudRain, Droplets } from 'lucide-react';

interface BiologyLabProps {
  experimentId: string;
}

// 植物生长模型 (简单 L-System 模拟)
function Plant({ stage }: { stage: number }) {
  const height = Math.min(stage * 0.5, 3);
  const color = stage > 4 ? '#22c55e' : '#86efac';
  
  return (
    <group position={[0, 0, 0]}>
      {/* 茎 */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.05 + stage * 0.02, 0.05 + stage * 0.02, height, 8]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      
      {/* 叶子 */}
      {stage > 2 && (
        <group position={[0, height * 0.6, 0]} rotation={[0.5, 0, 0]}>
          <mesh position={[0.3, 0, 0]}>
            <ellipsoidGeometry args={[0.3, 0.05, 0.15]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      )}
      {stage > 3 && (
        <group position={[0, height * 0.8, 0]} rotation={[-0.5, 2, 0]}>
          <mesh position={[0.3, 0, 0]}>
            <ellipsoidGeometry args={[0.25, 0.05, 0.12]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      )}

      {/* 花朵 */}
      {stage >= 5 && (
        <group position={[0, height, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
          <pointLight color="#f472b6" intensity={0.5} distance={1} />
        </group>
      )}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <cylinderGeometry args={[4, 4, 0.5, 32]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
  );
}

export const BiologyLab: React.FC<BiologyLabProps> = ({ experimentId }) => {
  const [params, setParams] = useState({
    water: 50,
    sunlight: 50,
    fertilizer: 50
  });
  const [growthStage, setGrowthStage] = useState(1);
  const [day, setDay] = useState(1);
  const [status, setStatus] = useState('种子已播种');

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'biology_lab' });
  }, [experimentId]);

  // 模拟生长逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setDay(d => d + 1);
      
      setGrowthStage(prev => {
        // 生长条件判断
        let growthRate = 0;
        if (params.water > 30 && params.water < 80) growthRate += 0.1;
        if (params.sunlight > 40 && params.sunlight < 90) growthRate += 0.1;
        if (params.fertilizer > 20 && params.fertilizer < 70) growthRate += 0.1;
        
        // 极端条件枯萎
        if (params.water === 0 || params.water === 100) return Math.max(0, prev - 0.2);
        
        const nextStage = Math.min(5, prev + growthRate);
        
        if (Math.floor(nextStage) > Math.floor(prev)) {
          logAction(experimentId, 'growth_update', { stage: Math.floor(nextStage), day });
        }
        
        if (nextStage >= 5 && prev < 5) {
          logAction(experimentId, 'complete', { result: 'bloomed' });
          setStatus('植物开花了！实验成功！');
        } else if (nextStage <= 0) {
          setStatus('植物枯萎了...');
        } else {
          setStatus(`生长中... 第 ${day} 天`);
        }
        
        return nextStage;
      });
    }, 2000); // 2秒模拟一天

    return () => clearInterval(interval);
  }, [params, experimentId, day]);

  return (
    <div className="w-full h-full flex bg-green-900">
      {/* 3D 视图 */}
      <div className="flex-1 relative">
        <Suspense fallback={<div className="text-white p-10">加载植物模型...</div>}>
          <Canvas shadows camera={{ position: [5, 5, 5], fov: 45 }}>
            <ambientLight intensity={params.sunlight / 100} />
            <spotLight 
              position={[5, 10, 5]} 
              intensity={params.sunlight / 50} 
              castShadow 
              color="#fef3c7"
            />
            <Ground />
            <Plant stage={growthStage} />
            <OrbitControls maxPolarAngle={Math.PI / 2.2} />
            
            <Html position={[0, 3, 0]}>
              <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-green-800 whitespace-nowrap">
                {status} (阶段: {growthStage.toFixed(1)})
              </div>
            </Html>
          </Canvas>
        </Suspense>
      </div>

      {/* 控制面板 */}
      <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sprout className="text-green-600" /> 生长环境控制
        </h3>

        <div className="space-y-4">
          <ControlSlider 
            label="水分" 
            icon={<Droplets size={18} className="text-blue-500" />}
            value={params.water}
            onChange={v => setParams(p => ({ ...p, water: v }))}
            color="bg-blue-500"
          />
          <ControlSlider 
            label="光照" 
            icon={<Sun size={18} className="text-amber-500" />}
            value={params.sunlight}
            onChange={v => setParams(p => ({ ...p, sunlight: v }))}
            color="bg-amber-500"
          />
          <ControlSlider 
            label="肥料" 
            icon={<CloudRain size={18} className="text-emerald-500" />}
            value={params.fertilizer}
            onChange={v => setParams(p => ({ ...p, fertilizer: v }))}
            color="bg-emerald-500"
          />
        </div>

        <div className="mt-auto bg-green-50 p-4 rounded-xl text-sm text-green-800">
          <h4 className="font-bold mb-2">实验小贴士</h4>
          <p>植物生长需要适宜的水分、阳光和养分。过量或不足都会导致植物枯萎。试着找到最佳平衡点！</p>
        </div>
      </div>
    </div>
  );
};

const ControlSlider = ({ label, icon, value, onChange, color }: any) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon} {label}
      </span>
      <span className="text-xs font-bold text-slate-500">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-${color.split('-')[1]}-600`}
    />
  </div>
);

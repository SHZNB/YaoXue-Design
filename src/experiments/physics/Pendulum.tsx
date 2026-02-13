import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { logAction } from '../../utils/logger';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';
import { ParticleSystem } from '../../components/lab/ParticleSystem';

interface PendulumProps {
  experimentId: string;
}

interface DataPoint {
  length: string;
  mass: string;
  angle: string;
  period: string;
  [key: string]: unknown;
}

interface PendulumModelProps {
  length: number;
  mass: number;
  initialAngle: number;
  isPlaying: boolean;
  onUpdate: (angle: number, time: number) => void;
}

export const Pendulum: React.FC<PendulumProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [length, setLength] = useState(5);
  const [mass, setMass] = useState(1);
  const [angle, setAngle] = useState(30); // Degrees
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(angle);
  const [time, setTime] = useState(0);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [targetPeriod, setTargetPeriod] = useState(0);
  const [showEffects, setShowEffects] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);

  useEffect(() => {
    if (challengeMode) {
      // Random target period between 2s and 6s
      setTargetPeriod(Math.random() * 4 + 2);
    }
  }, [challengeMode]);

  useEffect(() => {
    if (!isPlaying) {
      setCurrentAngle(angle);
      setTime(0);
    }
  }, [angle, isPlaying]);

  const handleRecord = () => {
    const period = 2 * Math.PI * Math.sqrt(length / 9.8);
    const newDataPoint = {
      length: length.toFixed(2) + ' m',
      mass: mass.toFixed(2) + ' kg',
      angle: angle.toFixed(1) + '°',
      period: period.toFixed(2) + ' s'
    };
    
    setDataPoints(prev => [...prev, newDataPoint]);
    logAction(experimentId, 'record_data', newDataPoint);

    if (challengeMode) {
      const diff = Math.abs(period - targetPeriod);
      if (diff < 0.1) {
        setShowEffects(true);
        logAction(experimentId, 'challenge_success', { target: targetPeriod, actual: period });
      }
    }
  };

  const columns = [
    { key: 'length', label: t('physics.pendulum.length') },
    { key: 'mass', label: t('physics.pendulum.mass') },
    { key: 'angle', label: t('physics.pendulum.angle') },
    { key: 'period', label: t('physics.pendulum.period') },
  ];

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="flex-1 relative bg-slate-900 flex overflow-hidden">
        <div className="flex-1 relative">
          <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            
            <PendulumModel 
              length={length} 
              mass={mass} 
              initialAngle={angle * (Math.PI / 180)} 
              isPlaying={isPlaying}
              onUpdate={(a, t) => {
                setCurrentAngle(a * (180 / Math.PI));
                setTime(t);
              }}
            />

            <OrbitControls />
          </Canvas>

          {/* Effects */}
          <Canvas style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
             <ParticleSystem 
               trigger={showEffects} 
               position={[0, 0, 0]} 
               color="#22c55e"
               count={50}
               onComplete={() => setShowEffects(false)}
             />
          </Canvas>

          {/* Challenge Overlay */}
          {challengeMode && (
            <div className="absolute top-4 left-4 bg-amber-500/90 p-4 rounded-lg text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">🎯 Challenge</h3>
              <p>Target Period: <span className="font-mono text-xl">{targetPeriod.toFixed(2)}s</span></p>
              <p className="text-xs opacity-80 mt-1">Adjust length to match!</p>
            </div>
          )}

          {/* Data Overlay */}
          <div className="absolute top-4 right-4 bg-black/70 p-4 rounded-lg text-white font-mono text-sm w-48 pointer-events-none">
            <div className="flex justify-between mb-1">
              <span>{t('physics.pendulum.period')}:</span>
              <span>{(2 * Math.PI * Math.sqrt(length / 9.8)).toFixed(2)} s</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>{t('physics.pendulum.angle')}:</span>
              <span>{currentAngle.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between">
              <span>{t('physics.free_fall.time')}:</span>
              <span>{time.toFixed(2)} s</span>
            </div>
          </div>
        </div>

        {/* Data Panel */}
        <div className="w-96 border-l border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4">
          <ExperimentDataPanel
            title={t('lab.data_record')}
            columns={columns}
            data={dataPoints}
            onRecord={handleRecord}
            className="h-full bg-slate-900/50 border-slate-700"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="h-48 bg-white border-t border-slate-200 p-6 flex gap-8">
        <div className="flex-1 space-y-4">
          <ControlSlider label={`${t('physics.pendulum.length')} (m)`} value={length} min={1} max={10} step={0.1} onChange={setLength} disabled={isPlaying} />
          <ControlSlider label={`${t('physics.pendulum.mass')} (kg)`} value={mass} min={0.1} max={5} step={0.1} onChange={setMass} disabled={isPlaying} />
          <ControlSlider label={`${t('physics.pendulum.angle')} (°)`} value={angle} min={5} max={90} step={1} onChange={setAngle} disabled={isPlaying} />
        </div>
        
        <div className="flex flex-col justify-center gap-4 w-48">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-full py-3 text-white rounded-lg font-bold shadow-lg transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-400' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {isPlaying ? t('physics.pendulum.pause') : t('physics.pendulum.start')}
          </button>
          <button 
            onClick={() => { setIsPlaying(false); setAngle(30); }}
            className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-all"
          >
            {t('lab.reset')}
          </button>
          
          <button 
            onClick={() => setChallengeMode(!challengeMode)}
            className={`w-full py-2 border-2 rounded-lg font-bold transition-all ${challengeMode ? 'border-amber-500 text-amber-500' : 'border-slate-300 text-slate-500'}`}
          >
            {challengeMode ? 'Exit Challenge' : '🏆 Challenge Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PendulumModel = ({ length, mass, initialAngle, isPlaying, onUpdate }: PendulumModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(0);
  const pausedTime = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      startTime.current = Date.now() - pausedTime.current * 1000;
    } else {
      pausedTime.current = (Date.now() - startTime.current) / 1000;
    }
  }, [isPlaying]);

  useFrame(() => {
    if (groupRef.current) {
      let theta = initialAngle;
      let t = 0;
      
      if (isPlaying) {
        t = (Date.now() - startTime.current) / 1000;
        const omega = Math.sqrt(9.8 / length);
        theta = initialAngle * Math.cos(omega * t);
        onUpdate(theta, t);
      } else {
        // When paused, maintain position based on last updated theta (or initial if never started)
        // Here we just re-calculate from pausedTime for simplicity in resume logic
        if (pausedTime.current > 0) {
           const omega = Math.sqrt(9.8 / length);
           theta = initialAngle * Math.cos(omega * pausedTime.current);
        }
      }

      groupRef.current.rotation.z = theta;
    }
  });

  return (
    <group position={[0, 10, 0]}>
      {/* Pivot */}
      <mesh>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {/* Pendulum Arm */}
      <group ref={groupRef}>
        <mesh position={[0, -length / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, length]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        
        {/* Bob */}
        <mesh position={[0, -length, 0]}>
          <sphereGeometry args={[0.3 * Math.pow(mass, 0.3), 32, 32]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
    </group>
  );
};

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ControlSlider = ({ label, value, min, max, step, onChange, disabled }: ControlSliderProps) => (
  <div className="flex items-center gap-4">
    <label className="w-32 text-sm font-bold text-slate-600">{label}</label>
    <input 
      type="range" 
      min={min} max={max} step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
    />
    <span className="w-12 text-right text-sm font-mono text-slate-800">{value}</span>
  </div>
);

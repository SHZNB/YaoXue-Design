import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { logAction } from '../../utils/logger';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';
import { ParticleSystem } from '../../components/lab/ParticleSystem';

interface FreeFallProps {
  experimentId: string;
}

interface DataPoint {
  time: string;
  height: string;
  velocity: string;
  [key: string]: unknown;
}

export const FreeFall: React.FC<FreeFallProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [height, setHeight] = useState(10);
  const [gravity, setGravity] = useState(9.8);
  const [mass, setMass] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ballY, setBallY] = useState(height);
  const [time, setTime] = useState(0);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [showEffects, setShowEffects] = useState(false);
  
  // Ref for animation loop
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'free_fall', params: { height, gravity, mass } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  const ballYRef = useRef(height);
  const timeRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);

  // Update refs when height changes
  useEffect(() => {
    if (!isPlaying) {
      ballYRef.current = height;
      timeRef.current = 0;
      setBallY(height);
      setTime(0);
    }
  }, [height, isPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    logAction(experimentId, 'start_simulation');
  };

  const handleReset = () => {
    setIsPlaying(false);
    ballYRef.current = height;
    timeRef.current = 0;
    setBallY(height);
    setTime(0);
    startTimeRef.current = null;
    setDataPoints([]);
    logAction(experimentId, 'reset');
  };

  // Throttled UI update (10fps)
  const updateUI = (y: number, t: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > 100) { // 100ms = 10fps
      setBallY(y);
      setTime(t);
      lastUpdateTimeRef.current = now;
    }
  };

  const handleUpdate = (y: number, t: number) => {
    ballYRef.current = y;
    timeRef.current = t;
    
    updateUI(y, t);

    if (y <= 0.5) {
      setIsPlaying(false);
      setBallY(y); // Ensure final position is set
      setTime(t);
      handleGroundHit(t);
      setShowEffects(true);
    }
  };

  const handleGroundHit = (finalTime: number) => {
    const finalVelocity = gravity * finalTime;
    const newDataPoint = {
      time: finalTime.toFixed(2) + ' s',
      height: height.toFixed(2) + ' m',
      velocity: finalVelocity.toFixed(2) + ' m/s'
    };
    
    setDataPoints(prev => [...prev, newDataPoint]);
    logAction(experimentId, 'record_data', newDataPoint);
  };

  const columns = [
    { key: 'time', label: t('physics.free_fall.time') },
    { key: 'height', label: t('physics.free_fall.height') },
    { key: 'velocity', label: t('physics.free_fall.velocity') },
  ];

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="flex-1 relative bg-slate-900 flex overflow-hidden">
        <div className="flex-1 relative">
          <Canvas shadows camera={{ position: [15, 10, 15], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 20, 10]} intensity={1} castShadow />
            <gridHelper args={[20, 20]} />
            
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Ball */}
            <Ball 
              y={ballY} // Initial position for React render, actual animation via ref
              radius={0.5 * Math.pow(mass, 0.3)} 
              isPlaying={isPlaying}
              initialHeight={height}
              gravity={gravity}
              onUpdate={handleUpdate}
            />

            {/* Particle Effects on Impact */}
            <ParticleSystem 
              trigger={showEffects} 
              position={[0, 0.5, 0]} 
              color="#fbbf24"
              count={30}
              onComplete={() => setShowEffects(false)}
            />

            {/* Height Marker */}
            <Html position={[0, height, 0]}>
              <div className="text-white text-xs bg-black/50 px-1 rounded transform -translate-x-1/2">
                {height}m
              </div>
            </Html>

            <OrbitControls />
          </Canvas>

          {/* Data Overlay */}
          <div className="absolute top-4 right-4 bg-black/70 p-4 rounded-lg text-white font-mono text-sm w-48 pointer-events-none">
            <div className="flex justify-between mb-1">
              <span>{t('physics.free_fall.time')}:</span>
              <span>{time.toFixed(2)} s</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>{t('physics.free_fall.height')}:</span>
              <span>{ballY.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span>{t('physics.free_fall.velocity')}:</span>
              <span>{(gravity * time).toFixed(2)} m/s</span>
            </div>
          </div>
        </div>

        {/* Data Panel */}
        <div className="w-96 border-l border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4">
          <ExperimentDataPanel
            title={t('lab.data_record')}
            columns={columns}
            data={dataPoints}
            className="h-full bg-slate-900/50 border-slate-700"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="h-48 bg-white border-t border-slate-200 p-6 flex gap-8">
        <div className="flex-1 space-y-4">
          <ControlSlider label={`${t('physics.free_fall.initial_height')} (m)`} value={height} min={1} max={20} step={1} onChange={setHeight} disabled={isPlaying} />
          <ControlSlider label={`${t('physics.free_fall.gravity_accel')} (m/s²)`} value={gravity} min={1.6} max={20} step={0.1} onChange={setGravity} disabled={isPlaying} />
          <ControlSlider label={`${t('physics.free_fall.mass')} (kg)`} value={mass} min={0.1} max={10} step={0.1} onChange={setMass} disabled={isPlaying} />
        </div>
        
        <div className="flex flex-col justify-center gap-4 w-48">
          {!isPlaying ? (
            <button 
              onClick={handleStart}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-all"
            >
              {t('physics.free_fall.start')}
            </button>
          ) : (
            <button 
              onClick={handleReset}
              className="w-full py-3 bg-red-500 hover:bg-red-400 text-white rounded-lg font-bold shadow-lg transition-all"
            >
              {t('lab.reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface BallProps {
  y: number;
  radius: number;
  isPlaying: boolean;
  initialHeight: number;
  gravity: number;
  onUpdate: (y: number, time: number) => void;
}

const Ball = ({ y, radius, isPlaying, initialHeight, gravity, onUpdate }: BallProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(0);

  useEffect(() => {
    if (isPlaying) startTime.current = Date.now();
  }, [isPlaying]);

  useFrame(() => {
    if (isPlaying && meshRef.current) {
      const elapsed = (Date.now() - startTime.current) / 1000;
      // h = h0 - 0.5 * g * t^2
      const newY = Math.max(radius, initialHeight - 0.5 * gravity * elapsed * elapsed);
      
      // Direct DOM manipulation for smooth animation
      meshRef.current.position.y = newY;
      
      onUpdate(newY, elapsed);
    } else if (!isPlaying && meshRef.current) {
        // Ensure visual sync when stopped/reset
        meshRef.current.position.y = y;
    }
  });

  return (
    <Sphere ref={meshRef} args={[radius, 32, 32]} position={[0, y, 0]} castShadow>
      <meshStandardMaterial color="#ef4444" roughness={0.4} metalness={0.1} />
    </Sphere>
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

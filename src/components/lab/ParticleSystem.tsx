import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  position?: [number, number, number];
  trigger: boolean;
  onComplete?: () => void;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 50, 
  color = '#fbbf24', 
  position = [0, 0, 0],
  trigger,
  onComplete 
}) => {
  const points = useRef<THREE.Points>(null);
  const active = useRef(false);
  const startTime = useRef(0);

  // Initialize particles
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3); // positions
    const velocity = new Float32Array(count * 3); // velocities
    
    for (let i = 0; i < count; i++) {
      // Random spread
      temp[i * 3] = (Math.random() - 0.5) * 0.5;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Explosion velocity
      velocity[i * 3] = (Math.random() - 0.5) * 5;
      velocity[i * 3 + 1] = Math.random() * 5 + 2; // Upward bias
      velocity[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    return {
      positions: temp,
      velocities: velocity,
      initialPositions: new Float32Array(temp) // clone for reset
    };
  }, [count]);

  // Reset/Trigger logic
  if (trigger && !active.current) {
    active.current = true;
    startTime.current = Date.now();
    // Reset positions
    if (points.current) {
      const posAttr = points.current.geometry.attributes.position as THREE.BufferAttribute;
      posAttr.array.set(particles.initialPositions);
      posAttr.needsUpdate = true;
    }
  }

  useFrame(() => {
    if (!active.current || !points.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const posAttr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;

    // Animation duration 1s
    if (elapsed > 1.0) {
      active.current = false;
      // Hide particles
      for (let i = 0; i < count * 3; i++) positions[i] = 0; // Collapse to 0 or move away
      posAttr.needsUpdate = true;
      if (onComplete) onComplete();
      return;
    }

    // Update physics
    for (let i = 0; i < count; i++) {
      // Apply velocity
      positions[i * 3] += particles.velocities[i * 3] * 0.016; // x
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * 0.016 - 9.8 * 0.016 * 0.016; // y (gravity)
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2] * 0.016; // z
      
      // Update velocity (gravity)
      particles.velocities[i * 3 + 1] -= 9.8 * 0.016;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TimelineConduits({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(i - count / 2) * 2, 0, (Math.random() - 0.5) * 2]}>
          <cylinderGeometry args={[0.05, 0.05, 20, 8]} />
          <meshBasicMaterial color="#b2f5ea" transparent opacity={0.3 + Math.random() * 0.5} />
        </mesh>
      ))}
    </group>
  );
}

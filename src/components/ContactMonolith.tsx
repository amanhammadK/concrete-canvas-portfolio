import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ContactMonolith({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      mesh.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group position={position}>
      <directionalLight position={[0, 10, 5]} intensity={0.5} color="#ffffff" />
      <mesh ref={mesh} position={[0, 0, 0]}>
        <boxGeometry args={[10, 20, 2]} />
        <meshStandardMaterial 
          color="#080808" 
          roughness={0.9} 
          metalness={0.2} 
        />
        {/* Edge highlight / rift */}
        <mesh position={[0, 0, 1.01]}>
          <planeGeometry args={[0.05, 20]} />
          <meshBasicMaterial color="#b2f5ea" transparent opacity={0.3} />
        </mesh>
      </mesh>
    </group>
  );
}

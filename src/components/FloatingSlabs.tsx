import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Slab({ position, rotationSpeed }: { position: [number, number, number], rotationSpeed: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeed;
      mesh.current.rotation.y += rotationSpeed * 0.5;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[4, 0.5, 3]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.2} />
      {/* Skill Node Orbiting */}
      <mesh position={[2.5, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#b2f5ea" />
      </mesh>
    </mesh>
  );
}

export default function FloatingSlabs({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <Slab position={[-4, 2, -2]} rotationSpeed={0.002} />
      <Slab position={[4, -1, -5]} rotationSpeed={-0.001} />
      <Slab position={[0, -4, -3]} rotationSpeed={0.003} />
    </group>
  );
}

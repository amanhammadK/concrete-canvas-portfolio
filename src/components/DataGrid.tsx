import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DataGrid() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Animate the geometry to look like rolling data terrain
    const time = state.clock.elapsedTime * 0.5;
    const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
    const position = geometry.attributes.position;
    
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      
      // Calculate a wave pattern based on x, y, and time
      const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 1.5;
      position.setZ(i, z);
    }
    
    position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -5]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshBasicMaterial 
        color="#b2f5ea" 
        wireframe 
        transparent 
        opacity={0.15} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

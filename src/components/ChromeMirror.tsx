import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function MirrorScene() {
  const knotRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.2;
      knotRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <color attach="background" args={['#030303']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, 0, -10]} intensity={1} color="#ffffff" />
      
      {/* Studio environment for realistic chrome reflections */}
      <Environment preset="studio" />

      {/* Floating Chrome Abstract Geometry */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={knotRef} position={[0, 1.2, 0]}>
          <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
          <meshPhysicalMaterial 
            color="#e0e0e0" 
            metalness={1} 
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>

      {/* Polished Chrome Mirror Floor */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.05}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333333"
          metalness={1}
          mirror={1}
        />
      </mesh>
    </>
  );
}

export default function ChromeMirror() {
  return (
    <div className="w-full h-full relative group cursor-crosshair">
      <Suspense fallback={
        <div className="absolute inset-0 bg-[#050505] flex items-center justify-center text-xs font-mono text-white/30 tracking-[0.2em]">
          [ RENDERING METAL ]
        </div>
      }>
        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
          <MirrorScene />
        </Canvas>
      </Suspense>
      
      {/* Metallic Glass Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
}

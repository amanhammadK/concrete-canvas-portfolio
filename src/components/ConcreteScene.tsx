import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

function ConcreteBlock({
  position,
  scale,
  rotationSpeed,
  floatIntensity = 0.3,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotationSpeed: [number, number, number];
  floatIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;

      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scale[0] * targetScale, 0.05);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scale[1] * targetScale, 0.05);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, scale[2] * targetScale, 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={floatIntensity}>
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={hovered ? "#3a3a3a" : "#2a2a2a"}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>
    </Float>
  );
}

function DistortedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -18]} scale={4}>
      <icosahedronGeometry args={[1, 6]} />
      <MeshDistortMaterial
        color="#1a1a1a"
        roughness={0.95}
        metalness={0.05}
        distort={0.25}
        speed={0.8}
      />
    </mesh>
  );
}

function MouseTracker({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.12,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.06,
        0.03
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.3, 0.02);
    camera.lookAt(0, 0, -10);
  });

  return null;
}

function Scene() {
  const blocks = useMemo(
    () => [
      { position: [-3, 1.5, -6] as [number, number, number], scale: [2.5, 4, 1.5] as [number, number, number], rotationSpeed: [0.02, 0.01, 0.005] as [number, number, number], floatIntensity: 0.4 },
      { position: [4, -1, -8] as [number, number, number], scale: [3, 2, 2] as [number, number, number], rotationSpeed: [-0.01, 0.015, 0.008] as [number, number, number], floatIntensity: 0.2 },
      { position: [0, -3, -10] as [number, number, number], scale: [5, 1, 3] as [number, number, number], rotationSpeed: [0.005, -0.008, 0.012] as [number, number, number], floatIntensity: 0.5 },
      { position: [-5, -2, -12] as [number, number, number], scale: [1.5, 6, 1] as [number, number, number], rotationSpeed: [0.008, 0.005, -0.01] as [number, number, number], floatIntensity: 0.3 },
      { position: [6, 3, -14] as [number, number, number], scale: [2, 2, 5] as [number, number, number], rotationSpeed: [-0.006, 0.01, 0.003] as [number, number, number], floatIntensity: 0.6 },
      { position: [1, 4, -9] as [number, number, number], scale: [4, 1.2, 1.2] as [number, number, number], rotationSpeed: [0.012, -0.005, 0.007] as [number, number, number], floatIntensity: 0.35 },
      { position: [-2, -5, -11] as [number, number, number], scale: [1, 3, 4] as [number, number, number], rotationSpeed: [-0.009, 0.007, -0.004] as [number, number, number], floatIntensity: 0.45 },
      { position: [7, -4, -16] as [number, number, number], scale: [2, 1, 6] as [number, number, number], rotationSpeed: [0.004, -0.012, 0.006] as [number, number, number], floatIntensity: 0.25 },
      { position: [-6, 5, -20] as [number, number, number], scale: [3, 3, 2] as [number, number, number], rotationSpeed: [-0.003, 0.006, -0.008] as [number, number, number], floatIntensity: 0.5 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[8, 12, 5]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-5, -3, 8]}
        intensity={0.3}
        color="#1a1a2a"
      />

      <CameraRig />

      <MouseTracker>
        {blocks.map((block, i) => (
          <ConcreteBlock key={i} {...block} />
        ))}
        <DistortedSphere />
      </MouseTracker>

      <EffectComposer>
        <Noise
          premultiply
          blendFunction={BlendFunction.ADD}
          opacity={0.55}
        />
        <Vignette
          offset={0.25}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export default function ConcreteScene() {
  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.55,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 5, 30]} />
        <Scene />
      </Canvas>
    </div>
  );
}

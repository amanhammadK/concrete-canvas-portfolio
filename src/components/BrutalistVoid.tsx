import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/* ── Mouse-reactive monolithic slab ── */
function Slab({
    position,
    scale,
    rotationSpeed,
    color = '#1a1a1a',
}: {
    position: [number, number, number];
    scale: [number, number, number];
    rotationSpeed: [number, number, number];
    color?: string;
}) {
    const mesh = useRef<THREE.Mesh>(null);
    const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

    useFrame(({ pointer, clock }, delta) => {
        if (!mesh.current) return;

        // Slow rotation
        mesh.current.rotation.x += rotationSpeed[0] * delta;
        mesh.current.rotation.y += rotationSpeed[1] * delta;
        mesh.current.rotation.z += rotationSpeed[2] * delta;

        // React to mouse – subtle parallax push
        const mouseInfluence = 0.3;
        mesh.current.position.x = THREE.MathUtils.lerp(
            mesh.current.position.x,
            initialPos.x + pointer.x * mouseInfluence * (initialPos.z * -0.1),
            0.02
        );
        mesh.current.position.y = THREE.MathUtils.lerp(
            mesh.current.position.y,
            initialPos.y + pointer.y * mouseInfluence * (initialPos.z * -0.1),
            0.02
        );

        // Subtle breathing scale
        const breathe = 1 + Math.sin(clock.getElapsedTime() * 0.5 + initialPos.x) * 0.02;
        mesh.current.scale.set(scale[0] * breathe, scale[1] * breathe, scale[2] * breathe);
    });

    return (
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.15}>
            <mesh ref={mesh} position={position} scale={scale} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color} roughness={0.92} metalness={0.0} />
            </mesh>
        </Float>
    );
}

/* ── Camera that subtly follows the mouse ── */
function CameraRig() {
    const { camera } = useThree();
    const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

    useFrame(({ pointer }) => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.5, 0.02);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.8, 0.02);
        camera.lookAt(target);
    });

    return null;
}

/* ── Main scene composition ── */
function Scene() {
    const slabs = useMemo(
        () => [
            { position: [-4, 2, -10] as [number, number, number], scale: [2, 6, 2] as [number, number, number], rotationSpeed: [0.015, 0.025, 0] as [number, number, number], color: '#1a1a1a' },
            { position: [5, -3, -12] as [number, number, number], scale: [3, 2, 8] as [number, number, number], rotationSpeed: [0, -0.015, 0.015] as [number, number, number], color: '#1c1c1c' },
            { position: [0, -5, -8] as [number, number, number], scale: [8, 1, 3] as [number, number, number], rotationSpeed: [0.008, 0, -0.008] as [number, number, number], color: '#181818' },
            { position: [-6, -4, -15] as [number, number, number], scale: [1.5, 8, 1.5] as [number, number, number], rotationSpeed: [0, 0.012, 0] as [number, number, number], color: '#1a1a1a' },
            { position: [7, 4, -18] as [number, number, number], scale: [4, 4, 2] as [number, number, number], rotationSpeed: [-0.01, 0, 0.015] as [number, number, number], color: '#141414' },
            { position: [-2, 6, -16] as [number, number, number], scale: [5, 1.5, 3] as [number, number, number], rotationSpeed: [0.01, 0.008, 0] as [number, number, number], color: '#1a1a1a' },
            { position: [3, 1, -6] as [number, number, number], scale: [1.2, 3, 1.2] as [number, number, number], rotationSpeed: [0.02, -0.01, 0.005] as [number, number, number], color: '#222222' },
            { position: [-8, 0, -20] as [number, number, number], scale: [6, 6, 1] as [number, number, number], rotationSpeed: [0.005, 0.005, 0] as [number, number, number], color: '#111111' },
        ],
        []
    );

    return (
        <>
            {/* Low ambient for deep shadows */}
            <ambientLight intensity={0.08} color="#ffffff" />

            {/* Main architectural light — angled for dramatic shadow casting */}
            <directionalLight
                position={[12, 25, 8]}
                intensity={3.5}
                castShadow
                color="#ffffff"
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            {/* Faint cool fill from below */}
            <directionalLight position={[-10, -15, -8]} intensity={0.3} color="#b0b0b0" />

            {slabs.map((s, i) => (
                <Slab key={i} {...s} />
            ))}

            <CameraRig />

            {/* WebGL film grain + vignette */}
            <EffectComposer enableNormalPass={false} multisampling={0}>
                <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.65} />
                <Vignette offset={0.35} darkness={0.95} blendFunction={BlendFunction.NORMAL} />
            </EffectComposer>
        </>
    );
}

export default function BrutalistVoid() {
    return (
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
            <Canvas
                shadows
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 0.7,
                }}
                camera={{ position: [0, 0, 8], fov: 50 }}
            >
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 8, 28]} />
                <Scene />
            </Canvas>
        </div>
    );
}

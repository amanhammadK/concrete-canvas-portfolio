import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function PortalScene({ isHovered, skills, link, isMobile }: { 
  isHovered: boolean; 
  skills: string[]; 
  link?: string; 
  isMobile: boolean 
}) {
  const diskRef = useRef<THREE.Mesh>(null!);
  const skillsGroupRef = useRef<THREE.Group>(null!);
  const { invalidate } = useThree();

  const expansion = useRef(0);

  useFrame((_, delta) => {
    // Cap delta to prevent huge jumps if tab was inactive
    const safeDelta = Math.min(delta, 0.1);
    
    const target = (isHovered || isMobile) ? 1 : 0;
    expansion.current = THREE.MathUtils.lerp(expansion.current, target, safeDelta * 6);

    if (diskRef.current) {
      diskRef.current.rotation.z += safeDelta * 0.6;
      const scale = 1.15 + expansion.current * 0.45;
      diskRef.current.scale.setScalar(scale);
    }

    if (skillsGroupRef.current) {
      skillsGroupRef.current.rotation.y += safeDelta * 0.45;
    }

    // Invalidate to keep animating if we are transitioning OR if we are hovered (so skills orbit)
    if (Math.abs(expansion.current - target) > 0.01 || isHovered) {
      invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      {/* Event Horizon */}
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Accretion Disks */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.15, 0.025, 12, 64]} />
        <meshBasicMaterial 
          color="#b2f5ea" 
          transparent 
          opacity={0.85} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.05, 0.015, 12, 64]} />
        <meshBasicMaterial 
          color="#00f5d4" 
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Orbiting Skills */}
      {expansion.current > 0.08 && (
        <group ref={skillsGroupRef} rotation={[Math.PI / 8, 0, 0]}>
          {skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2;
            const radius = 1.75;
            return (
              <mesh 
                key={skill} 
                position={[
                  Math.cos(angle) * radius,
                  0,
                  Math.sin(angle) * radius
                ]}
              >
                <Html 
                  center 
                  distanceFactor={8}
                  style={{ 
                    opacity: expansion.current,
                    transition: 'opacity 0.15s ease-out',
                    pointerEvents: 'none'
                  }}
                >
                  <span className="text-[9px] md:text-[10px] font-mono text-white/80 bg-black/70 px-2 py-0.5 border border-white/20 rounded">
                    {skill}
                  </span>
                </Html>
              </mesh>
            );
          })}
        </group>
      )}

      {/* Launch Button */}
      {(expansion.current > 0.6 && link) && (
        <Html center>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block bg-[#b2f5ea] hover:bg-white text-black font-mono text-[10px] tracking-[2px] uppercase px-5 py-2 transition-all active:scale-95"
            style={{ opacity: expansion.current }}
          >
            LAUNCH SYSTEM →
          </a>
        </Html>
      )}
    </>
  );
}

export default function SingularityPortal({ skills = [], link }: { skills?: string[]; link?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      className="relative w-full aspect-square max-w-[180px] mx-auto group cursor-crosshair"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Project singularity portal"
    >
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/40">
          [ STABILIZING ]
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
          frameloop="demand"   // ← Critical for performance
        >
          <PortalScene 
            isHovered={isHovered} 
            skills={skills} 
            link={link} 
            isMobile={isMobile} 
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

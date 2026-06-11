import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CinematicNodes({ count = 5000 }) {
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  // Use a ref to store global mouse coordinates so DOM layers don't block interaction
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse to [-1, 1]
      globalMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate a circular texture programmatically
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(32, 32, 30, 0, Math.PI * 2);
      context.fillStyle = '#ffffff';
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Generate random positions, colors, and initialize physics arrays
  const [positions, colors, initialPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    // Theme colors
    const baseColor = new THREE.Color('#b2f5ea');
    const accentColor = new THREE.Color('#48929A');
    const darkColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution for a "tunnel" or "vortex" look
      const radius = 2 + Math.random() * 15;
      const theta = Math.random() * 2 * Math.PI;
      const y = (Math.random() - 0.5) * 40;

      const px = radius * Math.cos(theta);
      const py = y;
      const pz = radius * Math.sin(theta);

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      initPos[i * 3] = px;
      initPos[i * 3 + 1] = py;
      initPos[i * 3 + 2] = pz;

      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;

      // Mix colors based on position
      const mixedColor = color.copy(baseColor).lerp(
        Math.random() > 0.5 ? accentColor : darkColor, 
        Math.random()
      );
      
      // Make particles brighter
      mixedColor.multiplyScalar(0.8 + Math.random() * 0.8);

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col, initPos, vel];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    
    // Slow cinematic rotation
    points.current.rotation.y = state.clock.elapsedTime * 0.05;
    points.current.rotation.z = state.clock.elapsedTime * 0.02;
    
    // Subtle breathing scale
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    points.current.scale.set(scale, scale, scale);

    // Interactive Gamified Physics
    const positionsAttr = points.current.geometry.attributes.position.array as Float32Array;
    
    // Convert normalized mouse coordinates to roughly world coordinates
    // We scale by viewport dimensions to match world space
    const mouseX = (globalMouse.current.x * viewport.width) / 2;
    const mouseY = (globalMouse.current.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Current position
      const cx = positionsAttr[ix];
      const cy = positionsAttr[iy];
      const cz = positionsAttr[iz];

      // Target (Original) position
      const ox = initialPositions[ix];
      const oy = initialPositions[iy];
      const oz = initialPositions[iz];

      // Distance from mouse in 2D space
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repulsion force if close to mouse
      if (dist < 4) {
        const force = (4 - dist) * 0.015;
        velocities[ix] -= (dx / dist) * force;
        velocities[iy] -= (dy / dist) * force;
      }

      // Spring force returning to original position
      velocities[ix] += (ox - cx) * 0.02;
      velocities[iy] += (oy - cy) * 0.02;
      velocities[iz] += (oz - cz) * 0.02;

      // Damping (friction)
      velocities[ix] *= 0.9;
      velocities[iy] *= 0.9;
      velocities[iz] *= 0.9;

      // Apply velocity
      positionsAttr[ix] += velocities[ix];
      positionsAttr[iy] += velocities[iy];
      positionsAttr[iz] += velocities[iz];
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18} // slightly larger for visibility
        vertexColors
        transparent
        opacity={0.9} // increased opacity to make it brighter
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={circleTexture}
        alphaTest={0.01}
      />
    </points>
  );
}

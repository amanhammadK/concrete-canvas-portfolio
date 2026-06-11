import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function VoidBackground({ count = 2000 }) {
  const points = useRef<THREE.Points>(null);
  const eventHorizon = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Track global scroll and mouse internally for high performance
  const scrollY = useRef(0);
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      // Calculate a normalized scroll value based on document height
      const docHeight = document.body.scrollHeight - window.innerHeight;
      scrollY.current = window.scrollY / docHeight;
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      globalMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Soft glowing particle texture
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(32, 32, 32, 0, Math.PI * 2);
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Generate black hole accretion disk math
  const [positions, colors, scales, randomRates] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const scls = new Float32Array(count);
    const rates = new Float32Array(count);
    
    const colorObj = new THREE.Color();
    
    // Teal/Mint theme based on the reference image
    const baseColor = new THREE.Color('#48929A'); // Teal/Blueish
    const brightColor = new THREE.Color('#b2f5ea'); // Mint Cyan
    const darkColor = new THREE.Color('#0f2b2b'); // Dark void teal

    const innerRadius = 2.5; // Radius of event horizon edge
    const outerRadius = 12.0;

    for (let i = 0; i < count; i++) {
      // Exponential distribution to cluster matter near the event horizon
      const radiusDist = Math.pow(Math.random(), 2.5); 
      const radius = innerRadius + radiusDist * (outerRadius - innerRadius);
      
      const angle = Math.random() * 2 * Math.PI;
      
      // Thin disk, slightly thicker in the middle
      const thickness = (outerRadius - radius) * 0.1 * (Math.random() - 0.5);
      
      const px = radius * Math.cos(angle);
      const py = thickness;
      const pz = radius * Math.sin(angle);

      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      // Color logic: Bright mint near the event horizon, fading to dark teal far away
      const mixRatio = 1 - radiusDist; // 1 near center, 0 far away
      colorObj.copy(darkColor).lerp(baseColor, mixRatio);
      if (Math.random() > 0.85) {
        // Occasional bright flare
        colorObj.lerp(brightColor, 0.8);
      }
      
      // Add intense brightness to the inner ring
      if (radius < innerRadius + 0.5) {
        colorObj.copy(brightColor);
        colorObj.multiplyScalar(2.0); // Oversaturation for bloom
      }

      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;

      // Randomize scales and speeds
      scls[i] = Math.random();
      rates[i] = (1 / radius) * (0.5 + Math.random() * 0.5); // Kepler-like velocity (faster near center)
    }
    return [pos, col, scls, rates];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (points.current) {
      // Base slow rotation
      points.current.rotation.y = time * 0.05;
      
      // Add extra rotation based on scroll (the user scrolls, the black hole spins faster)
      points.current.rotation.y += scrollY.current * Math.PI * 2;
      
      // Subtle tilt breathing
      points.current.rotation.z = Math.sin(time * 0.2) * 0.05;
      
      // Mouse interaction: Gentle gravitational pull on the entire mesh
      const targetX = globalMouse.current.x * 0.5;
      const targetY = globalMouse.current.y * 0.5;
      
      points.current.position.x += (targetX - points.current.position.x) * 0.05;
      points.current.position.y += (targetY - points.current.position.y) * 0.05;
      
      // Animate Individual Particles to create a swirling fluid effect
      const posAttr = points.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;
      
      for(let i = 0; i < count; i++) {
        const ix = i * 3;
        const iz = i * 3 + 2;
        
        const x = posArray[ix];
        const z = posArray[iz];
        
        // Calculate current angle and radius
        const radius = Math.sqrt(x*x + z*z);
        let angle = Math.atan2(z, x);
        
        // Increase angle over time (swirl)
        // Faster swirl if scrolling
        const scrollBonus = scrollY.current * 2.0;
        angle -= (randomRates[i] * 0.01) * (1 + scrollBonus);
        
        posArray[ix] = radius * Math.cos(angle);
        posArray[iz] = radius * Math.sin(angle);
      }
      posAttr.needsUpdate = true;
    }
    
    if (eventHorizon.current) {
      // Event horizon breathing
      const scale = 1 + Math.sin(time * 2) * 0.01 + (scrollY.current * 0.05);
      eventHorizon.current.scale.set(scale, scale, scale);
      
      // Mouse follow
      eventHorizon.current.position.x += (globalMouse.current.x * 0.5 - eventHorizon.current.position.x) * 0.05;
      eventHorizon.current.position.y += (globalMouse.current.y * 0.5 - eventHorizon.current.position.y) * 0.05;
    }
  });

  return (
    <group rotation={[Math.PI / 6, 0, -Math.PI / 8]} position={[0, 0, -2]}>
      {/* The Black Hole Event Horizon */}
      <mesh ref={eventHorizon}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* The Accretion Disk */}
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
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={scales}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={circleTexture}
          alphaTest={0.01}
        />
      </points>
    </group>
  );
}

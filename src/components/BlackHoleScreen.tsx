import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTex;
  uniform float uTime;
  varying vec2 vUv;

  // Simple procedural noise for stars
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 p = vUv - 0.5;
    float dist = length(p);
    
    // Smooth, peaceful vortex swirl
    float angle = uTime * 0.15 * exp(-dist * 4.0);
    
    // Rotate coordinates
    float s = sin(angle);
    float c = cos(angle);
    mat2 rot = mat2(c, -s, s, c);
    vec2 swirledP = rot * p;
    
    // Subtle breathing pulse
    float scale = 1.0 + 0.03 * sin(uTime * 0.5);
    swirledP *= scale;
    
    vec2 finalUv = swirledP + 0.5;
    
    vec4 baseColor = vec4(0.0);
    if(finalUv.x >= 0.0 && finalUv.x <= 1.0 && finalUv.y >= 0.0 && finalUv.y <= 1.0) {
      // Dim the image slightly so stars and text can stand out more
      baseColor = texture2D(uTex, finalUv) * 0.7;
    }

    // --- Procedural Swirling Stars ---
    // Use the swirled coordinates to generate stars so they orbit the black hole!
    float starVal = hash(swirledP * 150.0); // dense star field
    // Only keep brightest stars and make them twinkle based on time
    float starIntensity = smoothstep(0.985, 1.0, starVal) * (0.5 + 0.5 * sin(uTime * 3.0 + starVal * 100.0));
    // Add stars only outside the absolute event horizon
    if (dist > 0.08) {
      baseColor.rgb += vec3(starIntensity) * 0.8;
    }

    // --- Cinematic Glow & Shadow (Vignette) ---
    // Darken the edges deeply to blend into the background
    float vignette = smoothstep(0.7, 0.2, dist);
    baseColor.rgb *= vignette;

    // Add a soft glow near the center
    float glow = exp(-dist * 8.0) * 0.3;
    baseColor.rgb += vec3(0.3, 0.7, 0.7) * glow; // Teal-ish glow

    gl_FragColor = baseColor;
  }
`;

function ShaderPlane() {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture('/blackhole.png');
  
  // Create uniforms once
  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uTime: { value: 0 },
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Calculate plane size to cover the viewport while maintaining image aspect ratio roughly
  // The image is square, so we can just use the max of width and height to cover
  const size = Math.max(viewport.width, viewport.height) * 1.2;

  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BlackHoleScreen() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <ShaderPlane />
        <Stars 
          radius={50} 
          depth={50} 
          count={3000} 
          factor={2} 
          saturation={0.5} 
          fade 
          speed={0.5} 
        />
      </Canvas>
    </div>
  );
}

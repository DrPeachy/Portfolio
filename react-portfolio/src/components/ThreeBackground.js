import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

// === 1. Shader Code ===
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  // Simple 2D Hash function
  float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // 2D Value Noise function
  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Fractional Brownian Motion (fBm)
  float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  void main() {
    vUv = uv;
    
    vec2 noiseCoord = uv * 6.0; 
    
    // 计算局部空间的基础高度
    float elevation = fbm(noiseCoord + uTime * 0.1);
    
    // 鼠标交互推高地形
    float dist = distance(uv, uMouse);
    float mouseEffect = smoothstep(0.4, 0.0, dist) * 0.1; 
    
    elevation += mouseEffect;
    vElevation = elevation; // vElevation 记录的是纯粹的 Mesh Space 高度比例

    vec3 newPosition = position;
    newPosition.z += elevation * 4.0; // 实际 Z 轴位移

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorHigh; // 高处颜色 (电光蓝)
  uniform vec3 uColorLow;  // 低处颜色 (浅蓝)
  uniform vec3 uBgColor;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float contourInterval = 15.0; 
    
    float val = vElevation * contourInterval;
    float f = fract(val);
    
    float df = fwidth(val);
    float lineThickness = 1.0; 
    
    float edge = smoothstep(df * lineThickness, 0.0, f) + smoothstep(1.0 - df * lineThickness, 1.0, f);
    
    // --- 新增：基于高度的颜色映射 ---
    // 将 vElevation (大约在 0.0 到 1.0+ 之间) 映射为一个平滑的渐变系数
    // 0.3 以下完全是低处颜色，0.7 以上完全是高处颜色，中间平滑过渡
    float heightFactor = smoothstep(0.3, 0.7, vElevation);
    
    // 动态计算当前线条应该是什么颜色
    vec3 currentLineColor = mix(uColorLow, uColorHigh, heightFactor);
    
    // 将背景色和动态线条色混合
    vec3 finalColor = mix(uBgColor, currentLineColor, edge);
    // ---------------------------------

    // 边缘淡出遮罩
    float fadeX = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    float fadeY = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    float alphaMask = fadeX * fadeY;
    
    finalColor = mix(uBgColor, finalColor, alphaMask);

    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
  }
`;

// === 2. Topographic Map Component ===
const TopographicMap = () => {
  const materialRef = useRef();
  
  // 更新 Uniforms，引入高低两种颜色
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorHigh: { value: new THREE.Color('#3798ff') }, // 主色：电光蓝 (山峰)
    uColorLow: { value: new THREE.Color('#a8d2ff') },  // 副色：浅蓝 (山谷)
    uBgColor: { value: new THREE.Color('#f2f2f2') }    // 背景色
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
      
      const targetMouseX = state.pointer.x * 0.5 + 0.5;
      const targetMouseY = state.pointer.y * 0.5 + 0.5;
      
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(targetMouseX, targetMouseY),
        0.05
      );
    }
  });

  return (
    <mesh rotation={[-Math.PI * 0.25, 0, 0]} position={[0, -2, -5]}>
      <planeGeometry args={[100, 100, 250, 250]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

// === 3. Main Background Setup ===
const ThreeBackground = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -5, pointerEvents: 'none',
      background: '#f2f2f2',
      filter: isHome ? 'none' : 'blur(8px) opacity(0.8)',
      transition: 'filter 0.8s ease-in-out',
    }}>
      <Canvas 
        flat
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 10], fov: 60 }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <TopographicMap />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
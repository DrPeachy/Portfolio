import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// === 1. 几何体组件 (支持多种材质 + 平滑交互) ===
const GeometryShape = ({ position, color, geometryType, materialType = 'rubber' }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // --- 旋转逻辑 ---
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;

      // 注视鼠标
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;
      meshRef.current.rotation.x += (mouseY * 0.15 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (mouseX * 0.15 - meshRef.current.rotation.y) * 0.05;

      // --- 核心修复：平滑悬停 (Smooth Hover) ---
      // 不直接修改 JSX 的 scale，而是用 lerp 动态计算
      // 目标缩放值：悬停时 1.2，平时 1.0
      const targetScale = hovered ? 1.2 : 1.0;
      // 每一帧都向目标值靠近一点点 (0.1 是速度系数)
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // 基础几何体选择
  const Geometry = () => {
    switch (geometryType) {
      case 'torus': return <torusGeometry args={[1, 0.4, 64, 128]} />;
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      default: return <octahedronGeometry args={[1, 0]} />;
    }
  };

  // 材质选择器
  const Material = () => {
    if (materialType === 'glass') {
      // === 炫技材质：磨砂水晶 ===
      return (
        <MeshTransmissionMaterial
          backside
          samples={4}       // 采样数，越高越好但越慢
          thickness={0.5}   // 玻璃厚度
          roughness={0.1}   // 表面粗糙度
          anisotropy={0.1}  // 各向异性
          chromaticAberration={0.05} // 色散（像棱镜一样的彩虹边）
          color={color}
          resolution={256}  // 折射贴图分辨率
        />
      );
    }
    
    // === 默认材质：Q弹橡胶 ===
    return (
      <meshPhysicalMaterial
        color={color}
        roughness={0.2}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        emissive={color}
        emissiveIntensity={0.1}
      />
    );
  };

  return (
    <Float 
      speed={1} 
      rotationIntensity={0.8} 
      floatIntensity={0.5} 
      floatingRange={[-0.2, 0.2]}
    >
      <mesh 
        ref={meshRef} 
        position={position} 
        castShadow 
        receiveShadow
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <Geometry />
        <Material />
      </mesh>
    </Float>
  );
};

// === 2. 聚光灯 (保持不变) ===
const MovingSpot = () => {
  const lightRef = useRef();
  const targetRef = useRef();

  useFrame((state) => {
    const x = state.pointer.x * 6;
    const y = state.pointer.y * 6;

    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.1);
      targetRef.current.position.x = x * 0.5;
      targetRef.current.position.y = y * 0.5;
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[0, 0, 10]} 
        angle={0.3}
        penumbra={1} 
        intensity={10} 
        castShadow
        shadow-bias={-0.0001}
        target={targetRef.current} 
      />
      <object3D ref={targetRef} />
    </>
  );
};

// === 3. 相机视差 (保持不变) ===
const Rig = () => {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const ThreeBackground = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 8], fov: 45 }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
      >
        <ambientLight intensity={0.6} color="#ffffff" />
        <MovingSpot />
        <pointLight position={[-10, -5, -10]} intensity={4} color="#3798ff" />
        <pointLight position={[10, 5, -10]} intensity={2} color="#ff3798" />

        {/* === 场景物体 === */}
        
        {/* 1. 蓝色甜甜圈 (橡胶) - 主角 */}
        <GeometryShape 
          position={[-3.5, 1, 0]} 
          color="#3798ff" 
          geometryType="torus" 
          materialType="rubber" 
        />
        
        {/* 2. 浅蓝二十面体 (水晶) - 炫技位 */}
        {/* 我把它改成了 glass 材质，你会看到光线穿过它，非常梦幻 */}
        <GeometryShape 
          position={[3.5, 0, 1]} 
          color="#a8d2ff" 
          geometryType="icosahedron" 
          materialType="glass" 
        />
        
        {/* 3. 灰色八面体 (塑料) - 背景衬托 */}
        <GeometryShape 
          position={[-2.5, -3, -2]} 
          color="#e0e0e0" 
          geometryType="octahedron" 
          materialType="rubber" 
        />

        <Environment preset="city" blur={1} resolution={256}/> 
        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} color="#1a1a1a" />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.6} mipmapBlur intensity={1.2} radius={0.6} />
          <ToneMapping resolution={256} />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>

        <Rig />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
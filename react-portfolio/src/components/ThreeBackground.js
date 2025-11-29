import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Lightformer, Clouds, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

// === 1. Volumetric Fog Component (NEW) ===
// 这是一个独立的烟雾组件，使用 GPU Instancing 技术，性能极高
function VolumetricFog() {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={[0, -2, 0]}> {/* 稍微下沉一点，让烟雾有种从下往上升腾的感觉 */}
      <Clouds material={THREE.MeshStandardMaterial} limit={200} range={200}>
        
        {/* 左边的粉色云雾 */}
        <Cloud 
          seed={1}       // 随机种子
          fade={10}      // 边缘淡出距离，越大越柔和
          speed={0.1}    // 粒子内部扰动速度
          growth={4}     // 粒子大小
          volume={6}     // 体积密度
          opacity={0.3}  // 透明度
          bounds={[6, 2, 1]} // 限制在长方体区域内分布
          color="hotpink" // 樱花粉
          position={[-4, 0, -2]} 
        />

        {/* 右边的淡蓝色云雾 - 形成冷暖对比 */}
        <Cloud 
          seed={2} 
          fade={15} 
          speed={0.1} 
          growth={5} 
          volume={8} 
          opacity={0.2} 
          bounds={[6, 2, 1]} 
          color="blue" // 雾霾蓝
          position={[4, 1, -3]} 
        />
        
        {/* 中心的亮白光晕 - 增加层次感 */}
        <Cloud 
          seed={3} 
          fade={20} 
          speed={0.05} 
          growth={6} 
          volume={3} 
          opacity={0.5} 
          bounds={[10, 10, 10]} 
          color="white" 
          position={[0, 0, -5]} 
        />
      </Clouds>
    </group>
  );
}

// === 2. Geometry Component (Unchanged) ===
const GeometryShape = ({ yOffset, initialAngle, color, geometryType, materialType = 'rubber' }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const radiusX = 4.5; 
  const radiusZ = 1.5;
  const rotateFactor = 0.2;

  useFrame((state, delta) => {
    const fixedDelta = Math.min(delta, 0.1); // 限制最大 delta，防止帧率骤降时动画跳动
    
    if (meshRef.current) {
      meshRef.current.rotation.x += fixedDelta * 0.1;
      meshRef.current.rotation.y += fixedDelta * 0.15;
      
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;
      meshRef.current.rotation.x += (mouseY * 0.1 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (mouseX * 0.1 - meshRef.current.rotation.y) * 0.05;

      const targetScale = hovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const scrollProgress = window.scrollY / window.innerHeight * rotateFactor;
      const angle = -(scrollProgress * Math.PI * 2) + initialAngle;
      
      const targetX = radiusX * Math.cos(angle);
      const targetZ = radiusZ * Math.sin(angle);
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, yOffset, 0.05);
    }
  });

  const Geometry = () => {
    switch (geometryType) {
      case 'torus': return <torusGeometry args={[0.8, 0.3, 64, 128]} />;
      case 'icosahedron': return <icosahedronGeometry args={[0.8, 0]} />;
      case 'capsule': return <capsuleGeometry args={[0.4, 1, 5, 16]} />;
      default: return <octahedronGeometry args={[0.8, 0]} />;
    }
  };

  const Material = () => {
    if (materialType === 'glass') {
      return (
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.05} metalness={0.1} transmission={0} thickness={0} clearcoat={1} envMapIntensity={2}     
        />
      );
    }
    return (
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} envMapIntensity={1.5} />
    );
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
      <mesh 
        ref={meshRef} 
        position={[radiusX * Math.cos(initialAngle), yOffset, radiusZ * Math.sin(initialAngle)]}
        castShadow receiveShadow
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <Geometry />
        <Material />
      </mesh>
    </Float>
  );
};

// === 3. Camera Rig (Unchanged) ===
const Rig = () => {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const ThreeBackground = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -5, pointerEvents: 'none',
      // 这里可以放一个很浅的底色，防止空隙漏出黑色，但主要视觉由 VolumetricFog 承担
      background: '#d6f3ffff', 
      filter: isHome ? 'none' : 'blur(10px) brightness(1)',
      transition: 'filter 0.8s ease-in-out',
    }}>
      <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        {/* 环境光保留，照亮几何体 */}
        <ambientLight intensity={0.5} color="#ffffff" />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={5} castShadow />

        {/* === 核心新增：体积雾 === */}
        {/* 把它放在几何体之前渲染，或者之后都可以，因为有深度测试。放在这里管理方便 */}
        <VolumetricFog />

        {/* === SCENE OBJECTS === */}
        <GeometryShape initialAngle={0} yOffset={1.2} color="#3798ff" geometryType="torus" materialType="rubber" />
        <GeometryShape initialAngle={Math.PI * 0.5} yOffset={-1} color="#ff3798" geometryType="icosahedron" materialType="glass" />
        <GeometryShape initialAngle={Math.PI} yOffset={-2} color="#ffbcf7" geometryType="octahedron" materialType="glass" />
        <GeometryShape initialAngle={Math.PI * 1.5} yOffset={2} color="#ffffff" geometryType="capsule" materialType="rubber" />

        <Environment resolution={512}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={10} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
            <Lightformer form="ring" color="#4060ff" intensity={10} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
          </group>
        </Environment>

        <EffectComposer disableNormalPass>
          {/* 稍微加强 Bloom，让烟雾有种发光感 */}
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.8} radius={0.5} />
          <ToneMapping />
          <ChromaticAberration offset={[0.0005, 0.0005]} /> 
        </EffectComposer>

        <Rig />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

// Geometry component with a unified, clean aesthetic
const CleanGeometry = ({ position, color, geometryType, scale = 1, speed = 1 }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    // Prevent massive jumps in animation if frame rate drops
    const fixedDelta = Math.min(delta, 0.1); 
    
    if (meshRef.current) {
      meshRef.current.rotation.x += fixedDelta * 0.2 * speed;
      meshRef.current.rotation.y += fixedDelta * 0.3 * speed;
      
      // Smooth scale transition on hover
      const targetScale = hovered ? scale * 1.1 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Keep shapes simple and geometric
  const Geometry = () => {
    switch (geometryType) {
      case 'torus': return <torusGeometry args={[1, 0.3, 64, 128]} />;
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'capsule': return <capsuleGeometry args={[0.5, 1, 32, 32]} />;
      default: return <sphereGeometry args={[1, 64, 64]} />;
    }
  };

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <Geometry />
        {/* Premium Frosted Glass Material */}
        <meshPhysicalMaterial 
          color={color}
          transmission={0.9} 
          opacity={1}
          metalness={0.1}
          roughness={0.15}
          ior={1.5}
          thickness={0.5}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
};

// Camera Rig for subtle mouse parallax
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
      // Strict adherence to your theme's background color
      background: '#f2f2f2', 
      filter: isHome ? 'none' : 'blur(12px) opacity(0.6)',
      transition: 'filter 0.8s ease-in-out',
    }}>
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 8], fov: 45 }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        {/* Clean, soft lighting */}
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />

        {/* Scene Objects: 
          Using exactly your theme colors: Primary (Electric Blue), Secondary (Light Blue), and White
        */}
        <CleanGeometry position={[-3.5, 1, 0]} color="#3798ff" geometryType="torus" scale={1.2} speed={0.8} />
        <CleanGeometry position={[3.5, -1, -2]} color="#a8d2ff" geometryType="icosahedron" scale={1.5} speed={0.5} />
        <CleanGeometry position={[0, 2.5, -4]} color="#ffffff" geometryType="sphere" scale={1} speed={1.2} />
        
        {/* Ground the scene with very soft, subtle shadows at the bottom */}
        <ContactShadows position={[0, -3.5, 0]} opacity={0.3} scale={20} blur={2.5} far={4} color="#111111" />

        {/* Environment map is required for the glass transmission to reflect light properly */}
        <Environment preset="city" />

        <Rig />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Sculptural Architectural Monolith Element
function ArchitecturalStructure({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const monolithRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth cursor tracking with gentle lerp
    const targetX = (mouse.current?.x || 0) * 0.4;
    const targetY = -(mouse.current?.y || 0) * 0.3;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetX + state.clock.elapsedTime * 0.08,
      2,
      delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetY * 0.5 + 0.1,
      2,
      delta
    );

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Main Architectural Monolith - Honed Travertine Texture simulation */}
        <mesh ref={monolithRef} castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.3, 2.4, 0.45]} />
          <meshStandardMaterial
            color="#EAE5DC"
            roughness={0.45}
            metalness={0.08}
          />
        </mesh>

        {/* Secondary Asymmetrical Intersecting Slab */}
        <mesh position={[-0.45, 0.3, 0.25]} castShadow>
          <boxGeometry args={[0.3, 1.8, 0.5]} />
          <meshStandardMaterial
            color="#C5A880" // Champagne gold accent
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>

        {/* Third Cantilevered Horizontal Plinth */}
        <mesh position={[0.4, -0.8, -0.15]} castShadow>
          <boxGeometry args={[1.6, 0.22, 0.8]} />
          <meshStandardMaterial
            color="#2B2D31" // Charcoal obsidian stone
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>

        {/* Delicate Golden Orbital Wireframe Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.7, 0.008, 16, 100]} />
          <meshStandardMaterial
            color="#C5A880"
            metalness={0.9}
            roughness={0.2}
            emissive="#C5A880"
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>

      {/* Ground Shadow Receiver */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </group>
  );
}

export function HeroScene3D() {
  const mouse = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates from -1 to 1
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-16 h-16 border border-atelier-border rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Minimalist Ambient & Architectural Studio Lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-3, -1, -2]} intensity={0.4} color="#C5A880" />
        <pointLight position={[3, 2, 3]} intensity={0.6} color="#FFFFFF" />

        <ArchitecturalStructure mouse={mouse} />
      </Canvas>
    </div>
  );
}

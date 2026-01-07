'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type ScreenPoint = { x: number; y: number };

// Note: Preload is handled by useGLTF hook automatically

// Load the GLB model
function RobotModel({
  mousePosition: _mousePosition,
  robotScreenPosition: _robotScreenPosition,
}: {
  mousePosition?: ScreenPoint;
  robotScreenPosition?: ScreenPoint;
}) {
  // Load the GLB model - path is relative to public folder
  const gltf = useGLTF('/ai_robot.glb');
  const scene = gltf.scene;
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const eyesRef = useRef<THREE.Object3D[]>([]);
  const { viewport } = useThree();
  const bottomYRef = useRef<number>(0);
  const scaleFactorRef = useRef<number>(1);
  const isInitializedRef = useRef<boolean>(false);
  const initialViewportHeightRef = useRef<number | null>(null); // Store initial viewport height
  const eyeBasePositionsRef = useRef<Map<THREE.Object3D, { x: number; y: number; z: number }>>(new Map());
  
  // Setup scene and calculate bounding box for proper scaling and positioning
  useEffect(() => {
    if (!scene || isInitializedRef.current) return;
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Store initial viewport height once
    if (initialViewportHeightRef.current === null) {
      initialViewportHeightRef.current = viewport.height;
    }
    
    // Scale to fit - use 15% of viewport height
    const targetHeight = initialViewportHeightRef.current * 0.15;
    const scaleFactor = targetHeight / size.y;
    scaleFactorRef.current = scaleFactor;
    
    // Position at bottom
    bottomYRef.current = -initialViewportHeightRef.current / 2 + (size.y * scaleFactor * 0.5);
    
    // Find eyes in the model
    scene.traverse((child) => {
      const name = child.name.toLowerCase();
      if ((name.includes('eye') || name.includes('pupil')) && child instanceof THREE.Mesh) {
        eyesRef.current.push(child);
        // Store base positions
        const pos = child.position.clone();
        eyeBasePositionsRef.current.set(child, { x: pos.x, y: pos.y, z: pos.z });
      }
      
      // Find head
      if (name.includes('head') && !headRef.current) {
        headRef.current = child;
      }
    });
    
    isInitializedRef.current = true;
  }, [scene, viewport.height]);

  useFrame((state) => {
    if (!robotRef.current || !state) return;
    
    const t = state.clock?.getElapsedTime() || 0;
    
    // Lock scale to prevent size changes - always maintain fixed scale
    if (robotRef.current.scale.x !== scaleFactorRef.current) {
      robotRef.current.scale.setScalar(scaleFactorRef.current);
    }
    
    // Always keep robot at fixed position - never change
    robotRef.current.position.y = bottomYRef.current;
    robotRef.current.position.x = 0; // Center horizontally
    robotRef.current.position.z = 0; // Center depth
    robotRef.current.rotation.y = 0; // Keep body facing forward

    // Blinking animation every 4-5 seconds
    const blinkInterval = 4.5; // Average of 4-5 seconds
    const blinkTime = t % blinkInterval;
    let eyeScaleY = 1;
    
    // Blink animation (quick close and open)
    if (blinkTime < 0.1) {
      // Closing
      eyeScaleY = THREE.MathUtils.lerp(1, 0.05, blinkTime / 0.1);
    } else if (blinkTime < 0.2) {
      // Opening
      eyeScaleY = THREE.MathUtils.lerp(0.05, 1, (blinkTime - 0.1) / 0.1);
    }
    
    // Apply blinking to eyes
    eyesRef.current.forEach((eye) => {
      if (eye instanceof THREE.Mesh) {
        eye.scale.y = eyeScaleY;
      }
    });

    // Head movement disabled - keeping head stationary
    // Eyes can still move if needed, but head rotation is stopped
  });

  if (!scene) {
    // Show loading state if scene not loaded
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    );
  }

  return (
    <group ref={robotRef}>
      <primitive object={scene} />
    </group>
  );
}

// --------- Scene wrapper ---------
function RobotScene({
  mousePosition,
  robotScreenPosition,
}: {
  mousePosition: ScreenPoint;
  robotScreenPosition: ScreenPoint;
}) {
  return (
    <>
      {/* Robot positioned at bottom */}
      <RobotModel
        mousePosition={mousePosition}
        robotScreenPosition={robotScreenPosition}
      />

      {/* Optimized lighting - reduced lights for performance */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} castShadow={false} />

      {/* Shadow only - no ground line - use fixed position */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={5}
      />
    </>
  );
}

// --------- Exported component with mouse tracking ---------
export default function AIRobot3D({ onClick }: { onClick?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState<ScreenPoint>({
    x: 0,
    y: 0,
  });

  const [robotScreenPosition, setRobotScreenPosition] = useState<ScreenPoint>({
    x: 0,
    y: 0,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setMousePosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateRobotPosition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setRobotScreenPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom - rect.height / 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateRobotPosition);
    updateRobotPosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateRobotPosition);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          pointerEvents: 'auto',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white/50 text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        pointerEvents: 'auto',
      }}
      onClick={onClick}
    >
      <Canvas
        key="airobot-canvas"
        camera={{ position: [0, 0.5, 4], fov: 50 }}
        dpr={[0.5, 1]}
        performance={{ min: 0.3, max: 0.8 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          preserveDrawingBuffer: false,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          pointerEvents: 'auto',
          visibility: 'visible',
          opacity: 1,
          display: 'block',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
        }}
        onCreated={({ gl }) => {
          try {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            gl.shadowMap.enabled = false;
            gl.setClearColor(0x000000, 0);
            gl.physicallyCorrectLights = false;
            gl.toneMapping = THREE.NoToneMapping;
          } catch (error) {
            console.warn('Canvas initialization error:', error);
          }
        }}
      >
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        }>
          <RobotScene
            mousePosition={mousePosition}
            robotScreenPosition={robotScreenPosition}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

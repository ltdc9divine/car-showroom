'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useCarModel } from '@/lib/car-models';

interface Heavy3DViewerProps {
  carName: string;
  carColor?: string;
}

export const Heavy3DViewer = React.memo(({ 
  carName, 
  carColor = '#d4af37' 
}: Heavy3DViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const mouseDownRef = useRef(false);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const targetRotationXRef = useRef(0);
  const targetRotationYRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modelUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);
      cameraRef.current = camera;

      // Renderer setup (reduced quality for perf)
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (renderer.domElement instanceof Node) {
        containerRef.current.appendChild(renderer.domElement);
      } else {
        console.error('renderer.domElement is not a Node:', renderer.domElement);
      }
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xd4af37, 0.5);
      pointLight.position.set(-5, 5, -5);
      scene.add(pointLight);

      // Create car group
      const carGroup = new THREE.Group();
      scene.add(carGroup);
      carGroupRef.current = carGroup;

      // Try to load 3D model
      const modelUrl = useCarModel(carName);
      modelUrlRef.current = modelUrl;

      if (modelUrl) {
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            const model = gltf.scene;
            
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                  (child.material as THREE.Material).needsUpdate = true;
                }
              }
            });
            
            carGroup.add(model);
            
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / maxDim;
            model.scale.multiplyScalar(scale);
            
            const center = box.getCenter(new THREE.Vector3());
            model.position.x += -center.x * scale;
            model.position.y += -center.y * scale;
            model.position.z += -center.z * scale;
            
            setIsLoading(false);
          },
          undefined,
          (err: any) => {
            console.warn(`Failed to load model: ${err?.message || 'Unknown error'}, using fallback`);
            setIsLoading(false);
            createFallbackCar(carGroup, carColor);
          }
        );
      } else {
        createFallbackCar(carGroup, carColor);
        setIsLoading(false);
      }

      // Mouse events
      const onMouseDown = (event: MouseEvent) => {
        mouseDownRef.current = true;
        mouseXRef.current = event.clientX;
        mouseYRef.current = event.clientY;
      };

      const onMouseMove = (event: MouseEvent) => {
        if (!mouseDownRef.current) return;

        const deltaX = event.clientX - mouseXRef.current;
        const deltaY = event.clientY - mouseYRef.current;

        targetRotationYRef.current += deltaX * 0.01;
        targetRotationXRef.current += deltaY * 0.01;

        targetRotationXRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationXRef.current));

        mouseXRef.current = event.clientX;
        mouseYRef.current = event.clientY;
      };

      const onMouseUp = () => {
        mouseDownRef.current = false;
      };

      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 1) {
          mouseDownRef.current = true;
          mouseXRef.current = event.touches[0].clientX;
          mouseYRef.current = event.touches[0].clientY;
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        if (!mouseDownRef.current || event.touches.length !== 1) return;

        const deltaX = event.touches[0].clientX - mouseXRef.current;
        const deltaY = event.touches[0].clientY - mouseYRef.current;

        targetRotationYRef.current += deltaX * 0.01;
        targetRotationXRef.current += deltaY * 0.01;

        targetRotationXRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationXRef.current));

        mouseXRef.current = event.touches[0].clientX;
        mouseYRef.current = event.touches[0].clientY;
      };

      const onTouchEnd = () => {
        mouseDownRef.current = false;
      };

      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('touchstart', onTouchStart);
      renderer.domElement.addEventListener('touchmove', onTouchMove);
      renderer.domElement.addEventListener('touchend', onTouchEnd);

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Animation loop (30FPS for perf)
      let frameId: number;
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;
      let lastFrameTime = 0;

      const animate = (currentTime: number) => {
        frameId = requestAnimationFrame(animate);

        if (currentTime - lastFrameTime >= frameInterval) {
          if (carGroupRef.current) {
            carGroupRef.current.rotation.x += (targetRotationXRef.current - carGroupRef.current.rotation.x) * 0.1;
            carGroupRef.current.rotation.y += (targetRotationYRef.current - carGroupRef.current.rotation.y) * 0.1;
          }

          rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
          lastFrameTime = currentTime;
        }
      };

      animate(0);

      // Cleanup
      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        rendererRef.current?.dispose();
      };
    } catch (err) {
      console.error('Error initializing 3D viewer:', err);
      setError('Lỗi khi tải 3D viewer');
      setIsLoading(false);
    }
  }, [carColor, carName]);

  const createFallbackCar = (carGroup: THREE.Group, color: string) => {
    const car = new THREE.Group();

    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 4.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.7,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
    const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
    cabin.position.set(0, 1.5, -0.5);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);

    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(1.7, 0.6, 0.1);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.4,
    });
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(0, 1.6, 1.1);
    car.add(windshield);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
    });

    const wheelPositions = [
      [-0.8, 0.5, 1.2],
      [0.8, 0.5, 1.2],
      [-0.8, 0.5, -1.2],
      [0.8, 0.5, -1.2],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      car.add(wheel);
    });

    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff99,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.8, 2.2);
    car.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.8, 2.2);
    car.add(rightHeadlight);

    carGroup.add(car);
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full bg-gradient-to-b from-dark-900 to-dark-800"
        style={{ minHeight: '500px' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
            <p className="text-accent-gold mt-4 text-lg font-semibold">Đang tải mô hình HD 3D...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-red-400">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
});

Heavy3DViewer.displayName = 'Heavy3DViewer';

export default Heavy3DViewer;


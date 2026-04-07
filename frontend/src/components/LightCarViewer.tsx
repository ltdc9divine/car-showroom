'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Car } from '@/types';

interface LightCarViewerProps {
  carName: string;
  carColor?: string;
  className?: string;
}

const LightCarViewer: React.FC<LightCarViewerProps> = React.memo(({ 
  carName, 
  carColor = '#d4af37',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  const drawCar = useCallback((ctx: CanvasRenderingContext2D, size: number) => {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rotationRef.current);
    ctx.scale(0.8, 0.8);

    // Background gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(26,26,46,0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    // Car body
    ctx.fillStyle = carColor;
    ctx.shadowColor = carColor;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.roundRect(-80, -20, 160, 40, 20);
    ctx.fill();

    // Cabin
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(-60, 0, 120, 30, 15);
    ctx.fill();

    // Wheels
    const wheelGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
    wheelGradient.addColorStop(0, '#444');
    wheelGradient.addColorStop(1, '#222');
    ctx.fillStyle = wheelGradient;
    ctx.shadowColor = '#333';
    ctx.shadowBlur = 5;

    // Front wheels
    ctx.beginPath();
    ctx.arc(-50, 30, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 30, 25, 0, Math.PI * 2);
    ctx.fill();

    // Rear wheels
    ctx.beginPath();
    ctx.arc(-50, -30, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, -30, 25, 0, Math.PI * 2);
    ctx.fill();

    // Headlights
    ctx.fillStyle = '#ffff99';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(-70, -15, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, -15, 12, 0, Math.PI * 2);
    ctx.fill();

    // Car name text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(carName, 0, 80);

    ctx.restore();
  }, [carName, carColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      canvas.style.width = canvas.clientWidth + 'px';
      canvas.style.height = canvas.clientHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const size = Math.min(canvas.clientWidth, canvas.clientHeight);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCar(ctx, size);
      rotationRef.current += 0.005;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawCar]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full rounded-lg ${className}`}
    />
  );
});

LightCarViewer.displayName = 'LightCarViewer';

export default LightCarViewer;


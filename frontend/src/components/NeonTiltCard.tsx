'use client';

import React from 'react';
import Tilt from 'react-parallax-tilt';

interface NeonTiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
}

export default function NeonTiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-effect glass-neon-hover rounded-3xl p-1 ${className}`}>
      <div className="relative w-full h-full bg-cyber-900/30 backdrop-blur-xl rounded-2xl p-6 border border-neon-blue/10 shadow-2xl transform hover:scale-[1.02] hover:rotate-1 transition-all duration-600">
        {children}
      </div>
    </div>
  );
}


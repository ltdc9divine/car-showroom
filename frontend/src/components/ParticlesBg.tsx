'use client';

import React from 'react';

export default function ParticlesBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-2xl animate-float" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent-silver/10 rounded-full blur-xl animate-shimmer" />
    </div>
  );
}


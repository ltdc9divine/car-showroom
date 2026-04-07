'use client';

import React, { lazy, Suspense } from 'react';
import LightCarViewer from './LightCarViewer';

// Lazy load heavy THREE.js viewer
const Heavy3DViewer = lazy(() => import('./Heavy3DViewer'));

interface Car3DViewerProps {
  carName: string;
  carColor?: string;
  showHeavy?: boolean; // For backward compat, default light
}

const Car3DViewer: React.FC<Car3DViewerProps> = ({ 
  carName, 
  carColor = '#d4af37',
  showHeavy = false 
}) => {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      {showHeavy ? (
        <Suspense fallback={<LightCarViewer carName={carName} carColor={carColor} />}>
          <Heavy3DViewer carName={carName} carColor={carColor} />
        </Suspense>
      ) : (
        <LightCarViewer carName={carName} carColor={carColor} />
      )}
      {showHeavy && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          HD 3D Mode
        </div>
      )}
    </div>
  );
};

export default Car3DViewer;


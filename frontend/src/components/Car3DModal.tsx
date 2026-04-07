'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import Car3DViewer from './Car3DViewer';

interface Car3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
  carColor?: string;
}

export const Car3DModal: React.FC<Car3DModalProps> = ({
  isOpen,
  onClose,
  carName,
  carColor = '#d4af37',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 rounded-2xl shadow-2xl w-full h-[90vh] max-w-4xl border border-accent-gold/20 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-dark-800 to-transparent p-6 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-accent-gold">{carName} - Chế độ xem 3D</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX size={24} className="text-accent-gold" />
          </button>
        </div>

        {/* 3D Viewer */}
        <div className="relative w-full h-full">
          <Car3DViewer carName={carName} carColor={carColor} />
        </div>

        {/* Footer Instructions */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-800 to-transparent p-6">
          <p className="text-center text-dark-200 text-sm">
            💡 <span className="text-accent-gold font-semibold">Hướng dẫn:</span> Kéo chuột để xoay xe
            {' | '} Chạm 2 tay để phóng to/thu nhỏ
          </p>
        </div>
      </div>
    </div>
  );
};

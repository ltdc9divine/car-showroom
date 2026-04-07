'use client';

import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiInfo, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FiCheck className="w-6 h-6" />,
    error: <FiXCircle className="w-6 h-6" />,
    warning: <FiAlertTriangle className="w-6 h-6" />,
    info: <FiInfo className="w-6 h-6" />,
  };

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400',
    error: 'from-red-500/20 to-pink-500/20 border-red-500/50 text-red-400',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-400',
  };

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          relative overflow-hidden backdrop-blur-xl rounded-2xl border p-4 pr-12
          bg-gradient-to-r ${colors[type]}
          shadow-2xl shadow-black/50
          min-w-[320px] max-w-[400px]
          transform transition-transform hover:scale-[1.02]
        `}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
        
        {/* Icon */}
        <div className="flex items-start gap-4">
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${type === 'success' ? 'bg-green-500/20' : ''}
            ${type === 'error' ? 'bg-red-500/20' : ''}
            ${type === 'warning' ? 'bg-yellow-500/20' : ''}
            ${type === 'info' ? 'bg-blue-500/20' : ''}
          `}>
            <span className={`
              ${type === 'success' ? 'text-green-400' : ''}
              ${type === 'error' ? 'text-red-400' : ''}
              ${type === 'warning' ? 'text-yellow-400' : ''}
              ${type === 'info' ? 'text-blue-400' : ''}
            `}>
              {icons[type]}
            </span>
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <p className="text-white font-medium leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <FiX className="w-4 h-4 text-white/70" />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`
              h-full transition-all duration-[3000ms] ease-linear
              ${type === 'success' ? 'bg-green-500' : ''}
              ${type === 'error' ? 'bg-red-500' : ''}
              ${type === 'warning' ? 'bg-yellow-500' : ''}
              ${type === 'info' ? 'bg-blue-500' : ''}
            `}
            style={{ width: '100%', animation: `shrink ${duration}ms linear forwards` }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Toast Manager - for managing multiple toasts
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Set<(toasts: ToastItem[]) => void> = new Set();
const toasts: ToastItem[] = [];

export const toast = {
  success: (message: string) => {
    const id = ++toastId;
    toasts.push({ id, message, type: 'success' });
    listeners.forEach(fn => fn([...toasts]));
  },
  error: (message: string) => {
    const id = ++toastId;
    toasts.push({ id, message, type: 'error' });
    listeners.forEach(fn => fn([...toasts]));
  },
  warning: (message: string) => {
    const id = ++toastId;
    toasts.push({ id, message, type: 'warning' });
    listeners.forEach(fn => fn([...toasts]));
  },
  info: (message: string) => {
    const id = ++toastId;
    toasts.push({ id, message, type: 'info' });
    listeners.forEach(fn => fn([...toasts]));
  },
};

const removeToast = (id: number) => {
  const index = toasts.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach(fn => fn([...toasts]));
  }
};

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  return (
    <>
      {items.map((item) => (
        <Toast
          key={item.id}
          message={item.message}
          type={item.type}
          onClose={() => removeToast(item.id)}
        />
      ))}
    </>
  );
}

export default Toast;

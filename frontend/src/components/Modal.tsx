'use client';

import React, { useEffect } from 'react';
import { FiX, FiCheck, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

type ModalType = 'success' | 'error' | 'warning' | 'info' | 'default';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: ModalType;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'default',
  children,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <FiCheck className="w-12 h-12" />,
    error: <FiXCircle className="w-12 h-12" />,
    warning: <FiAlertTriangle className="w-12 h-12" />,
    info: <FiInfo className="w-12 h-12" />,
    default: null,
  };

  const colorClasses = {
    success: {
      icon: 'text-green-400 bg-green-500/20',
      border: 'border-green-500/30',
      button: 'bg-green-500 hover:bg-green-600',
    },
    error: {
      icon: 'text-red-400 bg-red-500/20',
      border: 'border-red-500/30',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-yellow-400 bg-yellow-500/20',
      border: 'border-yellow-500/30',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    },
    info: {
      icon: 'text-blue-400 bg-blue-500/20',
      border: 'border-blue-500/30',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
    default: {
      icon: 'text-gray-400 bg-gray-500/20',
      border: 'border-gray-500/30',
      button: 'bg-accent-gold hover:bg-accent-silver',
    },
  };

  const colors = colorClasses[type];

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        <div className="modal-decor-top-left" />
        <div className="modal-decor-top-right" />
        <div className="modal-decor-bottom-left" />
        <div className="modal-decor-bottom-right" />

        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <FiX className="w-5 h-5 text-white/70" />
              </button>
            )}
          </div>
        )}

        <div className="modal-body">
          {type !== 'default' && icons[type] && (
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${colors.icon}`}>
                {icons[type]}
              </div>
            </div>
          )}

          {message && (
            <p className="text-center text-dark-300 text-lg leading-relaxed mb-6">
              {message}
            </p>
          )}

          {children}

          {onConfirm && (
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-semibold
                  bg-dark-700 text-white
                  hover:bg-dark-600
                  transition-all duration-200
                  border border-dark-600"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-6 py-3 rounded-xl font-semibold text-dark-900 ${colors.button} transition-all duration-200 shadow-lg`}
              >
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;


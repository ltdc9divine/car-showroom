'use client';

import React from 'react';
import Modal from '@/components/Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      type="warning"
      confirmText="Xóa ngay"
      cancelText="Hủy"
      onConfirm={onConfirm}
      showCloseButton={true}
    />
  );
}


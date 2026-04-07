'use client';

import React from 'react';
import Modal from './Modal';
import { FiTrash2, FiX } from 'react-icons/fi';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message }: DeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      type="error"
      confirmText="Xóa ngay"
      cancelText="Hủy"
      onConfirm={onConfirm}
      showCloseButton={true}
    />
  );
}

'use client';

import React, { useState } from 'react';
import { FiCreditCard, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { toast } from './Toast';
import { useAuthStore } from '@/lib/store';
import { Order } from '@/types';

interface PaymentButtonProps {
  order: Order;
  onPaymentSuccess?: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ order, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  if (order.depositAmount && order.depositAmount > 0) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg">
        <FiCheckCircle className="w-5 h-5" />
        <span className="font-semibold">Đã thanh toán đặt cọc</span>
      </div>
    );
  }

  const depositAmount = Math.round((order.total * 0.0001) * 100) / 100; // 0.01% in VND

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Lấy token từ auth store
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        setLoading(false);
        return;
      }

      // Get car name from order
      const carName = order.items[0]?.car && typeof order.items[0].car === 'object'
        ? order.items[0].car.name
        : 'Xe';

      // Get user email
      const userEmail = order.user && typeof order.user === 'object'
        ? order.user.email
        : 'customer@example.com';

      // Gọi API backend để tạo Checkout Session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: depositAmount,
          carName: carName,
          userEmail: userEmail,
          currency: 'vnd',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Lỗi tạo phiên thanh toán');
        return;
      }

      if (data.checkoutUrl) {
        // Chuyển sang trang thanh toán Stripe được host bởi Stripe
        toast.success('Đang chuyển tới trang thanh toán Stripe...');
        window.location.href = data.checkoutUrl;
      } else {
        toast.error('Không thể tạo liên kết thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Lỗi khi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent-gold to-yellow-500 text-dark-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-gold/50 transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <FiLoader className="animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          <FiCreditCard />
          Thanh toán đặt cọc
        </>
      )}
    </button>
  );
};

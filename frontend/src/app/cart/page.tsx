'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { FiTrash2, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { ordersAPI } from '@/lib/services';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/Toast';

export default function CartPage() {
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.warning('Wishlist đang trống! Vui lòng thêm xe trước khi đặt hàng.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          car: item._id,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotalPrice(),
        shippingAddress: user.address || '',
      };

      await ordersAPI.create(orderData);
      toast.success('Đặt xe thành công! Cảm ơn bạn đã mua xe.');
      clearCart();
      router.push('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đặt xe thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Vui lòng đăng nhập để tiếp tục</h1>
          <Link href="/login" className="btn-primary text-lg">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/cars" className="flex items-center text-accent-gold hover:text-accent-silver">
            <FiArrowLeft className="mr-2" /> Tiếp tục mua sắm
          </Link>
        </div>

        <h1 className="text-5xl font-bold gradient-text mb-12">Wishlist</h1>

        {items.length === 0 ? (
          <div className="glass-effect p-12 text-center">
            <p className="text-xl text-dark-300 mb-6">Wishlist của bạn đang trống</p>
            <Link href="/cars" className="btn-primary">
              Xem xe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="relative glass-effect p-6 flex gap-4 overflow-hidden rounded-2xl">
                  {item.images[0] && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                      style={{ backgroundImage: `url(${item.images[0]})` }}
                    />
                  )}
                  <div className="relative z-10 flex-1 flex gap-4">
                    <img
                      src={item.images[0] || '/heroshot.jpeg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                      <p className="text-dark-300 text-sm mb-1">
                        {typeof item.brand === 'object' ? item.brand.name : item.brand}
                      </p>
                      <p className="text-accent-gold font-semibold text-base">
                        {item.price.toLocaleString('vi-VN')} VNĐ × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all relative z-10"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="glass-effect p-6 h-fit sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn xe</h2>

              <div className="space-y-4 pb-6 border-b border-dark-700">
                <div className="flex justify-between">
                  <span className="text-dark-400">Tạm tính</span>
                  <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Thuế (0%)</span>
                  <span>0 VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Vận chuyển</span>
                  <span>MIỄN PHÍ</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold my-6">
                <span>Tổng cộng</span>
                <span className="gradient-text">{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
              >
                <FiCheck /> <span>{loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}</span>
              </button>

              <button
                onClick={() => clearCart()}
                className="btn-secondary w-full py-3 mt-4"
              >
                Xóa wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

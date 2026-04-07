'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ordersAPI } from '@/lib/services';
import { Order } from '@/types';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi';
import { PaymentButton } from '@/components/PaymentButton';
import { toast } from '@/components/Toast';

export const dynamic = 'force-dynamic';

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const payment = searchParams?.get('payment');
    const sessionId = searchParams?.get('sessionId');
    if (typeof window !== 'undefined') {
      if (payment === 'success' && sessionId) {
        toast.success('Đang xác thực thanh toán...');
        const verifyAndFetchOrders = async () => {
          try {
            const token = localStorage.getItem('token');
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const orderRes = await ordersAPI.getMyOrders();
            const order = orderRes.data.find((o: Order) => o.status === 'confirmed');
            if (order) {
              await fetch(`${backendUrl}/api/payments/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sessionId, orderId: order._id }),
              });
            }
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data);
            setPaymentStatus('success');
            toast.success('Thanh toán đặt cọc thành công!');
          } catch (error) {
            console.error('Failed to verify payment:', error);
            toast.error('Thanh toán thành công! Đang cập nhật...');
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data);
            setPaymentStatus('success');
          }
        };
        verifyAndFetchOrders();
      } else if (payment === 'cancelled') {
        setPaymentStatus('cancelled');
        toast.error('Thanh toán hủy');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const getCarImage = (order: Order): string => {
    if (order.items.length > 0) {
      const firstItem = order.items[0];
      if (typeof firstItem.car === 'object' && firstItem.car.images && firstItem.car.images.length > 0) {
        return firstItem.car.images[0];
      }
    }
    return '';
  };

  if (!isClient || !user) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Trang chủ
        </Link>

        <h1 className="text-5xl font-bold gradient-text mb-12">Đơn Xe Của Tôi</h1>

        {/* Payment Status Messages */}
{paymentStatus === 'success' && (
          <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FiCheckCircle className="text-green-400 text-2xl" />
            <div>
              <p className="text-green-300 font-semibold">Thanh toán đặt cọc thành công!</p>
              <p className="text-sm text-green-300/80">Đã đặt cọc 0.01%. Admin sẽ liên hệ xác nhận.</p>
              <p className="text-xs text-green-300/70">Refresh trang để cập nhật trạng thái.</p>
            </div>
          </div>
        )}


        {paymentStatus === 'cancelled' && (
          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FiX className="text-red-400 text-2xl" />
            <div>
              <p className="text-red-300 font-semibold">Thanh toán đã bị hủy</p>
              <p className="text-sm text-red-300/80">Bạn có thể thử lại bất cứ lúc nào.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-dark-400">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="glass-effect p-12 text-center">
            <p className="text-xl text-dark-300 mb-6">Bạn chưa có đơn xe nào</p>
            <Link href="/cars" className="btn-primary">
              Xem xe
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const carImage = getCarImage(order);
              return (
<div
                  key={order._id}
                  className="relative glass-effect p-6 overflow-hidden rounded-2xl bg-gradient-to-b from-dark-900/90 to-transparent"
                  style={{
                    backgroundImage: carImage ? `url(${carImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay',
                  }}
                >
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent rounded-2xl" />
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-dark-400 text-sm">Mã đơn xe</p>
                        <p className="font-mono text-sm">{order._id.substring(0, 12)}...</p>
                      </div>
                      <div>
                        <p className="text-dark-400 text-sm">Tổng tiền</p>
                        <p className="gradient-text text-2xl font-bold">
                          {order.total.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div>
                        <p className="text-dark-400 text-sm">Trạng thái</p>
                        <p className={`font-semibold ${
                          order.status === 'completed' ? 'text-green-400' :
                          order.status === 'confirmed' ? 'text-blue-400' :
                          order.status === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                        {order.status === 'completed' ? 'Hoàn thành' : 
                           order.status === 'deposited' ? 'Đã đặt cọc' :
                           order.status === 'confirmed' ? 'Đã xác nhận' : 
                           order.status === 'pending' ? 'Chờ xử lý' : 
                           order.status === 'cancelled' ? 'Đã hủy' : order.status}

                        </p>
                      </div>
                      <div>
                        <p className="text-dark-400 text-sm">Ngày đặt</p>
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-dark-700 pt-6">
                      <h4 className="font-semibold mb-3">Danh sách xe:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-dark-300">
                            {typeof item.car === 'object'
                              ? item.car.name
                              : item.car}
                            {' × '}
                            {item.quantity} - {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Section */}
{order.status === 'confirmed' && paymentStatus !== 'success' && (
                      <div className="border-t border-dark-700 pt-6 mt-6">
                        <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 mb-4">
                          <p className="text-blue-300 font-semibold mb-2">✅ Đơn xe đã được xác nhận!</p>
                          <p className="text-sm text-blue-300">
                            Vui lòng thanh toán tiền đặt cọc để hoàn tất đặt hàng.
                          </p>
                        </div>
                        <PaymentButton order={order} />
                      </div>
                    )}
                    {order.status === 'deposited' && (
                      <div className="border-t border-dark-700 pt-6 mt-6 bg-green-900/20 p-4 rounded-lg">
                        <p className="text-green-300 font-semibold">✓ Đã thanh toán đặt cọc</p>
                        <p className="text-sm text-green-300/80">Chờ admin sắp xếp xem xe</p>
                      </div>
                    )}
                    {order.status === 'deposited' && !order.scheduleVisit && (
                      <div className="border-t border-dark-700 pt-6 mt-6">
                        <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 mb-4">
                          <p className="text-green-300 font-semibold mb-2">✅ Đã đặt cọc thành công!</p>
                          <p className="text-sm text-green-300">Đăng ký xem xe để nhận thông báo lịch hẹn.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<input type="text" placeholder="Họ và tên" id={`visitName-${order._id}`} className="input-field" />
                          <input type="tel" placeholder="Số điện thoại" id={`visitPhone-${order._id}`} className="input-field" />
                          <input type="date" id={`visitDate-${order._id}`} className="input-field md:col-span-2" />
                          <button className="btn-primary md:col-span-2" onClick={async () => {
                            const name = (document.getElementById(`visitName-${order._id}`) as HTMLInputElement)?.value || '';
                            const phone = (document.getElementById(`visitPhone-${order._id}`) as HTMLInputElement)?.value || '';
                            const dateStr = (document.getElementById(`visitDate-${order._id}`) as HTMLInputElement)?.value || '';
                            const date = new Date(dateStr);
                            if (name && phone && dateStr && !isNaN(date.getTime()) ) {
                              try {
                                await ordersAPI.scheduleVisit(order._id, { 
                                  name, 
                                  phone, 
                                  date: date.toISOString().split('T')[0]
                                });
                                toast.success('Đăng ký xem xe thành công!');
                                // Optimistic update
                                setOrders(orders.map(o => o._id === order._id ? {...o, scheduleVisit: {name, phone, date: date.toISOString()}} : o));
                              } catch (error: any) {
                                console.error('Schedule visit error:', error);
                                toast.error('Lỗi đăng ký: ' + (error.response?.data?.message || 'Thử lại'));
                              }
                            } else {
                              toast.error('Vui lòng điền đầy đủ thông tin');
                            }
                          }}>Đăng ký xem xe</button>
                        </div>
                      </div>
                    )}

                    {order.scheduleVisit && (
                      <div className="border-t border-dark-700 pt-6 mt-6">
                        <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4">
                          <p className="text-emerald-300 font-semibold">📅 Lịch xem xe đã đăng ký</p>
                          <p className="text-sm text-emerald-300 mt-1">{order.scheduleVisit.name}</p>
                          <p className="text-sm text-emerald-300">{order.scheduleVisit.phone}</p>
                          <p className="text-sm text-emerald-300">{new Date(order.scheduleVisit.date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}

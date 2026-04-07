'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ordersAPI } from '@/lib/services';
import { Order } from '@/types';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function AdminSchedulesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/admin');
      return;
    }

    fetchSchedules();
  }, [user, router]);

  const fetchSchedules = async () => {
    try {
      const response = await ordersAPI.getAll();
      // Filter orders with scheduleVisit
      const schedules = response.data.filter((order: Order) => order.scheduleVisit);
      setSchedules(schedules);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || !user || user.role !== 'admin') {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Bảng điều khiển
        </Link>

        <h1 className="text-5xl font-bold gradient-text mb-12">Lịch Đặt Xem Xe</h1>

        {loading ? (
          <div className="text-center text-dark-400">Đang tải...</div>
        ) : schedules.length === 0 ? (
          <div className="glass-effect p-12 text-center">
            <p className="text-xl text-dark-300 mb-6">Chưa có lịch đặt xem xe nào</p>
            <Link href="/admin/orders" className="btn-primary">
              Xem đơn hàng
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {schedules.map((order) => (
              <div key={order._id} className="glass-effect p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-dark-400 text-sm">Mã đơn hàng</p>
                      <p className="font-mono text-sm">{order._id.substring(0, 12)}...</p>
                    </div>
                    <div>
                      <p className="text-dark-400 text-sm">Khách hàng</p>
                      <p className="font-semibold">
                        {typeof order.user === 'object' ? order.user?.name ?? 'Khách vãng lai' : order.user ?? 'Khách vãng lai'}
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 text-sm">Tổng tiền</p>
                      <p className="gradient-text text-xl font-bold">
                        {order.total.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 text-sm">Ngày đặt lịch</p>
                      <p className="font-semibold">
                        {new Date(order.scheduleVisit!.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dark-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Thông tin lịch hẹn</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-accent-gold font-semibold">Họ tên:</span> {order.scheduleVisit!.name}</p>
                      <p><span className="text-accent-gold font-semibold">Điện thoại:</span> {order.scheduleVisit!.phone}</p>
                      <p><span className="text-accent-gold font-semibold">Ngày xem xe:</span> {new Date(order.scheduleVisit!.date).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Danh sách xe</h4>
                    <div className="space-y-1 text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-dark-300">
                          {typeof item.car === 'object' ? item.car?.name : item.car} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-dark-700 mt-6 pt-6 text-xs text-dark-400">
                  <p>Đơn hàng: <Link href={`/admin/orders`} className="text-accent-gold hover:underline">Xem chi tiết</Link></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


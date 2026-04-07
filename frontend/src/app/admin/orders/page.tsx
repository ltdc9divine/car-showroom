'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ordersAPI } from '@/lib/services';
import { Order } from '@/types';
import Link from 'next/link';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { toast } from '@/components/Toast';
import Modal from '@/components/Modal';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    console.log('Filtering orders:', { ordersCount: orders.length, searchTerm, statusFilter });
    return orders.filter((order) => {
      const customerName = typeof order.user === 'object' ? order.user?.name ?? '' : order.user ?? '';
      const matchesSearch = !searchTerm || 
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      fetchOrders();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      toast.error('Lỗi cập nhật đơn hàng');
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    try {
      await ordersAPI.delete(deletingOrder);
      fetchOrders();
      toast.success('Đã xóa đơn hàng');
    } catch (error) {
      toast.error('Lỗi xóa đơn');
    } finally {
      setDeletingOrder(null);
    }
  };

  if (!isClient || !user || user.role !== 'admin') {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Quay lại
        </Link>

        <h1 className="text-5xl font-bold gradient-text mb-12">Quản Lý Đơn Hàng</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm theo tên khách hàng hoặc mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-50 focus:border-accent-gold focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-50 focus:border-accent-gold focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="deposited">Đã đặt cọc</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-dark-400">Đang tải...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="glass-effect p-12 text-center">
            <p className="text-xl text-dark-300">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
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
                      <p className="text-dark-400 text-sm">Trạng thái</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="font-semibold bg-transparent border-b border-dark-700 outline-none cursor-pointer"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="deposited">Đã đặt cọc</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeletingOrder(order._id);
                    }}
                    className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all self-start"
                    title="Xóa đơn hàng"
                  >
                    🗑️
                  </button>
                </div>

                <div className="border-t border-dark-700 pt-6">
                  <h4 className="font-semibold mb-3">Danh sách xe:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-dark-300">
                        {typeof item.car === 'object' ? item.car?.name ?? 'Xe không xác định' : item.car ?? 'Xe không xác định'}
                        {' × '}
                        {item.quantity} - {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </div>
                    ))}
                  </div>
                </div>

{order.status === 'deposited' && (
                  <div className="border-t border-dark-700 mt-6 pt-6 bg-emerald-900/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-emerald-400 font-semibold">✓ Đã thanh toán cọc</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-emerald-300 text-sm">Phương thức</p>
                        <p className="text-emerald-400">Stripe</p>
                      </div>
                      {order.depositAmount && (
                        <div>
                          <p className="text-emerald-300 text-sm">Số tiền cọc</p>
                          <p className="text-emerald-400 font-bold">{order.depositAmount.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}


                {order.shippingAddress && (
                  <div className="border-t border-dark-700 mt-6 pt-6">
                    <p className="text-dark-400 text-sm">Địa chỉ giao hàng</p>
                    <p>{order.shippingAddress}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deletingOrder && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingOrder(null)}
          title="Xóa đơn hàng"
          message={`Xóa đơn ${deletingOrder.substring(0, 12)}...? Không thể khôi phục.`}
          type="warning"
          confirmText="Xóa ngay"
          cancelText="Giữ lại"
          onConfirm={handleDeleteOrder}
        />
      )}
    </div>
  );
}


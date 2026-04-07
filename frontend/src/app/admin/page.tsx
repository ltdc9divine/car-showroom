'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20">Không được phép truy cập</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Trang chủ
        </Link>

        <h1 className="text-5xl font-bold gradient-text mb-12">Bảng Điều Khiển Quản Trị</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cars Management */}
          <Link href="/admin/cars" className="glass-effect p-8 hover:border-accent-gold transition">
            <div className="text-4xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold mb-2">Quản Lý Xe</h2>
            <p className="text-dark-400">Thêm, sửa, hoặc xóa xe khỏi kho hàng</p>
          </Link>

          {/* Brands Management */}
          <Link href="/admin/brands" className="glass-effect p-8 hover:border-accent-gold transition">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold mb-2">Quản Lý Hãng Xe</h2>
            <p className="text-dark-400">Tạo và quản lý các hãng xe</p>
          </Link>

          {/* Orders Management */}
          <Link href="/admin/orders" className="glass-effect p-8 hover:border-accent-gold transition">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">Quản Lý Đơn Xe</h2>
            <p className="text-dark-400">Xem và cập nhật đơn hàng khách hàng</p>
          </Link>

          {/* Schedules Management */}
          <Link href="/admin/schedules" className="glass-effect p-8 hover:border-accent-gold transition">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-bold mb-2">Lịch Xem Xe</h2>
            <p className="text-dark-400">Xem và quản lý lịch đặt xem xe của khách</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

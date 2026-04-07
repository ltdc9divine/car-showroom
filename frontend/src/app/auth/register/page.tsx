'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/services';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Mật khẩu không khớp');
      }

      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setUser(response.data.user, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="glass-effect p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8 text-center">
            Tạo Tài Khoản
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                Họ và tên
              </label>
              <div className="flex items-center bg-dark-800 border border-dark-700 rounded px-4 py-2 focus-within:border-accent-gold">
                <FiUser className="text-dark-500 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent outline-none text-dark-50"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                Email
              </label>
              <div className="flex items-center bg-dark-800 border border-dark-700 rounded px-4 py-2 focus-within:border-accent-gold">
                <FiMail className="text-dark-500 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent outline-none text-dark-50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                Mật khẩu
              </label>
              <div className="flex items-center bg-dark-800 border border-dark-700 rounded px-4 py-2 focus-within:border-accent-gold">
                <FiLock className="text-dark-500 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent outline-none text-dark-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-200 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="flex items-center bg-dark-800 border border-dark-700 rounded px-4 py-2 focus-within:border-accent-gold">
                <FiLock className="text-dark-500 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent outline-none text-dark-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-6 font-semibold"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-6">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-accent-gold hover:text-accent-silver">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

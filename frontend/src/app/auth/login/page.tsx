'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/services';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await authAPI.login(formData.email, formData.password);
      setUser(response.data.user, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="glass-effect p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8 text-center">
            Chào Mừng Trở Lại
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Demo Credentials */}
            <div className="p-3 bg-dark-800 border border-dark-700 rounded text-sm text-dark-300">
              <p className="font-semibold text-accent-gold mb-1">Tài khoản demo:</p>
              <p>Người dùng: user@example.com / Mật: user123</p>
              <p>Quản trị: admin@example.com / Mật: admin123</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-6 font-semibold"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-6">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-accent-gold hover:text-accent-silver">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

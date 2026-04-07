'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { FiMenu, FiX, FiShoppingCart, FiLogOut, FiTruck, FiUser, FiStar } from 'react-icons/fi';
import { Suspense } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  // Client-only hydration fix
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        useAuthStore.setState({ user: parsedUser, isAuthenticated: true });
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-effect backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <Suspense fallback={<div className="w-8 h-8 bg-accent-gold/20 rounded-lg animate-pulse" />}>
<Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <FiTruck className="w-8 h-8 text-accent-gold transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-accent-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:inline gradient-text text-2xl font-bold tracking-tight">
                HDV Showroom
              </span>
              <span className="sm:hidden gradient-text text-xl font-bold">
                HDV
              </span>
            </div>
          </Link>
          </Suspense>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-dark-200 hover:text-accent-gold transition-all duration-300 rounded-lg hover:bg-white/5"
            >
              Trang Chủ
            </Link>
            <Link 
              href="/cars" 
              className="px-4 py-2 text-dark-200 hover:text-accent-gold transition-all duration-300 rounded-lg hover:bg-white/5"
            >
              Xe
            </Link>
            {isClient && user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="px-4 py-2 text-dark-200 hover:text-accent-gold transition-all duration-300 rounded-lg hover:bg-white/5 flex items-center gap-2"
              >
                <FiStar className="w-4 h-4" />
                Quản Lý
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2.5 hover:text-accent-gold transition-all duration-300 rounded-lg hover:bg-white/5 group"
            >
              <FiShoppingCart className="w-5 h-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
            </Link>

            {/* Orders */}
{isClient && user && (
              <Link 
                href="/orders" 
                className="p-2.5 hover:text-accent-gold transition-all duration-300 rounded-lg hover:bg-white/5"
                title="Đơn hàng của tôi"
              >
                <FiTruck className="w-5 h-5" />
              </Link>
            )}

            {user ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-800/50 rounded-full border border-dark-700">
                  <FiUser className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm text-dark-200">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-accent-gold/20 text-accent-gold text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="p-2.5 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/10"
                  title="Đăng xuất"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="hidden sm:block px-4 py-2 text-sm text-dark-200 hover:text-accent-gold transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-accent-gold to-yellow-500 text-dark-900 text-sm font-semibold rounded-xl hover:from-yellow-400 hover:to-accent-gold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent-gold/20"
                >
                  Đăng Ký
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            <Link 
              href="/" 
              className="block px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Trang Chủ
            </Link>
            <Link 
              href="/cars" 
              className="block px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Xe
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="block px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Đơn hàng
              </Link>
            )}
            {isClient && user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="block px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Quản Lý
              </Link>
            )}
            {!user && (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng Nhập
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-3 bg-accent-gold/20 text-accent-gold rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

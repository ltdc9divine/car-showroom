'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiSearch, FiShield, FiClock, FiAward } from 'react-icons/fi';
import CarCard from '@/components/CarCard';
import { useEffect, useState } from 'react';
import { carsAPI } from '@/lib/services';
import { Car } from '@/types';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carsAPI.getAll();
        setFeaturedCars(response.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/bg.jpeg)' }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-silver/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-float">
            Showroom Xe Cao Cấp HDV
          </h1>
          <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Khám phá bộ sưu tập độc quyền các chiếc xe cao cấp của chúng tôi. 
            Tìm chiếc xe hoàn hảo của bạn ngay hôm nay.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/cars" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group"
            >
              Xem Xe 
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10+</div>
              <div className="text-dark-400">Xe các loại</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">5+</div>
              <div className="text-dark-400">Hãng xe</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1B+</div>
              <div className="text-dark-400">Khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold gradient-text">Xe Nổi Bật</h2>
            <Link 
              href="/cars" 
              className="text-accent-gold hover:text-accent-silver flex items-center gap-2 transition-colors group"
            >
              Xem Tất Cả 
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-effect h-80 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Tại Sao Chọn HDV Showroom?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect p-8 text-center group hover:border-accent-gold/30 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <FiShield className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Xe Được Kiểm Chứng</h3>
              <p className="text-dark-400">
                Tất cả các phương tiện được kiểm tra kỹ lưỡng và được chứng nhận chất lượng cao nhất.
              </p>
            </div>
            
            <div className="glass-effect p-8 text-center group hover:border-accent-gold/30 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <FiAward className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Giá Tốt Nhất</h3>
              <p className="text-dark-400">
                Giá cạnh tranh với các tùy chọn thanh toán linh hoạt và hỗ trợ vay mua xe.
              </p>
            </div>
            
            <div className="glass-effect p-8 text-center group hover:border-accent-gold/30 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <FiClock className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Hỗ Trợ Chuyên Nghiệp</h3>
              <p className="text-dark-400">
                Đội ngũ tư vấn chuyên nghiệp hỗ trợ bạn 24/7 trong suốt quá trình mua xe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-transparent" />
            <h2 className="text-4xl font-bold mb-6 relative z-10">
              Sẵn Sàng Sở Hữu Xe Dream Car?
            </h2>
            <p className="text-dark-300 mb-8 relative z-10">
              Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận ưu đãi đặc biệt.
            </p>
            <Link 
              href="/cars" 
              className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 relative z-10"
            >
              Khám Phá Ngay
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

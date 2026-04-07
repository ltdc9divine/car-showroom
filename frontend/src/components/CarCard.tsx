'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';
import { toast } from './Toast';
import NeonTiltCard from './NeonTiltCard';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(car);
    toast.success('Đã thêm xe vào giỏ hàng!');
  };

  return (
    <Link href={`/cars/${car._id}`} className="block">
      <NeonTiltCard className="group h-full">
        <div className="glass-effect glass-neon-hover rounded-3xl overflow-hidden h-full flex flex-col">
          {/* Image - Optimized */}
          <div className="relative h-56 overflow-hidden bg-dark-800 rounded-t-3xl">
            <Image
              src={car.images[0] || '/heroshot.jpeg'}
              alt={car.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent" />
            {car.fuel && (
              <div className="absolute top-4 right-4 bg-accent-gold/95 backdrop-blur text-dark-900 px-3 py-1 rounded-full text-xs font-bold shadow-glow-gold">
                {car.fuel}
              </div>
            )}
            {/* Quick view button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white text-sm font-semibold border border-white/30">
                Xem 3D
              </span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            {/* Brand */}
            {typeof car.brand === 'object' && car.brand.name && (
              <p className="text-accent-gold text-xs font-bold uppercase tracking-wider mb-2">
                {car.brand.name}
              </p>
            )}

            {/* Name */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:gradient-text transition-colors duration-300">
              {car.name}
            </h3>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm text-dark-300 mb-6 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
                <span>{car.mileage?.toLocaleString('vi-VN')} km</span>
              </div>
            </div>

            {/* Rating */}
            {car.rating !== undefined && (
              <div className="flex items-center gap-1 text-sm text-yellow-400 mb-6">
                <FiStar className="w-4 h-4 fill-current" />
                <span>{car.rating?.toFixed(1)} ({car.reviews || 0})</span>
              </div>
            )}

            {/* Price & Button */}
            <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/10">
              <div className="gradient-text text-2xl font-black leading-none">
                {car.price?.toLocaleString('vi-VN')}đ
              </div>
              <button
                onClick={handleAddToCart}
                className="glass-effect glass-neon-hover p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-glow-gold"
              >
                <FiShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Neon corner glow */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-radial from-accent-gold/20 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all" />
        </div>
      </NeonTiltCard>
    </Link>
  );
}


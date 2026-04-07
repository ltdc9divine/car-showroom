'use client';

import React, { useState } from 'react';
import CarCard from '@/components/CarCard';
import CarFilter from '@/components/CarFilter';
import { carsAPI } from '@/lib/services';
import { Car } from '@/types';

export default function CarsPage() {

  const {
    data: cars,
    error,
    isLoading
  } = carsAPI.useAll();




  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-96 bg-dark-700 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-effect h-80 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cars) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-dark-300">Không tải được danh sách xe</h1>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary px-8 py-3"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Bộ Sưu Tập Siêu Xe</h1>
          <p className="text-dark-300 text-lg">
            Khám phá bộ sưu tập độc quyền các siêu xe hàng đầu thế giới
          </p>
        </div>


        <div className="grid grid-cols-1 gap-6">
          {/* Cars Grid */}
          <div>

            {cars.length === 0 ? (
              <div className="glass-effect p-16 text-center rounded-2xl">
                <div className="text-6xl mb-4">🚗</div>
                <h2 className="text-2xl font-bold mb-2 text-dark-200">Không tìm thấy siêu xe nào</h2>
                <p className="text-dark-400 mb-8">Thử thay đổi bộ lọc</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary px-8 py-3"
                >
                  Tải lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car: Car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


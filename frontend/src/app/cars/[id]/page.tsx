'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { carsAPI } from '@/lib/services';
import { Car } from '@/types';
import { FiArrowLeft, FiShoppingCart, FiBox, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { toast } from '@/components/Toast';


import { Suspense } from 'react';
import LightCarViewer from '@/components/LightCarViewer';

type ImageCategory = 'main' | 'exterior' | 'interior' | 'angles';

function CarDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const carId = params.id as string;
  const { data: car, error, isLoading } = carsAPI.useById(carId);
  const [activeCategory, setActiveCategory] = React.useState<ImageCategory>('main');
  const [imageIndex, setImageIndex] = React.useState(0);

  // Reset imageIndex về 0 mỗi khi đổi tab
  React.useEffect(() => {
    setImageIndex(0);
  }, [activeCategory]);


  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [imageZoom, setImageZoom] = React.useState(100);
  const addItem = useCartStore((state) => state.addItem);




  const handleAddToCart = () => {
    if (car) {
      addItem(car);
      toast.success('Đã thêm xe vào giỏ hàng thành công!');
    }
  };

  // Chỉ Ferrari mới có nội thất/ngoại thất/góc khác
  const isFerrari = car?.name?.toLowerCase().includes('ferrari');
  const getImages = () => {
    if (activeCategory === 'main') return car?.images ? [car.images[0]] : [];
    if (activeCategory === 'exterior') return isFerrari ? (car?.images || []) : [];
    if (activeCategory === 'interior') return isFerrari ? (car?.interiorImages || []) : [];
    if (activeCategory === 'angles') return isFerrari ? (car?.angleImages || []) : [];
    return [];
  };

  const getCategoryLabel = () => {
    switch (activeCategory) {
      case 'main': return 'Ảnh gốc';
      case 'exterior': return 'Ngoại thất';
      case 'interior': return 'Nội thất';
      case 'angles': return 'Các góc khác';
      default: return '';
    }
  };

  const currentImages = getImages();
  const hasExterior = isFerrari && car?.images && car.images.length > 0;
  const hasInterior = isFerrari && car?.interiorImages && car.interiorImages.length > 0;
  const hasAngles = isFerrari && car?.angleImages && car.angleImages.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-dark-700 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-dark-800 rounded-lg" />
              <div className="space-y-6">
                <div className="h-10 w-64 bg-dark-700 rounded-lg" />
                <div className="h-12 bg-dark-700 rounded-xl" />
                <div className="grid grid-cols-2 gap-4 h-32 bg-dark-700 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center text-dark-300">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy siêu xe</h1>
          <Link href="/cars" className="text-accent-gold hover:text-accent-silver">
            ← Quay lại danh sách xe
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/cars" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="glass-effect p-6">
            {/* Main Image - Optimized */}
            {(currentImages[imageIndex] && currentImages.length > 0) ? (
              <div
                className="w-full bg-dark-800 rounded-lg overflow-hidden mb-2 flex items-center justify-center"
                style={{ maxWidth: 600, margin: '0 auto', background: '#18181b' }}
              >
                <button
                  onClick={() => {
                    setIsImageModalOpen(true);
                    setImageZoom(100);
                  }}
                  className="w-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer group"
                  style={{ outline: 'none', border: 'none', background: 'none', padding: 0 }}
                >
                  <Image
                    src={currentImages[imageIndex]}
                    alt={`${car.name} - ${getCategoryLabel()}`}
                    width={500}
                    height={350}
                    className="rounded"
                    quality={100}
                    priority
                    style={{ width: '100%', height: 'auto', display: 'block', background: '#18181b' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none">
                    <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem phóng to
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="bg-dark-800 rounded-lg overflow-hidden mb-2 w-full flex items-center justify-center text-dark-400" style={{ background: '#18181b' }}>
                Không có ảnh
              </div>
            )}

            {/* Category Tabs - always clickable, above overlays */}
            <div className="flex gap-2 mb-6 flex-wrap z-10 relative">
              {hasExterior && (
                <button
                  onClick={() => setActiveCategory('exterior')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeCategory === 'exterior'
                      ? 'bg-accent-gold/90 text-dark-900'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  🚗 Ngoại thất
                </button>
              )}
              {hasInterior && (
                <button
                  onClick={() => setActiveCategory('interior')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeCategory === 'interior'
                      ? 'bg-accent-gold/90 text-dark-900'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  🪑 Nội thất
                </button>
              )}
              {hasAngles && (
                <button
                  onClick={() => setActiveCategory('angles')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeCategory === 'angles'
                      ? 'bg-accent-gold/90 text-dark-900'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  📐 Góc khác
                </button>
              )}
            </div>

            {/* Thumbnails - Optimized */}
            {currentImages.length > 1 && activeCategory !== 'main' && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentImages.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`flex-shrink-0 h-20 w-20 rounded border-2 overflow-hidden transition-all ${
                      idx === imageIndex
                        ? 'border-accent-gold scale-105'
                        : 'border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <Image 
                      src={image} 
                      alt=""
                      width={80}
                      height={80}
                      className="object-cover rounded"
                      style={{ background: '#18181b' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            {currentImages.length > 1 && activeCategory !== 'main' && (
              <div className="mt-4 text-center text-dark-400 text-sm">
                {imageIndex + 1} / {currentImages.length} - {getCategoryLabel()}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="glass-effect p-6">
            {typeof car.brand === 'object' && (
              <p className="text-accent-gold font-semibold mb-2">{car.brand.name}</p>
            )}

            <h1 className="text-4xl font-bold mb-6">{car.name}</h1>

            <div className="mb-8 pb-8 border-b border-dark-700">
              <div className="gradient-text text-5xl font-bold">
                {car.price.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-dark-700">
              <div>
                <p className="text-dark-400 text-sm">Năm sản xuất</p>
                <p className="text-2xl font-bold">{car.year}</p>
              </div>
              <div>
                <p className="text-dark-400 text-sm">Số km đã chạy</p>
                <p className="text-2xl font-bold">{car.mileage.toLocaleString('vi-VN')} km</p>
              </div>
              <div>
                <p className="text-dark-400 text-sm">Nhiên liệu</p>
                <p className="text-2xl font-bold">{car.fuel}</p>
              </div>
              <div>
                <p className="text-dark-400 text-sm">Tình trạng</p>
                <p className={`text-2xl font-bold ${car.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                  {car.isAvailable ? 'Còn hàng' : 'Đã bán'}
                </p>
              </div>
            </div>

            {/* Image Gallery Info */}
            <div className="mb-8 pb-8 border-b border-dark-700">
              <h3 className="text-lg font-bold mb-4 text-accent-gold">📸 Thư viện ảnh</h3>
              <div className="space-y-2 text-sm text-dark-300">
                {hasExterior && (
                  <p>
                    <span className="text-accent-gold">🚗 Ngoại thất:</span> {car.images?.length || 0} ảnh
                  </p>
                )}
                {hasInterior && (
                  <p>
                    <span className="text-accent-gold">🪑 Nội thất:</span> {car.interiorImages?.length || 0} ảnh
                  </p>
                )}
                {hasAngles && (
                  <p>
                    <span className="text-accent-gold">📐 Góc khác:</span> {car.angleImages?.length || 0} ảnh
                  </p>
                )}
              </div>
            </div>

            <p className="text-dark-300 mb-8">{car.description}</p>

            <div className="space-y-4">


              <button
                onClick={handleAddToCart}
                disabled={!car.isAvailable}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition ${
                  car.isAvailable
                    ? 'btn-primary hover:bg-accent-silver'
                    : 'bg-dark-700 text-dark-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart /> <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>
      </div>




      {/* Image View Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-51"
            aria-label="Close"
          >
            <FiX size={32} className="text-white" />
          </button>

          {/* Main Image Container */}
          <div className="flex-1 flex items-center justify-center w-full relative overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: '90vw', maxHeight: '60vh' }}>
              <Image
                src={currentImages[imageIndex] || 'https://via.placeholder.com/400x300'}
                alt={`${car.name} - ${getCategoryLabel()}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="w-full max-w-2xl mt-8 space-y-4 pb-4">
            {/* Zoom Controls */}
            <div className="flex gap-2 justify-center items-center">
              <button
                onClick={() => setImageZoom(Math.max(50, imageZoom - 10))}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition"
              >
                − Thu nhỏ
              </button>
              <span className="text-white min-w-24 text-center">{imageZoom}%</span>
              <button
                onClick={() => setImageZoom(Math.min(200, imageZoom + 10))}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition"
              >
                + Phóng to
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}
                    disabled={imageIndex === 0}
                    className="px-4 py-2 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white transition"
                  >
                    ← Trước
                  </button>
                  <span className="px-4 py-2 text-white text-center min-w-32">
                    {imageIndex + 1} / {currentImages.length}
                  </span>
                  <button
                    onClick={() => setImageIndex(Math.min(currentImages.length - 1, imageIndex + 1))}
                    disabled={imageIndex === currentImages.length - 1}
                    className="px-4 py-2 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white transition"
                  >
                    Sau →
                  </button>
                </>
              )}
            </div>

            {/* Category Indicator */}
            <div className="text-center text-dark-300 text-sm">
              {getCategoryLabel()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarDetailsPage() {
  return (
    <Suspense fallback={<div>Loading car details...</div>}>
      <CarDetailsContent />
    </Suspense>
  );
}


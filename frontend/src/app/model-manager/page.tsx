'use client';

import React, { useState } from 'react';
import { useCarModel } from '@/lib/car-models';

export default function ModelTestPage() {
  const cars = [
    'Lamborghini Aventador SVJ',
    'Ferrari SF90 Stradale',
    'Bugatti Chiron Super Sport',
    'Porsche 911 GT3 RS',
    'McLaren P1',
    'Rolls-Royce Spectre',
    'Aston Martin Valkyrie',
    'Mercedes-AMG One',
    'Lamborghini Huracan STO',
    'Ferrari 296 GTB',
    'Porsche Taycan Turbo S',
    'McLaren 720S',
  ];

  const [selectedCar, setSelectedCar] = useState(cars[0]);
  const [customUrl, setCustomUrl] = useState('');
  const modelUrl = useCarModel(selectedCar);

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-accent-gold mb-2">🎮 3D Model Manager</h1>
          <p className="text-dark-300">Quản lý và test các mô hình 3D</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Config Panel */}
          <div className="glass-effect p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">⚙️ Cấu Hình Model</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Chọn Xe:</label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded text-white focus:border-accent-gold"
              >
                {cars.map((car) => (
                  <option key={car} value={car}>
                    {car}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Model URL (Hiện Tại):</label>
              <div className="p-3 bg-dark-800 rounded border border-dark-600 break-words">
                {modelUrl ? (
                  <>
                    <p className="text-green-400 text-sm mb-2">✅ Model đã cấu hình</p>
                    <a
                      href={modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-gold hover:underline text-xs break-all"
                    >
                      {modelUrl}
                    </a>
                  </>
                ) : (
                  <p className="text-yellow-400">⚠️ Chưa có model, sẽ dùng fallback</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Update Model URL:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/model.glb"
                  className="flex-1 px-4 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm focus:border-accent-gold"
                />
                <button
                  onClick={() => {
                    console.log(`Update ${selectedCar} to ${customUrl}`);
                    alert('✅ Copy code này vào car-models.ts:\n\n"' + selectedCar + '": "' + customUrl + '",');
                    setCustomUrl('');
                  }}
                  className="px-4 py-2 bg-accent-gold text-dark-900 rounded font-semibold hover:bg-accent-silver"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-dark-400 mt-2">
                Thêm URL GLB vào config car-models.ts
              </p>
            </div>

            <div className="bg-dark-800 p-4 rounded border border-accent-gold/20">
              <h3 className="font-semibold mb-2">📋 Hướng Dẫn Cải Tiến</h3>
              <ol className="text-sm text-dark-300 space-y-1 list-decimal list-inside">
                <li>Tìm model trên Sketchfab.com</li>
                <li>Download GLB format</li>
                <li>Upload lên server hoặc CDN</li>
                <li>Paste URL vào form trên</li>
                <li>Save vào src/lib/car-models.ts</li>
              </ol>
            </div>
          </div>

          {/* Recommended Models */}
          <div className="glass-effect p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🎯 Xe Được Khuyến Nghị</h2>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <div className="text-sm text-dark-300 mb-4">
                <p>Các model này có thể tìm được nhất trên Sketchfab:</p>
              </div>

              {[
                { name: 'Lamborghini Aventador', search: 'lamborghini aventador' },
                { name: 'Ferrari SF90', search: 'ferrari sf90' },
                { name: 'Bugatti Chiron', search: 'bugatti chiron' },
                { name: 'Porsche 911 GT3', search: 'porsche 911 gt3' },
                { name: 'McLaren', search: 'mclaren' },
                { name: 'Rolls-Royce', search: 'rolls royce' },
                { name: 'Aston Martin', search: 'aston martin' },
                { name: 'Mercedes-AMG', search: 'mercedes amg' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    const url = `https://sketchfab.com/search?q=${item.search}&type=models&downloadable=true`;
                    window.open(url, '_blank');
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-accent-gold/50 transition text-sm"
                >
                  <span className="text-accent-gold">🔍</span> {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-effect p-4 rounded">
            <h3 className="font-semibold text-accent-gold mb-2">📁 File Model</h3>
            <p className="text-sm text-dark-300">
              Đặt trong: /public/models/cars/
            </p>
          </div>
          <div className="glass-effect p-4 rounded">
            <h3 className="font-semibold text-accent-gold mb-2">🌐 CDN Upload</h3>
            <p className="text-sm text-dark-300">
              Hoặc upload lên CDN: Cloudinary, Vercel, v.v
            </p>
          </div>
          <div className="glass-effect p-4 rounded">
            <h3 className="font-semibold text-accent-gold mb-2">⚡ Format</h3>
            <p className="text-sm text-dark-300">
              Dùng GLB (binary) format cho tốc độ tối ưu
            </p>
          </div>
        </div>

        {/* Code Output */}
        <div className="mt-8 glass-effect p-6 rounded">
          <h2 className="text-xl font-bold mb-4">📝 Sample Code Structure</h2>
          <pre className="bg-dark-800 p-4 rounded overflow-x-auto text-xs text-green-400">
{`// src/lib/car-models.ts
export const CAR_3D_MODELS: Record<string, string> = {
  'Lamborghini Aventador SVJ': 'https://yourdomain.com/models/cars/lamborghini.glb',
  'Ferrari SF90 Stradale': 'https://yourdomain.com/models/cars/ferrari.glb',
  'Bugatti Chiron Super Sport': 'https://yourdomain.com/models/cars/bugatti.glb',
  // ... thêm các mô hình khác
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}

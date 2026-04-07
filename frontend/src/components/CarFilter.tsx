'use client';

import React, { useState, useEffect } from 'react';
import { Brand } from '@/types';
import { brandsAPI } from '@/lib/services';

interface CarFilterProps {
  onFilterChange: (filters: any) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function CarFilter({ onFilterChange, searchQuery = '', onSearchChange }: CarFilterProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState({
    brand: 'all',
    fuel: 'all',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandsAPI.getAll();
        setBrands(response.data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      }
    };

    fetchBrands();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    console.log('CarFilter change', field, value);
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };


  return (
    <div className="glass-effect p-6 space-y-4">
      <h3 className="text-xl font-bold text-accent-gold">Bộ Lọc</h3>

      {/* Search Input */}
      {onSearchChange && (
        <div>
          <label className="block text-sm font-semibold text-dark-200 mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Tên xe hoặc hãng..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 placeholder-dark-600 hover:border-accent-gold focus:border-accent-gold outline-none"
          />
        </div>
      )}

      {/* Brand Filter */}
      <div>
        <label className="block text-sm font-semibold text-dark-200 mb-2">
          Hãng xe
        </label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 hover:border-accent-gold focus:border-accent-gold outline-none"
        >
          <option value="all">Tất cả hãng</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Filter */}
      <div>
        <label className="block text-sm font-semibold text-dark-200 mb-2">
          Loại nhiên liệu
        </label>
        <select
          value={filters.fuel}
          onChange={(e) => handleFilterChange('fuel', e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 hover:border-accent-gold focus:border-accent-gold outline-none"
        >
          <option value="all">Tất cả loại</option>
          <option value="Petrol">Xăng</option>
          <option value="Diesel">Dầu</option>
          <option value="Electric">Điện</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-dark-200 mb-2">
          Khoảng giá
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Giá thấp nhất"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 placeholder-dark-600"
          />
          <input
            type="number"
            placeholder="Giá cao nhất"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 placeholder-dark-600"
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-sm font-semibold text-dark-200 mb-2">
          Năm sản xuất
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Năm nhỏ nhất"
            value={filters.minYear}
            onChange={(e) => handleFilterChange('minYear', e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 placeholder-dark-600"
          />
          <input
            type="number"
            placeholder="Năm lớn nhất"
            value={filters.maxYear}
            onChange={(e) => handleFilterChange('maxYear', e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-dark-50 placeholder-dark-600"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setFilters({
            brand: 'all',
            fuel: 'all',
            minPrice: '',
            maxPrice: '',
            minYear: '',
            maxYear: '',
          });
          onFilterChange({ brand: 'all', fuel: 'all' });
        }}
        className="btn-secondary w-full text-sm"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

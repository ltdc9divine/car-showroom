'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { carsAPI, brandsAPI } from '@/lib/services';
import { Car, Brand } from '@/types';
import Link from 'next/link';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from '@/components/Toast';
import Modal from '@/components/Modal';

export default function AdminCarsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingCar, setDeletingCar] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    year: '',
    mileage: '',
    fuel: 'Petrol',
    images: [''],
    interiorImages: [''],
    angleImages: [''],
    description: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [carsRes, brandsRes] = await Promise.all([
        carsAPI.getAll(),
        brandsAPI.getAll(),
      ]);
      setCars(carsRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = useMemo(() => {
    console.log('Filtering cars:', { carsCount: cars.length, searchTerm, brandFilter });
    return cars.filter((car) => {
      const carBrandId = typeof car.brand === 'object' ? car.brand?._id : String(car.brand || '');
      const carBrandName = typeof car.brand === 'object' ? car.brand?.name ?? '' : '';
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        car.name.toLowerCase().includes(searchLower) ||
        carBrandName.toLowerCase().includes(searchLower);
      const matchesBrand = brandFilter === 'all' || carBrandId === brandFilter;
      return matchesSearch && matchesBrand;
    });
  }, [cars, searchTerm, brandFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        images: formData.images.filter((img) => img.trim()),
        interiorImages: formData.interiorImages.filter((img) => img.trim()),
        angleImages: formData.angleImages.filter((img) => img.trim()),
      };

      if (editingId) {
        await carsAPI.update(editingId, data);
        toast.success('Cập nhật xe thành công!');
      } else {
        await carsAPI.create(data);
        toast.success('Thêm xe mới thành công!');
      }

      fetchData();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        brand: '',
        price: '',
        year: '',
        mileage: '',
        fuel: 'Petrol',
        images: [''],
        interiorImages: [''],
        angleImages: [''],
        description: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Đã xảy ra lỗi');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingCar(id);
  };

  const confirmDeleteCar = async () => {
    if (!deletingCar) return;
    try {
      await carsAPI.delete(deletingCar);
      fetchData();
      toast.success('Xóa xe thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa xe');
    } finally {
      setDeletingCar(null);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingId(car._id);
    setFormData({
      name: car.name,
      brand: typeof car.brand === 'object' ? car.brand._id : car.brand,
      price: car.price.toString(),
      year: car.year.toString(),
      mileage: car.mileage.toString(),
      fuel: car.fuel,
      images: car.images || [''],
      interiorImages: car.interiorImages || [''],
      angleImages: car.angleImages || [''],
      description: car.description,
    });
    setShowForm(true);
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20">Không được phép truy cập</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Quay lại
        </Link>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold gradient-text">Quản Lý Xe</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus /> <span>Thêm Xe</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm theo tên xe hoặc hãng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-50 focus:border-accent-gold focus:outline-none"
            />
          </div>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-50 focus:border-accent-gold focus:outline-none"
          >
            <option value="all">Tất cả hãng</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-effect p-8 mb-12 space-y-6">
            <h2 className="text-2xl font-bold">{editingId ? 'Sửa Xe' : 'Thêm Xe Mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-accent-gold">📝 Thông Tin Cơ Bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tên xe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                    required
                  />

                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                    required
                  >
                    <option value="">Chọn hãng</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Giá (VNĐ)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Năm sản xuất"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Số km đã chạy"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                    required
                  />

                  <select
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    className="bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                  >
                    <option value="Petrol">Xăng</option>
                    <option value="Diesel">Dầu</option>
                    <option value="Electric">Điện</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <textarea
                  placeholder="Mô tả"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-4 bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50 min-h-24"
                />
              </div>

              {/* Exterior Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-accent-gold">🚗 Ảnh Ngoại Thất</h3>
                <div className="space-y-2">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="URL ảnh ngoại thất"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[idx] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="flex-1 bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                      />
                      {image && (
                        <a
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          👁️
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== idx);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                    className="w-full py-2 bg-dark-800 border border-dashed border-dark-600 rounded text-accent-gold hover:border-accent-gold"
                  >
                    + Thêm ảnh ngoại thất
                  </button>
                </div>
              </div>

              {/* Interior Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-accent-gold">🪑 Ảnh Nội Thất</h3>
                <div className="space-y-2">
                  {formData.interiorImages.map((image, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="URL ảnh nội thất"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.interiorImages];
                          newImages[idx] = e.target.value;
                          setFormData({ ...formData, interiorImages: newImages });
                        }}
                        className="flex-1 bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                      />
                      {image && (
                        <a
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          👁️
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.interiorImages.filter((_, i) => i !== idx);
                          setFormData({ ...formData, interiorImages: newImages });
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, interiorImages: [...formData.interiorImages, ''] })}
                    className="w-full py-2 bg-dark-800 border border-dashed border-dark-600 rounded text-accent-gold hover:border-accent-gold"
                  >
                    + Thêm ảnh nội thất
                  </button>
                </div>
              </div>

              {/* Angle Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-accent-gold">📐 Ảnh Các Góc Khác</h3>
                <div className="space-y-2">
                  {formData.angleImages.map((image, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="URL ảnh góc khác (trước, sau, cạnh, chi tiết...)"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.angleImages];
                          newImages[idx] = e.target.value;
                          setFormData({ ...formData, angleImages: newImages });
                        }}
                        className="flex-1 bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                      />
                      {image && (
                        <a
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          👁️
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.angleImages.filter((_, i) => i !== idx);
                          setFormData({ ...formData, angleImages: newImages });
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, angleImages: [...formData.angleImages, ''] })}
                    className="w-full py-2 bg-dark-800 border border-dashed border-dark-600 rounded text-accent-gold hover:border-accent-gold"
                  >
                    + Thêm ảnh góc khác
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-dark-800/50 border border-dark-700 rounded p-4">
                <p className="text-sm text-dark-300 mb-2">📸 Tóm tắt ảnh:</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">🚗 Ngoại thất: {formData.images.filter(i => i.trim()).length} ảnh</span>
                  <span className="text-purple-400">🪑 Nội thất: {formData.interiorImages.filter(i => i.trim()).length} ảnh</span>
                  <span className="text-blue-400">📐 Góc khác: {formData.angleImages.filter(i => i.trim()).length} ảnh</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn-primary py-3 flex-1"
                >
                  {editingId ? '✅ Cập nhật' : '➕ Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="btn-secondary py-3 flex-1"
                >
                  ❌ Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cars Table */}
        {loading ? (
          <div className="text-center text-dark-400">Đang tải...</div>
        ) : filteredCars.length === 0 ? (
          <div className="glass-effect p-12 text-center">
            <p className="text-xl text-dark-300">Không tìm thấy xe nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left px-4 py-4 text-dark-200">Tên xe</th>
                  <th className="text-left px-4 py-4 text-dark-200">Hãng</th>
                  <th className="text-left px-4 py-4 text-dark-200">Giá</th>
                  <th className="text-left px-4 py-4 text-dark-200">Năm</th>
                  <th className="text-left px-4 py-4 text-dark-200">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car._id} className="border-b border-dark-700 hover:bg-dark-800/50">
                    <td className="px-4 py-4">{car.name}</td>
                    <td className="px-4 py-4">
                      {typeof car.brand === 'object' ? car.brand.name : car.brand}
                    </td>
                    <td className="px-4 py-4 text-accent-gold">{car.price.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-4">{car.year}</td>
                    <td className="px-4 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deletingCar && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingCar(null)}
          title="Xóa xe"
          message={`Xóa xe ${cars.find(c => c._id === deletingCar)?.name || deletingCar.substring(0, 12)}...? Không thể khôi phục.`}
          type="warning"
          confirmText="Xóa ngay"
          cancelText="Giữ lại"
          onConfirm={confirmDeleteCar}
        />
      )}
    </div>
  );
}

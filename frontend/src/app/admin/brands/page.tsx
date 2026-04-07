'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { brandsAPI } from '@/lib/services';
import { Brand } from '@/types';
import Link from 'next/link';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from '@/components/Toast';

export default function AdminBrandsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchBrands();
  }, [user, router]);

  const fetchBrands = async () => {
    try {
      const response = await brandsAPI.getAll();
      setBrands(response.data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await brandsAPI.update(editingId, formData);
        toast.success('Cập nhật hãng xe thành công!');
      } else {
        await brandsAPI.create(formData);
        toast.success('Thêm hãng xe mới thành công!');
      }

      fetchBrands();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', logo: '', description: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Đã xảy ra lỗi');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hãng xe này?')) {
      try {
        await brandsAPI.delete(id);
        fetchBrands();
        toast.success('Xóa hãng xe thành công!');
      } catch (error) {
        toast.error('Lỗi khi xóa hãng xe');
      }
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand._id);
    setFormData({
      name: brand.name,
      logo: brand.logo || '',
      description: brand.description || '',
    });
    setShowForm(true);
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20">Không được phép truy cập</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Quay lại
        </Link>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold gradient-text">Quản Lý Hãng Xe</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus /> <span>Thêm Hãng</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-effect p-8 mb-12 space-y-4">
            <h2 className="text-2xl font-bold">{editingId ? 'Sửa Hãng' : 'Thêm Hãng Mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tên hãng xe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
                required
              />

              <input
                type="url"
                placeholder="URL Logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50"
              />

              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded px-4 py-2 text-dark-50 min-h-24"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn-primary py-3 flex-1"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="btn-secondary py-3 flex-1"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Brands Table */}
        {loading ? (
          <div className="text-center text-dark-400">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left px-4 py-4 text-dark-200">Tên hãng</th>
                  <th className="text-left px-4 py-4 text-dark-200">Mô tả</th>
                  <th className="text-left px-4 py-4 text-dark-200">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand._id} className="border-b border-dark-700 hover:bg-dark-800/50">
                    <td className="px-4 py-4 font-semibold">{brand.name}</td>
                    <td className="px-4 py-4 text-dark-400">{brand.description || '-'}</td>
                    <td className="px-4 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(brand._id)}
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
    </div>
  );
}

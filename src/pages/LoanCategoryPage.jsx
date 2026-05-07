import React, { useState } from 'react';
import { useLoanCategories, useCreateLoanCategory, useUpdateLoanCategory, useDeleteLoanCategory } from '../api/loanApi';
import { 
  FileText, 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Plus,
  X
} from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

export default function LoanCategoryPage() {
  const { data: categories, isLoading, error } = useLoanCategories();
  const createMutation = useCreateLoanCategory();
  const updateMutation = useUpdateLoanCategory();
  const deleteMutation = useDeleteLoanCategory();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    maxAmount: '',
    maxTenor: '',
    interestRate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setFormData({
      code: category.code,
      name: category.name,
      maxAmount: category.maxAmount.toString(),
      maxTenor: category.maxTenor.toString(),
      interestRate: category.interestRate.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({
      code: '',
      name: '',
      maxAmount: '',
      maxTenor: '',
      interestRate: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      maxAmount: Number(formData.maxAmount),
      maxTenor: Number(formData.maxTenor),
      interestRate: Number(formData.interestRate),
    };

    if (editId) {
      updateMutation.mutate({ id: editId, payload }, {
        onSuccess: handleCloseModal
      });
    } else {
      createMutation.mutate({ ...payload, code: formData.code }, {
        onSuccess: handleCloseModal
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Kategori Pinjaman</h1>
          <p className="text-gray-500 text-sm">Kelola jenis pinjaman, plafon, tenor, dan bunga</p>
        </div>
        <button 
          onClick={() => {
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 bg-white/50 rounded-2xl border border-dashed border-gray-300">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-gray-500 font-medium text-lg">Memuat kategori pinjaman...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 bg-red-50 rounded-2xl border border-red-100 text-red-500">
            <AlertCircle size={40} />
            <p className="font-bold text-lg">
              {error.response?.status === 403 ? "Akses Ditolak" : "Gagal memuat data"}
            </p>
            <p className="text-sm">
              {error.response?.status === 403 
                ? "Anda tidak memiliki izin untuk melihat kategori pinjaman." 
                : error.message}
            </p>
          </div>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="glass-panel p-6 flex flex-col gap-5 hover:border-blue-200 transition-all group">
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FileText size={24} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{category.code}</div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{category.name}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <DollarSign size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Maksimal</span>
                  </div>
                  <p className="text-sm font-black text-gray-900">{formatCurrency(category.maxAmount)}</p>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Tenor</span>
                  </div>
                  <p className="text-sm font-black text-gray-900">{category.maxTenor} Bulan</p>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 col-span-2">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Bunga (Per Tahun)</span>
                  </div>
                  <p className="text-sm font-black text-blue-600">{category.interestRate}%</p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => handleEdit(category)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-red-600 border border-red-100 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {deleteMutation.isPending && deleteMutation.variables === category.id ? "..." : "Hapus"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium bg-white/50 rounded-2xl border border-dashed border-gray-300">
            Belum ada kategori pinjaman.
          </div>
        )}
      </div>

      {/* Modal Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Plus size={20} className={editId ? "rotate-45" : ""} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{editId ? "Edit Kategori" : "Tambah Kategori"}</h2>
                  <p className="text-xs text-gray-500">{editId ? "Perbarui detail kategori pinjaman" : "Masukkan detail kategori pinjaman baru"}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Nama Kategori
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Pinjaman Motor"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Kode Kategori
                  </label>
                  <input 
                    type="text" 
                    name="code"
                    required
                    disabled={!!editId}
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Contoh: PMT"
                    className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${editId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 focus:bg-white'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Bunga (%)
                  </label>
                  <input 
                    type="number" 
                    name="interestRate"
                    required
                    step="0.01"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Maksimal Plafon
                  </label>
                  <input 
                    type="number" 
                    name="maxAmount"
                    required
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Maksimal Tenor
                  </label>
                  <input 
                    type="number" 
                    name="maxTenor"
                    required
                    value={formData.maxTenor}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {(createMutation.isError || updateMutation.isError) && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={14} />
                  {(createMutation.error || updateMutation.error)?.response?.data?.message || "Gagal menyimpan kategori"}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-2 py-3 px-8 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    editId ? "Perbarui Kategori" : "Simpan Kategori"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

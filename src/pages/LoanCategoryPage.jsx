import React, { useState } from 'react';
import { useLoanCategories, useCreateLoanCategory, useUpdateLoanCategory, useDeleteLoanCategory } from '../api/loanApi';
import { 
  FileText, Loader2, AlertCircle, TrendingUp, Calendar, DollarSign,
  Plus, X, Edit3, Trash2, ArrowRight, Layers
} from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export default function LoanCategoryPage() {
  const { data: categories, isLoading, error } = useLoanCategories();
  const createMutation = useCreateLoanCategory();
  const updateMutation = useUpdateLoanCategory();
  const deleteMutation = useDeleteLoanCategory();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', maxAmount: '', maxTenor: '', interestRate: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setFormData({
      code: category.code, name: category.name,
      maxAmount: category.maxAmount.toString(), maxTenor: category.maxTenor.toString(),
      interestRate: category.interestRate.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) deleteMutation.mutate(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ code: '', name: '', maxAmount: '', maxTenor: '', interestRate: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name, maxAmount: Number(formData.maxAmount),
      maxTenor: Number(formData.maxTenor), interestRate: Number(formData.interestRate),
    };
    if (editId) {
      updateMutation.mutate({ id: editId, payload }, { onSuccess: handleCloseModal });
    } else {
      createMutation.mutate({ ...payload, code: formData.code }, { onSuccess: handleCloseModal });
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#005bb7] focus:bg-white transition-all placeholder:text-slate-300";

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Kategori Pinjaman</h1>
          <p className="text-xs text-slate-400 mt-0.5">Konfigurasi produk pinjaman, plafon, dan suku bunga KMMA.</p>
        </div>
        <button
          onClick={() => { setEditId(null); setIsModalOpen(true); }}
          className="btn-primary"
        >
          <Plus size={14} /> Produk Baru
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#005bb7] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs">Memuat kategori...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-16 flex flex-col items-center gap-3 bg-red-50 rounded-xl text-red-500">
            <AlertCircle size={32} />
            <p className="font-semibold text-sm">{error.response?.status === 403 ? 'Akses Ditolak' : 'System Error'}</p>
            <p className="text-xs text-red-400">{error.response?.status === 403 ? 'Tidak memiliki izin akses.' : error.message}</p>
          </div>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-[#005bb7] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">{category.code}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1 leading-tight">{category.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <FileText size={14} />
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <TrendingUp size={12} className="text-[#76bc21]" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Suku Bunga</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-bold text-slate-800">{category.interestRate}</span>
                    <span className="text-xs text-slate-400">%</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Calendar size={12} className="text-[#005bb7]" />
                    <span className="text-[10px] font-medium uppercase tracking-wide">Tenor Maks</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-bold text-slate-800">{category.maxTenor}</span>
                    <span className="text-xs text-slate-400">Bln</span>
                  </div>
                </div>
              </div>

              {/* Max Amount */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <DollarSign size={13} />
                  <span className="text-[10px] font-medium uppercase tracking-wide">Maksimum Plafon</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(category.maxAmount)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-3 mt-auto">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-[#005bb7] hover:text-white hover:border-[#005bb7] transition-all duration-200"
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="w-9 flex items-center justify-center rounded-lg text-red-400 bg-white border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center gap-3 opacity-40">
            <Layers size={48} className="text-slate-300" />
            <p className="text-slate-400 text-xs">Tidak ada produk pinjaman</p>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#005bb7] rounded-xl flex items-center justify-center text-white shadow-sm">
                  <Plus size={16} className={`transition-transform duration-300 ${editId ? 'rotate-45' : ''}`} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">{editId ? 'Edit Konfigurasi' : 'Produk Baru'}</h2>
                  <p className="text-[10px] text-slate-400">{editId ? 'Perbarui parameter pinjaman' : 'Definisikan parameter pinjaman KMMA baru'}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Kategori Produk</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="E.g. Pembiayaan Kendaraan" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kode</label>
                  <input type="text" name="code" required disabled={!!editId} value={formData.code} onChange={handleInputChange} placeholder="E.g. PKB" className={`${inputClass} ${editId ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bunga (%)</label>
                  <div className="relative">
                    <input type="number" name="interestRate" required step="0.01" value={formData.interestRate} onChange={handleInputChange} placeholder="0.00" className={inputClass} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Maksimal Plafon (IDR)</label>
                  <input type="number" name="maxAmount" required value={formData.maxAmount} onChange={handleInputChange} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tenor Maks (Bulan)</label>
                  <input type="number" name="maxTenor" required value={formData.maxTenor} onChange={handleInputChange} placeholder="0" className={inputClass} />
                </div>
              </div>

              {(createMutation.isError || updateMutation.isError) && (
                <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  {(createMutation.error || updateMutation.error)?.response?.data?.message || 'Operasi gagal. Periksa input Anda.'}
                </div>
              )}

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-[2] py-2.5 rounded-xl text-xs font-bold text-white bg-[#005bb7] hover:bg-[#004a96] shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <><Loader2 size={14} className="animate-spin" />Memproses...</>
                  ) : (
                    <>{editId ? 'Update' : 'Deploy'} <ArrowRight size={14} /></>
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

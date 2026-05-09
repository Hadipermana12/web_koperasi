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
  X,
  Edit3,
  Trash2,
  Download,
  Filter,
  Layers
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
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Characterful Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-[#76bc21] rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Parameter Keuangan</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
            Kategori <span className="text-gradient-blue">Pinjaman</span>
          </h1>
          <p className="text-slate-600 font-medium text-lg mt-2 max-w-md">Konfigurasi produk pinjaman, plafon, dan suku bunga KMMA.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={() => {
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-3 px-8 py-4 bg-[#005bb7] text-white rounded-[1.5rem] text-sm font-black hover:bg-[#004a96] transition-all duration-700 shadow-[0_15px_35px_rgba(0,91,183,0.3)] hover:scale-105 active:scale-95 uppercase tracking-wider"
          >
            <Plus size={20} />
            Produk Baru
          </button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300">
            <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Synchronizing Categories...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 bg-red-50/50 backdrop-blur-xl rounded-[3rem] border border-red-100 text-red-500">
            <AlertCircle size={60} />
            <div className="text-center">
              <p className="font-black text-2xl tracking-tighter uppercase mb-2">
                {error.response?.status === 403 ? "Access Denied" : "System Error"}
              </p>
              <p className="text-sm font-medium text-red-400 max-w-xs mx-auto">
                {error.response?.status === 403 
                  ? "Unauthorized access detected. Please contact system administrator." 
                  : error.message}
              </p>
            </div>
          </div>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="group relative bg-[#f8fafc] border border-slate-200 rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col min-h-[320px]">
              
              {/* Header: Title & Code (Bento Box 1) */}
              <div className="bg-white rounded-[2rem] p-6 mb-4 flex justify-between items-start border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-50 text-[#005bb7] mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest">{category.code}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#005bb7] transition-colors">{category.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#76bc21] group-hover:bg-green-50 transition-colors">
                  <FileText size={18} />
                </div>
              </div>

              {/* Data Grid (Bento Boxes 2 & 3) */}
              <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col justify-between p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingUp size={16} className="text-[#76bc21]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Suku Bunga</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-6">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{category.interestRate}</span>
                    <span className="text-sm font-bold text-slate-400">%</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={16} className="text-[#005bb7]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tenor Maks</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-6">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{category.maxTenor}</span>
                    <span className="text-sm font-bold text-slate-400">Bln</span>
                  </div>
                </div>
              </div>

              {/* Maks Plafon (Bento Box 4) */}
              <div className="bg-white rounded-[2rem] p-6 mb-4 flex items-center justify-between border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <DollarSign size={14} className="text-slate-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Maksimum Plafon</span>
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">{formatCurrency(category.maxAmount)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 hover:bg-[#005bb7] hover:text-white hover:border-[#005bb7] shadow-sm transition-all duration-300 group/btn"
                >
                  <Edit3 size={14} className="group-hover/btn:scale-110 transition-transform" />
                  Edit Detail
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] text-red-400 bg-white border border-red-100 hover:bg-red-500 hover:text-white shadow-sm transition-all duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300 opacity-40">
            <Layers size={80} className="text-slate-300" />
            <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-sm">No Products Defined</p>
          </div>
        )}
      </div>

      {/* Modal Add/Edit Category - Premium Redesign */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#005bb7] to-[#00a8e8] rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(0,91,183,0.3)]">
                  <Plus size={32} className={`transition-transform duration-700 ${editId ? "rotate-45" : ""}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{editId ? "Edit Konfigurasi" : "Produk Baru"}</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">{editId ? "Perbarui parameter produk pinjaman" : "Definisikan parameter pinjaman KMMA baru"}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                    Nama Kategori Produk
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. Pembiayaan Kendaraan Bermotor"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-base font-bold text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all placeholder:text-slate-300"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                    Kode Identifikasi
                  </label>
                  <input 
                    type="text" 
                    name="code"
                    required
                    disabled={!!editId}
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="E.g. PKB"
                    className={`w-full border border-slate-200 rounded-[1.5rem] px-6 py-5 text-base font-black tracking-widest focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] transition-all ${editId ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none' : 'bg-slate-50/50 focus:bg-white'}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                    Bunga Efektif (%)
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      name="interestRate"
                      required
                      step="0.01"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-base font-black text-[#005bb7] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all placeholder:text-slate-300"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300 group-focus-within:text-[#005bb7] transition-colors">%</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                    Maksimal Plafon (IDR)
                  </label>
                  <input 
                    type="number" 
                    name="maxAmount"
                    required
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-base font-black text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                    Tenor Maksimal (Bulan)
                  </label>
                  <input 
                    type="number" 
                    name="maxTenor"
                    required
                    value={formData.maxTenor}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-base font-black text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              {(createMutation.isError || updateMutation.isError) && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
                  <AlertCircle size={20} />
                  {(createMutation.error || updateMutation.error)?.response?.data?.message || "Operation failed. Please verify your inputs."}
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-5 px-6 rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 transition-all duration-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-[2] py-5 px-8 rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-white bg-[#005bb7] hover:bg-[#004a96] shadow-[0_15px_35px_rgba(0,91,183,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-700 flex items-center justify-center gap-3 group"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {editId ? "Update Configuration" : "Deploy Product"}
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                    </>
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

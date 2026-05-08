import React, { useState } from 'react';
import { Clock, Search, ChevronDown, Eye, FileText, Loader2, AlertCircle, Plus, X, Edit3, Trash2, TrendingUp, Calendar, DollarSign, Layers, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import { usePendingLoans, useLoanCategories, useCreateLoanCategory, useUpdateLoanCategory, useDeleteLoanCategory, useUpdateLoanStatus } from '../api/loanApi';
import { WorkflowBanner, MiniTracker } from '../components/approval/WorkflowTracker';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState('persetujuan');

  // Persetujuan data
  const { data: loans, isLoading: loansLoading, error: loansError } = usePendingLoans();

  // Kategori data
  const { data: categories, isLoading: catLoading, error: catError } = useLoanCategories();
  const createMutation = useCreateLoanCategory();
  const updateMutation = useUpdateLoanCategory();
  const deleteMutation = useDeleteLoanCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', maxAmount: '', maxTenor: '', interestRate: '', isRequiredUpload: false });

  // Approval modal state
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const updateLoanStatus = useUpdateLoanStatus();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setFormData({
      code: cat.code ?? '',
      name: cat.name ?? '',
      maxAmount: (cat.maxAmount ?? '').toString(),
      maxTenor: (cat.maxTenor ?? '').toString(),
      interestRate: (cat.interestRate ?? '').toString(),
      isRequiredUpload: cat.isRequiredUpload ?? false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus kategori ini?')) deleteMutation.mutate(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ code: '', name: '', maxAmount: '', maxTenor: '', interestRate: '', isRequiredUpload: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      maxAmount: Number(formData.maxAmount),
      maxTenor: Number(formData.maxTenor),
      interestRate: Number(formData.interestRate),
      isRequiredUpload: formData.isRequiredUpload,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, payload }, { onSuccess: handleCloseModal });
    } else {
      createMutation.mutate({ ...payload, code: formData.code }, { onSuccess: handleCloseModal });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-[#76bc21] rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Manajemen Pinjaman</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
            Persetujuan <span className="text-gradient-blue">Pinjaman</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg mt-2 max-w-md">Kelola pengajuan dan konfigurasi produk pinjaman KMMA.</p>
        </div>
        {activeTab === 'kategori' && (
          <button
            onClick={() => { setEditId(null); setIsModalOpen(true); }}
            className="flex items-center gap-3 px-8 py-4 bg-[#005bb7] text-white rounded-[1.5rem] text-sm font-black hover:bg-[#004a96] transition-all duration-700 shadow-[0_15px_35px_rgba(0,91,183,0.3)] hover:scale-105 active:scale-95 uppercase tracking-wider relative z-10"
          >
            <Plus size={20} />
            Produk Baru
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2rem] p-2 flex gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('persetujuan')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'persetujuan' ? 'bg-[#005bb7] text-white shadow-[0_10px_30px_rgba(0,91,183,0.25)]' : 'text-slate-400 hover:text-slate-700'}`}
        >
          <Clock size={18} />
          Persetujuan
          {loans?.length > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'persetujuan' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-500'}`}>
              {loans.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('kategori')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'kategori' ? 'bg-[#005bb7] text-white shadow-[0_10px_30px_rgba(0,91,183,0.25)]' : 'text-slate-400 hover:text-slate-700'}`}
        >
          <FileText size={18} />
          Kategori Pinjaman
        </button>
      </div>

      {/* Tab Content: Persetujuan */}
      {activeTab === 'persetujuan' && (
        <div className="flex flex-col gap-6">
        <WorkflowBanner loans={loans || []} />
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Toolbar */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="Cari nama, NPK, atau ID pinjaman..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.25rem] py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 border border-slate-200 rounded-[1.25rem] px-6 py-4 text-sm font-black text-slate-500 bg-white hover:bg-slate-50 uppercase tracking-wider">
              Semua Status <ChevronDown size={16} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 font-black">ID Pinjaman</th>
                  <th className="px-8 py-5 font-black">Pemohon</th>
                  <th className="px-8 py-5 font-black">Jumlah</th>
                  <th className="px-8 py-5 font-black">Tenor</th>
                  <th className="px-8 py-5 font-black">Kategori</th>
                  <th className="px-8 py-5 font-black">Tracking Alur</th>
                  <th className="px-8 py-5 font-black text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loansLoading ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Loading...</p>
                      </div>
                    </td>
                  </tr>
                ) : loansError ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-16 text-center text-red-500">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle size={40} />
                        <p className="font-black uppercase tracking-tight">{loansError.response?.status === 403 ? "Akses Ditolak" : "Gagal memuat data"}</p>
                        <p className="text-xs text-red-400">{loansError.response?.status === 403 ? "Anda tidak memiliki izin." : loansError.message}</p>
                      </div>
                    </td>
                  </tr>
                ) : loans && loans.length > 0 ? (
                  loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-blue-50/30 transition-colors duration-300 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005bb7]"><FileText size={14} /></div>
                          <span className="font-black text-slate-700 text-xs tracking-wider">{loan.id.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-black text-slate-900">{loan.user?.name}</div>
                        <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">NPK: {loan.user?.npk}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-black text-slate-900">{formatCurrency(loan.amount)}</div>
                        <div className="text-[10px] text-slate-400">Total: {formatCurrency(loan.totalPayment)}</div>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-700">{loan.tenor} <span className="text-slate-400 font-medium text-xs">Bln</span></td>
                      <td className="px-8 py-5">
                        <span className="bg-blue-50 text-[#005bb7] text-[10px] font-black px-3 py-1.5 rounded-xl border border-blue-100">{loan.category?.name}</span>
                      </td>
                      <td className="px-8 py-6 min-w-[220px]">
                        <MiniTracker status={loan.status} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => { setSelectedLoan(loan); setRejectNote(''); }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-[#005bb7] bg-blue-50 border border-blue-100 hover:bg-[#005bb7] hover:text-white rounded-xl transition-all duration-500"
                        >
                          <Eye size={14} />Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Layers size={60} className="text-slate-300" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Tidak ada pengajuan pending</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Tab Content: Kategori */}
      {activeTab === 'kategori' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catLoading ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300">
              <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Loading...</p>
            </div>
          ) : catError ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 bg-red-50/50 backdrop-blur-xl rounded-[3rem] border border-red-100 text-red-500">
              <AlertCircle size={60} />
              <p className="font-black text-2xl tracking-tighter uppercase">{catError.response?.status === 403 ? "Access Denied" : "System Error"}</p>
              <p className="text-sm text-red-400">{catError.response?.status === 403 ? "Unauthorized access." : catError.message}</p>
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="group relative bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_15px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,91,183,0.1)] transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col gap-8">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-16 h-16 bg-blue-50 text-[#005bb7] rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:bg-[#005bb7] group-hover:text-white group-hover:rotate-6 shadow-sm border border-blue-100/50">
                    <FileText size={32} />
                  </div>
                  <div className="text-right">
                    <div className="badge-elegant bg-blue-50 text-[#005bb7] border-blue-100 mb-2 inline-block">{category.code}</div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{category.name}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-1.5"><DollarSign size={14} className="text-blue-500" /><span className="text-[10px] font-black uppercase tracking-widest">Max Plafon</span></div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{formatCurrency(category.maxAmount)}</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-1.5"><Calendar size={14} className="text-green-500" /><span className="text-[10px] font-black uppercase tracking-widest">Max Tenor</span></div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{category.maxTenor} <span className="text-xs text-slate-400">Bln</span></p>
                  </div>
                  <div className="bg-gradient-to-r from-[#005bb7] to-[#00a8e8] p-5 rounded-2xl col-span-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white"><TrendingUp size={20} /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-50">Suku Bunga Efektif</span>
                      </div>
                      <p className="text-3xl font-black text-white tracking-tighter">{category.interestRate}% <span className="text-xs font-bold text-blue-100/60">/ Thn</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 relative z-10">
                  {/* isRequiredUpload badge */}
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    category.isRequiredUpload
                      ? 'bg-blue-50 text-[#005bb7] border-blue-100'
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    <Upload size={14} />
                    {category.isRequiredUpload ? 'Upload Wajib' : 'Upload Opsional'}
                  </div>
                </div>
                <div className="flex gap-4 relative z-10">
                  <button onClick={() => handleEdit(category)} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 hover:border-[#005bb7] hover:text-[#005bb7] transition-all duration-500 shadow-sm">
                    <Edit3 size={16} />Edit
                  </button>
                  <button onClick={() => handleDelete(category.id)} disabled={deleteMutation.isPending} className="w-14 h-14 flex items-center justify-center rounded-[1.25rem] text-red-400 border border-red-50 hover:bg-red-50 hover:text-red-600 transition-all duration-500 disabled:opacity-50">
                    {deleteMutation.isPending && deleteMutation.variables === category.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300 opacity-40">
              <Layers size={80} className="text-slate-300" />
              <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-sm">Belum ada kategori</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] w-full max-w-xl overflow-hidden border border-white">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#005bb7] to-[#00a8e8] rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(0,91,183,0.3)]">
                  <Plus size={32} className={`transition-transform duration-700 ${editId ? "rotate-45" : ""}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{editId ? "Edit Konfigurasi" : "Produk Baru"}</h2>
                  <p className="text-sm font-medium text-slate-400 mt-1">{editId ? "Perbarui parameter produk" : "Definisikan produk pinjaman baru"}</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Nama Kategori</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Contoh: Pembiayaan Kendaraan" className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-base font-bold focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Kode</label>
                  <input type="text" name="code" required disabled={!!editId} value={formData.code} onChange={handleInputChange} placeholder="E.g. PKB" className={`w-full border border-slate-200 rounded-[1.5rem] px-6 py-4 text-base font-black tracking-widest focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] transition-all ${editId ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50/50 focus:bg-white'}`} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Bunga (%)</label>
                  <input type="number" name="interestRate" required step="0.01" value={formData.interestRate} onChange={handleInputChange} placeholder="0.00" className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-base font-black text-[#005bb7] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Max Plafon (IDR)</label>
                  <input type="number" name="maxAmount" required value={formData.maxAmount} onChange={handleInputChange} placeholder="0" className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-base font-black focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Max Tenor (Bulan)</label>
                  <input type="number" name="maxTenor" required value={formData.maxTenor} onChange={handleInputChange} placeholder="0" className="w-full bg-slate-50/50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-base font-black focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] focus:bg-white transition-all" />
                </div>
                {/* isRequiredUpload Toggle */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Wajib Upload Dokumen</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isRequiredUpload: !prev.isRequiredUpload }))}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] border-2 transition-all duration-500 ${
                      formData.isRequiredUpload
                        ? 'bg-[#005bb7] border-[#005bb7] text-white shadow-[0_10px_30px_rgba(0,91,183,0.2)]'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Upload size={20} />
                      <div className="text-left">
                        <p className="text-sm font-black">{formData.isRequiredUpload ? 'Upload Dokumen Wajib' : 'Upload Dokumen Tidak Wajib'}</p>
                        <p className={`text-[10px] font-medium mt-0.5 ${formData.isRequiredUpload ? 'text-blue-100' : 'text-slate-400'}`}>
                          {formData.isRequiredUpload ? 'Peminjam harus melampirkan dokumen pendukung' : 'Klik untuk mengaktifkan kewajiban upload'}
                        </p>
                      </div>
                    </div>
                    {formData.isRequiredUpload
                      ? <ToggleRight size={36} className="text-white" />
                      : <ToggleLeft size={36} className="text-slate-300" />
                    }
                  </button>
                </div>
              </div>
              {(createMutation.isError || updateMutation.isError) && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                  <AlertCircle size={18} />
                  {(createMutation.error || updateMutation.error)?.response?.data?.message || "Gagal menyimpan."}
                </div>
              )}
              <div className="flex gap-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all">Batal</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-[2] py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-white bg-[#005bb7] hover:bg-[#004a96] shadow-[0_15px_35px_rgba(0,91,183,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                  {createMutation.isPending || updateMutation.isPending ? <><Loader2 size={18} className="animate-spin" />Menyimpan...</> : (editId ? "Perbarui" : "Simpan Produk")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Approval Modal ─────────────────────────────────────── */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] w-full max-w-2xl border border-white overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-transparent">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Tindakan Persetujuan</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedLoan.user?.name}</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">NPK: {selectedLoan.user?.npk} &bull; {selectedLoan.category?.name}</p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Loan Summary */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
              <div className="p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Jumlah Pinjaman</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(selectedLoan.amount)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Bayar</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(selectedLoan.totalPayment)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Tenor</p>
                <p className="text-xl font-black text-slate-900">{selectedLoan.tenor} <span className="text-sm text-slate-400">Bulan</span></p>
              </div>
            </div>

            {/* Current tracking */}
            <div className="px-8 py-5 border-b border-slate-100">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-400 mb-3">Posisi Alur Saat Ini</p>
              <MiniTracker status={selectedLoan.status} />
            </div>

            {/* Reject note */}
            <div className="px-8 py-5 border-b border-slate-100">
              <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-slate-400 mb-2">
                Catatan Penolakan <span className="text-slate-300">(opsional)</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Tulis alasan penolakan jika diperlukan..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#005bb7] transition-all resize-none"
              />
            </div>

            {/* Error */}
            {updateLoanStatus.isError && (
              <div className="mx-8 mt-4 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-5 py-3 rounded-2xl text-xs font-black">
                <AlertCircle size={16} />
                {updateLoanStatus.error?.response?.data?.message || 'Gagal memperbarui status. Coba lagi.'}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 px-8 py-6">
              <button
                disabled={updateLoanStatus.isPending}
                onClick={() => updateLoanStatus.mutate({ loanId: selectedLoan.id, status: 'REJECTED', note: rejectNote }, { onSuccess: () => setSelectedLoan(null) })}
                className="flex-1 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {updateLoanStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                Tolak
              </button>
              <button
                disabled={updateLoanStatus.isPending}
                onClick={() => updateLoanStatus.mutate({ loanId: selectedLoan.id, status: 'APPROVED', note: rejectNote }, { onSuccess: () => setSelectedLoan(null) })}
                className="flex-[2] py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-[#005bb7] hover:bg-[#004a96] shadow-[0_10px_30px_rgba(0,91,183,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {updateLoanStatus.isPending
                  ? <><Loader2 size={16} className="animate-spin" />Memproses...</>
                  : <><Eye size={16} />Setujui Pengajuan</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

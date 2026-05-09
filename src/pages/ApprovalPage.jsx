import React, { useState } from 'react';
import { Clock, Search, ChevronDown, Eye, FileText, Loader2, AlertCircle, X, Layers } from 'lucide-react';
import { usePendingLoans, useUpdateLoanStatus } from '../api/loanApi';
import { WorkflowBanner, MiniTracker } from '../components/approval/WorkflowTracker';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export default function ApprovalPage() {
  // Persetujuan data
  const { data: loans, isLoading: loansLoading, error: loansError } = usePendingLoans();

  // Approval modal state
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const updateLoanStatus = useUpdateLoanStatus();
  const [search, setSearch] = useState('');

  const filteredLoans = loans?.filter(loan => 
    loan.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    loan.user?.npk?.toLowerCase().includes(search.toLowerCase()) ||
    loan.id.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-[#76bc21] rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Manajemen Pinjaman</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
            Approval <span className="text-gradient-blue">Pembiayaan</span>
          </h1>
          <p className="text-slate-600 font-medium text-lg mt-2 max-w-md">Review dan kelola pengajuan pinjaman anggota KMMA secara real-time.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4 flex-wrap bg-slate-50/50">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, NPK, atau ID pinjaman..."
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#005bb7] transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 border border-slate-200 rounded-xl px-5 py-3 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 uppercase tracking-widest shadow-sm transition-colors">
              Semua Status <ChevronDown size={14} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">ID Pinjaman</th>
                  <th className="px-6 py-4 font-bold">Pemohon</th>
                  <th className="px-6 py-4 font-bold">Jumlah</th>
                  <th className="px-6 py-4 font-bold">Tenor</th>
                  <th className="px-6 py-4 font-bold">Kategori</th>
                  <th className="px-6 py-4 font-bold">Tracking Alur</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loansLoading ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#005bb7] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : loansError ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-16 text-center text-red-500">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle size={32} />
                        <p className="font-bold uppercase tracking-widest text-xs">{loansError.response?.status === 403 ? "Akses Ditolak" : "Gagal memuat data"}</p>
                        <p className="text-[10px] text-red-400 font-medium">{loansError.response?.status === 403 ? "Anda tidak memiliki izin." : loansError.message}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#005bb7] transition-colors"><FileText size={14} /></div>
                          <span className="font-bold text-slate-700 text-[11px] tracking-wide">{loan.id.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{loan.user?.name}</div>
                        <div className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">NPK: {loan.user?.npk}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{formatCurrency(loan.amount)}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Total: {formatCurrency(loan.totalPayment)}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{loan.tenor} <span className="text-slate-400 font-normal text-xs">Bln</span></td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md">{loan.category?.name}</span>
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <MiniTracker status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { setSelectedLoan(loan); setRejectNote(''); }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-200 hover:bg-[#005bb7] hover:text-white hover:border-[#005bb7] rounded-lg transition-all duration-300"
                        >
                          <Eye size={12} />Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Layers size={40} className="text-slate-400" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tidak ada pengajuan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Approval Modal ─────────────────────────────────────── */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] w-full max-w-2xl border border-white overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-transparent">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Tindakan Persetujuan</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedLoan.user?.name}</h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">NPK: {selectedLoan.user?.npk} &bull; {selectedLoan.category?.name}</p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Loan Summary */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
              <div className="p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Jumlah Pinjaman</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(selectedLoan.amount)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Bayar</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(selectedLoan.totalPayment)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Tenor</p>
                <p className="text-xl font-black text-slate-900">{selectedLoan.tenor} <span className="text-sm text-slate-500">Bulan</span></p>
              </div>
            </div>

            {/* Current tracking */}
            <div className="px-8 py-5 border-b border-slate-100">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500 mb-3">Posisi Alur Saat Ini</p>
              <MiniTracker status={selectedLoan.status} />
            </div>

            {/* Reject note */}
            <div className="px-8 py-5 border-b border-slate-100">
              <label className="block text-[9px] font-black uppercase tracking-[0.35em] text-slate-500 mb-2">
                Catatan Penolakan <span className="text-slate-400">(opsional)</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Tulis alasan penolakan jika diperlukan..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#005bb7] transition-all resize-none shadow-sm"
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
                className="flex-1 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
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

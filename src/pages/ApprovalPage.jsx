import React, { useState } from 'react';
import { Clock, Search, Eye, FileText, Loader2, AlertCircle, X, Layers } from 'lucide-react';
import { usePendingLoans, useUpdateLoanStatus } from '../api/loanApi';
import { WorkflowBanner, MiniTracker } from '../components/approval/WorkflowTracker';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export default function ApprovalPage() {
  const { data: loans, isLoading: loansLoading, error: loansError } = usePendingLoans();
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
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Approval Pembiayaan</h1>
          <p className="text-xs text-slate-400 mt-0.5">Review dan kelola pengajuan pinjaman anggota KMMA.</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap bg-slate-50/50">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NPK, atau ID pinjaman..."
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#005bb7] transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">ID Pinjaman</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pemohon</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Jumlah</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenor</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Kategori</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracking Alur</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loansLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#005bb7] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 text-xs">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : loansError ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-red-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={24} />
                      <p className="font-semibold text-xs">{loansError.response?.status === 403 ? 'Akses Ditolak' : 'Gagal memuat data'}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileText size={11} />
                        </div>
                        <span className="font-semibold text-slate-600 text-[10px]">{loan.id.substring(0, 8)}…</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{loan.user?.name}</div>
                      <div className="text-slate-400 text-[10px]">NPK: {loan.user?.npk}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{formatCurrency(loan.amount)}</div>
                      <div className="text-slate-400 text-[10px]">Total: {formatCurrency(loan.totalPayment)}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{loan.tenor} <span className="text-slate-400 font-normal text-[10px]">Bln</span></td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">{loan.category?.name}</span>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <MiniTracker status={loan.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setSelectedLoan(loan); setRejectNote(''); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-slate-600 border border-slate-200 hover:bg-[#005bb7] hover:text-white hover:border-[#005bb7] rounded-lg transition-all duration-200"
                      >
                        <Eye size={10} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <Layers size={32} className="text-slate-400" />
                      <p className="text-slate-500 text-xs">Tidak ada pengajuan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Tindakan Persetujuan</p>
                <h2 className="text-base font-bold text-slate-800">{selectedLoan.user?.name}</h2>
                <p className="text-xs text-slate-400">NPK: {selectedLoan.user?.npk} · {selectedLoan.category?.name}</p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                <X size={15} />
              </button>
            </div>

            {/* Loan Summary */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
              {[
                { label: 'Jumlah Pinjaman', value: formatCurrency(selectedLoan.amount) },
                { label: 'Total Bayar', value: formatCurrency(selectedLoan.totalPayment) },
                { label: 'Tenor', value: `${selectedLoan.tenor} Bulan` },
              ].map((item, i) => (
                <div key={i} className="p-4 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Tracking */}
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Posisi Alur Saat Ini</p>
              <MiniTracker status={selectedLoan.status} />
            </div>

            {/* Reject note */}
            <div className="px-5 py-4 border-b border-slate-100">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Catatan Penolakan <span className="text-slate-300">(opsional)</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Tulis alasan penolakan jika diperlukan..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#005bb7] transition-all resize-none"
              />
            </div>

            {/* Error */}
            {updateLoanStatus.isError && (
              <div className="mx-5 mt-3 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-xs font-semibold">
                <AlertCircle size={14} />
                {updateLoanStatus.error?.response?.data?.message || 'Gagal memperbarui. Coba lagi.'}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 px-5 py-4">
              <button
                disabled={updateLoanStatus.isPending}
                onClick={() => updateLoanStatus.mutate({ loanId: selectedLoan.id, status: 'REJECTED', note: rejectNote }, { onSuccess: () => setSelectedLoan(null) })}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {updateLoanStatus.isPending ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                Tolak
              </button>
              <button
                disabled={updateLoanStatus.isPending}
                onClick={() => updateLoanStatus.mutate({ loanId: selectedLoan.id, status: 'APPROVED', note: rejectNote }, { onSuccess: () => setSelectedLoan(null) })}
                className="flex-[2] py-2.5 rounded-xl text-xs font-bold text-white bg-[#005bb7] hover:bg-[#004a96] shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {updateLoanStatus.isPending ? <><Loader2 size={13} className="animate-spin" />Memproses...</> : <><Eye size={13} />Setujui</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { usePendingLoans } from '../../api/loanApi';
import { FileText, Loader2, Clock, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export default function PendingLoans() {
  const { data: loans, isLoading, error } = usePendingLoans();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-8 flex items-center justify-center shadow-sm">
        <Loader2 className="animate-spin text-[#005bb7] mr-2" size={18} />
        <p className="text-slate-400 text-xs">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    const isForbidden = error.response?.status === 403;
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          <p>{isForbidden ? 'Akses Ditolak - Tidak ada izin.' : error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[#005bb7]" />
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Approval Pinjaman</h2>
            <p className="text-[10px] text-slate-400">Pengajuan terbaru butuh persetujuan</p>
          </div>
        </div>
        <Link
          to="/persetujuan"
          className="text-[10px] font-semibold text-[#005bb7] hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pemohon</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Jumlah</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loans && loans.length > 0 ? (
              loans.slice(0, 5).map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#005bb7] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {loan.user?.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-xs">{loan.user?.name}</div>
                        <div className="text-[10px] text-slate-400">NPK: {loan.user?.npk}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="font-semibold text-slate-800 text-xs">{formatCurrency(loan.amount)}</div>
                    <div className="text-[10px] text-slate-400">{loan.tenor} Bulan</div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to="/persetujuan"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#76bc21] hover:text-[#68a61d]"
                    >
                      <Eye size={11} /> Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Clock size={28} className="text-slate-200" />
                    <p className="text-xs text-slate-400">Tidak ada pengajuan pending</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

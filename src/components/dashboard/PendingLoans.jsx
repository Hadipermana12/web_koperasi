import React from 'react';
import { usePendingLoans } from '../../api/loanApi';
import { FileText, Loader2, Clock, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

export default function PendingLoans() {
  const { data: loans, isLoading, error } = usePendingLoans();

  if (isLoading) {
    return (
      <div className="glass-bento p-12 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-gray-500 font-medium">Memuat pengajuan pinjaman...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-bento p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
          <AlertCircle size={20} />
          Gagal mengambil data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-bento overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-blue-50/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Persetujuan Pinjaman</h2>
          </div>
          <p className="text-sm text-gray-500">Pengajuan pinjaman terbaru yang butuh persetujuan</p>
        </div>
        <Link 
          to="/persetujuan" 
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-100 px-3 py-1.5 rounded-lg shadow-sm transition-all"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4">Pemohon</th>
              <th className="px-6 py-4 text-right">Jumlah</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loans && loans.length > 0 ? (
              loans.slice(0, 5).map((loan) => (
                <tr key={loan.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {loan.user?.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{loan.user?.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">NPK: {loan.user?.npk}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-gray-900 text-sm">{formatCurrency(loan.amount)}</div>
                    <div className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{loan.tenor} Bulan</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to="/persetujuan"
                      className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700"
                    >
                      <Eye size={12} />
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Clock size={36} className="text-gray-200" />
                    <p className="text-sm font-medium">Tidak ada pengajuan pinjaman pending</p>
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

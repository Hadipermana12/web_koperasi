import React from 'react';
import { Clock, Info, CheckCircle, Search, ChevronDown, Eye, FileText, Loader2, AlertCircle } from 'lucide-react';
import { usePendingLoans } from '../api/loanApi';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

export default function ApprovalPage() {
  const { data: loans, isLoading, error } = usePendingLoans();

  const summaryCards = [
    { title: 'Pending Review', value: loans?.length || 0, icon: Clock, iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50' },
    { title: 'Waiting Pak Agus', value: '0', icon: Info, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { title: 'Waiting Direktur', value: '0', icon: Info, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
    { title: 'Total Approved', value: '0', icon: CheckCircle, iconColor: 'text-green-600', iconBg: 'bg-green-50' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Persetujuan Pinjaman</h1>
        <p className="text-gray-500 text-sm">Kelola pengajuan pinjaman dengan sistem approval bertingkat</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-500 font-medium text-sm w-3/4">{card.title}</h3>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama, NPK, atau ID pinjaman..." 
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Semua Status
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">ID PINJAMAN</th>
                <th className="px-6 py-4 font-semibold">PEMOHON</th>
                <th className="px-6 py-4 font-semibold">JUMLAH</th>
                <th className="px-6 py-4 font-semibold">TENOR</th>
                <th className="px-6 py-4 font-semibold">KATEGORI</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="text-green-500 animate-spin" />
                      <p className="text-gray-400 font-medium">Memuat data pinjaman...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-red-500">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={32} />
                      <p className="font-bold">Gagal memuat data</p>
                      <p className="text-xs">{error.message}</p>
                    </div>
                  </td>
                </tr>
              ) : loans && loans.length > 0 ? (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="text-gray-400" size={16} />
                        <span className="font-medium text-gray-900">{loan.id.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{loan.user?.name}</div>
                      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">NPK: {loan.user?.npk}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{formatCurrency(loan.amount)}</div>
                      <div className="text-[10px] text-gray-400">Tot: {formatCurrency(loan.totalPayment)}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{loan.tenor} Bulan</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        {loan.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight border ${
                        loan.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <Clock size={10} className="mr-1.5" />
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-100 hover:bg-green-100 rounded-lg transition-all">
                        <Eye size={14} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-medium">
                    Tidak ada pengajuan pinjaman pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

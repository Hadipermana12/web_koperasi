import React, { useState } from 'react';
import { ChevronDown, Download, DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const chartData = [
  { name: 'Okt', labaBersih: 95 },
  { name: 'Nov', labaBersih: 105 },
  { name: 'Des', labaBersih: 110 },
  { name: 'Jan', labaBersih: 108 },
  { name: 'Feb', labaBersih: 115 },
  { name: 'Mar', labaBersih: 118 },
  { name: 'Apr', labaBersih: 122 },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Pendapatan', 'Pengeluaran', 'Laporan'];

  const summaryCards = [
    {
      title: 'Total Aset Koperasi',
      value: 'Rp 2.4M',
      change: '+12.5% dari bulan lalu',
      positive: true,
      icon: DollarSign,
      color: 'text-[#76bc21]',
      bg: 'bg-green-50',
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: 'Rp 125 Jt',
      change: '+8.2% vs target',
      positive: true,
      icon: TrendingUp,
      color: 'text-[#005bb7]',
      bg: 'bg-blue-50',
    },
    {
      title: 'Pengeluaran Bulan Ini',
      value: 'Rp 45 Jt',
      change: '-3.1% lebih efisien',
      positive: true,
      icon: TrendingDown,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pengelolaan Keuangan</h1>
          <p className="text-xs text-slate-400 mt-0.5">Monitor dan kelola keuangan koperasi secara real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            Bulan Ini <ChevronDown size={13} />
          </button>
          <button className="btn-green">
            <Download size={13} /> Export Laporan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium">{card.title}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                <card.icon size={15} className={card.color} />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-800 mb-1">{card.value}</p>
            <div className={`flex items-center gap-1 text-[10px] font-semibold ${card.positive ? 'text-[#76bc21]' : 'text-red-500'}`}>
              <TrendingUp size={10} />
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-0.5">Laporan Laba Rugi</h3>
        <p className="text-[10px] text-slate-400 mb-4">Perbandingan pendapatan vs pengeluaran (dalam juta)</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.7} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Poppins' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Poppins' }} ticks={[0, 35, 70, 105, 140]} domain={[0, 140]} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '11px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="labaBersih" name="Laba Bersih (Jt)" fill="#005bb7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Distribusi Aset */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Distribusi Aset</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Pinjaman Beredar', value: 'Rp 1.9M', pct: 77, color: 'bg-[#76bc21]' },
              { label: 'Simpanan Anggota', value: 'Rp 550 Jt', pct: 23, color: 'bg-[#005bb7]' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  <span className="text-xs font-bold text-slate-800">{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.pct}% dari total aset</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rasio Keuangan */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Rasio Keuangan</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Profit Margin', value: '64%', icon: TrendingUp, color: 'text-[#76bc21]', bg: 'bg-green-50' },
              { label: 'Loan to Savings Ratio', value: '3.36', icon: PieChart, color: 'text-[#005bb7]', bg: 'bg-blue-50' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-[10px] font-medium text-slate-500 mb-0.5">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                  <item.icon size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

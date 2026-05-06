import React, { useState } from 'react';
import { 
  ChevronDown, 
  Download, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengelolaan Keuangan</h1>
          <p className="text-gray-500 text-sm">Monitor dan kelola keuangan koperasi secara real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Bulan Ini
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 bg-green-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-600 transition-colors shadow-sm">
            <Download size={16} />
            Export Laporan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Green Solid */}
        <div className="bg-green-500 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-sm mb-2 text-green-50">Total Aset Koperasi</h3>
              <p className="text-3xl font-bold">Rp 2.4M</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-400">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <TrendingUp size={16} />
              +12.5% dari bulan lalu
            </div>
          </div>
        </div>

        {/* Card 2: Pendapatan */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 font-medium text-sm mb-2">Pendapatan Bulan Ini</h3>
              <p className="text-3xl font-bold text-gray-900">Rp 125 Jt</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
              <TrendingUp size={16} />
              +8.2% vs target
            </div>
          </div>
        </div>

        {/* Card 3: Pengeluaran */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-500 font-medium text-sm mb-2">Pengeluaran Bulan Ini</h3>
              <p className="text-3xl font-bold text-gray-900">Rp 45 Jt</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
              <TrendingDown size={16} />
              -3.1% lebih efisien
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={activeTab === tab ? 'bg-green-500 text-white px-6 py-2 rounded-full' : 'px-6 py-2'}>
                {tab}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Laporan Laba Rugi</h3>
        <p className="text-sm text-gray-500 mb-6">Perbandingan pendapatan vs pengeluaran (dalam juta)</p>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                ticks={[0, 35, 70, 105, 140]}
                domain={[0, 140]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="square"
                formatter={(value) => <span className="text-gray-600 text-sm font-medium ml-1">{value}</span>}
              />
              {/* Dummy data bars just to match the legend text for now, but only rendering Laba Bersih visibly */}
              <Bar dataKey="Pendapatan (Jt)" fill="#22c55e" hide={true} />
              <Bar dataKey="Pengeluaran (Jt)" fill="#ef4444" hide={true} />
              <Bar dataKey="labaBersih" name="Laba Bersih (Jt)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi Aset */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Aset</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600">Pinjaman Beredar</span>
                <span className="font-bold text-gray-900">Rp 1.9M</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '77%' }}></div>
              </div>
              <span className="text-xs text-gray-400">77% dari total aset</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600">Simpanan Anggota</span>
                <span className="font-bold text-gray-900">Rp 550 Jt</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
              </div>
              <span className="text-xs text-gray-400">23% dari total aset</span>
            </div>
          </div>
        </div>

        {/* Rasio Keuangan */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Rasio Keuangan</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Profit Margin</p>
                <p className="text-2xl font-bold text-green-500">64%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Loan to Savings Ratio</p>
                <p className="text-2xl font-bold text-blue-500">3.36</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <PieChart size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

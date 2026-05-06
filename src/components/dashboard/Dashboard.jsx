import React from 'react';
import { 
  Users, 
  Clock, 
  FileText, 
  Wallet,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import SummaryCard from './SummaryCard';
import RecentActivities from './RecentActivities';
import RegisteredUsers from './RegisteredUsers';
import PendingLoans from './PendingLoans';
import { useUsers, usePendingUsers } from '../../api/userApi';
import { usePendingLoans } from '../../api/loanApi';

const lineChartData = [
  { name: 'Okt', value: 45 },
  { name: 'Nov', value: 55 },
  { name: 'Des', value: 65 },
  { name: 'Jan', value: 60 },
  { name: 'Feb', value: 70 },
  { name: 'Mar', value: 75 },
  { name: 'Apr', value: 70 },
];

export default function Dashboard() {
  const { data: users } = useUsers();
  const { data: pendingUsers } = usePendingUsers();
  const { data: pendingLoans } = usePendingLoans();

  const totalUsers = users?.length || 0;
  const totalPendingUsers = pendingUsers?.length || 0;
  const totalPendingLoans = pendingLoans?.length || 0;

  const pieChartData = [
    { name: 'Disetujui', value: 156, color: '#22c55e' }, // green-500
    { name: 'Pending', value: totalPendingLoans, color: '#f59e0b' },
    { name: 'Ditolak', value: 12, color: '#ef4444' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm tracking-wide">Selamat datang kembali! Berikut ringkasan aktivitas koperasi hari ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Anggota Aktif"
          value={totalUsers.toLocaleString()}
          trend="+12.5%"
          isPositive={true}
          trendText="vs bulan lalu"
          icon={Users}
          iconColor="text-green-500"
          iconBg="bg-green-50"
        />
        <SummaryCard 
          title="Menunggu Verifikasi"
          value={totalPendingUsers.toLocaleString()}
          trend={totalPendingUsers > 0 ? `+${totalPendingUsers} baru` : 'Semua clear'}
          isPositive={totalPendingUsers === 0}
          trendText="dari Mobile App"
          icon={Clock}
          iconColor={totalPendingUsers > 0 ? 'text-yellow-600' : 'text-gray-400'}
          iconBg={totalPendingUsers > 0 ? 'bg-yellow-50' : 'bg-gray-50'}
        />
        <SummaryCard 
          title="Persetujuan Pinjaman"
          value={totalPendingLoans.toLocaleString()}
          trend={totalPendingLoans > 0 ? `${totalPendingLoans} pending` : 'Semua aman'}
          isPositive={totalPendingLoans === 0}
          trendText="butuh tindakan"
          icon={FileText}
          iconColor={totalPendingLoans > 0 ? 'text-blue-600' : 'text-gray-400'}
          iconBg={totalPendingLoans > 0 ? 'bg-blue-50' : 'bg-gray-50'}
        />
        <SummaryCard 
          title="Saldo Koperasi"
          value="Rp 2.4M"
          trend="+15.3%"
          isPositive={true}
          trendText="vs bulan lalu"
          icon={Wallet}
          iconColor="text-purple-500"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 glass-bento glass-bento-hover p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tren Transaksi</h3>
              <p className="text-sm text-gray-500">Data transaksi 7 bulan terakhir</p>
            </div>
            <button className="flex items-center gap-2 border border-white rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/50 transition-colors bg-white/30">
              7 Bulan Terakhir
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  ticks={[0, 45, 90, 135, 180]}
                  domain={[0, 180]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', color: '#1f2937' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  style={{ filter: 'drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.3))' }}
                  dot={{ fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-bento glass-bento-hover p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Status Pinjaman</h3>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-48 w-full relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))' }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', color: '#1f2937' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-2 border border-white">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_2px_4px_currentColor]" style={{ backgroundColor: item.color, color: item.color }}></div>
                    <span className="text-sm font-medium text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Bento Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Users (Real-time Sync) */}
        <RegisteredUsers />

        {/* Pending Loans Section */}
        <PendingLoans />
      </div>
    </div>
  );
}

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import SummaryCard from './SummaryCard';
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
    { name: 'Disetujui', value: 156, color: '#76bc21' },
    { name: 'Pending',   value: totalPendingLoans, color: '#f59e0b' },
    { name: 'Ditolak',   value: 12,  color: '#ef4444' },
  ];

  const totalProcessed = 156 + 12; // Disetujui + Ditolak
  const approvalRate = totalProcessed > 0 ? Math.round((156 / (156 + 12)) * 100) : 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-xs text-slate-400 mt-0.5">Selamat datang kembali! Berikut ringkasan aktivitas koperasi hari ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard 
          title="Approval Status"
          value={totalPendingUsers.toLocaleString()}
          trend={totalPendingUsers > 0 ? `+${totalPendingUsers}` : 'Clear'}
          isPositive={totalPendingUsers === 0}
          trendText="Anggota pending verifikasi"
          to="/anggota?tab=pending"
        />
        <SummaryCard 
          title="Total Anggota"
          value={totalUsers.toLocaleString()}
          trend="+12.5%"
          isPositive={true}
          trendText="vs bln lalu"
          to="/anggota?tab=all"
        />
        <SummaryCard 
          title="Approval Pinjaman"
          value={totalPendingLoans.toLocaleString()}
          trend={totalPendingLoans > 0 ? `${totalPendingLoans} pending` : 'Aman'}
          isPositive={totalPendingLoans === 0}
          trendText="butuh tindakan"
          to="/persetujuan"
        />
        <SummaryCard 
          title="Saldo Koperasi"
          value="Rp 2.4M"
          trend="+15.3%"
          isPositive={true}
          trendText="vs bln lalu"
          to="/keuangan"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-4 shadow-sm min-w-0">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Tren Transaksi</h3>
              <p className="text-[10px] text-slate-400">7 bulan terakhir</p>
            </div>
            <button className="flex items-center gap-1 border border-slate-100 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors bg-white">
              7 Bulan <ChevronDown size={12} />
            </button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.7} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Poppins' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Poppins' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '11px' }} />
                <Line type="monotone" dataKey="value" stroke="#005bb7" strokeWidth={2} dot={{ fill: '#fff', stroke: '#005bb7', strokeWidth: 2, r: 3 }} activeDot={{ r: 4, fill: '#005bb7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Status Pinjaman</h3>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex justify-between items-center px-2 py-1 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RegisteredUsers />
        <PendingLoans />
      </div>
    </div>
  );
}

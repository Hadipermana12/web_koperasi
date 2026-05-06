import React from 'react';
import { FileText, Receipt, FileCheck, ArrowDownCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    name: 'Budi Santoso (NPK: 12345)',
    action: 'mengajukan pinjaman',
    time: '5 menit yang lalu',
    amount: 'Rp 15.000.000',
    status: 'Pending',
    icon: FileText,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    statusColor: 'text-yellow-600',
    statusBg: 'bg-yellow-100'
  },
  {
    id: 2,
    name: 'Siti Nurhaliza (NPK: 12346)',
    action: 'melakukan setor simpanan',
    time: '12 menit yang lalu',
    amount: 'Rp 500.000',
    status: 'Completed',
    icon: Receipt,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    statusColor: 'text-green-600',
    statusBg: 'bg-green-100'
  },
  {
    id: 3,
    name: 'Ahmad Yani (NPK: 12347)',
    action: 'mengajukan pinjaman',
    time: '23 menit yang lalu',
    amount: 'Rp 10.000.000',
    status: 'Pending',
    icon: FileText,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    statusColor: 'text-yellow-600',
    statusBg: 'bg-yellow-100'
  },
  {
    id: 4,
    name: 'Pak Agus',
    action: 'menyetujui pinjaman',
    time: '1 jam yang lalu',
    amount: 'Rp 20.000.000',
    status: 'Approved',
    icon: FileCheck,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    statusColor: 'text-blue-600',
    statusBg: 'bg-blue-100'
  },
  {
    id: 5,
    name: 'Dewi Lestari (NPK: 12348)',
    action: 'melakukan penarikan',
    time: '2 jam yang lalu',
    amount: 'Rp 2.000.000',
    status: 'Completed',
    icon: ArrowDownCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    statusColor: 'text-green-600',
    statusBg: 'bg-green-100'
  }
];

export default function RecentActivities() {
  return (
    <div className="glass-bento mt-6 flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-gray-200 bg-white/40">
        <h2 className="text-lg font-bold text-gray-900">Aktivitas Terkini</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time updates dari sistem</p>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;
          
          // Map original colors to light theme variants
          const iconBg = activity.iconColor.includes('yellow') ? 'bg-amber-100 border border-amber-200 shadow-sm' :
                         activity.iconColor.includes('green') ? 'bg-green-100 border border-green-200 shadow-sm' :
                         activity.iconColor.includes('blue') ? 'bg-blue-100 border border-blue-200 shadow-sm' :
                         'bg-red-100 border border-red-200 shadow-sm';
                         
          const iconColor = activity.iconColor.includes('yellow') ? 'text-amber-600' :
                            activity.iconColor.includes('green') ? 'text-green-600' :
                            activity.iconColor.includes('blue') ? 'text-blue-600' :
                            'text-red-600';

          return (
            <div 
              key={activity.id} 
              className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-bold text-blue-600 mr-1">{activity.name}</span>
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                <span className="font-bold text-gray-900">{activity.amount}</span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${iconBg} ${iconColor}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

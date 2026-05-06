import React from 'react';
import { Search, Menu } from 'lucide-react';

export default function Header() {
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  };

  return (
    <header className="h-20 glass-panel flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-6 flex-1">
        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white/50 rounded-xl transition-colors">
          <Menu size={24} />
        </button>
        
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari pengajuan, anggota, transaksi..." 
            className="w-full bg-white/50 border border-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-bold text-gray-900">{userInfo.name || 'Admin'}</span>
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">{userInfo.role || 'Super Admin'}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 hover:shadow-sm transition-all text-xs"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

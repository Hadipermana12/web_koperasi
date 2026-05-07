import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  RefreshCw,
  User,
  Users
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import { usePendingLoans } from '../../api/loanApi';
import { usePendingUsers } from '../../api/userApi';

export default function Sidebar() {
  const { data: pendingLoans } = usePendingLoans();
  const { data: pendingUsers } = usePendingUsers();
  
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userRole = userInfo.role;

  const isHead = userRole === 'HEAD';
  const isAdmin = userRole === 'ADMIN';
  const isHeadOrAdmin = isHead || isAdmin;

  return (
    <aside className="w-64 h-screen glass-panel flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-white/40">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
          K
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-wide">KMMA</h1>
          <h2 className="text-xl font-bold text-gray-900 leading-tight tracking-wide">Admin</h2>
          <p className="text-xs text-blue-500 mt-1 tracking-widest uppercase font-semibold">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-sm' : 'text-gray-600 font-medium hover:bg-white/60 hover:text-blue-600'
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {isHeadOrAdmin && (
          <>
            <NavLink 
              to="/anggota" 
              className={({ isActive }) => 
                `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-sm' : 'text-gray-600 font-medium hover:bg-white/60 hover:text-blue-600'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                Manajemen Anggota
              </div>
              {pendingUsers?.length > 0 && (
                <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                  {pendingUsers.length}
                </span>
              )}
            </NavLink>
            
            <NavLink 
              to="/kategori-pinjaman" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-sm' : 'text-gray-600 font-medium hover:bg-white/60 hover:text-blue-600'
                }`
              }
            >
              <FileText size={20} />
              Kategori Pinjaman
            </NavLink>
          </>
        )}
        
        {isHead && (
          <NavLink 
            to="/persetujuan" 
            className={({ isActive }) => 
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-sm' : 'text-gray-600 font-medium hover:bg-white/60 hover:text-blue-600'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <FileText size={20} />
              Persetujuan Pinjaman
            </div>
            {pendingLoans?.length > 0 && (
              <span className="bg-red-100 text-red-600 border border-red-200 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                {pendingLoans.length}
              </span>
            )}
          </NavLink>
        )}

        <NavLink 
          to="/keuangan" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-sm' : 'text-gray-600 font-medium hover:bg-white/60 hover:text-blue-600'
            }`
          }
        >
          <Wallet size={20} />
          Pengelolaan Keuangan
        </NavLink>

        <NavLink 
          to="/sinkronisasi" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-sm' : 'text-gray-600 font-medium hover:bg-white/60 hover:text-blue-600'
            }`
          }
        >
          <RefreshCw size={20} />
          Sinkronisasi Data
        </NavLink>
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-white/40 flex items-center gap-3 bg-white/50">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 font-bold">
          {userInfo.name?.charAt(0) || <User size={20} />}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 truncate">{userInfo.name || 'Admin User'}</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest truncate">{userRole || 'Super Admin'}</p>
        </div>
      </div>
    </aside>
  );
}

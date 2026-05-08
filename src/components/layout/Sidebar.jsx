import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  RefreshCw,
  User,
  Users,
  ArrowRight
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
    <aside className="w-64 h-screen glass-panel flex flex-col fixed left-0 top-0 z-20 border-r border-white/40 overflow-hidden group">
      {/* Dynamic Background Decor */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10"></div>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-4 p-10 border-b border-white/40 relative">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#005bb7] to-[#00a8e8] rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-[0_15px_35px_rgba(0,91,183,0.3)] transform -rotate-6 transition-all duration-700 hover:rotate-0 hover:scale-110 cursor-pointer">
            K
            <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] animate-pulse"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#76bc21] border-4 border-white rounded-full shadow-lg shadow-green-900/20"></div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">KMMA</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#005bb7] mt-1 opacity-60">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto relative z-10">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-700 relative overflow-hidden group/link ${
              isActive 
                ? 'bg-[#005bb7] text-white shadow-[0_15px_35px_rgba(0,91,183,0.25)] scale-[1.02]' 
                : 'text-slate-400 font-bold hover:text-[#005bb7] hover:bg-white/80'
            }`
          }
        >
          <LayoutDashboard size={22} className="relative z-10" />
          <span className="tracking-tight relative z-10">Dashboard</span>
          <ArrowRight size={16} className={`absolute right-4 transition-all duration-500 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0 -translate-x-4`} />
        </NavLink>

        {isHeadOrAdmin && (
          <div className="mt-4">
            <p className="px-6 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Registry</p>
            <NavLink 
              to="/anggota" 
              className={({ isActive }) => 
                `flex items-center justify-between px-6 py-4 rounded-[1.25rem] transition-all duration-700 group/link ${
                  isActive 
                    ? 'bg-[#005bb7] text-white shadow-[0_15px_35px_rgba(0,91,183,0.25)] scale-[1.02]' 
                    : 'text-slate-400 font-bold hover:text-[#005bb7] hover:bg-white/80'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <Users size={22} />
                <span className="tracking-tight">Anggota</span>
              </div>
              {pendingUsers?.length > 0 && (
                <span className="bg-[#76bc21] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-green-900/20 animate-bounce">
                  {pendingUsers.length}
                </span>
              )}
            </NavLink>
          </div>
        )}
        
        {isHeadOrAdmin && (
          <div className="mt-4">
            <p className="px-6 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Pinjaman</p>
            <NavLink 
              to="/persetujuan" 
              className={({ isActive }) => 
                `flex items-center justify-between px-6 py-4 rounded-[1.25rem] transition-all duration-700 group/link ${
                  isActive 
                    ? 'bg-[#005bb7] text-white shadow-[0_15px_35px_rgba(0,91,183,0.25)] scale-[1.02]' 
                    : 'text-slate-400 font-bold hover:text-[#005bb7] hover:bg-white/80'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <FileText size={22} />
                <span className="tracking-tight text-xs leading-tight">Persetujuan Pinjaman</span>
              </div>
              {pendingLoans?.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-red-900/20 animate-pulse">
                  {pendingLoans.length}
                </span>
              )}
            </NavLink>
          </div>
        )}

        <div className="mt-4">
          <p className="px-6 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Utilities</p>
          <NavLink 
            to="/sinkronisasi" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-700 ${
                isActive 
                  ? 'bg-[#005bb7] text-white shadow-[0_15px_35px_rgba(0,91,183,0.25)] scale-[1.02]' 
                  : 'text-slate-400 font-bold hover:text-[#005bb7] hover:bg-white/80'
              }`
            }
          >
            <RefreshCw size={22} />
            <span className="tracking-tight">Sinkronisasi</span>
          </NavLink>
        </div>

        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink 
            to="/keuangan" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-700 ${
                isActive 
                  ? 'bg-[#005bb7] text-white shadow-[0_15px_35px_rgba(0,91,183,0.25)] scale-[1.02]' 
                  : 'text-slate-400 font-bold hover:text-[#005bb7] hover:bg-white/80'
              }`
            }
          >
            <Wallet size={22} />
            <span className="tracking-tight">Keuangan</span>
          </NavLink>
        </div>
      </nav>

      {/* Profile Section - Characterful */}
      <div className="p-8 relative">
        <div className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-blue-900/5 group/profile transition-all duration-700 hover:scale-[1.05]">
          <div className="relative">
            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#76bc21] to-[#00a8e8] flex items-center justify-center text-white shadow-lg shadow-blue-900/10 font-black text-xl group-hover/profile:rotate-12 transition-transform duration-500">
              {userInfo.name?.charAt(0) || "A"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 truncate tracking-tight">{userInfo.name || "Administrator"}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">{userRole || "KMMA Staff"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

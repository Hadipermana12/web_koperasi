import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  UserCheck,
  Users,
  Settings,
  Package,
  Car,
  ChevronRight,
  ChevronDown,
  Database,
  ChevronUp
} from 'lucide-react';

import { NavLink, useLocation } from 'react-router-dom';
import { usePendingLoans } from '../../api/loanApi';
import { usePendingUsers } from '../../api/userApi';
import logo from '../../assets/logoo.png';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const { data: pendingLoans } = usePendingLoans();
  const { data: pendingUsers } = usePendingUsers();
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  
  const isLinkActive = (path) => {
    return location.pathname + location.search === path;
  };
  
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userRole = userInfo.role;

  const isHead = userRole === 'HEAD';
  const isAdmin = userRole === 'ADMIN';
  const isHeadOrAdmin = isHead || isAdmin;

  return (
    <aside className="w-72 h-screen bg-white/80 backdrop-blur-3xl flex flex-col fixed left-0 top-0 z-20 border-r border-slate-200 shadow-[20px_0_50px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-8 flex items-center justify-center border-b border-slate-100/50">
        <div className="w-full max-w-[14rem] h-20 flex items-center justify-center group cursor-pointer">
          <img src={logo} alt="KMMA Logo" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-all duration-500" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        
        {/* DASHBOARD */}
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group ${
              isActive 
                ? 'bg-[#005bb7] text-white shadow-[0_10px_25px_rgba(0,91,183,0.2)]' 
                : 'text-slate-700 font-black hover:bg-slate-50 hover:text-[#005bb7]'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="tracking-tight uppercase text-xs font-black tracking-widest">Dashboard</span>
        </NavLink>

        {/* AKTIVASI AKUN USER */}
        {isHeadOrAdmin && (
          <NavLink 
            to="/anggota?tab=pending" 
            className={
              isLinkActive('/anggota?tab=pending')
                ? 'flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group mt-2 bg-[#005bb7] text-white shadow-[0_10px_25px_rgba(0,91,183,0.2)]' 
                : 'flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group mt-2 text-slate-700 font-black hover:bg-slate-50 hover:text-[#005bb7]'
            }
          >
            <div className="flex items-center gap-4">
              <UserCheck size={20} />
              <span className="tracking-tight uppercase text-xs font-black tracking-widest">Aktivasi Akun User</span>
            </div>
            {pendingUsers?.length > 0 && (
              <span className="bg-[#76bc21] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                {pendingUsers.length}
              </span>
            )}
          </NavLink>
        )}

        {/* APPROVAL PEMBIAYAAN */}
        {isHeadOrAdmin && (
          <NavLink 
            to="/persetujuan" 
            className={({ isActive }) => 
              `flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group mt-2 ${
                isActive 
                  ? 'bg-[#005bb7] text-white shadow-[0_10px_25px_rgba(0,91,183,0.2)]' 
                  : 'text-slate-700 font-black hover:bg-slate-50 hover:text-[#005bb7]'
              }`
            }
          >
            <div className="flex items-center gap-4">
              <FileText size={20} />
              <span className="tracking-tight uppercase text-xs font-black tracking-widest leading-tight">Approval Pembiayaan</span>
            </div>
            {pendingLoans?.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg animate-pulse">
                {pendingLoans.length}
              </span>
            )}
          </NavLink>
        )}

        {/* MASTER DATA GROUP (Dropdown) */}
        <div className="mt-8 mb-2">
          <button 
            onClick={() => setIsMasterOpen(!isMasterOpen)}
            className="w-full px-6 flex items-center justify-between mb-4 group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Database size={14} className="text-slate-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Master Data</p>
            </div>
            <div className={`transition-transform duration-300 ${isMasterOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-[#005bb7]" />
            </div>
          </button>
          
          {isMasterOpen && (
            <div className="flex flex-col gap-1 pl-4 border-l-2 border-slate-100 ml-4 animate-in slide-in-from-top-2 duration-300">
              {/* Daftar User */}
              <NavLink 
                to="/anggota?tab=all" 
                className={
                  isLinkActive('/anggota?tab=all')
                    ? 'flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 text-[#005bb7] bg-blue-50 font-black' 
                    : 'flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 text-slate-700 font-black hover:text-[#005bb7]'
                }
              >
                <Users size={16} />
                <span className="text-xs tracking-tight">Daftar User</span>
              </NavLink>

              {/* Kategori Pinjaman */}
              <NavLink 
                to="/kategori-pinjaman" 
                className={({ isActive }) => 
                  `flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 ${
                    isActive ? 'text-[#005bb7] bg-blue-50 font-black' : 'text-slate-700 font-black hover:text-[#005bb7]'
                  }`
                }
              >
                <Settings size={16} />
                <span className="text-xs tracking-tight">Kategori Pinjaman</span>
              </NavLink>

              {/* Produk Coming Soon */}
              <div className="flex items-center gap-4 px-6 py-3 text-slate-300 cursor-not-allowed">
                <Package size={16} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Produk</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">Coming Soon</span>
                </div>
              </div>

              {/* Mobil Coming Soon */}
              <div className="flex items-center gap-4 px-6 py-3 text-slate-300 cursor-not-allowed">
                <Car size={16} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Mobil</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">Coming Soon</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Keuangan Section */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <NavLink 
            to="/keuangan" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 ${
                isActive 
                  ? 'bg-[#005bb7] text-white shadow-[0_10px_25px_rgba(0,91,183,0.2)]' 
                  : 'text-slate-600 font-bold hover:bg-slate-50 hover:text-[#005bb7]'
              }`
            }
          >
            <Wallet size={20} />
            <span className="tracking-tight uppercase text-xs font-black tracking-widest">Keuangan</span>
          </NavLink>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="p-6">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-[#76bc21] flex items-center justify-center text-white font-black text-lg">
            {userInfo.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-xs font-black text-slate-900 truncate">{userInfo.name || "Administrator"}</h3>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{userRole || "Staff"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

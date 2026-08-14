import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  UserCheck,
  Users,
  Settings,
  Package,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  LogOut
} from 'lucide-react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePendingLoans } from '../../api/loanApi';
import { usePendingUsers } from '../../api/userApi';
import logo from '../../assets/logoo.png';
import { useState } from 'react';

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: pendingLoans } = usePendingLoans();
  const { data: pendingUsers } = usePendingUsers();
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  
  const isLinkActive = (path) => {
    return location.pathname + location.search === path;
  };
  
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userRole = userInfo.role;
  const isHead = userRole?.toUpperCase() === 'HEAD';
  const isAdmin = userRole?.toUpperCase() === 'ADMIN';
  const isHeadOrAdmin = isHead || isAdmin;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    navigate('/login');
  };

  const navLinkClass = (isActive) =>
    `flex items-center ${isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5'} rounded-lg text-[14px] font-medium transition-all duration-200 ${
      isActive
        ? 'bg-[#76bc21] text-[#0f172a] shadow-sm shadow-[#76bc21]/20'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  const subLinkClass = (isActive) =>
    `flex items-center ${isCollapsed ? 'justify-center w-10 h-8 mx-auto' : 'gap-3 px-3 py-1.5'} rounded-lg text-[13px] font-normal transition-all duration-200 ${
      isActive
        ? 'bg-[#76bc21]/15 text-[#76bc21]'
        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
    }`;

  return (
    <aside className={`h-[calc(100vh-24px)] bg-[#0f172a] flex flex-col fixed left-3 top-3 z-20 rounded-2xl shadow-lg border border-slate-800/40 overflow-visible transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Vertical Bar Toggle Tab (Diletakkan di belakang layer sidebar, warna navy tetap solid saat hover) */}
      <button 
        onClick={onToggleCollapse} 
        className="absolute -right-6 top-[-1px] h-14 w-12 bg-[#0f172a] text-slate-400 hover:text-[#76bc21] flex items-center justify-end pr-2.5 rounded-r-2xl border-y border-r border-slate-800/80 shadow-md transition-all cursor-pointer z-[-1] group"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <div className="w-1.5 h-6 bg-slate-600 group-hover:bg-[#76bc21] rounded-full transition-colors" />
      </button>

      {/* Logo Area */}
      <div className="px-4 pt-8 pb-6 border-b border-slate-800/60 flex items-center justify-center">
        {!isCollapsed ? (
          <img src={logo} alt="KMMA Logo" className="h-14 object-contain brightness-110" />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-[#76bc21] flex items-center justify-center text-[#0f172a] font-bold text-base shadow-sm">
            K
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'items-center gap-1.5' : ''}`}>
        {/* Section label */}
        {!isCollapsed && <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1">Menu</p>}

        {/* DASHBOARD */}
        <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)} title={isCollapsed ? "Dashboard" : undefined}>
          <LayoutDashboard size={15} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        {/* AKTIVASI AKUN USER */}
        {isHeadOrAdmin && (
          <NavLink
            to="/anggota?tab=pending"
            className={isLinkActive('/anggota?tab=pending') ? navLinkClass(true) : navLinkClass(false)}
            title={isCollapsed ? "Aktivasi User" : undefined}
          >
            <UserCheck size={15} className="shrink-0" />
            {!isCollapsed && <span className="flex-1">Aktivasi User</span>}
            {pendingUsers?.length > 0 && !isCollapsed && (
              <span className="bg-[#76bc21] text-[#0f172a] font-bold rounded-md text-center text-[9px] px-1.5 py-0.5 min-w-[18px]">
                {pendingUsers.length}
              </span>
            )}
          </NavLink>
        )}

        {/* APPROVAL PEMBIAYAAN */}
        {isHeadOrAdmin && (
          <NavLink
            to="/persetujuan"
            className={({ isActive }) => navLinkClass(isActive)}
            title={isCollapsed ? "Approval" : undefined}
          >
            <FileText size={15} className="shrink-0" />
            {!isCollapsed && <span className="flex-1">Approval</span>}
            {pendingLoans?.length > 0 && !isCollapsed && (
              <span className="bg-red-500 text-white font-bold rounded-md text-center text-[9px] px-1.5 py-0.5 min-w-[18px] animate-pulse">
                {pendingLoans.length}
              </span>
            )}
          </NavLink>
        )}

        {/* MASTER DATA */}
        {isCollapsed ? (
          <>
            <NavLink to="/anggota?tab=all" className={isLinkActive('/anggota?tab=all') ? navLinkClass(true) : navLinkClass(false)} title="Daftar User">
              <Users size={15} className="shrink-0" />
            </NavLink>
            <NavLink to="/kategori-pinjaman" className={({ isActive }) => navLinkClass(isActive)} title="Kategori Pinjaman">
              <Settings size={15} className="shrink-0" />
            </NavLink>
          </>
        ) : (
          <div className="mt-2 w-full">
            <button
              onClick={() => setIsMasterOpen(!isMasterOpen)}
              className="w-full px-3 flex items-center justify-between mb-1 py-1 group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database size={11} className="text-slate-500" />
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Master Data</p>
              </div>
              <ChevronDown
                size={11}
                className={`text-slate-500 transition-transform duration-200 ${isMasterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isMasterOpen && (
              <div className="flex flex-col gap-0.5 pl-3 border-l-2 border-slate-800/60 ml-3">
                <NavLink
                  to="/anggota?tab=all"
                  className={isLinkActive('/anggota?tab=all') ? subLinkClass(true) : subLinkClass(false)}
                >
                  <Users size={14} className="shrink-0" />
                  <span>Daftar User</span>
                </NavLink>

                <NavLink
                  to="/kategori-pinjaman"
                  className={({ isActive }) => subLinkClass(isActive)}
                >
                  <Settings size={14} className="shrink-0" />
                  <span>Kategori Pinjaman</span>
                </NavLink>

                <div className="flex items-center gap-3 px-3 py-1.5 text-slate-600 cursor-not-allowed">
                  <Package size={14} className="shrink-0" />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs">Produk</span>
                    <span className="text-[8px] uppercase tracking-tight opacity-55">Soon</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 text-slate-600 cursor-not-allowed">
                  <Car size={14} className="shrink-0" />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs">Mobil</span>
                    <span className="text-[8px] uppercase tracking-tight opacity-55">Soon</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KEUANGAN */}
        <div className="mt-2 w-full">
          {!isCollapsed && <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1">Keuangan</p>}
          <NavLink
            to="/keuangan"
            className={({ isActive }) => navLinkClass(isActive)}
            title={isCollapsed ? "Keuangan" : undefined}
          >
            <Wallet size={15} className="shrink-0" />
            {!isCollapsed && <span>Keuangan</span>}
          </NavLink>
        </div>
      </nav>

      {/* Profile & Logout */}
      <div className="px-3 py-3 border-t border-slate-800/60 relative">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-slate-800 shadow-sm border border-[#0f172a]/10 transition-all">
            <div className="w-7 h-7 rounded-lg bg-[#76bc21] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {userInfo.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">{userInfo.name || 'Admin'}</p>
              <p className="text-[9px] text-[#76bc21] uppercase font-bold tracking-wide leading-tight">{userRole || 'Staff'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 cursor-pointer"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center relative">
            <button
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className="w-10 h-10 rounded-xl bg-white text-[#0f172a] hover:ring-2 hover:ring-[#76bc21] flex items-center justify-center font-bold text-sm shadow-sm transition-all cursor-pointer"
              title={userInfo.name || 'Profil Akun'}
            >
              <div className="w-8 h-8 rounded-lg bg-[#76bc21] flex items-center justify-center text-white font-bold text-xs">
                {userInfo.name?.charAt(0) || 'A'}
              </div>
            </button>

            {/* Floating Profile Pop-up Modal */}
            {showProfilePopup && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfilePopup(false)} 
                />
                <div className="absolute left-14 bottom-0 w-52 bg-white rounded-2xl shadow-2xl border border-[#0f172a]/10 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#76bc21] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                      {userInfo.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{userInfo.name || 'Admin'}</p>
                      <p className="text-[10px] text-[#76bc21] font-semibold uppercase">{userRole || 'Staff'}</p>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">{userInfo.email || 'admin@kmma.co.id'}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

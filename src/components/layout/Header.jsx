import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, CheckCircle, XCircle, Info, Check, X, 
  Users, FileText, LayoutDashboard, Wallet, Settings, UserCheck, ArrowRight, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkAsRead } from '../../api/notificationApi';
import { useUsers } from '../../api/userApi';
import { usePendingLoans, useLoanCategories } from '../../api/loanApi';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
}

function typeConfig(type) {
  switch (type) {
    case 'LOAN_APPROVED': return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
    case 'LOAN_REJECTED': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-500' };
    default: return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' };
  }
}

const APP_MENUS = [
  { title: 'Dashboard', desc: 'Ringkasan aktivitas & statistik', path: '/', icon: LayoutDashboard, category: 'Menu Utama' },
  { title: 'Aktivasi User', desc: 'Verifikasi pendaftaran anggota baru', path: '/anggota?tab=pending', icon: UserCheck, category: 'Menu Utama' },
  { title: 'Approval Pembiayaan', desc: 'Persetujuan pinjaman anggota', path: '/persetujuan', icon: FileText, category: 'Menu Utama' },
  { title: 'Daftar Anggota', desc: 'Manajemen semua anggota koperasi', path: '/anggota?tab=all', icon: Users, category: 'Master Data' },
  { title: 'Kategori Pinjaman', desc: 'Konfigurasi produk, bunga & tenor', path: '/kategori-pinjaman', icon: Settings, category: 'Master Data' },
  { title: 'Pengelolaan Keuangan', desc: 'Laporan laba rugi, aset & rasio', path: '/keuangan', icon: Wallet, category: 'Keuangan' },
];

function NotificationPanel({ onClose }) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Notifikasi</h3>
          {unreadCount > 0 && (
            <p className="text-[10px] text-slate-400 mt-0.5">{unreadCount} belum dibaca</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => notifications.filter(n => !n.isRead).forEach(n => markAsRead.mutate(n.id))}
              className="text-[10px] font-semibold text-[#005bb7] hover:underline flex items-center gap-1"
            >
              <Check size={10} /> Tandai Semua
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] text-slate-400">Memuat...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 opacity-40">
            <Bell size={28} className="text-slate-300" />
            <p className="text-xs text-slate-400">Belum ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = typeConfig(notif.type);
            const Icon = cfg.icon;
            return (
              <button
                key={notif.id}
                onClick={() => !notif.isRead && markAsRead.mutate(notif.id)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon size={14} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-xs leading-tight ${notif.isRead ? 'font-medium text-slate-600' : 'font-semibold text-slate-800'}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${cfg.dot}`} />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[9px] text-slate-300 mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 text-center">{notifications.length} total notifikasi</p>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  const { data: notifications = [] } = useNotifications();
  const { data: users = [] } = useUsers();
  const { data: loans = [] } = usePendingLoans();
  const { data: categories = [] } = useLoanCategories();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Auto-expand notification button: stays expanded for 5s, then collapsed for 5s (total 10s cycle)
  useEffect(() => {
    if (unreadCount === 0) {
      setIsExpanded(false);
      return;
    }

    const interval = setInterval(() => {
      setIsExpanded(true);
      // Stay expanded for 5 seconds, then contract back
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }, 10000);

    return () => clearInterval(interval);
  }, [unreadCount]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowNotif(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter smart search items
  const q = searchQuery.trim().toLowerCase();

  const matchedMenus = q ? APP_MENUS.filter(m => 
    m.title.toLowerCase().includes(q) || 
    m.desc.toLowerCase().includes(q)
  ) : [];

  const matchedUsers = q && Array.isArray(users) ? users.filter(u => 
    u.name?.toLowerCase().includes(q) || 
    u.npk?.toLowerCase().includes(q) || 
    u.email?.toLowerCase().includes(q) ||
    u.phoneNumber?.toLowerCase().includes(q)
  ).slice(0, 5) : [];

  const matchedLoans = q && Array.isArray(loans) ? loans.filter(l => 
    l.user?.name?.toLowerCase().includes(q) || 
    l.user?.npk?.toLowerCase().includes(q) || 
    l.category?.name?.toLowerCase().includes(q) ||
    String(l.amount).includes(q) ||
    l.id?.toLowerCase().includes(q)
  ).slice(0, 5) : [];

  const matchedCategories = q && Array.isArray(categories) ? categories.filter(c => 
    c.name?.toLowerCase().includes(q) || 
    c.code?.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const totalMatches = matchedMenus.length + matchedUsers.length + matchedLoans.length + matchedCategories.length;

  const handleNavigate = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="h-14 bg-white/95 border border-[#0f172a]/10 flex items-center justify-between px-5 sticky top-3 z-30 shadow-sm rounded-xl mx-5 mt-3 backdrop-blur-md">
      {/* Smart Search Bar */}
      <div className="relative w-72 md:w-96" ref={searchRef}>
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#76bc21] transition-colors" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Cari menu, anggota, pengajuan, kategori..."
            className="w-full bg-[#faf9f6] border border-[#0f172a]/15 rounded-full py-1.5 pl-9 pr-8 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#76bc21]/20 focus:border-[#76bc21] focus:bg-white transition-all placeholder:text-slate-400 shadow-inner shadow-black/[0.02]"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Smart Search Dropdown Results */}
        {isSearchOpen && (
          <div className="absolute left-0 top-full mt-2 w-[340px] sm:w-[420px] max-h-[460px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header info */}
            <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {q ? `Hasil Pencarian (${totalMatches})` : 'Pintasan & Menu Cepat'}
              </span>
              <span className="text-[9px] text-slate-400">Tekan pilihan untuk buka</span>
            </div>

            {/* Scrollable Results */}
            <div className="overflow-y-auto max-h-[380px] divide-y divide-slate-50 p-1">
              {!q ? (
                /* Quick Shortcuts when query is empty */
                <div className="p-2 flex flex-col gap-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Pintasan Cepat</p>
                  {APP_MENUS.map((menu, i) => {
                    const Icon = menu.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => handleNavigate(menu.path)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#005bb7] flex items-center justify-center shrink-0 group-hover:bg-[#005bb7] group-hover:text-white transition-colors">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 group-hover:text-[#005bb7] transition-colors">{menu.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{menu.desc}</p>
                        </div>
                        <ArrowRight size={12} className="text-slate-300 group-hover:text-[#005bb7] transition-colors" />
                      </button>
                    );
                  })}
                </div>
              ) : totalMatches === 0 ? (
                /* Empty state */
                <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-2">
                    <Search size={18} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Tidak ada hasil yang cocok</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-[220px]">
                    Tidak ditemukan data untuk kata kunci "{searchQuery}"
                  </p>
                </div>
              ) : (
                <>
                  {/* Matched Menus */}
                  {matchedMenus.length > 0 && (
                    <div className="py-1 px-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Halaman & Menu</p>
                      {matchedMenus.map((menu, i) => {
                        const Icon = menu.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => handleNavigate(menu.path)}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-blue-50/60 transition-colors group cursor-pointer"
                          >
                            <div className="w-6 h-6 rounded-md bg-blue-50 text-[#005bb7] flex items-center justify-center shrink-0">
                              <Icon size={12} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-[#005bb7]">{menu.title}</p>
                              <p className="text-[10px] text-slate-400 truncate">{menu.desc}</p>
                            </div>
                            <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Menu</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Matched Users */}
                  {matchedUsers.length > 0 && (
                    <div className="py-1 px-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Anggota / User</p>
                      {matchedUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleNavigate(user.isActive ? '/anggota?tab=all' : '/anggota?tab=pending')}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${user.isActive ? 'bg-green-50 text-[#76bc21]' : 'bg-amber-50 text-amber-600'}`}>
                            {user.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-[#005bb7]">{user.name}</p>
                            <p className="text-[10px] text-slate-400">NPK: {user.npk} {user.phoneNumber ? `· ${user.phoneNumber}` : ''}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${user.isActive ? 'bg-green-50 text-[#76bc21]' : 'bg-amber-50 text-amber-600'}`}>
                            {user.isActive ? 'Aktif' : 'Pending'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matched Loans */}
                  {matchedLoans.length > 0 && (
                    <div className="py-1 px-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Pengajuan Pinjaman</p>
                      {matchedLoans.map((loan) => (
                        <button
                          key={loan.id}
                          onClick={() => handleNavigate('/persetujuan')}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-[#005bb7] flex items-center justify-center shrink-0">
                            <FileText size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-[#005bb7]">{loan.user?.name}</p>
                            <p className="text-[10px] text-slate-400">{loan.category?.name || 'Pinjaman'} · Rp {Number(loan.amount).toLocaleString('id-ID')}</p>
                          </div>
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            Approval
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matched Categories */}
                  {matchedCategories.length > 0 && (
                    <div className="py-1 px-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Kategori Pinjaman</p>
                      {matchedCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNavigate('/kategori-pinjaman')}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Layers size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-[#005bb7]">{cat.name}</p>
                            <p className="text-[10px] text-slate-400">Kode: {cat.code} · Bunga: {cat.interestRate}%</p>
                          </div>
                          <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                            Produk
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotif((v) => !v)}
            style={{
              width: isExpanded && unreadCount > 0 ? '220px' : '32px',
              paddingLeft: isExpanded && unreadCount > 0 ? '8px' : '0px',
              paddingRight: isExpanded && unreadCount > 0 ? '8px' : '0px',
            }}
            className={`relative h-8 flex items-center rounded-lg border border-red-700 bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/30 transition-[width,padding] duration-700 ease-in-out cursor-pointer overflow-hidden ${
              unreadCount > 0 && !isExpanded ? 'animate-bell-shake' : ''
            }`}
            title="Notifikasi"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <Bell size={14} />
            </div>
            
            {/* Smooth sliding text */}
            <div
              style={{
                width: isExpanded && unreadCount > 0 ? '170px' : '0px',
                opacity: isExpanded && unreadCount > 0 ? 1 : 0,
              }}
              className="overflow-hidden transition-[width,opacity] duration-700 ease-in-out whitespace-nowrap text-left pl-1"
            >
              <span className="text-[11px] font-bold">
                {unreadCount} notifikasi belum dibaca
              </span>
            </div>

            {/* Badge when collapsed */}
            <span 
              style={{
                opacity: isExpanded || unreadCount === 0 ? 0 : 1,
              }}
              className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 bg-white text-red-600 border border-red-200 text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-sm transition-opacity duration-500 pointer-events-none"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </button>
          {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
        </div>
      </div>
    </header>
  );
}

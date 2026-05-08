import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, Bell, CheckCircle, XCircle, Info, Check } from 'lucide-react';
import { useNotifications, useMarkAsRead } from '../../api/notificationApi';

// ── Helpers ────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
}

function typeConfig(type) {
  switch (type) {
    case 'LOAN_APPROVED': return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' };
    case 'LOAN_REJECTED': return { icon: XCircle,     color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100',     dot: 'bg-red-500'     };
    default:              return { icon: Info,         color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    dot: 'bg-blue-500'    };
  }
}

// ── Notification Dropdown ──────────────────────────────────────────
function NotificationPanel({ onClose }) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();

  const handleClick = (notif) => {
    if (!notif.isRead) markAsRead.mutate(notif.id);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 top-full mt-3 w-96 bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Notifikasi</h3>
          {unreadCount > 0 && (
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{unreadCount} belum dibaca</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => notifications.filter(n => !n.isRead).forEach(n => markAsRead.mutate(n.id))}
            className="flex items-center gap-1.5 text-[11px] font-black text-[#005bb7] hover:underline uppercase tracking-widest"
          >
            <Check size={12} /> Tandai Semua
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-300">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 opacity-40">
            <Bell size={40} className="text-slate-300" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = typeConfig(notif.type);
            const Icon = cfg.icon;
            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left flex items-start gap-4 px-6 py-4 border-b border-slate-50 transition-all duration-300 hover:bg-slate-50/70 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                  <Icon size={18} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm tracking-tight leading-tight ${notif.isRead ? 'font-semibold text-slate-700' : 'font-black text-slate-900'}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-2">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 text-center">
            {notifications.length} notifikasi total
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Header ────────────────────────────────────────────────────
export default function Header() {
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const [showNotif, setShowNotif] = useState(false);
  const panelRef = useRef(null);

  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  };

  return (
    <header className="h-20 glass-panel flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Left — search */}
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

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Bell Button */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotif((v) => !v)}
            className={`relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
              showNotif
                ? 'bg-[#005bb7] text-white border-[#005bb7] shadow-[0_8px_20px_rgba(0,91,183,0.3)]'
                : 'bg-white/60 text-slate-500 border-white hover:bg-white hover:text-[#005bb7] hover:border-[#005bb7]/20'
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
        </div>

        {/* User info */}
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-bold text-gray-900">{userInfo.name || 'Admin'}</span>
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">{userInfo.role || 'Super Admin'}</span>
        </div>

        {/* Logout */}
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

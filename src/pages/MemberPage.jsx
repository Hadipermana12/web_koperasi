import React, { useState } from 'react';
import { useUsers, useUpdateUserStatus } from '../api/userApi';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Clock,
  UserCheck,
  UserX,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';

export default function MemberPage() {
  const { data: users, isLoading } = useUsers();
  const updateStatusMutation = useUpdateUserStatus();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending'

  const isUserActive = (u) => {
    const val = u.isActive ?? u.is_active;
    return val === true || val === 1 || val === 'true' || val === '1' || val === 'active';
  };

  const allUsers = users ?? [];
  const pendingUsers = allUsers.filter(u => !isUserActive(u) && u.role !== 'admin');
  const activeUsers = allUsers.filter(u => isUserActive(u));

  const displayUsers = (activeTab === 'all' ? allUsers : pendingUsers).filter(u => {
    return u.name?.toLowerCase().includes(search.toLowerCase()) || u.npk?.toLowerCase().includes(search.toLowerCase());
  });

  const handleApprove = async (userId) => {
    if (!window.confirm('Setujui pendaftaran anggota ini?')) return;
    try {
      await updateStatusMutation.mutateAsync({ userId, isActive: true });
      alert('Berhasil menyetujui anggota!');
    } catch (e) {
      alert('Gagal menyetujui: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Tolak dan hapus pendaftaran anggota ini?')) return;
    try {
      await updateStatusMutation.mutateAsync({ userId, isActive: false });
      alert('Berhasil menonaktifkan anggota!');
    } catch (e) {
      alert('Gagal menolak: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Characterful Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-[#76bc21] rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Database Anggota</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
            Manajemen <span className="text-gradient-blue">Anggota</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg mt-2 max-w-md">Kelola ekosistem anggota KMMA dengan presisi dan transparansi total.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-600 hover:border-[#005bb7] hover:text-[#005bb7] transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
            <Filter size={20} />
            Advanced Filter
          </button>
          <button className="flex items-center gap-3 px-8 py-4 bg-[#76bc21] text-white rounded-[1.5rem] text-sm font-black hover:bg-[#86cc31] transition-all duration-700 shadow-[0_15px_35px_rgba(118,188,33,0.3)] hover:scale-105 active:scale-95 uppercase tracking-wider">
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Minimalist Glass Stat Bar */}
      <div className="bg-white/40 backdrop-blur-3xl border border-white rounded-[2.5rem] p-3 flex flex-col md:flex-row items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        {/* Stat 1: Total - Interactive */}
        <div 
          onClick={() => setActiveTab('all')}
          className={`flex-1 flex items-center gap-6 px-10 py-5 rounded-[2rem] transition-all duration-700 cursor-pointer group/stat ${
            activeTab === 'all' ? 'bg-white shadow-xl shadow-blue-900/5' : 'hover:bg-white/50'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${
            activeTab === 'all' ? 'bg-[#005bb7] text-white rotate-6' : 'bg-blue-50 text-[#005bb7] group-hover/stat:scale-110'
          }`}>
            <Users size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Total Anggota</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tracking-tighter ${activeTab === 'all' ? 'text-slate-900' : 'text-slate-600'}`}>
                {allUsers.length}
              </span>
              <span className="text-xs font-bold text-slate-400">Members</span>
            </div>
          </div>
          {activeTab === 'all' && <div className="ml-auto w-2 h-2 bg-[#005bb7] rounded-full shadow-[0_0_10px_#005bb7]"></div>}
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-12 bg-slate-200/60 mx-2"></div>

        {/* Stat 2: Verified - Display Only */}
        <div className="flex-1 flex items-center gap-6 px-10 py-5 transition-all duration-700 group/stat">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-[#76bc21] flex items-center justify-center group-hover/stat:rotate-12 group-hover/stat:bg-[#76bc21] group-hover/stat:text-white transition-all duration-700">
            <CheckCircle size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 text-nowrap">Status Terverifikasi</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">
                {activeUsers.length}
              </span>
              <span className="text-xs font-bold text-slate-400">Active</span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-12 bg-slate-200/60 mx-2"></div>

        {/* Stat 3: Pending - Interactive */}
        <div 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center gap-6 px-10 py-5 rounded-[2rem] transition-all duration-700 cursor-pointer group/stat ${
            activeTab === 'pending' ? 'bg-white shadow-xl shadow-orange-900/5' : 'hover:bg-white/50'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${
            activeTab === 'pending' ? 'bg-orange-500 text-white rotate-6' : 'bg-orange-50 text-orange-500 group-hover/stat:scale-110'
          }`}>
            <Clock size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 text-nowrap">Menunggu Verifikasi</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tracking-tighter ${activeTab === 'pending' ? 'text-slate-900' : 'text-slate-600'}`}>
                {pendingUsers.length}
              </span>
              {pendingUsers.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                  NEW
                </span>
              )}
            </div>
          </div>
          {activeTab === 'pending' && <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"></div>}
        </div>
      </div>

      {/* Tab Controls & Table Card */}
      <div className="glass-bento rounded-[3.5rem] border border-white shadow-[0_30px_80px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        {/* Toolbar & Tabs */}
        <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex bg-slate-100/50 p-2 rounded-[1.75rem] border border-slate-200 w-fit self-start backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-10 py-3.5 rounded-[1.25rem] text-xs font-black transition-all duration-500 tracking-widest uppercase ${activeTab === 'all' ? 'bg-[#005bb7] text-white shadow-xl shadow-blue-900/20 scale-105' : 'text-slate-500 hover:bg-white hover:text-[#005bb7]'}`}
            >
              Semua Anggota
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-10 py-3.5 rounded-[1.25rem] text-xs font-black transition-all duration-500 tracking-widest uppercase relative ${activeTab === 'pending' ? 'bg-orange-500 text-white shadow-xl shadow-orange-900/20 scale-105' : 'text-slate-500 hover:bg-white hover:text-orange-500'}`}
            >
              Menunggu Review
              {pendingUsers.length > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-pulse">
                  {pendingUsers.length}
                </span>
              )}
            </button>
          </div>

          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005bb7] transition-colors" size={22} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NPK atau Nama Anggota..."
              className="w-full pl-14 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-base font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#005bb7] transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto p-6 lg:p-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-10">
                <th className="px-10 py-2">Identitas & Peran</th>
                <th className="px-10 py-2">Kontak Internal</th>
                <th className="px-10 py-2">Status Akun</th>
                <th className="px-10 py-2">Terdaftar Sejak</th>
                <th className="px-10 py-2 text-right">Opsi Pengelolaan</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Synchronizing...</p>
                    </div>
                  </td>
                </tr>
              ) : displayUsers.length > 0 ? (
                displayUsers.map((user) => {
                  const active = isUserActive(user);
                  const isPending = !active && user.role !== 'admin';
                  const isAdmin = user.role === 'admin';
                  
                  return (
                    <tr key={user.id} className="group hover:translate-x-2 transition-all duration-700">
                      <td className="px-10 py-6 bg-white first:rounded-l-[2rem] border-y border-l border-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-900/5 group-hover:border-blue-100 transition-all duration-700">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${
                            isAdmin ? 'bg-purple-100 text-purple-600' :
                            isPending ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-[#76bc21]'
                          }`}>
                            {user.name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-xl tracking-tight">{user.name}</div>
                            <div className="flex items-center gap-3 mt-1">
                              {isAdmin && <span className="bg-purple-50 text-purple-600 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border border-purple-100">Super Administrator</span>}
                              {!isAdmin && <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Koperasi Member</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 bg-white border-y border-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-900/5 group-hover:border-blue-100 transition-all duration-700">
                        <div className="text-base text-slate-700 font-black tracking-tight">{user.npk}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1 group-hover:text-[#005bb7] transition-colors">{user.phoneNumber || 'N/A'}</div>
                      </td>
                      <td className="px-10 py-6 bg-white border-y border-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-900/5 group-hover:border-blue-100 transition-all duration-700">
                        <div className="flex items-center gap-2">
                          {isPending ? (
                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                              <Clock size={14} className="animate-spin-slow" /> Pending
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-green-50 text-[#76bc21] border border-green-100 shadow-sm">
                              <ShieldCheck size={14} /> Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-6 bg-white border-y border-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-900/5 group-hover:border-blue-100 transition-all duration-700">
                        <div className="text-xs text-slate-500 font-black uppercase tracking-wider">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Just Now'}
                        </div>
                      </td>
                      <td className="px-10 py-6 bg-white last:rounded-r-[2rem] border-y border-r border-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-900/5 group-hover:border-blue-100 transition-all duration-700 text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="px-6 py-3 text-[10px] font-black uppercase bg-[#76bc21] text-white rounded-[1rem] hover:bg-[#86cc31] transition-all shadow-[0_10px_20px_rgba(118,188,33,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50 tracking-widest"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="px-6 py-3 text-[10px] font-black uppercase bg-white border border-slate-200 text-slate-400 rounded-[1rem] hover:bg-slate-50 hover:text-red-500 hover:border-red-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 tracking-widest"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="p-4 text-slate-300 hover:text-[#005bb7] hover:bg-blue-50 rounded-[1.25rem] transition-all duration-500 hover:rotate-90">
                            <MoreVertical size={24} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Users size={80} className="text-slate-300" />
                      <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-sm">Empty State</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

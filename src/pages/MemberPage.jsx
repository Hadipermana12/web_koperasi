import React, { useState } from 'react';
import { useUsers, useUpdateUserStatus } from '../api/userApi';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'pending' ? 'pending' : 'all');

  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'pending') setActiveTab('pending');
    else setActiveTab('all');
  }, [searchParams]);

  const isUserActive = (u) => {
    const val = u.isActive ?? u.is_active;
    return val === true || val === 1 || val === 'true' || val === '1' || val === 'active';
  };

  const allUsersRaw = users ?? [];
  // Filter out admins/staff to only show mobile users (members)
  const allUsers = allUsersRaw.filter(u => u.role !== 'admin' && u.role !== 'HEAD' && u.role !== 'operator');
  
  const pendingUsers = allUsers.filter(u => !isUserActive(u));
  const activeUsers = allUsers.filter(u => isUserActive(u));

  const isActivationContext = searchParams.get('tab') === 'pending';
  const displayUsers = (isActivationContext ? pendingUsers : (activeTab === 'all' ? allUsers : pendingUsers)).filter(u => {
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Database Anggota</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
            {isActivationContext ? 'Aktivasi' : 'Manajemen'} <span className="text-gradient-blue">{isActivationContext ? 'Akun User' : 'Anggota'}</span>
          </h1>
          <p className="text-slate-600 font-medium text-lg mt-2 max-w-md">
            {isActivationContext 
              ? 'Verifikasi pendaftaran anggota baru KMMA untuk memberikan akses layanan.'
              : 'Kelola ekosistem anggota KMMA dengan presisi dan transparansi total.'}
          </p>
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
        
        {!isActivationContext && (
          <>
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Total Anggota</span>
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 text-nowrap">Status Terverifikasi</span>
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
          </>
        )}

        {/* Stat 3: Pending - Interactive */}
        <div 
          onClick={() => !isActivationContext && setActiveTab('pending')}
          className={`flex-1 flex items-center gap-6 px-10 py-5 rounded-[2rem] transition-all duration-700 cursor-pointer group/stat ${
            activeTab === 'pending' || isActivationContext ? 'bg-white shadow-xl shadow-orange-900/5' : 'hover:bg-white/50'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${
            activeTab === 'pending' || isActivationContext ? 'bg-orange-500 text-white rotate-6' : 'bg-orange-50 text-orange-500 group-hover/stat:scale-110'
          }`}>
            <Clock size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 text-nowrap">Menunggu Verifikasi</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black tracking-tighter ${activeTab === 'pending' || isActivationContext ? 'text-slate-900' : 'text-slate-600'}`}>
                {pendingUsers.length}
              </span>
              {pendingUsers.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                  NEW
                </span>
              )}
            </div>
          </div>
          {(activeTab === 'pending' || isActivationContext) && <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"></div>}
        </div>
      </div>

      {/* Tab Controls & Table Card */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col mt-4">
        {/* Toolbar & Search */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-end gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005bb7] transition-colors" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NPK atau Nama Anggota..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#005bb7] transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">ID / NPK</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Terdaftar</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-[#005bb7] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : displayUsers.length > 0 ? (
                displayUsers.map((user) => {
                  const active = isUserActive(user);
                  const isPending = !active && user.role !== 'admin';
                  const isAdmin = user.role === 'admin';
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{user.npk || '-'}</div>
                        <div className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">ID: {user.id?.substring(0,8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isAdmin ? 'bg-purple-100 text-purple-600' :
                            isPending ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-[#005bb7]'
                          }`}>
                            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{user.email || '-'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{user.phoneNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Super Admin</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Member</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-orange-50 text-orange-600 border border-orange-100">
                            <Clock size={12} /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-green-50 text-[#76bc21] border border-green-100">
                            <ShieldCheck size={12} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600 font-medium">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1.5 text-[10px] font-bold uppercase bg-[#76bc21] text-white rounded-lg hover:bg-[#68a61d] transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1.5 text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="p-2 text-slate-400 hover:text-[#005bb7] hover:bg-blue-50 rounded-lg transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Users size={40} className="text-slate-400" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Data Kosong</p>
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

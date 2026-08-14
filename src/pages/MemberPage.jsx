import React, { useState } from 'react';
import { useUsers, useUpdateUserStatus } from '../api/userApi';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, Search, MoreVertical, CheckCircle, Clock,
  UserCheck, UserX, ShieldCheck, Download, Filter
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
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isActivationContext ? 'Aktivasi Akun User' : 'Manajemen Anggota'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActivationContext
              ? 'Verifikasi pendaftaran anggota baru KMMA.'
              : 'Kelola ekosistem anggota KMMA.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">
            <Filter size={13} /> Filter
          </button>
          <button className="btn-green">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {!isActivationContext && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              activeTab === 'all' ? 'border-[#005bb7] bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'all' ? 'bg-[#005bb7] text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Users size={15} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total</p>
              <p className={`text-lg font-bold leading-none ${activeTab === 'all' ? 'text-[#005bb7]' : 'text-slate-700'}`}>{allUsers.length}</p>
            </div>
          </button>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 text-[#76bc21]">
              <CheckCircle size={15} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Aktif</p>
              <p className="text-lg font-bold text-slate-700 leading-none">{activeUsers.length}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              activeTab === 'pending' ? 'border-amber-400 bg-amber-50' : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'pending' ? 'bg-amber-400 text-white' : 'bg-amber-50 text-amber-500'}`}>
              <Clock size={15} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Pending</p>
              <div className="flex items-center gap-1">
                <p className={`text-lg font-bold leading-none ${activeTab === 'pending' ? 'text-amber-600' : 'text-slate-700'}`}>{pendingUsers.length}</p>
                {pendingUsers.length > 0 && (
                  <span className="bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-md animate-pulse">NEW</span>
                )}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NPK atau Nama..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#005bb7] transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">ID / NPK</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Lengkap</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Kontak</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Terdaftar</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#005bb7] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 text-xs">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : displayUsers.length > 0 ? (
                displayUsers.map((user) => {
                  const active = isUserActive(user);
                  const isPending = !active && user.role !== 'admin';
                  const isAdminUser = user.role === 'admin';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{user.npk || '-'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {user.id?.substring(0, 8)}…</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isAdminUser ? 'bg-purple-100 text-purple-600' :
                            isPending ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-[#005bb7]'
                          }`}>
                            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-semibold text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700">{user.email || '-'}</div>
                        <div className="text-[10px] text-slate-400">{user.phoneNumber || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        {isAdminUser ? (
                          <span className="bg-purple-50 text-purple-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">Super Admin</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">Member</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-600">
                            <Clock size={10} /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-green-50 text-[#76bc21]">
                            <ShieldCheck size={10} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-[#76bc21] text-white rounded-lg hover:bg-[#68a61d] transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="p-1.5 text-slate-400 hover:text-[#005bb7] hover:bg-blue-50 rounded-lg transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <Users size={32} className="text-slate-400" />
                      <p className="text-slate-500 text-xs">Data Kosong</p>
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

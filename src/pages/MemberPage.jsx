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
} from 'lucide-react';

export default function MemberPage() {
  const { data: users, isLoading } = useUsers();
  const updateStatusMutation = useUpdateUserStatus();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'pending'

  const isUserActive = (u) => {
    const val = u.isActive ?? u.is_active;
    return val === true || val === 1 || val === 'true' || val === '1' || val === 'active';
  };

  const filtered = (users ?? []).filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.npk?.toLowerCase().includes(search.toLowerCase());
    const active = isUserActive(u);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? active : !active);
    return matchSearch && matchStatus;
  });

  const totalActive = users?.filter(u => isUserActive(u))?.length ?? 0;
  const totalPending = users?.filter(u => !isUserActive(u) && u.role !== 'admin')?.length ?? 0;

  const handleApprove = async (userId) => {
    if (!window.confirm('Setujui pendaftaran anggota ini?')) return;
    try {
      console.log('Approving user:', userId);
      const res = await updateStatusMutation.mutateAsync({ userId, isActive: true });
      console.log('Approve response:', res);
      alert('Berhasil menyetujui anggota!');
    } catch (e) {
      console.error('Approve error:', e);
      alert('Gagal menyetujui: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Tolak dan hapus pendaftaran anggota ini?')) return;
    try {
      console.log('Rejecting user:', userId);
      const res = await updateStatusMutation.mutateAsync({ userId, isActive: false });
      console.log('Reject response:', res);
      alert('Berhasil menonaktifkan anggota!');
    } catch (e) {
      console.error('Reject error:', e);
      alert('Gagal menolak: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Anggota</h1>
          <p className="text-gray-500 text-sm">Lihat dan kelola data anggota yang terdaftar melalui Mobile App.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setFilterStatus('all')}
          className={`bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${filterStatus === 'all' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Anggota</p>
            <p className="text-2xl font-black text-gray-900">{users?.length || 0}</p>
          </div>
        </div>
        <div
          onClick={() => setFilterStatus('active')}
          className={`bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${filterStatus === 'active' ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Sudah Aktif</p>
            <p className="text-2xl font-black text-gray-900">{totalActive}</p>
          </div>
        </div>
        <div
          onClick={() => setFilterStatus('pending')}
          className={`bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${filterStatus === 'pending' ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-100 hover:border-gray-200'}`}
        >
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Menunggu Verifikasi</p>
            <p className="text-2xl font-black text-gray-900">{totalPending}</p>
            {totalPending > 0 && <p className="text-xs text-yellow-600 font-semibold animate-pulse">Perlu tindakan</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan Nama atau NPK..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
            Terakhir Update: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Informasi Anggota</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Status Verifikasi</th>
                <th className="px-6 py-4">Tgl. Registrasi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">Memuat data...</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((user) => {
                  const active = isUserActive(user);
                  const isPending = !active && user.role !== 'admin';
                  const isAdmin = user.role === 'admin';
                  return (
                    <tr key={user.id} className={`transition-colors group ${isPending ? 'bg-yellow-50/40 hover:bg-yellow-50' : 'hover:bg-gray-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            isAdmin ? 'bg-purple-100 text-purple-700' :
                            isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {user.name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">NPK: {user.npk}</span>
                              <span className="text-[9px] bg-gray-100 px-1 rounded text-gray-400">
                                raw: {String(user.isActive)} | {String(user.is_active)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 font-medium">{user.phoneNumber || '-'}</div>
                        <div className="text-xs text-gray-400">Email tidak tersedia</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isAdmin ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 text-purple-700">Admin</span>
                          ) : isPending ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-yellow-100 text-yellow-700 border border-yellow-200">
                              <Clock size={10} /> Menunggu Verifikasi
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-green-100 text-green-700 border border-green-200">
                              <CheckCircle size={10} /> Aktif
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                          : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-green-700 bg-green-100 border border-green-200 hover:bg-green-200 rounded-lg transition-all disabled:opacity-50"
                            >
                              <UserCheck size={13} /> Setujui
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={updateStatusMutation.isPending}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-100 border border-red-200 hover:bg-red-200 rounded-lg transition-all disabled:opacity-50"
                            >
                              <UserX size={13} /> Tolak
                            </button>
                          </div>
                        ) : (
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">Tidak ada data anggota.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


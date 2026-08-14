import React from 'react';
import { useUsers, useUpdateUserStatus } from '../../api/userApi';
import { UserCheck, UserX, Loader2, Clock } from 'lucide-react';

export default function RegisteredUsers() {
  const { data: users, isLoading, error } = useUsers(); 
  const updateStatusMutation = useUpdateUserStatus();

  const isUserActive = (u) => u.isActive === true || u.isActive === 1 || u.isActive === 'true' || u.isActive === '1' || u.isActive === 'active';
  const pendingUsers = Array.isArray(users) ? users.filter(u => !isUserActive(u) && u.role !== 'admin') : [];

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

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-8 flex items-center justify-center shadow-sm">
        <Loader2 className="animate-spin text-amber-500 mr-2" size={18} />
        <p className="text-slate-400 text-xs">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-lg text-xs">
          Gagal memuat: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-amber-500" />
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Menunggu Verifikasi</h2>
            <p className="text-[10px] text-slate-400">Anggota baru dari Mobile App</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
          pendingUsers?.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
        }`}>
          {pendingUsers?.length || 0} Pending
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama / NPK</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">No. HP</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pendingUsers && pendingUsers.length > 0 ? (
              pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {user.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-xs">{user.name}</div>
                        <div className="text-[10px] text-slate-400">NPK: {user.npk}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{user.phoneNumber || '-'}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-[#76bc21] bg-green-50 border border-green-100 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <UserCheck size={11} /> Setujui
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <UserX size={11} /> Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <UserCheck size={28} className="text-green-300" />
                    <p className="text-xs text-slate-400">Tidak ada anggota pending</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

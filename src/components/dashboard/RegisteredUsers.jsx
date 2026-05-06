import React from 'react';
import { useUsers, useUpdateUserStatus } from '../../api/userApi';
import { UserCheck, UserX, Loader2, Clock } from 'lucide-react';

export default function RegisteredUsers() {
  const { data: users, isLoading, error } = useUsers(); 
  const updateStatusMutation = useUpdateUserStatus();

  const isUserActive = (u) => u.isActive === true || u.isActive === 1 || u.isActive === 'true' || u.isActive === '1' || u.isActive === 'active';
  
  // Filter user yang benar-benar pending
  const pendingUsers = users?.filter(u => !isUserActive(u) && u.role !== 'admin') ?? [];

  const handleApprove = async (userId) => {
    if (!window.confirm('Setujui pendaftaran anggota ini?')) return;
    try {
      console.log('Approving user (Dashboard):', userId);
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
      console.log('Rejecting user (Dashboard):', userId);
      const res = await updateStatusMutation.mutateAsync({ userId, isActive: false });
      console.log('Reject response:', res);
      alert('Berhasil menonaktifkan anggota!');
    } catch (e) {
      console.error('Reject error:', e);
      alert('Gagal menolak: ' + (e.response?.data?.message || e.message));
    }
  };

  if (isLoading) {
    return (
      <div className="glass-bento p-12 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500 mb-4" size={32} />
        <p className="text-gray-500 font-medium">Memuat permintaan verifikasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-bento p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
          Gagal mengambil data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-bento overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-yellow-50/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-yellow-600" />
            <h2 className="text-lg font-bold text-gray-900">Menunggu Verifikasi</h2>
          </div>
          <p className="text-sm text-gray-500">Anggota baru dari Mobile App yang belum disetujui admin</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
          pendingUsers?.length > 0
            ? 'bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse'
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
          {pendingUsers?.length || 0} Pending
        </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4">Nama / NPK</th>
              <th className="px-6 py-4">No. HP</th>
              <th className="px-6 py-4 text-right">Aksi Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingUsers && pendingUsers.length > 0 ? (
              pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-yellow-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm">
                        {user.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400">NPK: {user.npk}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.phoneNumber || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-100 border border-green-200 hover:bg-green-200 rounded-lg transition-all disabled:opacity-50"
                        title="Setujui"
                      >
                        <UserCheck size={14} />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 border border-red-200 hover:bg-red-200 rounded-lg transition-all disabled:opacity-50"
                        title="Tolak"
                      >
                        <UserX size={14} />
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <UserCheck size={36} className="text-green-400" />
                    <p className="text-sm font-medium">Tidak ada anggota yang menunggu verifikasi</p>
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

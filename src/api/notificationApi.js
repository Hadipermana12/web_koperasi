import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

let mockNotifications = [
  { id: 'notif-1', title: 'Pengajuan Baru', message: 'Ahmad Muzakki mengajukan pinjaman Motor sebesar Rp 5.000.000', type: 'LOAN_REQUESTED', isRead: false, createdAt: '2026-08-14T10:00:00Z' },
  { id: 'notif-2', title: 'Pendaftaran Anggota', message: 'Budi Santoso mendaftar sebagai anggota baru', type: 'USER_REGISTERED', isRead: false, createdAt: '2026-08-14T09:30:00Z' },
  { id: 'notif-3', title: 'Pinjaman Disetujui', message: 'Pinjaman Citra Lestari telah disetujui Kepala Koperasi', type: 'LOAN_APPROVED', isRead: true, createdAt: '2026-08-13T15:00:00Z' },
];

// GET /api/notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        return mockNotifications;
      }
      const { data } = await axiosInstance.get('/notifications');
      return data.data;
    },
    refetchInterval: 30000, // auto-refresh setiap 30 detik
    staleTime: 10000,
  });
};

// PATCH /api/notifications/:id/read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        mockNotifications = mockNotifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        );
        return { id };
      }
      const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
      return data;
    },
    onMutate: async (id) => {
      // Optimistic update — langsung ubah lokal sebelum response server
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      return { previous };
    },
    onError: (_, __, context) => {
      // Rollback jika gagal
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

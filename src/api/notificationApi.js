import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

// GET /api/notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
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

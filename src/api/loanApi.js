import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

export const fetchPendingLoans = async () => {
  const { data } = await axiosInstance.get('/loans/pending');
  return data.data; // Berdasarkan payload response: { "status": "success", "data": [...] }
};

export const usePendingLoans = () => {
  return useQuery({
    queryKey: ['loans', 'pending'],
    queryFn: fetchPendingLoans,
    refetchInterval: 30000, // Refresh setiap 30 detik
  });
};

// Kita tambahkan juga fungsi approve/reject untuk persiapan
export const useUpdateLoanStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ loanId, status, note }) => {
      // Endpoint asumsi berdasarkan pola sebelumnya
      const { data } = await axiosInstance.patch(`/loans/${loanId}/status`, { status, note });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'pending'] });
    },
  });
};

export const fetchLoanCategories = async () => {
  const { data } = await axiosInstance.get('/loans/categories');
  return data.data; // payload response: { "status": "...", "data": [...] }
};

export const useLoanCategories = () => {
  return useQuery({
    queryKey: ['loans', 'categories'],
    queryFn: fetchLoanCategories,
  });
};

export const useCreateLoanCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/loans/categories', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'categories'] });
    },
  });
};

export const useUpdateLoanCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosInstance.patch(`/loans/categories/${id}`, payload);
      return data; // Return whole data: { status, message } or { status, data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'categories'] });
    },
  });
};

export const useDeleteLoanCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/loans/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'categories'] });
    },
  });
};

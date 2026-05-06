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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

let mockLoans = [
  { id: 'loan-1', amount: 5000000, totalPayment: 5500000, tenor: 12, status: 'WAITING_APPROVAL', category: { name: 'Pembiayaan Motor' }, user: { name: 'Ahmad Muzakki', npk: '10001' } },
  { id: 'loan-2', amount: 12000000, totalPayment: 13200000, tenor: 24, status: 'WAITING_APPROVAL', category: { name: 'Pembiayaan Modal Usaha' }, user: { name: 'Budi Santoso', npk: '10002' } },
  { id: 'loan-3', amount: 3000000, totalPayment: 3300000, tenor: 6, status: 'APPROVED', category: { name: 'Pembiayaan Elektronik' }, user: { name: 'Citra Lestari', npk: '10003' } },
];

let mockCategories = [
  { id: 'cat-1', code: 'PKB', name: 'Pembiayaan Kendaraan', interestRate: 5.5, maxTenor: 36, maxAmount: 50000000 },
  { id: 'cat-2', code: 'PMU', name: 'Modal Usaha', interestRate: 6.0, maxTenor: 24, maxAmount: 20000000 },
  { id: 'cat-3', code: 'PE', name: 'Elektronik & Gadget', interestRate: 4.5, maxTenor: 12, maxAmount: 10000000 },
];

export const fetchPendingLoans = async () => {
  const token = localStorage.getItem('access_token');
  if (token && token.startsWith('mock-token-')) {
    return mockLoans;
  }
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
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        mockLoans = mockLoans.map(l =>
          l.id === loanId ? { ...l, status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED' } : l
        );
        return { data: mockLoans.find(l => l.id === loanId) };
      }
      const { data } = await axiosInstance.patch(`/loans/${loanId}/approve`, { status, note });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'pending'] });
    },
  });
};

export const fetchLoanCategories = async () => {
  const token = localStorage.getItem('access_token');
  if (token && token.startsWith('mock-token-')) {
    return mockCategories;
  }
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
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        const newCat = { id: 'cat-' + Math.random(), ...payload };
        mockCategories.push(newCat);
        return newCat;
      }
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
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        mockCategories = mockCategories.map(c =>
          c.id === id ? { ...c, ...payload } : c
        );
        return { data: mockCategories.find(c => c.id === id) };
      }
      // payload includes: name, maxAmount, maxTenor, interestRate, isRequiredUpload
      const { data } = await axiosInstance.patch(`/loans/categories/${id}`, payload);
      return data;
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
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        mockCategories = mockCategories.filter(c => c.id !== id);
        return { id };
      }
      const { data } = await axiosInstance.delete(`/loans/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'categories'] });
    },
  });
};

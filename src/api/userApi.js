import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

let mockUsers = [
  { id: '1', npk: '10001', name: 'Ahmad Muzakki', role: 'member', email: 'ahmad@example.com', phoneNumber: '08123456789', isActive: true, createdAt: '2026-08-01T00:00:00Z' },
  { id: '2', npk: '10002', name: 'Budi Santoso', role: 'member', email: 'budi@example.com', phoneNumber: '08123456790', isActive: false, createdAt: '2026-08-10T00:00:00Z' },
  { id: '3', npk: '10003', name: 'Citra Lestari', role: 'member', email: 'citra@example.com', phoneNumber: '08123456791', isActive: false, createdAt: '2026-08-12T00:00:00Z' },
  { id: '4', npk: '10004', name: 'Dedi Wijaya', role: 'member', email: 'dedi@example.com', phoneNumber: '08123456792', isActive: true, createdAt: '2026-08-05T00:00:00Z' },
];

export const fetchUsers = async () => {
  const token = localStorage.getItem('access_token');
  if (token && token.startsWith('mock-token-')) {
    return mockUsers;
  }
  // Tambahkan timestamp agar browser tidak mengambil data lama dari cache
  const { data } = await axiosInstance.get(`/users?t=${Date.now()}`);
  console.log('Fetched users data:', data.data);
  return data.data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 10000, // Poll every 10 seconds for real-time sync
  });
};

// Hook untuk user yang belum diverifikasi (status: false / isActive: false)
export const usePendingUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    select: (users) => Array.isArray(users) ? users.filter(u => !u.isActive && u.role !== 'admin') : [],
    refetchInterval: 10000,
  });
};

// Update user status (approve/reject/toggle)
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isActive }) => {
      const token = localStorage.getItem('access_token');
      if (token && token.startsWith('mock-token-')) {
        mockUsers = mockUsers.map(u => 
          u.id === userId ? { ...u, isActive } : u
        );
        return { data: mockUsers.find(u => u.id === userId) };
      }
      const payload = { 
        isActive: isActive,
        is_active: isActive,
        status: isActive ? 'active' : 'inactive',
        active: isActive
      };
      const { data } = await axiosInstance.patch(`/auth/${userId}/status`, payload);
      return data;
    },
    onSuccess: async (res) => {
      const updatedUser = res?.data || res;
      queryClient.setQueryData(['users'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(u => 
          (u.id === updatedUser.id || u._id === updatedUser._id || u.npk === updatedUser.npk) 
            ? { ...u, ...updatedUser } 
            : u
        );
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};


export const login = async (npk, password) => {
  // Mock login for development/demo purposes
  if (npk === 'admin' && password === 'admin123') {
    return {
      accessToken: 'mock-token-' + Math.random().toString(36).substr(2),
      refreshToken: 'mock-refresh-token',
      user: {
        npk: 'admin',
        name: 'Super Admin KMMA',
        role: 'ADMIN',
        email: 'admin@kmma.co.id'
      }
    };
  }

  const { data } = await axiosInstance.post('/auth/login', { npk, password });
  return data.data;
};

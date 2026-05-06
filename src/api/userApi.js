import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

export const fetchUsers = async () => {
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
    select: (users) => users?.filter(u => !u.isActive && u.role !== 'admin') ?? [],
    refetchInterval: 10000,
  });
};

// Update user status (approve/reject/toggle)
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isActive }) => {
      // Mengirimkan beberapa variasi nama field untuk memastikan kompatibilitas dengan backend
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
      // Optimistic/Manual update cache agar langsung berubah di layar
      const updatedUser = res?.data || res;
      queryClient.setQueryData(['users'], (oldData) => {
        if (!oldData) return oldData;
        // Kita handle kemungkinan id atau _id dari backend
        return oldData.map(u => 
          (u.id === updatedUser.id || u._id === updatedUser._id || u.npk === updatedUser.npk) 
            ? { ...u, ...updatedUser } 
            : u
        );
      });
      
      // Beri jeda 1.5 detik agar backend benar-benar selesai menyimpan ke DB
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Trigger refetch untuk memastikan data benar-benar sinkron dengan DB
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
        role: 'admin',
        email: 'admin@kmma.co.id'
      }
    };
  }

  const { data } = await axiosInstance.post('/auth/login', { npk, password });
  return data.data;
};

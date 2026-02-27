import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User } from './authService';

export const userService = {
  // Lấy danh sách tất cả users
  getAllUsers: async (): Promise<User[]> => {
    if (!isSupabaseConfigured) {
      // Local Mode: Lấy từ localStorage + Admin mặc định
      const usersStr = localStorage.getItem('mock_db_users');
      const localUsers: User[] = usersStr ? JSON.parse(usersStr) : [];
      
      // Thêm admin mặc định vào danh sách hiển thị nếu chưa có
      const adminDefault = {
        id: 'admin-local',
        fullName: 'Quản Trị Viên (Mặc định)',
        email: 'admin@sacviet.vn',
        role: 'admin' as const
      };
      
      return [adminDefault, ...localUsers];
    }

    // Supabase Mode: Cần dùng Supabase Admin Client (thường không dùng trực tiếp ở client-side vì bảo mật)
    // Tuy nhiên, với RLS (Row Level Security), admin có thể select bảng profiles/users nếu được cấu hình.
    // Ở đây giả định ta có bảng 'profiles' public hoặc dùng RPC.
    // Để đơn giản cho demo, ta sẽ mock hoặc fetch từ bảng 'profiles' nếu bạn đã tạo.
    // Tạm thời trả về mảng rỗng hoặc mock nếu chưa có bảng profiles.
    
    const { data, error } = await supabase
      .from('profiles') // Giả định bảng profiles
      .select('*');

    if (error) {
        console.warn('Chưa cấu hình bảng profiles, trả về danh sách rỗng');
        return [];
    }
    return data as any;
  },

  // Cập nhật quyền (Role)
  updateUserRole: async (userId: string, newRole: 'admin' | 'user') => {
    if (!isSupabaseConfigured) {
      if (userId === 'admin-local') return; // Không sửa admin mặc định

      const usersStr = localStorage.getItem('mock_db_users');
      let users: any[] = usersStr ? JSON.parse(usersStr) : [];
      
      users = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
      localStorage.setItem('mock_db_users', JSON.stringify(users));
      return;
    }

    // Supabase Mode: Gọi Edge Function hoặc update bảng profiles
    // const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    alert('Tính năng cập nhật quyền trên Supabase cần cấu hình Backend (Edge Functions).');
  }
};

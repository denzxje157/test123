import { supabase, isSupabaseConfigured } from './supabaseClient.ts';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role?: 'admin' | 'user';
}

export const authService = {
  // 1. ĐĂNG NHẬP
  login: async (email: string, password: string): Promise<User> => {
    if (!isSupabaseConfigured) {
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Tài khoản Admin mặc định cho Local Mode
          if (email === 'admin@sacviet.vn' && password === 'admin123') {
             const adminUser: User = {
               id: 'admin-local',
               fullName: 'Quản Trị Viên',
               email: 'admin@sacviet.vn',
               role: 'admin'
             };
             localStorage.setItem('mock_token', JSON.stringify(adminUser));
             resolve(adminUser);
             return;
          }

          const usersStr = localStorage.getItem('mock_db_users');
          const users = usersStr ? JSON.parse(usersStr) : [];
          const user = users.find((u: any) => u.email === email && u.password === password);
          
          if (user) {
            const userInfo = { 
              id: user.id, 
              fullName: user.fullName, 
              email: user.email,
              role: user.role || 'user' // Mặc định là user
            };
            localStorage.setItem('mock_token', JSON.stringify(userInfo));
            resolve(userInfo);
          } else {
            reject(new Error('Email hoặc mật khẩu không chính xác (Local Mode)'));
          }
        }, 500);
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    if (!data.user) throw new Error('Không tìm thấy thông tin người dùng');

    return {
      id: data.user.id,
      fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      role: data.user.user_metadata?.role || 'user'
    };
  },

  // 2. ĐĂNG KÝ
  register: async (fullName: string, email: string, password: string): Promise<User> => {
    if (!isSupabaseConfigured) {
      // Fallback to localStorage
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const usersStr = localStorage.getItem('mock_db_users');
          const users = usersStr ? JSON.parse(usersStr) : [];
          
          if (users.find((u: any) => u.email === email)) {
            reject(new Error('Email này đã được sử dụng (Local Mode)'));
            return;
          }
          
          const newUser = {
            id: Date.now().toString(),
            fullName,
            email,
            password,
            role: 'user' // Mặc định đăng ký là user
          };
          
          users.push(newUser);
          localStorage.setItem('mock_db_users', JSON.stringify(users));
          
          const userInfo = { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: 'user' as const };
          localStorage.setItem('mock_token', JSON.stringify(userInfo));
          
          resolve(userInfo);
        }, 500);
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user' // Mặc định là user
        },
      },
    });

    if (error) throw error;
    
    if (!data.user) throw new Error('Đăng ký thất bại');

    return {
      id: data.user.id,
      fullName: data.user.user_metadata?.full_name || fullName,
      email: data.user.email || '',
      role: 'user'
    };
  },

  // 3. LẤY THÔNG TIN USER HIỆN TẠI
  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured) {
      // Fallback to localStorage
      return new Promise((resolve) => {
        const token = localStorage.getItem('mock_token');
        if (token) {
          resolve(JSON.parse(token));
        } else {
          resolve(null);
        }
      });
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;
      
      return {
        id: session.user.id,
        fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        role: session.user.user_metadata?.role || 'user'
      };
    } catch (error) {
      console.warn('Failed to fetch session from Supabase, likely due to missing config.');
      return null;
    }
  },

  // 4. ĐĂNG XUẤT
  logout: async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('mock_token');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

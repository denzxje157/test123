import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, User } from '../services/authService.ts';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient.ts';

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  toggleAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Lấy nhanh dữ liệu cũ để hiển thị giao diện tức thì
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        // 2. Chạy ngầm lên Server Supabase để lấy quyền Admin mới nhất (tránh bị kẹt quyền cũ)
        if (isSupabaseConfigured && currentUser) {
           supabase.auth.getUser().then(({ data, error }) => {
              if (data?.user && !error) {
                  setUser(prev => {
                      if (!prev) return null;
                      const freshRole = data.user.user_metadata?.role || 'user';
                      // Chỉ cập nhật nếu quyền có thay đổi
                      if (prev.role !== freshRole) {
                          return { ...prev, role: freshRole };
                      }
                      return prev;
                  });
              }
           });
        }
      } catch (error) {
        console.error("Lỗi kiểm tra phiên đăng nhập:", error);
      }
    };
    checkAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
           if (session?.user) {
               setUser({
                   id: session.user.id,
                   fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                   email: session.user.email || '',
                   role: session.user.user_metadata?.role || 'user'
               });
           }
        } else if (event === 'SIGNED_OUT') {
           setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen);

  // ĐÃ TRẢ LẠI LUỒNG LOGIN GỐC ĐỂ KHÔNG BỊ QUAY QUAY NỮA
  const login = async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);

    // Chạy ngầm lấy quyền Admin sau khi đã login thành công
    if (isSupabaseConfigured && loggedInUser) {
       supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
              setUser(prev => prev ? { ...prev, role: data.user.user_metadata?.role || 'user' } : null);
          }
       });
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    const newUser = await authService.register(fullName, email, password);
    setUser(newUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthModalOpen, toggleAuthModal, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
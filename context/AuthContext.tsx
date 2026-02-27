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
    // Check initial session
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    checkAuth();

    // Listen for auth changes ONLY if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
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

  const login = async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
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

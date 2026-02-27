import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Bảo vệ trang Admin (Đơn giản: Kiểm tra email)
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    // Kiểm tra quyền Admin
    if (user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
    }
  }, [user, navigate]);

  const menuItems = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Tổng quan' },
    { path: '/admin/products', icon: 'inventory_2', label: 'Quản lý Sản phẩm' },
    { path: '/admin/orders', icon: 'shopping_cart', label: 'Quản lý Đơn hàng' },
    { path: '/admin/users', icon: 'group', label: 'Khách hàng' },
    { path: '/', icon: 'home', label: 'Về trang chủ' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3E9] font-display flex">
      {/* Sidebar - Đổi màu đỏ chói thành màu tối sang trọng hơn (Dark Charcoal/Slate) */}
      <aside className={`bg-[#1F2937] text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20 shadow-2xl border-r border-gold/10`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex flex-col leading-none">
              <h1 className="font-black text-xl tracking-widest text-white uppercase">SẮC VIỆT</h1>
              <span className="text-[9px] font-bold tracking-[0.3em] text-gold mt-1">QUẢN TRỊ</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-gold transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path 
                ? 'bg-primary text-white shadow-lg font-bold translate-x-1' 
                : 'hover:bg-white/5 text-white/60 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className={`material-symbols-outlined ${location.pathname === item.path ? 'text-white' : 'text-gold/70 group-hover:text-gold transition-colors'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="text-sm tracking-wide uppercase">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-full bg-gold flex items-center justify-center text-primary font-black border-2 border-white/20 shadow-inner">
                {user?.fullName?.charAt(0) || 'A'}
             </div>
             {isSidebarOpen && (
               <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate text-white">{user?.fullName}</p>
                 <p className="text-[10px] text-white/40 truncate font-mono">{user?.email}</p>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 bg-[#F7F3E9] min-h-screen`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

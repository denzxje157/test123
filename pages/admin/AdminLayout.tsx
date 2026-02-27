import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth() || {};
  const location = useLocation();
  const navigate = useNavigate();
  // Responsive: Mobile tự đóng sidebar, Desktop mặc định mở
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  // Xử lý tự động đóng mở khi xoay màn hình hoặc kéo kích thước
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bảo vệ trang Admin
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user?.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
    }
  }, [user, navigate]);

  // Tự động đóng sidebar trên mobile khi chuyển trang
  useEffect(() => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Tổng quan' },
    { path: '/admin/products', icon: 'inventory_2', label: 'Quản lý Sản phẩm' },
    { path: '/admin/orders', icon: 'shopping_cart', label: 'Quản lý Đơn hàng' },
    { path: '/admin/users', icon: 'group', label: 'Khách hàng' },
    { path: '/', icon: 'home', label: 'Về trang chủ' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3E9] font-display flex overflow-x-hidden relative">
      {/* Mobile Overlay (Lớp mờ khi mở menu trên điện thoại) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-[#1F2937] text-white transition-all duration-300 flex flex-col fixed h-full z-50 shadow-2xl border-r border-gold/10 ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/10 h-16 md:h-20 shrink-0">
          <div className={`flex flex-col leading-none transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            <h1 className="font-black text-lg md:text-xl tracking-widest text-white uppercase">SẮC VIỆT</h1>
            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-gold mt-1">QUẢN TRỊ</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-gold transition-colors absolute right-4 md:right-6">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path 
                ? 'bg-primary text-white shadow-lg font-bold translate-x-1' 
                : 'hover:bg-white/5 text-white/60 hover:text-white hover:translate-x-1'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <span className={`material-symbols-outlined shrink-0 ${location.pathname === item.path ? 'text-white' : 'text-gold/70 group-hover:text-gold transition-colors'}`}>{item.icon}</span>
              <span className={`text-sm tracking-wide uppercase whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
          <div className="flex items-center gap-3">
             <div className="size-10 shrink-0 rounded-full bg-gold flex items-center justify-center text-primary font-black border-2 border-white/20 shadow-inner">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
             </div>
             <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
               <p className="text-sm font-bold truncate text-white">{user?.fullName || 'Admin'}</p>
               <p className="text-[10px] text-white/40 truncate font-mono">{user?.email || 'admin@domain.com'}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 w-full min-h-screen ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} pt-16 md:pt-0`}>
         {/* Mobile Header Toggle (Thanh bar trên cùng dành cho điện thoại) */}
         <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1F2937] flex items-center justify-between px-4 z-30 shadow-md border-b border-gold/10">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-gold hover:bg-white/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined">menu_open</span>
            </button>
            <div className="text-center font-black text-white tracking-widest uppercase text-sm">Trang Quản Trị</div>
            <div className="w-10"></div> {/* Spacer để cân bằng */}
         </div>
         
         {/* Nội dung trang con */}
         <div className="p-4 md:p-8 bg-[#F7F3E9] min-h-full">
           {children}
         </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
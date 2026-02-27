import React from 'react';
import AdminLayout from './AdminLayout';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-black text-text-main mb-2 uppercase tracking-tight mt-2 md:mt-0">Tổng quan</h1>
        <p className="text-text-soft mb-6 md:mb-8 font-medium text-sm md:text-base">Chào mừng trở lại trang quản trị <span className="text-primary font-black">Sắc Việt</span>.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Box Sản phẩm */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gold/10 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="size-12 md:size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-3xl">inventory_2</span>
            </div>
            <div className="flex-1">
              <p className="text-[9px] md:text-[10px] text-text-soft font-black uppercase tracking-widest">Sản phẩm</p>
              <h3 className="text-xl md:text-2xl font-black text-text-main">Quản lý</h3>
            </div>
            <Link to="/admin/products" className="text-primary hover:underline text-[10px] md:text-xs font-black uppercase tracking-wider p-2 shrink-0">Xem</Link>
          </div>

          {/* Box Đơn hàng */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gold/10 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="size-12 md:size-14 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center border border-gold/20 group-hover:scale-110 transition-transform shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-3xl">shopping_cart</span>
            </div>
            <div className="flex-1">
              <p className="text-[9px] md:text-[10px] text-text-soft font-black uppercase tracking-widest">Đơn hàng</p>
              <h3 className="text-xl md:text-2xl font-black text-text-main">Quản lý</h3>
            </div>
            <Link to="/admin/orders" className="text-gold-dark hover:underline text-[10px] md:text-xs font-black uppercase tracking-wider p-2 shrink-0">Xem</Link>
          </div>

          {/* Box Khách hàng (Đã sửa lỗi nút Xem) */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gold/10 flex items-center gap-4 hover:shadow-md transition-shadow group sm:col-span-2 lg:col-span-1">
             <div className="size-12 md:size-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100 group-hover:scale-110 transition-transform shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-3xl">group</span>
            </div>
            <div className="flex-1">
              <p className="text-[9px] md:text-[10px] text-text-soft font-black uppercase tracking-widest">Khách hàng</p>
              <h3 className="text-xl md:text-2xl font-black text-text-main">Quản lý</h3>
            </div>
            <Link to="/admin/users" className="text-green-600 hover:underline text-[10px] md:text-xs font-black uppercase tracking-wider p-2 shrink-0">Xem</Link>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-[#8B0000] p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden border border-white/10 group">
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight text-white">Bắt đầu quản lý cửa hàng</h2>
            <p className="opacity-90 max-w-lg mb-6 text-xs md:text-sm font-medium leading-relaxed text-white/90">Sử dụng thanh bên để điều hướng đến các mục quản lý sản phẩm, đơn hàng và khách hàng. Đừng quên nạp dữ liệu mẫu nếu đây là lần đầu tiên bạn truy cập.</p>
            <Link to="/admin/products" className="bg-white text-primary px-5 py-3 md:px-6 md:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-md hover:bg-gold hover:text-white transition-all inline-flex items-center gap-2 active:scale-95">
              Đến trang sản phẩm <span className="material-symbols-outlined text-sm md:text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="absolute -right-5 -bottom-10 md:-right-10 md:-bottom-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
             <span className="material-symbols-outlined text-[120px] md:text-[200px] text-white">storefront</span>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none mix-blend-overlay"></div>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
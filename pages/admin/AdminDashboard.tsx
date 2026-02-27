import React from 'react';
import AdminLayout from './AdminLayout';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-black text-text-main mb-2 uppercase tracking-tight">Tổng quan</h1>
      <p className="text-text-soft mb-8 font-medium">Chào mừng trở lại trang quản trị <span className="text-primary font-black">Sắc Việt</span>.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-3xl">inventory_2</span>
          </div>
          <div>
            <p className="text-[10px] text-text-soft font-black uppercase tracking-widest">Sản phẩm</p>
            <h3 className="text-2xl font-black text-text-main">Quản lý</h3>
          </div>
          <Link to="/admin/products" className="ml-auto text-primary hover:underline text-xs font-black uppercase tracking-wider">Xem</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="size-14 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center border border-gold/20">
            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
          </div>
          <div>
            <p className="text-[10px] text-text-soft font-black uppercase tracking-widest">Đơn hàng</p>
            <h3 className="text-2xl font-black text-text-main">Quản lý</h3>
          </div>
          <Link to="/admin/orders" className="ml-auto text-gold-dark hover:underline text-xs font-black uppercase tracking-wider">Xem</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex items-center gap-4 hover:shadow-md transition-shadow">
           <div className="size-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <span className="material-symbols-outlined text-3xl">group</span>
          </div>
          <div>
            <p className="text-[10px] text-text-soft font-black uppercase tracking-widest">Khách hàng</p>
            <h3 className="text-2xl font-black text-text-main">Quản lý</h3>
          </div>
          <button className="ml-auto text-green-600 hover:underline text-xs font-black uppercase tracking-wider">Xem</button>
        </div>
      </div>

      <div className="bg-[#8B0000] p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden border border-white/10">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">Bắt đầu quản lý cửa hàng</h2>
          <p className="opacity-90 max-w-lg mb-6 text-sm font-medium leading-relaxed text-white/90">Sử dụng thanh bên để điều hướng đến các mục quản lý sản phẩm, đơn hàng và khách hàng. Đừng quên nạp dữ liệu mẫu nếu đây là lần đầu tiên bạn truy cập.</p>
          <Link to="/admin/products" className="bg-white text-primary px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-md hover:bg-gold hover:text-white transition-all inline-flex items-center gap-2 active:scale-95">
            Đến trang sản phẩm <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
           <span className="material-symbols-outlined text-[200px] text-white">storefront</span>
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

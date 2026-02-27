import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { userService } from '../../services/userService';
import { User } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth() || {};
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Lỗi tải người dùng:', error);
    }
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    if (userId === currentUser?.id) {
      alert('Bạn không thể tự thay đổi quyền của chính mình!');
      return;
    }
    if (userId === 'admin-local') {
      alert('Không thể thay đổi quyền của Admin mặc định!');
      return;
    }

    if (window.confirm(`Bạn có chắc muốn cấp quyền ${newRole === 'admin' ? 'QUẢN TRỊ' : 'NGƯỜI DÙNG'} cho tài khoản này?`)) {
      try {
        await userService.updateUserRole(userId, newRole);
        fetchUsers(); 
      } catch (error) {
        alert('Có lỗi xảy ra khi đổi quyền!');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main uppercase tracking-tight">Khách hàng & Phân quyền</h1>
          <p className="text-text-soft mt-1 font-medium text-sm md:text-base">Quản lý tài khoản và cấp quyền truy cập hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">Người dùng</th>
                <th className="p-4 whitespace-nowrap">Email</th>
                <th className="p-4 whitespace-nowrap">Vai trò hiện tại</th>
                <th className="p-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-text-soft font-bold">Đang tải dữ liệu...</td></tr>
              ) : users.length === 0 ? (
                <tr>
                   <td colSpan={4} className="p-12 text-center text-text-soft">
                      <span className="material-symbols-outlined text-4xl text-gold/30 mb-2 block">group_off</span>
                      <p className="font-bold">Chưa có người dùng nào đăng ký.</p>
                   </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 shrink-0 rounded-full flex items-center justify-center font-black text-white shadow-inner ${u.role === 'admin' ? 'bg-primary border-2 border-primary/20' : 'bg-gold border-2 border-gold/20'}`}>
                          {u?.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-bold text-text-main max-w-[150px] truncate">{u?.fullName || 'Người dùng Ẩn danh'}</span>
                        {u.id === currentUser?.id && <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-green-200">Bạn</span>}
                      </div>
                    </td>
                    <td className="p-4 text-xs md:text-sm font-medium text-text-soft">{u?.email || 'N/A'}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-background-light text-text-soft border border-gold/20'
                      }`}>
                        {u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {u.id !== 'admin-local' && u.id !== currentUser?.id && (
                        <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          {u.role !== 'admin' ? (
                            <button 
                              onClick={() => handleRoleChange(u.id, 'admin')}
                              className="px-3 py-2 md:py-1.5 bg-primary text-white rounded-lg text-[10px] md:text-xs font-bold hover:brightness-110 shadow-md transition-all active:scale-95 uppercase tracking-wide"
                            >
                              Cấp Admin
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRoleChange(u.id, 'user')}
                              className="px-3 py-2 md:py-1.5 bg-white border border-gold/20 text-text-soft rounded-lg text-[10px] md:text-xs font-bold hover:bg-background-light transition-all uppercase tracking-wide shadow-sm"
                            >
                              Gỡ quyền
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 md:mt-8 p-4 md:p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 md:gap-4 items-start animate-fade-in shadow-sm">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
           <span className="material-symbols-outlined text-xl">info</span>
        </div>
        <div>
          <h4 className="font-black text-blue-800 text-xs md:text-sm uppercase mb-1 tracking-tight">Lưu ý về đồng bộ dữ liệu</h4>
          <p className="text-[10px] md:text-xs text-blue-700/80 leading-relaxed font-medium">
            Hiện tại hệ thống hỗ trợ cả chế độ Local và Supabase. Để nhiều Admin từ các máy khác nhau cùng quản lý chung và đảm bảo dữ liệu không bị mất khi đổi máy, hãy chắc chắn bạn đã cấu hình <strong className="text-blue-800">VITE_SUPABASE_URL</strong> trong file <code className="bg-white/50 px-1 py-0.5 rounded border border-blue-200">.env</code>.
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AdminLayout>
  );
};

export default UserManagement;
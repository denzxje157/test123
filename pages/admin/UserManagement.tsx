import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { userService } from '../../services/userService';
import { User } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await userService.getAllUsers();
    setUsers(data);
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
      await userService.updateUserRole(userId, newRole);
      fetchUsers(); // Tải lại danh sách
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Khách hàng & Phân quyền</h1>
          <p className="text-text-soft mt-1 font-medium">Quản lý tài khoản và cấp quyền truy cập hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">Người dùng</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai trò hiện tại</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-text-soft">Đang tải dữ liệu...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-text-soft">Chưa có người dùng nào đăng ký.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center font-black text-white ${u.role === 'admin' ? 'bg-primary' : 'bg-gold'}`}>
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-text-main">{u.fullName}</span>
                        {u.id === currentUser?.id && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Bạn</span>}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-text-soft">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {u.id !== 'admin-local' && u.id !== currentUser?.id && (
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {u.role !== 'admin' ? (
                            <button 
                              onClick={() => handleRoleChange(u.id, 'admin')}
                              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-110 shadow-md transition-all active:scale-95"
                            >
                              Thăng cấp Admin
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRoleChange(u.id, 'user')}
                              className="px-3 py-1.5 bg-white border border-gold/20 text-text-soft rounded-lg text-xs font-bold hover:bg-gray-50 transition-all"
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
      
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start">
        <span className="material-symbols-outlined text-blue-600">info</span>
        <div>
          <h4 className="font-bold text-blue-800 text-sm uppercase mb-1">Lưu ý về đồng bộ dữ liệu</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Hiện tại hệ thống đang chạy ở chế độ <strong>Local Demo</strong>. Dữ liệu tài khoản và quyền hạn chỉ được lưu trên trình duyệt này. 
            Để nhiều Admin từ các máy khác nhau cùng quản lý chung, bạn cần kích hoạt kết nối <strong>Supabase Database</strong>.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;

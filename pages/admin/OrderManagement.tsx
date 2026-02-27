import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { orderService, Order } from '../../services/orderService';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    }
    setIsLoading(false);
  };

  const updateStatus = async (id: number | string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    } catch (error) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipping': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'cancelled': return 'Đã hủy';
      default: return 'Chờ xác nhận';
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main uppercase tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-text-soft mt-1 font-medium text-sm md:text-base">Theo dõi và xử lý đơn đặt hàng từ khách.</p>
        </div>
        
        {/* Bộ lọc trạng thái có thanh cuộn ngang trên Mobile */}
        <div className="flex gap-2 bg-white p-1.5 md:p-1 rounded-xl border border-gold/10 shadow-sm overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-1">
          {['all', 'pending', 'processing', 'shipping', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition-all whitespace-nowrap shrink-0 ${
                filterStatus === status 
                ? 'bg-primary text-white shadow-md' 
                : 'text-text-soft hover:bg-gold/10'
              }`}
            >
              {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">Mã đơn</th>
                <th className="p-4 whitespace-nowrap">Khách hàng</th>
                <th className="p-4 whitespace-nowrap">Sản phẩm</th>
                <th className="p-4 whitespace-nowrap">Tổng tiền</th>
                <th className="p-4 whitespace-nowrap">Ngày đặt</th>
                <th className="p-4 whitespace-nowrap">Trạng thái</th>
                <th className="p-4 whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-text-soft font-bold">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan={7} className="p-12 text-center text-text-soft">
                      <span className="material-symbols-outlined text-4xl text-gold/30 mb-2 block">receipt_long</span>
                      <p className="font-bold">Chưa có đơn hàng nào.</p>
                   </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4 font-mono font-bold text-primary text-xs md:text-sm">{order?.order_id || 'N/A'}</td>
                    <td className="p-4">
                      <p className="font-bold text-text-main text-xs md:text-sm">{order?.customer_info?.name || 'Khách vãng lai'}</p>
                      <p className="text-[10px] text-text-soft">{order?.customer_info?.phone || 'Không có SĐT'}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {(order?.items || []).slice(0, 2).map((item, idx) => (
                          <span key={idx} className="text-[10px] md:text-xs text-text-main truncate max-w-[150px]">• {item?.name || 'Sản phẩm'} (x{item?.quantity || 1})</span>
                        ))}
                        {(order?.items?.length || 0) > 2 && <span className="text-[10px] text-primary italic font-bold">+ {(order.items.length) - 2} sản phẩm khác</span>}
                      </div>
                    </td>
                    <td className="p-4 font-black text-primary text-xs md:text-sm whitespace-nowrap">{(Number(order?.total) || 0).toLocaleString()} đ</td>
                    <td className="p-4 text-[10px] md:text-xs text-text-soft font-medium whitespace-nowrap">
                       {order?.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded border text-[9px] md:text-[10px] font-black uppercase tracking-wider ${getStatusColor(order?.status || 'pending')}`}>
                        {getStatusLabel(order?.status || 'pending')}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        className="bg-white border border-gold/20 text-[10px] md:text-xs font-bold text-text-main rounded-lg p-1.5 md:p-2 outline-none focus:border-primary cursor-pointer hover:bg-gold/5 transition-colors shadow-sm"
                        value={order?.status || 'pending'}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AdminLayout>
  );
};

export default OrderManagement;
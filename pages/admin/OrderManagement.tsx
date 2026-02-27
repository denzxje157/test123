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
      setOrders(data);
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
      alert('Cập nhật thất bại');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-text-soft mt-1 font-medium">Theo dõi và xử lý đơn đặt hàng từ khách.</p>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gold/10 shadow-sm">
          {['all', 'pending', 'processing', 'shipping', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
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
      
      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-text-soft">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-text-soft">Chưa có đơn hàng nào.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4 font-mono font-bold text-primary text-sm">{order.order_id}</td>
                    <td className="p-4">
                      <p className="font-bold text-text-main text-sm">{order.customer_info?.name}</p>
                      <p className="text-[10px] text-text-soft">{order.customer_info?.phone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="text-xs text-text-main truncate max-w-[150px]">• {item.name} (x{item.quantity})</span>
                        ))}
                        {order.items?.length > 2 && <span className="text-[10px] text-text-soft italic">+ {order.items.length - 2} sản phẩm khác</span>}
                      </div>
                    </td>
                    <td className="p-4 font-black text-primary text-sm">{Number(order.total).toLocaleString()} đ</td>
                    <td className="p-4 text-xs text-text-soft font-medium">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        className="bg-white border border-gold/20 text-xs font-bold text-text-main rounded-lg p-1.5 outline-none focus:border-primary cursor-pointer hover:bg-gold/5 transition-colors"
                        value={order.status}
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
    </AdminLayout>
  );
};

export default OrderManagement;

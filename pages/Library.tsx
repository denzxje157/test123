import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService, Order as ServiceOrder } from '../services/orderService';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  ethnic: string;
  img: string;
}

interface Order {
  id: string;
  userId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    note: string;
  };
  paymentMethod: string;
  total: number;
  items: OrderItem[];
  status: string;
  date: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await orderService.getOrdersByUserId(user.id);
          const mappedOrders: Order[] = data.map((order: any) => ({
             id: order.order_id || order.id || 'Unknown',
             userId: order.user_id || order.userId || '',
             customer: order.customer_info || order.customer || { name: '', phone: '', address: '', note: '' },
             paymentMethod: order.payment_method || order.paymentMethod || '',
             total: order.total || 0,
             items: order.items || [],
             status: order.status === 'pending' ? 'Đang xử lý' : (order.status || 'Đang xử lý'),
             date: order.created_at || order.date || new Date().toISOString()
          }));
          setOrders(mappedOrders);
        } catch (error) {
          console.error('Lỗi khi tải đơn hàng:', error);
        }
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F5EA] pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gold/20 max-w-md w-full">
           <div className="size-20 bg-background-light rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-text-soft">lock</span>
           </div>
           <h2 className="text-2xl font-black text-text-main mb-3">Bạn chưa đăng nhập</h2>
           <p className="text-text-soft mb-8">Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.</p>
           <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors">
              Về trang chủ
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EA] pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
           <Link to="/" className="size-10 rounded-full bg-white border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-white transition-colors shadow-sm">
              <span className="material-symbols-outlined">arrow_back</span>
           </Link>
           <div>
              <h1 className="text-3xl font-black text-text-main uppercase tracking-wide">Đơn hàng của tôi</h1>
              <p className="text-sm text-text-soft font-medium mt-1">Theo dõi hành trình di sản về nhà</p>
           </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gold/10 shadow-sm">
             <div className="size-24 bg-background-light rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-text-soft/30">receipt_long</span>
             </div>
             <h3 className="text-xl font-black text-text-main mb-2">Chưa có đơn hàng nào</h3>
             <p className="text-text-soft mb-8 max-w-md mx-auto">Hãy ghé thăm Chợ Phiên để tìm kiếm những món quà di sản độc đáo cho riêng mình.</p>
             <Link to="/marketplace" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95">
                Khám phá ngay
                <span className="material-symbols-outlined">arrow_forward</span>
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id} 
                className="bg-white rounded-3xl border border-gold/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-background-light p-6 border-b border-gold/10 flex flex-wrap gap-4 justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl border border-gold/10 shadow-sm">
                         <span className="material-symbols-outlined text-primary text-2xl">local_mall</span>
                      </div>
                      <div>
                         <p className="text-[10px] text-text-soft font-black uppercase tracking-widest">Mã đơn hàng</p>
                         <p className="text-lg font-black text-text-main">{order.id}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-text-soft font-black uppercase tracking-widest">Ngày đặt</p>
                      <p className="text-sm font-bold text-text-main">
                        {!isNaN(new Date(order.date).getTime()) 
                          ? `${new Date(order.date).toLocaleDateString('vi-VN')} - ${new Date(order.date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`
                          : 'Không xác định'}
                      </p>
                   </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                   {/* Status & Total */}
                   <div className="flex flex-wrap gap-4 justify-between items-center mb-6 pb-6 border-b border-dashed border-gold/20">
                      <div className="flex items-center gap-2">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                            order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                         }`}>
                            {order.status}
                         </span>
                         <span className="text-xs text-text-soft font-medium">| {order.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs text-text-soft font-bold mr-2">Tổng tiền:</span>
                         <span className="text-xl font-black text-primary">{(order.total || 0).toLocaleString('vi-VN')} đ</span>
                      </div>
                   </div>

                   {/* Items List */}
                   <div className="space-y-4">
                      {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                         <div key={idx} className="flex gap-4 items-center">
                            <div className="size-16 rounded-xl bg-gray-100 border border-gold/10 overflow-hidden shrink-0">
                               <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-bold text-text-main text-sm truncate">{item.name}</h4>
                               <p className="text-[10px] text-bronze uppercase font-black tracking-widest">{item.ethnic}</p>
                            </div>
                            <div className="text-right shrink-0">
                               <p className="text-sm font-bold text-text-main">{item.price}</p>
                               <p className="text-xs text-text-soft">x{item.quantity}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                   
                   {/* Actions */}
                   <div className="mt-6 pt-6 border-t border-gold/10 flex justify-end gap-3">
                      <button className="px-5 py-2.5 rounded-xl border border-gold/20 text-text-main text-sm font-bold hover:bg-background-light transition-colors">
                         Liên hệ hỗ trợ
                      </button>
                      <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
                         Mua lại
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

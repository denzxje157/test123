import { supabase, isSupabaseConfigured } from './supabaseClient';
import { CartItem } from '../context/CartContext';

export interface Order {
  id: number | string;
  order_id: string;
  user_id: string;
  customer_info: {
    name: string;
    phone: string;
    address: string;
    note: string;
  };
  payment_method: string;
  total: number;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  created_at: string;
}

const LOCAL_STORAGE_KEY = 'sacnoi_orders';

export const orderService = {
  // Lấy toàn bộ đơn hàng
  getAllOrders: async (): Promise<Order[]> => {
    if (!isSupabaseConfigured) {
      // Local Mode: Lấy từ localStorage của từng user (giả lập admin xem hết)
      // Thực tế local mode khó lấy hết nếu key theo user_id. 
      // Ta sẽ dùng key chung 'sacnoi_orders_all' cho admin demo.
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_all');
      return saved ? JSON.parse(saved) : [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Lấy đơn hàng của user cụ thể
  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
      return saved ? JSON.parse(saved) : [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData: Omit<Order, 'id'>) => {
    if (!isSupabaseConfigured) {
      // 1. Lưu vào danh sách riêng của user
      const userKey = `${LOCAL_STORAGE_KEY}_${orderData.user_id}`;
      const userOrders = JSON.parse(localStorage.getItem(userKey) || '[]');
      const newOrder = { ...orderData, id: Date.now() }; // Mock ID
      localStorage.setItem(userKey, JSON.stringify([newOrder, ...userOrders]));

      // 2. Lưu vào danh sách chung cho Admin xem (Local Demo)
      const allOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY + '_all') || '[]');
      localStorage.setItem(LOCAL_STORAGE_KEY + '_all', JSON.stringify([newOrder, ...allOrders]));
      
      return newOrder;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId: number | string, status: string) => {
    if (!isSupabaseConfigured) {
      // Cập nhật trong danh sách chung (Admin)
      const allOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY + '_all') || '[]');
      const updatedAllOrders = allOrders.map((o: Order) => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem(LOCAL_STORAGE_KEY + '_all', JSON.stringify(updatedAllOrders));

      // Cập nhật trong danh sách riêng của user (cần tìm user_id từ order, hơi phức tạp ở local)
      // Tạm bỏ qua cập nhật user list ở local mode cho đơn giản, hoặc loop qua tất cả keys
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
  }
};

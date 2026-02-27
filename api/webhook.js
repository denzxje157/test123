import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Chỉ nhận tín hiệu POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Chỉ nhận POST request' });
  }

  try {
    // 1. TÌM CHÌA KHÓA (Hỗ trợ nhiều tên biến đề phòng gõ nhầm trên Vercel)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    // Báo lỗi rõ ràng ra SePay nếu Vercel vẫn chưa nhận được chìa khóa
    if (!supabaseUrl) return res.status(400).json({ error: 'Vercel đang thiếu URL Supabase' });
    if (!supabaseKey) return res.status(400).json({ error: 'Vercel đang thiếu Key Supabase' });

    // 2. KHỞI TẠO SUPABASE
    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = req.body;
    
    // 3. ĐỌC DỮ LIỆU SEPAY
    const content = data.content || data.transactionContent || data.description || '';
    const type = data.transferType;

    // Bỏ qua giao dịch rút tiền
    if (type && type !== 'in') {
      return res.status(200).json({ message: 'Bỏ qua giao dịch rút tiền' });
    }

    // Tìm mã đơn hàng
    const orderMatch = content.match(/SN-?\d{6}/i);
    if (!orderMatch) {
      return res.status(200).json({ message: 'Không tìm thấy mã đơn hàng Sắc Việt' });
    }

    let orderId = orderMatch[0].toUpperCase();
    if (!orderId.includes('-')) orderId = orderId.replace('SN', 'SN-');

    // 4. TÌM VÀ CẬP NHẬT ĐƠN HÀNG
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError || !order) {
      return res.status(200).json({ message: `Đơn hàng ${orderId} không tồn tại` });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('order_id', orderId);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true, message: `Đã duyệt đơn ${orderId} thành công!` });

  } catch (error) {
    console.error('Lỗi Webhook:', error);
    return res.status(500).json({ error: error.message || 'Lỗi hệ thống' });
  }
}
// Dùng require thay vì import để chống lỗi biên dịch trên Vercel
const { createClient } = require('@supabase/supabase-js');

module.exports = async function (req, res) {
  // Chỉ nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Chỉ nhận POST request' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    // Bắt lỗi ngay nếu thiếu biến môi trường
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Vercel đang thiếu biến môi trường Supabase' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = req.body;
    
    const content = data.content || data.transactionContent || data.description || '';
    const type = data.transferType;

    if (type && type !== 'in') {
      return res.status(200).json({ message: 'Bỏ qua giao dịch rút tiền' });
    }

    const orderMatch = content.match(/SN-?\d{6}/i);
    if (!orderMatch) {
      return res.status(200).json({ message: 'Không tìm thấy mã đơn hàng Sắc Việt' });
    }

    let orderId = orderMatch[0].toUpperCase();
    if (!orderId.includes('-')) {
        orderId = orderId.replace('SN', 'SN-');
    }

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
    return res.status(500).json({ error: error.message || 'Lỗi không xác định' });
  }
};
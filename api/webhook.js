import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer'; // Đã thêm lại thư viện gửi mail

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Chỉ nhận POST request' });

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) return res.status(400).json({ error: 'Thiếu biến môi trường Supabase' });

    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = req.body;
    
    const content = data.content || data.transactionContent || data.description || '';
    if (data.transferType && data.transferType !== 'in') return res.status(200).json({ message: 'Bỏ qua giao dịch rút tiền' });

    const orderMatch = content.match(/SN-?\d{6}/i);
    if (!orderMatch) return res.status(200).json({ message: 'Không tìm thấy mã đơn hàng' });

    let orderId = orderMatch[0].toUpperCase();
    if (!orderId.includes('-')) orderId = orderId.replace('SN', 'SN-');

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError || !order) return res.status(200).json({ message: `Đơn hàng ${orderId} không tồn tại` });

    // 1. Cập nhật Database
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('order_id', orderId);

    if (updateError) throw updateError;

    // 2. Gửi Email thông báo
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && order.customer_info?.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Sắc Việt" <${process.env.EMAIL_USER}>`,
        to: order.customer_info.email,
        subject: `[Sắc Việt] Thanh toán thành công đơn hàng ${orderId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 10px;">
            <h2 style="color: #A11D1D; text-align: center;">Thanh toán thành công!</h2>
            <p>Xin chào <b>${order.customer_info.name}</b>,</p>
            <p>Sắc Việt đã ghi nhận thanh toán cho đơn hàng <b>${orderId}</b> với số tiền <b>${order.total.toLocaleString('vi-VN')}đ</b>.</p>
            <p>Chúng tôi sẽ sớm giao hàng đến địa chỉ: <i>${order.customer_info.address}</i></p>
            <p>Cảm ơn bạn đã đồng hành bảo tồn di sản Việt!</p>
          </div>
        `
      });
    }

    return res.status(200).json({ success: true, message: `Đã duyệt đơn và gửi Email cho ${orderId}!` });

  } catch (error) {
    console.error('Lỗi Webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
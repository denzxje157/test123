import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Chỉ nhận POST request' });

  try {
    const { orderId, customerEmail, customerName, total, address, paymentMethod } = req.body;

    // Kiểm tra xem Vercel có mật khẩu Gmail chưa và khách có nhập email không
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && customerEmail) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Sắc Việt" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `[Sắc Việt] Xác nhận đơn hàng ${orderId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4AF37; border-radius: 10px;">
            <h2 style="color: #A11D1D; text-align: center;">Đặt hàng thành công!</h2>
            <p>Xin chào <b>${customerName}</b>,</p>
            <p>Sắc Việt đã nhận được yêu cầu đặt hàng <b>${orderId}</b> của bạn với tổng số tiền <b>${total.toLocaleString('vi-VN')}đ</b>.</p>
            <p>Phương thức: <b>${paymentMethod}</b></p>
            <p>Chúng tôi sẽ sớm giao hàng đến địa chỉ: <i>${address}</i></p>
            <p>Cảm ơn bạn đã đồng hành bảo tồn di sản Việt!</p>
          </div>
        `
      });
    }

    return res.status(200).json({ success: true, message: 'Đã gửi Email thành công!' });

  } catch (error) {
    console.error('Lỗi gửi mail:', error);
    return res.status(500).json({ error: error.message });
  }
}
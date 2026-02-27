import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { supabase } from '../services/supabaseClient.ts';
import { orderService } from '../services/orderService';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, toggleAuthModal } = useAuth();
  
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr'>('cod');
  const [orderId, setOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Thêm state để lắng nghe trạng thái thanh toán từ Supabase
  const [orderStatus, setOrderStatus] = useState<'pending' | 'paid'>('pending');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // HỆ THỐNG LẮNG NGHE TIỀN VỀ (POLLING) - CHUẨN SHOPEE
  useEffect(() => {
    if (step !== 'success' || !orderId || paymentMethod === 'cod') return;

    // Cứ 3 giây hỏi Database 1 lần xem đơn này đã 'paid' chưa
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('status')
          .eq('order_id', orderId)
          .single();

        if (data && data.status === 'paid') {
          // BÙM! Có người chuyển khoản -> Dừng hỏi và chuyển trạng thái UI
          setOrderStatus('paid');
          clearInterval(interval);
          
          // Chuyển khoản xong thì tự động xóa giỏ hàng và mở Zalo
          setTimeout(() => {
            const zaloMsg = `Chào Sắc Việt, tôi đã thanh toán thành công đơn hàng ${orderId}.`;
            window.open(`https://zalo.me/0987654321?text=${encodeURIComponent(zaloMsg)}`, '_blank');
            clearCart();
          }, 2000);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra thanh toán:", err);
      }
    }, 3000);

    // Dọn dẹp bộ đếm nếu đóng giỏ hàng
    return () => clearInterval(interval);
  }, [step, orderId, paymentMethod]);

  if (!isCartOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toggleAuthModal();
      return;
    }

    setIsSubmitting(true);
    
    // Sinh mã đơn hàng
    const newOrderId = `SN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    
    const paymentText = paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản (QR)';

    const orderData = {
      order_id: newOrderId,
      user_id: user.id,
      customer_info: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        note: formData.note
      },
      payment_method: paymentText,
      total: totalPrice,
      items: cart,
      status: 'pending' as const, // Mặc định là chờ thanh toán
      created_at: new Date().toISOString()
    };

    try {
      // Lưu đơn vào Database
      await orderService.createOrder(orderData);
      
      // Chuyển sang màn hình "Chờ thanh toán"
      setStep('success');
      setOrderStatus('pending');
      setIsSubmitting(false);

      // Nếu là COD thì xử lý luôn, không cần chờ Webhook
      if (paymentMethod === 'cod') {
        
        // --- THÊM ĐOẠN NÀY ĐỂ GỌI API GỬI MAIL ---
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: newOrderId,
              customerEmail: formData.email,
              customerName: formData.name,
              total: totalPrice,
              address: formData.address,
              paymentMethod: paymentText
            })
          });
        } catch (e) {
          console.error("Lỗi khi gọi API gửi mail COD:", e);
        }
        // ------------------------------------------

        setOrderStatus('paid'); // Giả vờ 'paid' để hiện tích xanh
        setTimeout(() => {
           const codMsg = `Chào Sắc Việt, tôi vừa đặt đơn hàng COD mã: ${newOrderId}`;
           window.location.href = `https://zalo.me/0987654321?text=${encodeURIComponent(codMsg)}`;
           clearCart();
        }, 3000);
      }
      
    } catch (error) {
      console.error('Lỗi lưu đơn hàng:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end font-display">
      <div className="absolute inset-0 bg-text-main/60 backdrop-blur-sm animate-fade-in" onClick={toggleCart}></div>
      
      <div className="relative w-full max-w-md bg-[#F7F3E9] h-full shadow-2xl flex flex-col border-l-4 border-gold animate-slide-in-right">
        
        {/* Header */}
        <div className="p-6 bg-primary text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
               <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </div>
            <div>
               <h2 className="text-lg font-black uppercase tracking-widest leading-none">Giỏ Hàng</h2>
               <p className="text-[10px] text-gold-light font-bold mt-1 opacity-90">Di sản trong tay bạn</p>
            </div>
          </div>
          <button onClick={toggleCart} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#F7F3E9]">
          
          {/* STEP 1: XEM GIỎ HÀNG */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-soft/50 space-y-4">
                   <span className="material-symbols-outlined text-6xl opacity-50">remove_shopping_cart</span>
                   <p className="font-bold text-lg">Chưa có bảo vật nào</p>
                   <button onClick={toggleCart} className="text-primary font-black uppercase text-xs hover:underline mt-2">Quay lại chợ phiên</button>
                </div>
              ) : (
                <div className="space-y-6">
                   {cart.map((item) => (
                     <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gold/20 shadow-sm relative group">
                        <img src={item.img} alt={item.name} className="size-20 rounded-xl object-cover border border-gold/10 bg-gray-100" />
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-1">
                              <h3 className="font-black text-text-main text-sm line-clamp-2 pr-2">{item.name}</h3>
                              <button onClick={() => removeFromCart(item.id)} className="text-text-soft/40 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                           </div>
                           <p className="text-[10px] text-bronze uppercase font-black tracking-widest mb-2">{item.ethnic}</p>
                           <div className="flex items-center justify-between">
                              <span className="text-primary font-bold text-sm">{item.price}</span>
                              <div className="flex items-center bg-background-light rounded-lg border border-gold/10">
                                 <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:text-primary">-</button>
                                 <span className="text-xs font-black px-1">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:text-primary">+</button>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: NHẬP THÔNG TIN (KHÔNG HIỆN QR Ở ĐÂY NỮA) */}
          {step === 'checkout' && (
             <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm animate-fade-in">
                <h3 className="font-black text-text-main uppercase text-sm mb-6 flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary">fact_check</span>
                   Thông tin người nhận
                </h3>
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                   <div>
                      <label className="block text-[10px] font-black uppercase text-bronze mb-1 ml-2">Họ và tên</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background-light border border-gold/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ví dụ: Nguyễn Văn A" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase text-bronze mb-1 ml-2">Email xác nhận</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background-light border border-gold/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ví dụ: email@gmail.com" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase text-bronze mb-1 ml-2">Số điện thoại (Zalo)</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background-light border border-gold/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ví dụ: 0912..." />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase text-bronze mb-1 ml-2">Địa chỉ nhận hàng</label>
                      <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-background-light border border-gold/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px]" placeholder="Số nhà, phường/xã..."></textarea>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase text-bronze mb-1 ml-2">Lời nhắn (Tùy chọn)</label>
                      <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-background-light border border-gold/20 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[60px]"></textarea>
                   </div>

                   <div className="mt-6 pt-4 border-t border-gold/10">
                      <label className="block text-[10px] font-black uppercase text-bronze mb-3 ml-2">Phương thức thanh toán</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gold/20 bg-background-light text-text-soft hover:bg-gold/5'}`}>
                          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                          <span className="material-symbols-outlined mb-2 text-3xl">local_shipping</span>
                          <span className="text-xs font-bold text-center">Thanh toán nhận hàng</span>
                        </label>
                        <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gold/20 bg-background-light text-text-soft hover:bg-gold/5'}`}>
                          <input type="radio" name="payment" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="sr-only" />
                          <span className="material-symbols-outlined mb-2 text-3xl">qr_code_2</span>
                          <span className="text-xs font-bold text-center">Chuyển khoản QR</span>
                        </label>
                      </div>
                   </div>
                </form>
             </div>
          )}

          {/* STEP 3: MÀN HÌNH CHỜ THANH TOÁN HOẶC THÀNH CÔNG */}
          {step === 'success' && (
             <div className="h-full flex flex-col items-center justify-center text-center p-2 animate-fade-in">
                
                {paymentMethod === 'qr' && orderStatus === 'pending' ? (
                   // GIAO DIỆN ĐANG CHỜ KHÁCH QUÉT MÃ QR
                   <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-xl w-full flex flex-col items-center">
                     <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Quét mã để thanh toán</p>
                     <p className="text-xs text-text-soft mb-4">Đơn hàng <span className="font-bold text-text-main">{orderId}</span></p>
                     
                     <div className="bg-white p-2 rounded-xl border-2 border-primary border-dashed mb-4 relative">
                        {/* QUAN TRỌNG: Dùng orderId làm Nội dung chuyển khoản để SePay nhận diện */}
                        <img 
                          src={`https://img.vietqr.io/image/MB-666150707-compact2.png?amount=${totalPrice}&addInfo=${orderId}&accountName=NGUYEN%20HOANG%20ANH`} 
                          alt="VietQR MB Bank" 
                          className="w-56 h-56 object-contain" 
                        />
                     </div>
                     
                     <div className="text-[11px] text-text-soft space-y-1 bg-background-light w-full p-4 rounded-xl border border-gold/10 text-left mb-6">
                        <p><span className="font-bold text-text-main">Ngân hàng:</span> MB Bank</p>
                        <p><span className="font-bold text-text-main">Số tài khoản:</span> 666150707</p>
                        <p><span className="font-bold text-text-main">Chủ tài khoản:</span> NGUYEN HOANG ANH</p>
                        <p><span className="font-bold text-text-main">Số tiền:</span> <span className="text-primary font-black text-sm">{totalPrice.toLocaleString('vi-VN')} đ</span></p>
                        <p><span className="font-bold text-text-main">Nội dung:</span> <span className="font-bold text-primary">{orderId}</span></p>
                     </div>

                     <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        <p className="text-xs font-bold animate-pulse">Hệ thống đang chờ nhận tiền...</p>
                     </div>
                   </div>
                ) : (
                   // GIAO DIỆN ĐÃ THANH TOÁN THÀNH CÔNG (Sau khi SePay báo về)
                   <div className="flex flex-col items-center animate-slide-up bg-white p-8 rounded-3xl border border-gold/20 shadow-xl w-full">
                      <div className="size-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                        <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                      </div>
                      <h3 className="text-2xl font-black text-text-main mb-3 leading-tight">Đặt Hàng <br/> Thành Công!</h3>
                      
                      <div className="bg-background-light px-6 py-4 rounded-2xl border border-gold/20 mb-6 shadow-sm w-full">
                        <p className="text-[10px] text-text-soft uppercase font-black tracking-widest mb-1">Mã đơn hàng</p>
                        <p className="text-xl font-black text-primary tracking-widest">{orderId}</p>
                      </div>
                      
                      <p className="text-text-soft mb-6 text-sm">Cảm ơn bạn. Thông tin hóa đơn sẽ sớm được gửi qua Email.</p>
                      <p className="text-xs font-bold text-primary animate-pulse flex items-center gap-2">
                        Đang chuyển hướng Zalo <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </p>
                   </div>
                )}
             </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-6 pb-8 sm:pb-6 bg-white border-t border-gold/10 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
             <div className="flex justify-between items-center mb-6">
                <span className="text-text-soft font-bold text-sm">Tổng cộng:</span>
                <span className="text-2xl font-black text-primary">{totalPrice.toLocaleString('vi-VN')} đ</span>
             </div>
             
             {step === 'cart' ? (
               <button onClick={() => setStep('checkout')} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                 Tiến hành đặt hàng
                 <span className="material-symbols-outlined text-lg">arrow_forward</span>
               </button>
             ) : (
               <div className="flex gap-3">
                  <button onClick={() => setStep('cart')} disabled={isSubmitting} className="flex-1 bg-background-light text-text-soft border border-gold/20 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gold/10 transition-colors disabled:opacity-50">
                    Quay lại
                  </button>
                  <button type="submit" form="checkout-form" disabled={isSubmitting} className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Xác nhận & Gửi đơn
                        <span className="material-symbols-outlined text-lg">send</span>
                      </>
                    )}
                  </button>
               </div>
             )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CartDrawer;
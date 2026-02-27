import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import AIChatWidget from './AIChatWidget.tsx';
import { User, LogOut, UserCircle2, ShoppingBag, MessageSquare, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleCart, totalItems } = useCart();
  const { user, toggleAuthModal, logout } = useAuth();

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Bản đồ', path: '/map' },
    { name: 'Chợ Phiên', path: '/marketplace' },
    { name: 'Thư viện', path: '/library' },
    { name: 'Cộng đồng', path: '/community' },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-gold/20 bg-background-light/90 backdrop-blur-md shadow-sm font-display">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
              <img 
                src="https://lh3.googleusercontent.com/d/18IzzMdMCckjzNcMpkhqp52zhXw72K9js" 
                alt="Logo Sắc Nối" 
                className="relative h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gold shadow-md transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-lg md:text-xl font-black uppercase tracking-tighter text-primary group-hover:text-red-700 transition-colors">SẮC VIỆT</h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-text-soft group-hover:text-gold transition-colors">DI SẢN VIỆT</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] xl:text-xs font-black uppercase tracking-widest transition-all hover:text-primary relative py-2 group ${
                  location.pathname === link.path ? 'text-primary' : 'text-text-soft'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* NÚT ADMIN TRỰC TIẾP (MỚI - Chỉ hiện cho Admin) */}
            {user?.role === 'admin' && (
              <Link 
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black text-gold rounded-full border border-gold/30 hover:bg-zinc-900 transition-all shadow-lg active:scale-95"
              >
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Quản trị</span>
              </Link>
            )}

            {/* AI Discovery Button (Desktop) */}
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`hidden lg:flex rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 items-center gap-2 shadow-lg border ${
                isChatOpen 
                ? 'bg-gold text-white border-gold shadow-gold/40' 
                : 'bg-white text-primary border-primary/20 hover:bg-primary/5'
              }`}
            >
              <MessageSquare size={16} />
              <span>Hỏi Già Làng AI</span>
            </button>

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="relative size-9 md:size-10 flex items-center justify-center rounded-full bg-white border border-gold/20 text-text-main hover:bg-gold hover:text-white transition-colors shadow-sm group"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-background-light shadow-sm animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Auth Button */}
            <div className="relative">
              {user ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-white border border-gold/20 rounded-full pl-1 pr-3 py-1 hover:bg-gold/5 transition-colors shadow-sm"
                >
                  <div className="size-7 md:size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-gold/30">
                    <User size={16} strokeWidth={2.5} />
                  </div>
                  <span className="hidden md:block text-xs font-bold text-text-main max-w-[80px] truncate">{user.fullName.split(' ').pop()}</span>
                </button>
              ) : (
                <button 
                  onClick={toggleAuthModal}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <UserCircle2 size={18} />
                  <span className="hidden md:inline text-xs font-black uppercase tracking-wider">Đăng nhập</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setIsUserMenuOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gold/20 overflow-hidden z-[100] animate-fade-in-up origin-top-right">
                    <div className="p-4 border-b border-gold/10 bg-background-light">
                      <p className="text-sm font-black text-text-main truncate">{user.fullName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-text-soft truncate">{user.email}</p>
                        {user.role === 'admin' && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase">Admin</span>}
                      </div>
                    </div>
                    <div className="p-2">
                      {/* Bổ sung nút Admin trong mobile/dropdown cho chắc chắn */}
                      {user.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <ShieldCheck size={16} /> Trang quản trị
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-main hover:bg-gold/10 rounded-xl transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <User size={16} /> Hồ sơ cá nhân
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-main hover:bg-gold/10 rounded-xl transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <span className="material-symbols-outlined text-base">receipt_long</span> Đơn hàng của tôi
                      </Link>
                      <div className="h-px bg-gold/10 my-1"></div>
                      <button 
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-text-main hover:text-primary transition-colors p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-symbols-outlined text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background-light border-t border-gold/20 p-6 flex flex-col gap-4 animate-fade-in absolute w-full shadow-2xl h-[calc(100vh-70px)] top-full z-[90] overflow-y-auto">
            {/* Nút Admin trên Mobile */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="bg-black text-gold p-4 rounded-2xl flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-3 font-black uppercase tracking-widest text-xs">
                  <ShieldCheck size={20} /> TRANG QUẢN TRỊ
                </div>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-black uppercase tracking-widest flex items-center justify-between border-b border-gold/10 pb-4 ${
                  location.pathname === link.path ? 'text-primary' : 'text-text-main'
                }`}
              >
                {link.name}
                <span className="material-symbols-outlined text-gold/50 text-sm">arrow_forward</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* MOBILE FLOATING CHAT BUTTON */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-[90] size-12 flex items-center justify-center bg-primary text-white rounded-full shadow-2xl border-2 border-gold animate-bounce-slow hover:scale-105 active:scale-95 transition-transform"
        >
           <MessageSquare size={24} />
        </button>
      )}

      {/* AI Chat Widget */}
      <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  );
};

export default Navbar;
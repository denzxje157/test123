import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Marketplace from './pages/Marketplace.tsx';
import Library from './pages/Library.tsx';
import Community from './pages/Community.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import Footer from './components/Footer.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import CartDrawer from './components/CartDrawer.tsx';
import AuthModal from './components/AuthModal.tsx';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import ProductManagement from './pages/admin/ProductManagement.tsx';
import OrderManagement from './pages/admin/OrderManagement.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';
import ContentManagement from './pages/admin/ContentManagement.tsx';
import SeoManagement from './pages/admin/SeoManagement.tsx'; // THÊM DÒNG NÀY

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return <>{children}</>;
  return <div key={location.pathname} className="animate-fade-in-page">{children}</div>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/content" element={<ContentManagement />} />
            <Route path="/admin/seo" element={<SeoManagement />} /> {/* THÊM DÒNG NÀY */}

            {/* Public Routes */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <CartDrawer />
                <AuthModal />
                <main className="flex-grow relative">
                  <PageWrapper>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/orders" element={<OrdersPage />} />
                    </Routes>
                  </PageWrapper>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
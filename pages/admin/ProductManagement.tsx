import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { productService, Product } from '../../services/productService';
import { rawData } from '../Marketplace'; 
import { ethnicData, libraryData } from '../../data/mockData';
import { contentService } from '../../services/contentService';
import { supabase } from '../../services/supabaseClient';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', ethnic: '', price: 0, description: '', image: '', category: 'Thủ công', stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    }
    setIsLoading(false);
  };

  // NÚT CỨU HỘ: Nạp Dân Tộc + Sản Phẩm
  // NÚT CỨU HỘ TỐI THƯỢNG: Nạp Dân Tộc + Sản Phẩm + Thư Viện
  const handleSeedData = async () => {
    if (!window.confirm('Hệ thống sẽ dọn sạch và nạp lại Bảng Dân Tộc, Sản Phẩm và Thư Viện. Bấm OK để tiếp tục!')) return;
    setIsLoading(true);
    try {
      // 🚀 LỆNH TẨY NÃO: Xóa sạch rác cũ trong trình duyệt để diệt tận gốc lỗi JSON.parse
      localStorage.clear();
      // 1. Quét dọn sạch sẽ trước khi nạp để không bị trùng lặp
      await supabase.from('san_pham').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('thu_vien').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('dan_toc').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // 2. Nạp bảng Dân Tộc (Bắt buộc phải có trước)
      console.log("Đang nạp bảng Dân Tộc...");
      await productService.seedDanToc(ethnicData);

      // 3. Gom và Nạp dữ liệu sản phẩm
      console.log("Đang nạp bảng Sản Phẩm...");
      const allItems: any[] = [];
      rawData.forEach(group => {
        (group.items || []).forEach(item => {
          let priceNum = 0;
          if (item?.p) {
             const priceMatch = item.p.match(/(\d+)\./);
             if (priceMatch) priceNum = parseInt(priceMatch[1]) * 1000;
          }
          allItems.push({
            name: item?.n || 'Sản phẩm',
            ethnic: group?.e || 'Khác',
            price: priceNum || 100000, 
            price_display: item?.p || 'Liên hệ',
            description: item?.d || 'Chưa có mô tả',
            image: item?.img || ''
          });
        });
      });
      await productService.seedProducts(allItems);

      // 4. BƠM DỮ LIỆU THƯ VIỆN 👈 (Đây chính là chìa khóa bạn đang thiếu)
      console.log("Đang nạp bảng Thư Viện...");
      if (libraryData && libraryData.length > 0) {
         await contentService.seedLibraryItems(libraryData);
      }

      alert('🎉 CỨU HỘ THÀNH CÔNG! Đã nạp lại 54 Dân tộc, Sản phẩm và Thư viện với hình ảnh rực rỡ!');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi seed data:', error);
      alert('Lỗi nạp dữ liệu! Vui lòng kiểm tra Console.');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi xóa:', error);
      alert('Xóa thất bại! Vui lòng kiểm tra quyền Admin.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    const payload = {
      ...formData,
      price_display: formData.price_display || `${(formData.price || 0).toLocaleString('vi-VN')} VNĐ`
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        alert('Cập nhật thành công!');
      } else {
        await productService.addProduct(payload as Product);
        alert('Thêm sản phẩm thành công!');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', ethnic: '', price: 0, description: '', image: '', category: 'Thủ công' });
      fetchProducts();
    } catch (error: any) {
      console.error('Lưu thất bại:', error);
      alert(`Lưu thất bại: ${error.message || 'Vui lòng kiểm tra lại quyền Admin trên Supabase'}`);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main uppercase tracking-tight">Quản lý Sản phẩm</h1>
          <p className="text-text-soft mt-1 font-medium text-sm md:text-base">Tổng số: <span className="text-primary font-black">{products.length}</span> sản phẩm</p>
        </div>
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          <button onClick={handleSeedData} className="flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-2 bg-white border border-gold/20 text-text-main rounded-xl font-bold hover:bg-background-light transition-colors text-xs flex items-center justify-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-lg">database</span>
            <span className="hidden sm:inline">Nạp dữ liệu mẫu</span>
            <span className="sm:hidden">Nạp mẫu</span>
          </button>
          <button onClick={() => { setEditingProduct(null); setFormData({ name: '', ethnic: '', stock: 0, price: 0, description: '', image: '', category: 'Thủ công' }); setIsModalOpen(true); }} className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-2 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:brightness-110 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-base md:text-lg">add</span>
            Thêm mới
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">Hình ảnh</th>
                <th className="p-4 whitespace-nowrap">Tên sản phẩm</th>
                <th className="p-4 whitespace-nowrap">Dân tộc</th>
                <th className="p-4 whitespace-nowrap">Giá (VNĐ)</th>
                <th className="p-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-soft font-bold">Đang tải dữ liệu...</td></tr>
              ) : products.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-12 text-center text-text-soft">
                      <span className="material-symbols-outlined text-4xl text-gold/30 mb-2 block">inventory_2</span>
                      <p className="font-bold">Chưa có sản phẩm nào. Hãy nạp dữ liệu mẫu.</p>
                   </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4 w-20">
                      <img src={product?.image || 'https://placehold.co/100'} alt={product?.name || 'Item'} className="size-12 rounded-xl object-cover border border-gold/20 shadow-sm" />
                    </td>
                    <td className="p-4 font-bold text-text-main max-w-[200px] truncate">{product?.name || 'Chưa cập nhật'}</td>
                    <td className="p-4">
                       <span className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold-dark rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          {product?.ethnic || 'Khác'}
                       </span>
                    </td>
                    <td className="p-4 font-black text-primary whitespace-nowrap">{(Number(product?.price) || 0).toLocaleString('vi-VN')} đ</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(product)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"><span className="material-symbols-outlined text-lg">edit</span></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"><span className="material-symbols-outlined text-lg">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-display">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up relative z-10 max-h-[90vh] flex flex-col border-4 border-gold/20">
            <div className="p-5 md:p-6 border-b border-gold/10 flex justify-between items-center bg-background-light shrink-0">
              <h2 className="text-lg md:text-xl font-black text-text-main uppercase tracking-tight">{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-soft hover:text-red-500 bg-white size-8 flex items-center justify-center rounded-full shadow-sm border border-gold/10 transition-colors"><span className="material-symbols-outlined text-xl">close</span></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 md:p-6 space-y-4 md:space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-text-soft uppercase tracking-widest mb-1.5">Tên sản phẩm</label>
                    <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gold/20 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold text-text-main transition-all shadow-sm" placeholder="Nhập tên..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-soft uppercase tracking-widest mb-1.5">Dân tộc</label>
                    <input required type="text" value={formData.ethnic || ''} onChange={e => setFormData({...formData, ethnic: e.target.value})} className="w-full border border-gold/20 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold text-text-main transition-all shadow-sm" placeholder="VD: Mông, Thái..." />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-text-soft uppercase tracking-widest mb-1.5">Giá (VNĐ)</label>
                    <input required type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gold/20 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-black text-primary transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-soft uppercase tracking-widest mb-1.5">Số lượng</label>
                    <input required type="number" min="0" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border border-gold/20 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold text-text-main transition-all shadow-sm" placeholder="Nhập số lượng..." />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-text-soft uppercase tracking-widest mb-1.5">Link Ảnh (URL)</label>
                    <input required type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-gold/20 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-text-main transition-all shadow-sm" placeholder="/pictures-sanpham/..." />
                  </div>
                </div>
                
                {formData.image && (
                  <div className="mt-2 h-24 sm:h-32 w-full rounded-xl border border-gold/20 overflow-hidden bg-background-light">
                     <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x200?text=L%E1%BB%97i+%E1%BA%A3nh')} />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-text-soft uppercase tracking-widest mb-1.5">Câu chuyện / Mô tả</label>
                  <textarea required rows={4} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gold/20 bg-white rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-text-main transition-all shadow-sm resize-none"></textarea>
                </div>
              </div>

              <div className="p-5 md:p-6 border-t border-gold/10 bg-white shrink-0 flex justify-end gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gold/20 text-text-main font-bold rounded-xl hover:bg-background-light transition-colors text-xs uppercase tracking-widest">Hủy</button>
                  <button type="submit" className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2">
                     <span className="material-symbols-outlined text-base">save</span>
                     Lưu sản phẩm
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </AdminLayout>
  );
};

export default ProductManagement;
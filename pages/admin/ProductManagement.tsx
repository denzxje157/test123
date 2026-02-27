import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { productService, Product } from '../../services/productService';
import { rawData } from '../Marketplace'; // Import dữ liệu gốc để seed

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', ethnic: '', price: 0, description: '', image: '', category: 'Thủ công'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    }
    setIsLoading(false);
  };

  // Hàm Seed dữ liệu từ Marketplace.tsx vào Supabase
  const handleSeedData = async () => {
    if (!window.confirm('Bạn có chắc muốn nạp dữ liệu mẫu vào Database? Hành động này sẽ thêm nhiều sản phẩm.')) return;
    
    setIsLoading(true);
    try {
      const allItems: any[] = [];
      rawData.forEach(group => {
        group.items.forEach(item => {
          // Chuyển đổi giá từ chuỗi sang số (ước lượng)
          let priceNum = 0;
          const priceMatch = item.p.match(/(\d+)\./); // Lấy số đầu tiên tìm thấy
          if (priceMatch) priceNum = parseInt(priceMatch[1]) * 1000;

          allItems.push({
            name: item.n,
            ethnic: group.e,
            price: priceNum || 100000, // Mặc định nếu không parse được
            price_display: item.p,
            description: item.d,
            image: item.img,
            category: 'Thủ công'
          });
        });
      });

      await productService.seedProducts(allItems);
      alert('Đã nạp dữ liệu thành công!');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi seed data:', error);
      alert('Lỗi khi nạp dữ liệu. Hãy kiểm tra console.');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Xóa thất bại');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.addProduct(formData as Product);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', ethnic: '', price: 0, description: '', image: '', category: 'Thủ công' });
      fetchProducts();
    } catch (error) {
      alert('Lưu thất bại');
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 mt-1">Tổng số: {products.length} sản phẩm</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSeedData} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors text-sm">
            <span className="material-symbols-outlined align-middle mr-1 text-lg">database</span>
            Nạp dữ liệu mẫu
          </button>
          <button onClick={() => { setEditingProduct(null); setFormData({}); setIsModalOpen(true); }} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-colors shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tên sản phẩm</th>
                <th className="p-4">Dân tộc</th>
                <th className="p-4">Giá (VNĐ)</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chưa có sản phẩm nào. Hãy nạp dữ liệu mẫu.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <img src={product.image} alt={product.name} className="size-12 rounded-lg object-cover border border-gray-200" />
                    </td>
                    <td className="p-4 font-bold text-gray-800">{product.name}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">{product.ethnic}</span></td>
                    <td className="p-4 font-mono text-primary font-bold">{product.price?.toLocaleString()} đ</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800">{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên sản phẩm</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dân tộc</label>
                  <input required type="text" value={formData.ethnic || ''} onChange={e => setFormData({...formData, ethnic: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giá (VNĐ)</label>
                  <input required type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link Ảnh</label>
                  <input required type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả</label>
                <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:brightness-110 shadow-lg">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManagement;

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { contentService, LibraryItem } from '../../services/contentService';

const ContentManagement: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  
  const [formData, setFormData] = useState<Omit<LibraryItem, 'id'>>({
    category: 'architecture',
    ethnic: 'Kinh',
    title: '',
    desc: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await contentService.getLibraryItems();
      setItems(data || []);
    } catch (error) {
      console.error('Lỗi tải bài viết:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await contentService.updateLibraryItem(editingItem.id, formData);
        alert('Cập nhật thành công!');
      } else {
        await contentService.addLibraryItem(formData);
        alert('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu bài viết!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
      try {
        await contentService.deleteLibraryItem(id);
        fetchItems();
      } catch (error) {
        alert('Lỗi khi xóa bài viết!');
      }
    }
  };

  const openEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category || 'architecture',
      ethnic: item.ethnic || '',
      title: item.title || '',
      desc: item.desc || '',
      content: item.content || '',
      image: item.image || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      category: 'architecture',
      ethnic: 'Kinh',
      title: '',
      desc: '',
      content: '',
      image: ''
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main uppercase tracking-tight">Thư viện Di sản</h1>
          <p className="text-text-soft mt-1 font-medium text-sm md:text-base">Quản lý bài viết: <span className="text-primary font-black">{items.length}</span> bài</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto bg-primary text-white px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:brightness-110 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base md:text-lg">add</span> Thêm bài viết
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">Hình ảnh</th>
                <th className="p-4 whitespace-nowrap">Tiêu đề</th>
                <th className="p-4 whitespace-nowrap">Danh mục</th>
                <th className="p-4 whitespace-nowrap">Dân tộc</th>
                <th className="p-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-soft font-bold">Đang tải dữ liệu...</td></tr>
              ) : items.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-12 text-center text-text-soft">
                      <span className="material-symbols-outlined text-4xl text-gold/30 mb-2 block">library_books</span>
                      <p className="font-bold">Chưa có bài viết nào.</p>
                   </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4 w-24">
                      <img src={item?.image || 'https://placehold.co/200x150'} alt={item?.title || 'Ảnh'} className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg border border-gold/20 shadow-sm" onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x150?text=L%E1%BB%97i+%E1%BA%A3nh')} />
                    </td>
                    <td className="p-4 font-bold text-text-main max-w-[200px] truncate" title={item?.title}>{item?.title || 'Chưa cập nhật'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-md bg-background-light border border-gold/20 text-[10px] font-black uppercase tracking-wider text-text-soft whitespace-nowrap">
                        {item?.category === 'architecture' ? 'Kiến trúc' : item?.category === 'ritual' ? 'Nghi lễ' : item?.category === 'festival' ? 'Lễ hội' : 'Khác'}
                      </span>
                    </td>
                    <td className="p-4 text-xs md:text-sm font-black text-primary uppercase tracking-widest">{item?.ethnic || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100" title="Sửa">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100" title="Xóa">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-display">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-3xl flex flex-col max-h-[90vh] relative z-10 shadow-2xl animate-scale-up border-4 border-gold/20 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gold/10 flex justify-between items-center bg-background-light shrink-0">
              <h3 className="text-lg md:text-xl font-black uppercase text-text-main tracking-tight">{editingItem ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-soft hover:text-red-500 bg-white size-8 flex items-center justify-center rounded-full shadow-sm border border-gold/10 transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4 md:space-y-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-soft tracking-widest mb-1.5">Danh mục</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full p-3 rounded-xl border border-gold/20 bg-white focus:border-primary outline-none font-bold text-text-main shadow-sm transition-colors cursor-pointer"
                  >
                    <option value="architecture">Kiến trúc</option>
                    <option value="ritual">Nghi lễ</option>
                    <option value="festival">Lễ hội</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-text-soft tracking-widest mb-1.5">Dân tộc</label>
                  <input 
                    type="text" 
                    required
                    value={formData.ethnic} 
                    onChange={e => setFormData({...formData, ethnic: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gold/20 bg-white focus:border-primary outline-none font-bold text-text-main shadow-sm transition-colors"
                    placeholder="Ví dụ: Kinh, Thái, Mường..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-text-soft tracking-widest mb-1.5">Tiêu đề</label>
                <input 
                  type="text" 
                  required
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 md:p-4 rounded-xl border border-gold/20 bg-white focus:border-primary outline-none font-black text-primary shadow-sm transition-colors text-sm md:text-base"
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-text-soft tracking-widest mb-1.5">Mô tả ngắn</label>
                <textarea 
                  required
                  value={formData.desc} 
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold/20 bg-white focus:border-primary outline-none h-20 font-medium shadow-sm transition-colors resize-none"
                  placeholder="Mô tả ngắn gọn về di sản..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-text-soft tracking-widest mb-1.5">Nội dung chi tiết</label>
                <textarea 
                  required
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full p-4 rounded-xl border border-gold/20 bg-white focus:border-primary outline-none h-40 md:h-56 font-medium shadow-sm transition-colors resize-none leading-relaxed"
                  placeholder="Nội dung chi tiết..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-text-soft tracking-widest mb-1.5">Link Hình ảnh</label>
                <input 
                  type="text" 
                  required
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold/20 bg-white focus:border-primary outline-none font-medium shadow-sm transition-colors"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-3 h-32 md:h-48 w-full object-cover rounded-xl border border-gold/20 overflow-hidden bg-background-light shadow-inner">
                     <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=L%E1%BB%97i+%E1%BA%A3nh')} />
                  </div>
                )}
              </div>
            </form>
            
            <div className="p-5 md:p-6 border-t border-gold/10 bg-white shrink-0 flex justify-end gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gold/20 text-text-main font-bold rounded-xl hover:bg-background-light transition-colors text-xs uppercase tracking-widest">Hủy</button>
                <button type="submit" className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2">
                   <span className="material-symbols-outlined text-base">publish</span>
                   {editingItem ? 'Lưu thay đổi' : 'Đăng bài'}
                </button>
            </div>
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

export default ContentManagement;
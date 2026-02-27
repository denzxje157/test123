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
    const data = await contentService.getLibraryItems();
    setItems(data);
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
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      await contentService.deleteLibraryItem(id);
      fetchItems();
    }
  };

  const openEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      ethnic: item.ethnic,
      title: item.title,
      desc: item.desc,
      content: item.content,
      image: item.image
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Quản lý Thư viện Di sản</h1>
          <p className="text-text-soft mt-1 font-medium">Đăng tải và chỉnh sửa các bài viết văn hóa.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:brightness-110 shadow-lg flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span> Thêm bài viết
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background-light text-text-soft text-xs uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tiêu đề</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Dân tộc</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-soft">Đang tải dữ liệu...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-soft">Chưa có bài viết nào.</td></tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-background-light transition-colors group">
                    <td className="p-4">
                      <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-lg border border-gold/10" />
                    </td>
                    <td className="p-4 font-bold text-text-main max-w-xs truncate">{item.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-gray-100 text-xs font-bold uppercase text-text-soft border border-gray-200">
                        {item.category === 'architecture' ? 'Kiến trúc' : item.category === 'ritual' ? 'Nghi lễ' : 'Lễ hội'}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-primary">{item.ethnic}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gold/10 flex justify-between items-center sticky top-0 bg-white z-20">
              <h3 className="text-xl font-black uppercase text-text-main">{editingItem ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-soft hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-soft mb-1">Danh mục</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full p-3 rounded-xl border border-gold/20 bg-background-light focus:border-primary outline-none"
                  >
                    <option value="architecture">Kiến trúc</option>
                    <option value="ritual">Nghi lễ</option>
                    <option value="festival">Lễ hội</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-text-soft mb-1">Dân tộc</label>
                  <input 
                    type="text" 
                    required
                    value={formData.ethnic} 
                    onChange={e => setFormData({...formData, ethnic: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gold/20 bg-background-light focus:border-primary outline-none"
                    placeholder="Ví dụ: Kinh, Thái, Mường..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-soft mb-1">Tiêu đề</label>
                <input 
                  type="text" 
                  required
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold/20 bg-background-light focus:border-primary outline-none font-bold"
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-soft mb-1">Mô tả ngắn</label>
                <textarea 
                  required
                  value={formData.desc} 
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold/20 bg-background-light focus:border-primary outline-none h-20"
                  placeholder="Mô tả ngắn gọn về di sản..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-soft mb-1">Nội dung chi tiết</label>
                <textarea 
                  required
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold/20 bg-background-light focus:border-primary outline-none h-40"
                  placeholder="Nội dung chi tiết..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-soft mb-1">Link Hình ảnh</label>
                <input 
                  type="text" 
                  required
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gold/20 bg-background-light focus:border-primary outline-none"
                  placeholder="https://..."
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-gold/10" />
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gold/20 font-bold text-text-soft hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:brightness-110 shadow-lg">
                  {editingItem ? 'Lưu thay đổi' : 'Đăng bài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentManagement;

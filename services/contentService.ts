import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface LibraryItem {
  id: string;
  category: 'architecture' | 'ritual' | 'festival';
  ethnic: string;
  title: string;
  desc: string;
  content: string;
  image: string;
}

// Dữ liệu mẫu ban đầu (Fallback)
const INITIAL_LIBRARY_DATA: LibraryItem[] = [
  { id: 'arch-kinh-dinh', category: 'architecture', ethnic: 'Kinh', title: 'Đình Làng Việt', desc: 'Biểu tượng quyền lực làng xã và tâm linh.', content: "Đình làng là công trình kiến trúc lớn nhất, quan trọng nhất của làng người Việt ở Bắc Bộ...", image: 'https://ltlskt-dhxd.com/wp-content/uploads/2019/03/4.png?w=840' },
  { id: 'arch-cham-thap', category: 'architecture', ethnic: 'Chăm', title: 'Tháp Chăm (Kalan)', desc: 'Đỉnh cao kỹ thuật xây gạch không mạch.', content: "Kalan là đền thờ các vị thần Hindu...", image: 'https://fvgtravel.com.vn/uploads/up/root/editor/2025/05/20/19/33/w1230/tha1747722808_5733.jpg' },
  { id: 'fes-kinh-tet', category: 'festival', ethnic: 'Kinh', title: 'Tết Nguyên Đán', desc: 'Lễ hội lớn nhất.', content: "Tết Nguyên Đán là dịp đoàn viên...", image: 'https://media.vov.vn/sites/default/files/styles/large/public/2021-02/banh_chung_tet_0.jpg' },
  // ... (Có thể thêm nhiều hơn nếu cần, nhưng để gọn ta dùng ít mẫu)
];

const LOCAL_STORAGE_KEY = 'sacviet_library';

export const contentService = {
  // Lấy tất cả bài viết thư viện
  getLibraryItems: async (): Promise<LibraryItem[]> => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) {
        // Nếu chưa có, lưu dữ liệu mẫu vào localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LIBRARY_DATA));
        return INITIAL_LIBRARY_DATA;
      }
      return JSON.parse(saved);
    }

    const { data, error } = await supabase
      .from('library')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('Lỗi Supabase, dùng fallback:', error);
      return INITIAL_LIBRARY_DATA;
    }
    return data || [];
  },

  // Thêm bài viết mới
  addLibraryItem: async (item: Omit<LibraryItem, 'id'>) => {
    const newItem = { ...item, id: `lib-${Date.now()}` };

    if (!isSupabaseConfigured) {
      const items = await contentService.getLibraryItems();
      const updatedItems = [newItem, ...items];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
      return newItem;
    }

    const { data, error } = await supabase
      .from('library')
      .insert([newItem])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cập nhật bài viết
  updateLibraryItem: async (id: string, updates: Partial<LibraryItem>) => {
    if (!isSupabaseConfigured) {
      const items = await contentService.getLibraryItems();
      const updatedItems = items.map(i => i.id === id ? { ...i, ...updates } : i);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
      return;
    }

    const { error } = await supabase
      .from('library')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  // Xóa bài viết
  deleteLibraryItem: async (id: string) => {
    if (!isSupabaseConfigured) {
      const items = await contentService.getLibraryItems();
      const updatedItems = items.filter(i => i.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
      return;
    }

    const { error } = await supabase
      .from('library')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

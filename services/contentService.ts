import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface LibraryItem {
  id: string;
  category: 'architecture' | 'ritual' | 'festival' | string;
  ethnic: string;
  title: string;
  desc: string;
  content: string;
  image: string;
  created_at?: string;
}

// Hàm trợ giúp lấy ID dân tộc
const getDanTocId = async (tenDanToc: string) => {
  if (!tenDanToc || tenDanToc === 'Khác' || tenDanToc === 'TẤT CẢ') return null;
  try {
    const { data } = await supabase
      .from('dan_toc')
      .select('id')
      .ilike('ten_dan_toc', `%${tenDanToc}%`)
      .limit(1)
      .single();
    return data?.id || null;
  } catch {
    return null;
  }
};

export const contentService = {
  // Lấy dữ liệu Thư viện
  getLibraryItems: async (): Promise<LibraryItem[]> => {
    if (!isSupabaseConfigured) return [];
    
    const { data, error } = await supabase
      .from('thu_vien')
      .select('*, dan_toc(ten_dan_toc)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Lỗi tải thư viện:', error);
      return [];
    }
    
    // Dịch từ Tiếng Việt (Database) sang Tiếng Anh (Giao diện)
    return (data || []).map(item => ({
      id: item.id,
      category: item.danh_muc || 'architecture',
      ethnic: item.dan_toc?.ten_dan_toc || 'Khác',
      title: item.tieu_de || 'Chưa có tiêu đề',
      desc: item.mo_ta_ngan || '',
      content: item.noi_dung || '',
      image: item.anh_thu_vien || '',
      created_at: item.created_at
    }));
  },

  // Thêm bài viết mới
  addLibraryItem: async (item: Omit<LibraryItem, 'id' | 'created_at'>) => {
    const dtId = await getDanTocId(item.ethnic);
    
    // Dịch từ Tiếng Anh (Giao diện) sang Tiếng Việt (Database)
    const payload = {
      danh_muc: item.category,
      tieu_de: item.title,
      mo_ta_ngan: item.desc,
      noi_dung: item.content,
      anh_thu_vien: item.image,
      id_dan_toc: dtId
    };

    const { data, error } = await supabase.from('thu_vien').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  // Cập nhật bài viết
  updateLibraryItem: async (id: string, updates: Partial<LibraryItem>) => {
    let dtId = undefined;
    if (updates.ethnic) dtId = await getDanTocId(updates.ethnic);

    const payload: any = {};
    if (updates.category) payload.danh_muc = updates.category;
    if (updates.title) payload.tieu_de = updates.title;
    if (updates.desc) payload.mo_ta_ngan = updates.desc;
    if (updates.content) payload.noi_dung = updates.content;
    if (updates.image) payload.anh_thu_vien = updates.image;
    if (dtId !== undefined) payload.id_dan_toc = dtId;

    const { error } = await supabase.from('thu_vien').update(payload).eq('id', id);
    if (error) throw error;
  },

  // Xóa bài viết
  deleteLibraryItem: async (id: string) => {
    const { error } = await supabase.from('thu_vien').delete().eq('id', id);
    if (error) throw error;
  },

  // Nạp dữ liệu mẫu cho Thư viện
  seedLibraryItems: async (items: any[]) => {
    if (!isSupabaseConfigured) return;
    const { data: danTocList } = await supabase.from('dan_toc').select('id, ten_dan_toc');
    
    const payloads = items.map(i => {
      const dt = danTocList?.find(d => i.ethnic && d.ten_dan_toc.toLowerCase().includes(i.ethnic.toLowerCase()));
      return {
        danh_muc: i.category,
        tieu_de: i.title,
        mo_ta_ngan: i.desc,
        noi_dung: i.content,
        anh_thu_vien: i.image,
        id_dan_toc: dt?.id || null
      };
    });

    const { error } = await supabase.from('thu_vien').insert(payloads);
    if (error) throw error;
  }
};
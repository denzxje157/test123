import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface LibraryItem {
  id: string;
  category: string;
  ethnic: string;
  title: string;
  desc: string;
  content: string;
  image: string;
  created_at?: string;
}

const SUPABASE_STORAGE_URL = 'https://cazllsidgvysyxbvrftq.supabase.co/storage/v1/object/public/images-sacviet/';

const fixImagePath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return SUPABASE_STORAGE_URL + cleanPath;
};

const getDanTocId = async (tenDanToc: string) => {
  if (!tenDanToc || tenDanToc === 'Khác' || tenDanToc === 'TẤT CẢ') return null;
  try {
    const { data } = await supabase.from('dan_toc').select('id').ilike('ten_dan_toc', `%${tenDanToc}%`).limit(1).single();
    return data?.id || null;
  } catch {
    return null;
  }
};

export const contentService = {
  getLibraryItems: async (): Promise<LibraryItem[]> => {
    if (!isSupabaseConfigured) return [];
    
    try {
        const { data, error } = await supabase
          .from('thu_vien')
          .select('*, dan_toc(ten_dan_toc)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return (data || []).map(item => {
           // 🛑 CHỐT CHẶN: Ép chuẩn từ khóa để khớp 100% với 3 Tab trên giao diện
           let cat = String(item.danh_muc || '').toLowerCase().trim();
           let finalCat = 'architecture'; // Mặc định là Kiến trúc
           if (cat.includes('ritual') || cat === 'nghi lễ') finalCat = 'ritual';
           if (cat.includes('festival') || cat === 'lễ hội') finalCat = 'festival';

           return {
              id: item.id,
              category: finalCat,
              ethnic: item.dan_toc?.ten_dan_toc || 'Khác',
              title: item.tieu_de || 'Chưa có tiêu đề',
              desc: item.mo_ta_ngan || '',
              content: item.noi_dung || '',
              image: fixImagePath(item.anh_thu_vien),
              created_at: item.created_at
           };
        });
    } catch (error) {
        console.error("Lỗi tải thư viện:", error);
        return [];
    }
  },

  addLibraryItem: async (item: Omit<LibraryItem, 'id' | 'created_at'>) => {
    const dtId = await getDanTocId(item.ethnic);
    const payload = { danh_muc: item.category, tieu_de: item.title, mo_ta_ngan: item.desc, noi_dung: item.content, anh_thu_vien: fixImagePath(item.image), id_dan_toc: dtId };
    const { data, error } = await supabase.from('thu_vien').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  updateLibraryItem: async (id: string, updates: Partial<LibraryItem>) => {
    let dtId = undefined;
    if (updates.ethnic) dtId = await getDanTocId(updates.ethnic);
    const payload: any = {};
    if (updates.category) payload.danh_muc = updates.category;
    if (updates.title) payload.tieu_de = updates.title;
    if (updates.desc) payload.mo_ta_ngan = updates.desc;
    if (updates.content) payload.noi_dung = updates.content;
    if (updates.image) payload.anh_thu_vien = fixImagePath(updates.image);
    if (dtId !== undefined) payload.id_dan_toc = dtId;
    const { error } = await supabase.from('thu_vien').update(payload).eq('id', id);
    if (error) throw error;
  },

  deleteLibraryItem: async (id: string) => {
    const { error } = await supabase.from('thu_vien').delete().eq('id', id);
    if (error) throw error;
  },

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
        anh_thu_vien: fixImagePath(i.image),
        id_dan_toc: dt?.id || null
      };
    });
    const { error } = await supabase.from('thu_vien').insert(payloads);
    if (error) throw error;
  }
};
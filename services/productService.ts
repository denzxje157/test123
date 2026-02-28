import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface Product {
  id: string;
  name: string;
  ethnic: string;
  price: number; 
  price_display: string; 
  description: string;
  image: string;
  category: string;
  created_at?: string;
}

// 🎯 ĐÂY LÀ ĐỊA CHỈ KHO ẢNH SUPABASE CỦA BẠN
const SUPABASE_STORAGE_URL = 'https://cazllsidgvysyxbvrftq.supabase.co/storage/v1/object/public/images-sacviet/';

// 💡 HÀM MA THUẬT: Tự động biến đường dẫn ngắn thành đường dẫn Cloud
const fixImagePath = (path: string) => {
  if (!path) return '';
  // Nếu đã là link web (http) thì giữ nguyên
  if (path.startsWith('http')) return path;
  
  // Cắt bỏ dấu '/' ở đầu nếu có để ghép chuỗi cho chuẩn
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Ghép gốc URL của Supabase Storage với đường dẫn ảnh
  return SUPABASE_STORAGE_URL + cleanPath;
};

export const productService = {
  // 1. LẤY SẢN PHẨM
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.from('san_pham').select('*, dan_toc(ten_dan_toc)').order('created_at', { ascending: false });
    if (error) return [];
    
    return (data || []).map(p => ({
      id: p.id,
      name: p.ten_san_pham || 'Sản phẩm mới',
      ethnic: p.dan_toc?.ten_dan_toc || 'Khác',
      price: parseInt(String(p.gia || '0').replace(/\D/g, '')) || 0,
      price_display: String(p.gia || 'Liên hệ'),
      description: p.mo_ta || '',
      image: fixImagePath(p.anh_san_pham), // 👈 Tự sửa lỗi lấy ảnh
      category: 'Thủ công',
      created_at: p.created_at
    }));
  },

  // 2. CỨU HỘ BẢNG DÂN TỘC
  // 2. CỨU HỘ BẢNG DÂN TỘC
  seedDanToc: async (ethnicData: any[]) => {
    if (!isSupabaseConfigured) return;
    const payloads = ethnicData.map(e => ({
      ten_dan_toc: e.name,
      dia_ban: e.location,
      dan_so: e.population,
      // 👇 CHÌA KHÓA LÀ ĐÂY: Ép nó thành mảng JSON chuẩn để Home.tsx đọc không bị sặc!
      toa_do: JSON.stringify(e.coords), 
      mo_ta: e.description,
      di_san: e.heritage,
      anh_dai_dien: fixImagePath(e.img)
    }));
    await supabase.from('dan_toc').insert(payloads);
  },

  // 3. NẠP DỮ LIỆU SẢN PHẨM
  seedProducts: async (products: any[]) => {
    if (!isSupabaseConfigured) return;
    const { data: danTocList } = await supabase.from('dan_toc').select('id, ten_dan_toc');
    
    const payloads = products.map(p => {
      const dt = danTocList?.find(d => p.ethnic && d.ten_dan_toc.toLowerCase().includes(p.ethnic.toLowerCase()));
      return {
        ten_san_pham: p.name,
        gia: p.price_display || `${(p.price || 0).toLocaleString('vi-VN')} đ`,
        mo_ta: p.description || '',
        anh_san_pham: fixImagePath(p.image), // 👈 Tự sửa link ảnh sản phẩm
        id_dan_toc: dt?.id || null
      };
    });
    const { error } = await supabase.from('san_pham').insert(payloads);
    if (error) throw error;
  },

  // 4. THÊM SẢN PHẨM MỚI
  addProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
    const { data: dtData } = await supabase.from('dan_toc').select('id').ilike('ten_dan_toc', `%${product.ethnic}%`).limit(1).single();
    const payload = {
      ten_san_pham: product.name,
      gia: product.price_display || `${product.price.toLocaleString('vi-VN')} đ`,
      mo_ta: product.description,
      anh_san_pham: fixImagePath(product.image),
      id_dan_toc: dtData?.id || null
    };
    const { data, error } = await supabase.from('san_pham').insert([payload]).select();
    if (error) throw error;
    return data;
  },

  // 5. CẬP NHẬT SẢN PHẨM
  updateProduct: async (id: string, updates: Partial<Product>) => {
    const payload: any = {};
    if (updates.name) payload.ten_san_pham = updates.name;
    if (updates.price_display) payload.gia = updates.price_display;
    if (updates.description) payload.mo_ta = updates.description;
    if (updates.image) payload.anh_san_pham = fixImagePath(updates.image);
    if (updates.ethnic) {
      const { data: dtData } = await supabase.from('dan_toc').select('id').ilike('ten_dan_toc', `%${updates.ethnic}%`).limit(1).single();
      if (dtData) payload.id_dan_toc = dtData.id;
    }
    const { data, error } = await supabase.from('san_pham').update(payload).eq('id', id).select();
    if (error) throw error;
    return data;
  },
  
  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('san_pham').delete().eq('id', id);
    if (error) throw error;
  }
};
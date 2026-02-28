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

// 💡 HÀM TRỢ GIÚP: Tìm ID của dân tộc dựa vào tên (VD: "Thái" -> lấy ID của dân tộc Thái)
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
  } catch (error) {
    return null;
  }
};

export const productService = {
  // 1. LẤY TOÀN BỘ SẢN PHẨM
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured) return [];
    
    const { data, error } = await supabase
      .from('san_pham')
      .select('*, dan_toc(ten_dan_toc)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      throw error;
    }
    
    // Ép kiểu dữ liệu từ DB (Tiếng Việt) sang chuẩn UI (Tiếng Anh) để không phải sửa Code giao diện
    return (data || []).map(p => {
      const giaStr = String(p.gia || '0');
      const numericPrice = parseInt(giaStr.replace(/\D/g, '')) || 0;

      return {
        id: p.id,
        name: p.ten_san_pham || 'Sản phẩm chưa có tên',
        ethnic: p.dan_toc?.ten_dan_toc || 'Khác',
        price: numericPrice,
        price_display: p.gia || 'Liên hệ',
        description: p.mo_ta || '',
        image: p.anh_san_pham || '',
        category: 'Thủ công',
        created_at: p.created_at
      };
    });
  },

  // 2. THÊM SẢN PHẨM MỚI
  addProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured) throw new Error("Chưa kết nối Supabase");

    const dtId = await getDanTocId(product.ethnic);

    const payload = {
      ten_san_pham: product.name,
      gia: product.price_display || `${product.price.toLocaleString('vi-VN')} đ`,
      mo_ta: product.description,
      anh_san_pham: product.image,
      id_dan_toc: dtId 
    };

    const { data, error } = await supabase.from('san_pham').insert([payload]).select();
    if (error) throw error;
    return data;
  },

  // 3. CẬP NHẬT SẢN PHẨM
  updateProduct: async (id: string, updates: Partial<Product>) => {
    if (!isSupabaseConfigured) throw new Error("Chưa kết nối Supabase");

    let dtId = undefined;
    if (updates.ethnic) {
      dtId = await getDanTocId(updates.ethnic);
    }

    const payload: any = {};
    if (updates.name !== undefined) payload.ten_san_pham = updates.name;
    if (updates.price_display !== undefined) payload.gia = updates.price_display;
    if (updates.description !== undefined) payload.mo_ta = updates.description;
    if (updates.image !== undefined) payload.anh_san_pham = updates.image;
    if (dtId !== undefined) payload.id_dan_toc = dtId;

    const { data, error } = await supabase.from('san_pham').update(payload).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  // 4. XÓA SẢN PHẨM
  deleteProduct: async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('san_pham').delete().eq('id', id);
    if (error) throw error;
  },

  // 5. NẠP DỮ LIỆU MẪU (Seed)
  seedProducts: async (products: any[]) => {
    if (!isSupabaseConfigured) throw new Error("Chưa kết nối Supabase");
    
    // Xử lý nạp hàng loạt
    const payloads = await Promise.all(products.map(async (p) => {
       const dtId = await getDanTocId(p.ethnic);
       return {
         ten_san_pham: p.name,
         gia: p.price_display || (p.price ? `${p.price.toLocaleString('vi-VN')} đ` : 'Liên hệ'),
         mo_ta: p.description || '',
         anh_san_pham: p.image || '',
         id_dan_toc: dtId
       };
    }));

    const { error } = await supabase.from('san_pham').insert(payloads);
    if (error) throw error;
  },

  getProductsByEthnic: async () => { return []; }
};
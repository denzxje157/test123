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

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('san_pham')
      .select('*, dan_toc(ten_dan_toc)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(p => ({
      id: p.id,
      name: p.ten_san_pham || 'Sản phẩm không tên',
      ethnic: p.dan_toc?.ten_dan_toc || 'Khác',
      price: parseInt(String(p.gia || '0').replace(/\D/g, '')) || 0,
      price_display: p.gia || 'Liên hệ',
      description: p.mo_ta || '',
      image: p.anh_san_pham || '',
      category: 'Thủ công',
      created_at: p.created_at
    }));
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('san_pham').delete().eq('id', id);
    if (error) throw error;
  },

  seedProducts: async (products: any[]) => {
    const { data: danTocList } = await supabase.from('dan_toc').select('id, ten_dan_toc');
    const payloads = products.map(p => {
      const dt = danTocList?.find(d => d.ten_dan_toc.includes(p.ethnic));
      return {
        ten_san_pham: p.name,
        gia: p.price_display || `${p.price?.toLocaleString('vi-VN')} đ`,
        mo_ta: p.description || '',
        anh_san_pham: p.image || '',
        id_dan_toc: dt?.id || null
      };
    });
    const { error } = await supabase.from('san_pham').insert(payloads);
    if (error) throw error;
  }
};
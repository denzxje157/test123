import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface Product {
  id: string;
  name: string;
  ethnic: string;
  price: number; // Lưu dưới dạng số để tính toán
  price_display: string; // Lưu chuỗi hiển thị gốc (VD: "50.000 - 150.000 VNĐ") nếu cần, hoặc format từ price
  description: string;
  image: string;
  category: string;
  created_at?: string;
}

const LOCAL_STORAGE_KEY = 'sacnoi_products';

export const productService = {
  // Lấy toàn bộ sản phẩm
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Lấy sản phẩm theo dân tộc
  getProductsByEthnic: async (ethnic: string): Promise<Product[]> => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const products: Product[] = saved ? JSON.parse(saved) : [];
      return products.filter(p => p.ethnic === ethnic);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('ethnic', ethnic);
    
    if (error) throw error;
    return data || [];
  },

  // Thêm sản phẩm mới
  addProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const products: Product[] = saved ? JSON.parse(saved) : [];
      const newProduct = { ...product, id: Date.now().toString(), created_at: new Date().toISOString() };
      products.unshift(newProduct);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      return [newProduct];
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) throw error;
    return data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: string, updates: Partial<Product>) => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      let products: Product[] = saved ? JSON.parse(saved) : [];
      products = products.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      return products.find(p => p.id === id);
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id: string) => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      let products: Product[] = saved ? JSON.parse(saved) : [];
      products = products.filter(p => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      return;
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Seed dữ liệu mẫu (Chỉ dùng 1 lần)
  seedProducts: async (products: any[]) => {
    if (!isSupabaseConfigured) {
      // Trong chế độ local, ta chỉ cần lưu đè mảng mới vào
      const productsWithIds = products.map((p, index) => ({
        ...p,
        id: `seed-${Date.now()}-${index}`,
        created_at: new Date().toISOString()
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productsWithIds));
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert(products);
    if (error) throw error;
  }
};

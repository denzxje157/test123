import { supabase } from './supabaseClient';

export interface CommunityPost {
  id?: string;
  author_name: string;
  author_avatar: string;
  content: string;
  image_url?: string;
  location?: string;
  likes?: number;
  created_at?: string;
}

export const communityService = {
  // Lấy danh sách bài viết
  getPosts: async (): Promise<CommunityPost[]> => {
    const { data, error } = await supabase
      .from('bai_viet')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Lỗi tải bài viết:", error);
      return [];
    }
    return data || [];
  },

  // Đăng bài mới
  createPost: async (post: CommunityPost) => {
    const { data, error } = await supabase
      .from('bai_viet')
      .insert([post])
      .select();
      
    if (error) throw error;
    return data[0];
  },

  // Xóa bài viết
  deletePost: async (id: string) => {
    const { error } = await supabase
      .from('bai_viet')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
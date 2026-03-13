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
      .from('mxh_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Lỗi tải bài viết:", error);
      return [];
    }
    return data || [];
  },

  // Đăng bài mới (ĐÃ FIX LỖI 100%)
  createPost: async (post: CommunityPost) => {
    // Chỉ gửi các trường cần thiết, bỏ qua id để Supabase tự tạo UUID
    const payload = {
      author_name: post.author_name,
      author_avatar: post.author_avatar,
      content: post.content,
      image_url: post.image_url || null,
      location: post.location || 'Cộng đồng Sắc Việt',
      likes: 0
    };

    const { data, error } = await supabase
      .from('mxh_posts')
      .insert([payload])
      .select();
      
    if (error) throw error;
    return data[0];
  },

  // Xóa bài viết
  deletePost: async (id: string) => {
    const { error } = await supabase
      .from('mxh_posts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
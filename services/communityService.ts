import { supabase } from './supabaseClient'; // Chỉnh lại đường dẫn này nếu dự án của bạn để file supabase ở chỗ khác

export const communityService = {
  // 1. LẤY DANH SÁCH BÀI VIẾT (Bao gồm Tác giả, số Like, và Bình luận)
  getPosts: async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        id, 
        content, 
        image_url, 
        location, 
        created_at,
        profiles:user_id (id, full_name, avatar_url),
        post_likes (user_id),
        post_comments (id, content, created_at, profiles:user_id (full_name, avatar_url))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi lấy bài viết:", error);
      throw error;
    }
    return data;
  },

  // 2. ĐĂNG BÀI MỚI
  createPost: async (userId: string, content: string, imageUrl?: string, location?: string) => {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{ user_id: userId, content, image_url: imageUrl, location }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // 3. XÓA BÀI VIẾT
  deletePost: async (postId: string) => {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);
      
    if (error) throw error;
    return true;
  },

  // 4. THẢ TIM HOẶC HỦY TIM
  toggleLike: async (postId: string, userId: string) => {
    // Check xem user này đã like bài này chưa
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Đã like -> Xóa (Bỏ tim)
      await supabase.from('post_likes').delete().eq('id', existingLike.id);
      return false; // Trả về false nghĩa là trạng thái Unliked
    } else {
      // Chưa like -> Thêm mới (Thả tim)
      await supabase.from('post_likes').insert([{ post_id: postId, user_id: userId }]);
      return true; // Trả về true nghĩa là trạng thái Liked
    }
  },

  // 5. THÊM BÌNH LUẬN
  addComment: async (postId: string, userId: string, content: string) => {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([{ post_id: postId, user_id: userId, content }])
      .select('*, profiles:user_id (full_name, avatar_url)')
      .single();
      
    if (error) throw error;
    return data; // Trả về comment vừa tạo kèm thông tin user để hiển thị ngay lập tức
  }
};
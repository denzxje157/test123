import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { seoService, SeoArticle } from '../services/seoService.ts';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<SeoArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const data = await seoService.getArticleBySlug(slug);
        if (data) {
          setArticle(data);
          // Tự động đổi tiêu đề tab trình duyệt cho chuẩn SEO
          document.title = `${data.tieu_de} | Sắc Nối`;
        } else {
          navigate('/blog'); // Nếu đường dẫn sai, đẩy về trang Blog
        }
      } catch (error) {
        console.error('Lỗi tải chi tiết bài viết:', error);
      }
      setIsLoading(false);
    };
    fetchArticle();
  }, [slug, navigate]);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center font-black text-gold">Đang tải bài viết...</div>;
  if (!article) return null;

  return (
    <article className="min-h-screen bg-[#F7F3E9] font-display pb-20">
      {/* Banner Bài viết */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img src={article.anh_bia} alt={article.tieu_de} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-5xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-gold mb-6 text-sm font-bold transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Về trang tin tức
          </Link>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {article.tieu_de}
          </h1>
          <div className="flex items-center gap-4 text-white/90 text-xs md:text-sm font-bold tracking-widest uppercase">
            <span>Tác giả: {article.tac_gia}</span>
            <span>|</span>
            <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Nội dung Bài viết */}
      <div className="max-w-4xl mx-auto bg-white -mt-10 md:-mt-20 relative z-10 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gold/20">
        <div className="text-lg md:text-xl font-bold text-primary italic mb-8 pb-8 border-b border-gold/20 leading-relaxed text-justify">
          {article.mo_ta_ngan}
        </div>
        
        {/* KHU VỰC RENDER HTML CHUẨN SEO */}
        <div 
          className="prose prose-lg max-w-none text-text-main font-medium leading-loose text-justify prose-h2:text-2xl prose-h2:font-black prose-h2:text-primary prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-6 prose-strong:text-primary prose-img:rounded-2xl prose-img:border prose-img:border-gold/20 prose-img:shadow-lg prose-a:text-blue-600 hover:prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.noi_dung }}
        />

        {/* ---------------- VÙNG CHIA SẺ BÀI VIẾT SEO ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gold/20 pt-8 mt-12 gap-4">
          <span className="font-bold text-sm text-text-main uppercase tracking-widest">Chia sẻ bài viết này:</span>
          <div className="flex items-center gap-3">
            
            {/* Nút Share Facebook */}
            <button 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95 flex-1 sm:flex-none"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              Facebook
            </button>

            {/* Nút Copy Link */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết bài viết!');
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-gold/20 text-text-main text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gold/10 transition-all shadow-sm active:scale-95 flex-1 sm:flex-none"
            >
              <span className="material-symbols-outlined text-sm">link</span>
              Copy Link
            </button>
            
          </div>
        </div>
        {/* ---------------- KẾT THÚC VÙNG CHIA SẺ ---------------- */}
        
      </div>
    </article>
  );
};

export default BlogDetail;
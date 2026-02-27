
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { contentService, LibraryItem } from '../services/contentService';

type Category = 'architecture' | 'ritual' | 'festival';

const Library: React.FC = () => {
  const [libraryData, setLibraryData] = useState<LibraryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('architecture');
  const [selectedEthnicFilter, setSelectedEthnicFilter] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12; 
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await contentService.getLibraryItems();
      setLibraryData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedItem) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'auto'; }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedItem]);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, selectedEthnicFilter, searchTerm]);

  const availableEthnics = useMemo(() => {
    const ethnics = new Set(libraryData.map(item => item.ethnic));
    return ['ALL', ...Array.from(ethnics).sort((a, b) => a.localeCompare(b, 'vi'))];
  }, [libraryData]);

  const filteredData = useMemo(() => {
    return libraryData.filter(item => {
      const matchCategory = item.category === activeCategory;
      const matchEthnic = selectedEthnicFilter === 'ALL' || item.ethnic === selectedEthnicFilter;
      const matchSearch = item.ethnic.toLowerCase().includes(searchTerm.toLowerCase()) || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchEthnic && matchSearch;
    });
  }, [libraryData, activeCategory, selectedEthnicFilter, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage, ITEMS_PER_PAGE]);

  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'architecture', icon: 'temple_hindu', label: 'Kiến Trúc' },
    { id: 'ritual', icon: 'self_improvement', label: 'Nghi Lễ' },
    { id: 'festival', icon: 'festival', label: 'Lễ Hội' }
  ];

  return (
    <div className="relative min-h-screen font-display bg-[#F7F3E9]">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-scales.png')" }}></div>

      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-8 lg:py-12 relative z-10">
        <header className="mb-8 lg:mb-12 text-center">
          <div className="flex items-center justify-center gap-4 text-primary font-bold tracking-[0.3em] uppercase text-xs lg:text-sm mb-4">
            <span className="h-px w-8 lg:w-12 bg-primary"></span>Kho Tàng Di Sản Số<span className="h-px w-8 lg:w-12 bg-primary"></span>
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-text-main italic mb-6">Tiếng Vọng <span className="text-gold">Tiền Nhân</span></h2>
          <div className="max-w-md mx-auto relative group z-20 px-4 lg:px-0">
            <input type="text" placeholder="Tìm kiếm di sản..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/80 backdrop-blur-sm border-2 border-gold/20 rounded-full py-3 px-6 pl-12 text-text-main placeholder:text-text-soft/50 focus:outline-none focus:border-primary transition-colors shadow-lg text-sm" />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold group-hover:text-primary transition-colors">search</span>
          </div>
        </header>

        <div className="lg:hidden mb-8 space-y-4 sticky top-20 z-30 bg-[#F7F3E9]/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-gold/10 shadow-sm">
           <div className="flex gap-2 overflow-x-auto custom-scrollbar-h pb-2">
              {categories.map((cat) => (
                 <button key={cat.id} onClick={() => { setActiveCategory(cat.id as Category); setSelectedEthnicFilter('ALL'); }} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${activeCategory === cat.id ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gold/20 text-text-soft hover:bg-gold/10'}`}>
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span><span className="font-black uppercase tracking-widest text-[10px]">{cat.label}</span>
                 </button>
              ))}
           </div>
           
           {/* Thanh lọc Dân tộc có mũi tên điều hướng - ĐÃ CẬP NHẬT GIAO DIỆN NỔI BẬT HƠN */}
           <div className="flex items-center gap-2 group bg-white/50 p-2 rounded-xl border border-gold/10 shadow-inner">
              <button onClick={scrollLeft} className="p-2 bg-gold/10 hover:bg-gold hover:text-white rounded-lg text-gold transition-colors shrink-0 active:scale-95 shadow-sm" aria-label="Cuộn trái">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              
              <div className="flex-1 flex gap-2 overflow-x-auto custom-scrollbar-h py-1 scroll-smooth no-scrollbar" ref={scrollRef}>
                  {availableEthnics.map((ethnic) => (
                    <button key={ethnic} onClick={() => setSelectedEthnicFilter(ethnic)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap border transition-all shrink-0 ${selectedEthnicFilter === ethnic ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gold/20 text-text-soft hover:bg-gold/10'}`}>
                      {ethnic === 'ALL' ? 'Tất cả' : ethnic}
                    </button>
                  ))}
              </div>

              <button onClick={scrollRight} className="p-2 bg-gold/10 hover:bg-gold hover:text-white rounded-lg text-gold transition-colors shrink-0 active:scale-95 shadow-sm" aria-label="Cuộn phải">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-24 z-10">
            <div className="bg-white p-2 rounded-[2rem] border border-gold/20 shadow-xl">
               {categories.map((cat) => (
                 <button key={cat.id} onClick={() => { setActiveCategory(cat.id as Category); setSelectedEthnicFilter('ALL'); }} className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-300 mb-2 last:mb-0 ${activeCategory === cat.id ? 'bg-primary text-white shadow-lg' : 'hover:bg-gold/10 text-text-soft'}`}>
                    <span className={`material-symbols-outlined ${activeCategory === cat.id ? 'text-white' : 'text-primary'}`}>{cat.icon}</span><span className="font-black uppercase tracking-widest text-xs">{cat.label}</span>
                 </button>
               ))}
            </div>
            <div className="bg-white rounded-[2rem] border border-gold/20 shadow-xl overflow-hidden flex flex-col max-h-[60vh]">
               <div className="p-5 border-b border-gold/10 bg-gold/5"><h3 className="font-black uppercase text-xs tracking-[0.2em] text-text-main flex items-center gap-2"><span className="material-symbols-outlined text-base">groups</span>Chọn Dân Tộc</h3></div>
               <div className="overflow-y-auto p-2 custom-scrollbar flex-1">
                 {availableEthnics.map((ethnic) => (
                   <button key={ethnic} onClick={() => setSelectedEthnicFilter(ethnic)} className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all mb-1 flex justify-between items-center ${selectedEthnicFilter === ethnic ? 'bg-text-main text-gold' : 'text-text-soft hover:bg-gold/10'}`}>
                     {ethnic === 'ALL' ? 'Tất cả dân tộc' : `${ethnic}`}
                     {selectedEthnicFilter === ethnic && <span className="size-2 rounded-full bg-gold"></span>}
                   </button>
                 ))}
               </div>
            </div>
          </aside>

          <main className="flex-1 w-full">
             <div className="mb-6 hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <h3 className="text-2xl font-black text-text-main uppercase italic">{activeCategory === 'architecture' && 'Không gian kiến trúc'}{activeCategory === 'ritual' && 'Nghi lễ & Tín ngưỡng'}{activeCategory === 'festival' && 'Lễ hội & Văn hóa'}</h3>
                   {selectedEthnicFilter !== 'ALL' && <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{selectedEthnicFilter}</span>}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-bronze uppercase tracking-widest"><span>{filteredData.length} kết quả</span><span>Trang {currentPage}/{totalPages > 0 ? totalPages : 1}</span></div>
             </div>

            {currentData.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {currentData.map((item) => (
                    <div key={item.id} onClick={() => setSelectedItem(item)} className="group bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-gold/15 shadow-md hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer relative flex flex-col h-[300px] md:h-[400px]">
                      <div className="h-40 md:h-56 overflow-hidden relative shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" loading="lazy" decoding="async" />
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary/90 text-white text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-md z-10">{item.ethnic}</div>
                      </div>
                      <div className="p-3 md:p-6 flex flex-col flex-grow">
                        <h3 className="text-xs md:text-lg font-black text-text-main mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{item.title}</h3>
                        <p className="text-[10px] md:text-xs text-text-soft font-medium line-clamp-2 md:line-clamp-3 mb-2 md:mb-4 leading-relaxed flex-grow opacity-80">{item.desc}</p>
                        <div className="flex items-center justify-between border-t border-gold/10 pt-2 md:pt-4 mt-auto">
                          <span className="text-[8px] md:text-[9px] font-bold text-bronze uppercase tracking-widest group-hover:text-gold transition-colors">Xem chi tiết</span>
                          <div className="size-6 md:size-8 rounded-full bg-gold/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:rotate-45"><span className="material-symbols-outlined text-xs md:text-lg">arrow_outward</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 md:mt-12 flex items-center justify-center gap-2 pb-20 lg:pb-0">
                    <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="size-8 md:size-10 rounded-full flex items-center justify-center border border-gold/20 bg-white text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"><span className="material-symbols-outlined text-base md:text-lg">chevron_left</span></button>
                    <div className="flex gap-1 md:gap-2 mx-2 md:mx-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                         if (page !== 1 && page !== totalPages && Math.abs(currentPage - page) > 1) { if (Math.abs(currentPage - page) === 2) return <span key={page} className="text-gold/50 font-bold self-end text-xs">...</span>; return null; }
                         return <button key={page} onClick={() => handlePageChange(page)} className={`size-8 md:size-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white border border-gold/10 text-text-soft hover:border-gold/50'}`}>{page}</button>;
                      })}
                    </div>
                    <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="size-8 md:size-10 rounded-full flex items-center justify-center border border-gold/20 bg-white text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"><span className="material-symbols-outlined text-base md:text-lg">chevron_right</span></button>
                  </div>
                )}
              </>
            ) : (<div className="text-center py-32 bg-white/50 rounded-[3rem] border-2 border-dashed border-gold/20"><p className="text-text-soft font-bold text-lg">Chưa có dữ liệu.</p></div>)}
          </main>
        </div>

        {selectedItem && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-display">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedItem(null)}></div>
            <div className="bg-white w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-[2rem] shadow-2xl relative z-10 animate-slide-up flex flex-col md:flex-row overflow-hidden border-4 border-gold/20">
               <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white text-text-soft hover:text-red-600 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all active:scale-95 border border-gold/10 group"
               >
                 <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">close</span>
               </button>

               <div className="w-full md:w-[70%] h-1/2 md:h-auto relative shrink-0 group bg-[#F2EFE6] border-b md:border-b-0 md:border-r border-gold/10">
                 <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                 <div className="absolute bottom-4 left-4 md:bottom-10 md:left-16 text-white z-20 max-w-2xl animate-slide-up-content p-2">
                    <div className="inline-block px-3 py-1 bg-gold text-text-main text-[10px] font-black uppercase tracking-widest rounded-full mb-2 shadow-lg border border-white/20">Dân tộc {selectedItem.ethnic}</div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black italic leading-tight mb-2 drop-shadow-lg">{selectedItem.title}</h2>
                 </div>
               </div>

               <div className="w-full md:w-[30%] h-1/2 md:h-auto p-6 md:p-8 bg-white relative flex flex-col">
                 <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 animate-fade-in delay-100 pr-2">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                       <span className="text-xs font-black text-primary uppercase tracking-widest">Chi tiết {selectedItem.category}</span>
                    </div>
                    <div className="prose prose-sm text-text-main font-serif leading-relaxed text-justify">
                       <p className="font-bold text-base italic text-text-soft/90 mb-4 border-l-4 border-gold pl-4 py-1">"{selectedItem.desc}"</p>
                       {selectedItem.content.split('\n').map((paragraph, idx) => (<p key={idx} className="mb-3 text-sm">{paragraph}</p>))}
                    </div>
                 </div>
                 <div className="pt-4 border-t border-gold/10 flex gap-4 shrink-0 mt-2">
                        <button className="flex-1 bg-primary text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gold hover:text-text-main transition-all shadow-xl">Tìm hiểu thêm</button>
                 </div>
               </div>
            </div>
          </div>, document.body
        )}
      </div>
      <style>{`
        .custom-scrollbar-h::-webkit-scrollbar { height: 0px; background: transparent; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up-content { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up-content { animation: slide-up-content 0.6s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A11D1D; border-radius: 10px; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 0px; background: transparent; }
      `}</style>
    </div>
  );
};

export default Library;

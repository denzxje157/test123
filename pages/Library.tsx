import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { contentService } from '../services/contentService';

type Category = 'architecture' | 'ritual' | 'festival';

interface LibraryItem {
  id: string;
  category: Category;
  ethnic: string;
  title: string;
  desc: string;
  content: string;
  image: string;
}

const CATEGORIES = [
  { id: 'architecture', label: 'Kiến trúc' },
  { id: 'ritual', label: 'Nghi lễ' },
  { id: 'festival', label: 'Lễ hội' }
];

const Library: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>([]); 
  const [activeCategory, setActiveCategory] = useState<Category>('architecture');
  const [selectedEthnicFilter, setSelectedEthnicFilter] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLoading(true);
      try {
        // 🚀 CHÌA KHÓA LÀ ĐÂY: Gọi thẳng dữ liệu "Sạch" từ contentService
        const data = await contentService.getLibraryItems();

        if (data && data.length > 0) {
          // LỌC DỮ LIỆU TRÙNG LẶP: Loại bỏ các bài có cùng Tiêu đề và Dân tộc
          const uniqueData = data.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.title === value.title && 
              t.ethnic === value.ethnic
            ))
          );
          
          setItems(uniqueData as LibraryItem[]);
        }
      } catch (err) { 
        console.error("Lỗi lấy dữ liệu:", err); 
      }
      setIsLoading(false);
    };
    fetchLibrary();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedItem]);

  const availableEthnics = useMemo(() => {
    const ethnics = new Set(items.map(item => item.ethnic));
    return ['ALL', ...Array.from(ethnics).sort((a, b) => a.localeCompare(b, 'vi'))];
  }, [items]);

  const filteredData = useMemo(() => {
    return items.filter(item => {
      const matchCategory = item.category === activeCategory;
      const matchEthnic = selectedEthnicFilter === 'ALL' || item.ethnic === selectedEthnicFilter;
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchEthnic && matchSearch;
    });
  }, [items, activeCategory, selectedEthnicFilter, searchTerm]);

  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen font-display bg-[#F7F3E9] overflow-x-hidden">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-8 lg:py-12 relative z-10">
        <header className="mb-8 lg:mb-12 text-center">
          <h2 className="text-4xl lg:text-7xl font-black text-text-main italic mb-6">Tiếng Vọng <span className="text-gold">Tiền Nhân</span></h2>
          
          <div className="max-w-md mx-auto relative group z-20">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gold group-hover:text-primary transition-colors text-xl leading-none">
                search
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm di sản..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-white/80 backdrop-blur-sm border-2 border-gold/20 rounded-full py-3 pl-12 pr-6 text-text-main focus:outline-none focus:border-primary transition-colors shadow-lg text-sm block" 
            />
          </div>
        </header>

        <div className="lg:hidden mb-8 space-y-4">
          <div className="flex overflow-x-auto custom-scrollbar pb-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => { setActiveCategory(cat.id as Category); setSelectedEthnicFilter('ALL'); }} 
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-sm flex-shrink-0 ${
                  activeCategory === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-text-soft border border-gold/20 hover:bg-gold/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <select 
              value={selectedEthnicFilter} 
              onChange={(e) => setSelectedEthnicFilter(e.target.value)}
              className="w-full bg-white border-2 border-gold/20 rounded-xl px-4 py-3 text-sm font-bold text-text-main focus:outline-none focus:border-primary appearance-none shadow-sm"
            >
              {availableEthnics.map(ethnic => (
                <option key={ethnic} value={ethnic}>
                  {ethnic === 'ALL' ? 'Tất cả dân tộc' : `Dân tộc ${ethnic}`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gold">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-24">
            <div className="bg-white p-2 rounded-[2rem] border border-gold/20 shadow-xl">
               {CATEGORIES.map((cat) => (
                 <button 
                   key={cat.id} 
                   onClick={() => { setActiveCategory(cat.id as Category); setSelectedEthnicFilter('ALL'); }} 
                   className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] mb-2 last:mb-0 transition-all ${activeCategory === cat.id ? 'bg-primary text-white shadow-lg' : 'text-text-soft hover:bg-gold/10'}`}
                 >
                    <span className="font-black uppercase tracking-widest text-xs">{cat.label}</span>
                 </button>
               ))}
            </div>
            <div className="bg-white rounded-[2rem] border border-gold/20 shadow-xl overflow-hidden flex flex-col max-h-[50vh]">
               <div className="p-4 border-b border-gold/10 bg-gold/5 font-black text-xs uppercase text-center">Chọn Dân Tộc</div>
               <div ref={scrollRef} className="overflow-y-auto p-2 custom-scrollbar">
                 {availableEthnics.map((ethnic) => (
                   <button 
                     key={ethnic} 
                     onClick={() => setSelectedEthnicFilter(ethnic)} 
                     className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all mb-1 ${selectedEthnicFilter === ethnic ? 'bg-text-main text-gold' : 'text-text-soft hover:bg-gold/10'}`}
                   >
                     {ethnic === 'ALL' ? 'Tất cả dân tộc' : ethnic}
                   </button>
                 ))}
               </div>
            </div>
          </aside>

          <main className="flex-1 w-full">
            {isLoading ? (
               <div className="text-center py-32 flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-gold font-black uppercase tracking-widest animate-pulse text-sm">Đang tải di sản...</span>
               </div>
            ) : currentData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentData.map((item) => (
                  <div key={item.id} onClick={() => setSelectedItem(item)} className="group bg-white rounded-[2rem] overflow-hidden border border-gold/15 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col h-[380px]">
                    <div className="h-56 overflow-hidden relative shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                      <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-md">
                        {item.ethnic}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col bg-white">
                      <h3 className="text-lg font-black text-text-main mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-text-soft line-clamp-3 opacity-80 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/50 rounded-[3rem] border-2 border-dashed border-gold/20 flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl text-gold/40 mb-4">search_off</span>
                <p className="font-bold text-lg text-text-main">Không tìm thấy di sản phù hợp.</p>
                <p className="text-sm text-text-soft mt-1">Vui lòng thử từ khóa hoặc danh mục khác.</p>
              </div>
            )}
          </main>
        </div>

        {selectedItem && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedItem(null)}></div>
            <div className="bg-white w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-[2rem] shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden border-4 border-gold/30 animate-slide-up">
               <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white size-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white">
                 <span className="material-symbols-outlined">close</span>
               </button>
               
               <div className="w-full md:w-[60%] h-1/2 md:h-auto relative bg-[#F2EFE6] border-b md:border-b-0 md:border-r border-gold/10">
                 <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white max-w-lg pr-4">
                    <div className="inline-block px-4 py-1.5 bg-primary border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg">
                      Dân tộc {selectedItem.ethnic}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic leading-tight drop-shadow-lg">{selectedItem.title}</h2>
                 </div>
               </div>

               <div className="w-full md:w-[40%] h-1/2 md:h-auto flex flex-col bg-white">
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <p className="font-bold text-lg md:text-xl italic text-primary mb-6 border-l-4 border-gold pl-4 py-1">"{selectedItem.desc}"</p>
                    <div className="prose text-sm text-text-main leading-loose font-medium text-justify">
                      {selectedItem.content.split('\n').map((p, i) => (
                        <p key={i} className="mb-4">{p}</p>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>, document.body
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Library;
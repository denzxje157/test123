import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, ZoomControl, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { ethnicData, EthnicGroup } from '../data/mockData.ts'; 
import { supabase } from '../services/supabaseClient.ts'; // ĐÃ THÊM KẾT NỐI SUPABASE

interface Story {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  image: string;
  themeColor: string;
}

const MAP_CENTER: [number, number] = [16.0, 108.0];

// --- HOOKS & UTILS ---
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); };
  }, [threshold]);

  return { ref, isVisible };
};

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-[1000ms] ease-out-expo ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const MapFixer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => { map.invalidateSize(); }, 600);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const ChangeView = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
      map.flyTo(coords, 9, { animate: true, duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

const EthnicButton = React.memo(({ ethnic, index, isSelected, onClick, onHover }: any) => (
  <button
    onMouseEnter={() => onHover(ethnic.name)}
    onMouseLeave={() => onHover(null)}
    onClick={() => onClick(ethnic)}
    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 flex items-center gap-4 group ${
      isSelected 
      ? 'bg-primary border-primary text-white shadow-xl scale-[1.02] z-10' 
      : 'bg-white border-gold/10 text-text-main hover:border-primary/30 shadow-sm hover:translate-x-1'
    }`}
  >
    <div className={`size-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-inner transition-colors duration-300 ${
      isSelected ? 'bg-gold/20 text-gold' : 'bg-primary/5 text-primary'
    }`}>
      {ethnic.name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-black uppercase text-[12px] tracking-tight truncate">{ethnic.name}</h4>
      <p className={`text-[9px] font-bold tracking-widest transition-colors duration-300 ${isSelected ? 'text-gold-light/70' : 'text-bronze'}`}>
        {ethnic.location}
      </p>
    </div>
  </button>
));

const StoryModal = ({ story, onClose }: { story: Story, onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-display">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 animate-slide-up flex overflow-hidden border-4 border-gold/30 flex-col md:flex-row">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 border-2 border-white"
        >
          <span>ĐÓNG CỬA SỔ</span>
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="w-full md:w-[60%] h-1/2 md:h-auto relative bg-[#F2EFE6] group border-b md:border-b-0 md:border-r border-gold/10 shrink-0">
          <img src={story.image} alt={story.title} className="w-full h-full object-cover grayscale-[10%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white max-w-2xl p-2 pr-10">
             <div className="inline-block px-4 py-1.5 bg-primary/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 md:mb-4 border border-white/20 shadow-lg">
               {story.subtitle}
             </div>
             <h2 className="text-2xl md:text-4xl lg:text-5xl font-black italic tracking-tighter leading-tight drop-shadow-lg">
               {story.title}
             </h2>
          </div>
        </div>

        <div className="w-full md:w-[40%] h-1/2 md:h-auto flex flex-col bg-white relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6 md:mb-8 sticky top-0 bg-white pt-2 pb-4 border-b border-gold/10 z-10">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-text-soft">Câu chuyện di sản</span>
             </div>
             <div className="prose prose-sm text-text-main font-serif leading-loose text-justify">
               {story.content.map((paragraph, idx) => (
                  <p key={idx} className="mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'forwards' }}>
                    {paragraph}
                  </p>
               ))}
             </div>
             <div className="mt-8 p-6 bg-background-light rounded-2xl border border-gold/10 text-center">
                <p className="font-serif italic text-primary font-bold text-sm">"Lắng nghe ngàn xưa vọng lại..."</p>
             </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Home: React.FC = () => {
  // STATE CHỨA DANH SÁCH DÂN TỘC (Mặc định lấy từ mockData để phòng hờ)
  const [ethnicList, setEthnicList] = useState<EthnicGroup[]>(ethnicData);
  
  const [selectedEthnic, setSelectedEthnic] = useState<EthnicGroup | null>(null);
  const [hoveredEthnicName, setHoveredEthnicName] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const navigate = useNavigate();
  const mapSectionRef = useRef<HTMLElement>(null);

  // --- LUỒNG KẾT NỐI SUPABASE ---

  useEffect(() => {
    const fetchEthnicData = async () => {
      try {
        // 1. Gọi đúng tên bảng 'dan_toc' trên Supabase
        const { data, error } = await supabase
          .from('dan_toc')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // 2. "Dịch" các cột tiếng Việt sang cấu trúc tiếng Anh mà giao diện cần
          const mappedData = data.map((item: any) => ({
            name: item.name || item.ten || item.ten_dan_toc, // Khớp với cột tên dân tộc của bạn
            location: item.location || item.vi_tri || item.dia_ban, 
            population: item.population || item.dan_so,
            // Đảm bảo tọa độ [lat, lng] được parse đúng định dạng mảng
            coords: typeof item.toa_do === 'string' ? JSON.parse(item.toa_do) : item.toa_do, 
            description: item.mo_ta,
            heritage: item.di_san,
            img: item.anh_dai_dien
          }));

          setEthnicList(mappedData);
          console.log("Đã tải thành công dữ liệu từ bảng dan_toc!");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ Supabase:", error);
      }
    };

    fetchEthnicData();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < window.innerHeight * 1.2) setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const createEthnicIcon = useCallback((ethnic: EthnicGroup, isSelected: boolean, isHovered: boolean) => {
    const size = isSelected ? 48 : isHovered ? 40 : 28;
    return L.divIcon({
      className: 'ethnic-marker-container',
      html: `
        <div class="relative flex items-center justify-center transition-all duration-300" style="width:${size}px; height:${size}px;">
          ${isSelected || isHovered ? '<div class="absolute inset-0 bg-gold/40 rounded-full animate-ping"></div>' : ''}
          <div class="absolute inset-0 bg-primary rounded-full border-2 ${isSelected ? 'border-gold scale-110 shadow-2xl' : 'border-white/50 shadow-md'} flex items-center justify-center overflow-hidden">
             <span class="text-white font-black" style="font-size: ${size * 0.4}px;">${ethnic.name.charAt(0)}</span>
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen font-display bg-background-light scroll-smooth overflow-x-hidden">
      {activeStory && <StoryModal story={activeStory} onClose={() => setActiveStory(null)} />}

      <div className="pt-20 px-3 md:px-6 pb-8 bg-background-light min-h-screen">
        <section className="relative h-[65vh] md:h-[75vh] w-full max-w-[1800px] mx-auto rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl bg-text-main mb-8">
          <div className="absolute inset-0 z-0" style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0) scale(${1 + scrollY * 0.0002})` }}>
            <img src="https://cdn.nhandan.vn/assets/web/styles/img/54dantoc/zone-1-1.png" className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Vietnam Heritage" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40"></div>
          </div>
          <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6" style={{ transform: `translate3d(0, ${scrollY * -0.1}px, 0)`, opacity: Math.max(0, 1 - scrollY / 500) }}>
            <RevealSection>
              <h1 className="text-6xl sm:text-8xl lg:text-[12rem] font-black text-gold italic tracking-tighter uppercase leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12">SẮC VIỆT</h1>
              <button onClick={() => navigate('/marketplace')} className="px-10 py-4 border-2 border-white/30 text-white font-black uppercase tracking-widest rounded-[2rem] hover:bg-white hover:text-text-main transition-all active:scale-95 text-xs backdrop-blur-sm">Ghé thăm chợ phiên</button>
            </RevealSection>
          </div>
        </section>

        {/* MISSION SECTION */}
        <section className="relative py-16 max-w-[1800px] mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Sứ mệnh của chúng tôi</h2>
               <h2 className="text-2xl md:text-4xl font-black text-text-main max-w-4xl mx-auto">Chúng tôi kết nối những giá trị truyền thống với hiện đại, bảo tồn bản sắc văn hóa dân tộc.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { icon: 'auto_awesome', title: 'Bảo tồn di sản', desc: 'Lưu giữ kỹ thuật thủ công cổ truyền.' },
                 { icon: 'handshake', title: 'Thương mại công bằng', desc: 'Đảm bảo thu nhập xứng đáng cho nghệ nhân.' },
                 { icon: 'groups', title: 'Kết nối cộng đồng', desc: 'Xây dựng cầu nối tri thức văn hóa.' }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gold/10 shadow-sm hover:shadow-md transition-all">
                    <span className="material-symbols-outlined text-5xl text-bronze mb-6">{item.icon}</span>
                    <h3 className="text-xl font-black text-text-main mb-4">{item.title}</h3>
                    <p className="text-text-soft leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </RevealSection>
        </section>

        {/* MAP SECTION */}
        <section ref={mapSectionRef} className="py-20 border-t border-gold/20">
          <div className="max-w-[1700px] mx-auto px-6">
            <RevealSection>
              <div className="mb-12 text-center lg:text-left lg:px-14">
                <h2 className="text-5xl lg:text-[9rem] font-black text-primary italic uppercase tracking-tighter leading-none mb-6">BẢN ĐỒ <br/><span className="text-text-main block mt-4">54 DÂN TỘC</span></h2>
                <p className="text-bronze font-black uppercase text-[12px] tracking-[0.6em]">Hội tụ và lan tỏa sức mạnh dòng máu Lạc Hồng</p>
              </div>
            </RevealSection>
            
            <div className="flex flex-col lg:flex-row h-[700px] lg:h-[900px] gap-12">
              <div className="flex-1 relative rounded-[3rem] lg:rounded-[5rem] overflow-hidden border-[8px] border-primary/10 shadow-2xl bg-[#e4e9f0] z-0 isolate">
                 <MapContainer center={MAP_CENTER} zoom={6} className="w-full h-full" zoomControl={false} attributionControl={false}>
                    <MapFixer />
                    <TileLayer url="https://mt1.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}" />
                    <ZoomControl position="bottomright" />
                    {selectedEthnic && <ChangeView coords={selectedEthnic.coords} />}
                    
                    {/* ĐÃ THAY BẰNG ETHNICLIST LẤY TỪ DB */}
                    {ethnicList.map((ethnic, idx) => (
                      <Marker 
                        key={`marker-${ethnic.name}-${idx}`} 
                        position={ethnic.coords} 
                        icon={createEthnicIcon(ethnic, selectedEthnic?.name === ethnic.name, hoveredEthnicName === ethnic.name)}
                        eventHandlers={{ click: () => setSelectedEthnic(ethnic) }}
                      >
                        <Tooltip direction="top" offset={[0, -15]} opacity={1}>
                          <div className="px-6 py-2.5 bg-primary text-white border-2 border-gold rounded-full shadow-2xl">
                            <span className="text-[13px] font-black uppercase tracking-widest">{ethnic.name}</span>
                          </div>
                        </Tooltip>
                      </Marker>
                    ))}
                 </MapContainer>
              </div>

              <div className="w-full lg:w-[480px] bg-[#F7F3E9] rounded-[3rem] lg:rounded-[5rem] flex flex-col overflow-hidden border-[8px] border-gold/20 shadow-2xl relative h-[500px] lg:h-auto">
                <div className="p-10 bg-primary shrink-0 text-white"><h2 className="text-3xl font-black italic uppercase">CỘNG ĐỒNG <br/><span className="text-gold">VIỆT NAM</span></h2></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                  {/* ĐÃ THAY BẰNG ETHNICLIST LẤY TỪ DB */}
                  {ethnicList.map((ethnic, idx) => (
                    <EthnicButton 
                      key={`list-${ethnic.name}-${idx}`}
                      ethnic={ethnic}
                      isSelected={selectedEthnic?.name === ethnic.name}
                      onClick={setSelectedEthnic}
                      onHover={setHoveredEthnicName}
                    />
                  ))}
                </div>

                {selectedEthnic && (
                  <div className="absolute inset-0 z-[100] bg-background-light p-8 animate-slide-up-slow flex flex-col overflow-y-auto custom-scrollbar">
                     <button onClick={() => setSelectedEthnic(null)} className="self-end size-14 rounded-full border-2 border-gold/20 flex items-center justify-center bg-white shadow-xl hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined text-3xl">close</span></button>
                     <div className="mt-6 space-y-8 text-left">
                        <div className="rounded-[3rem] overflow-hidden aspect-[4/3] border-[6px] border-white shadow-2xl">
                          {/* ẢNH DÂN TỘC TẠI ĐÂY */}
                          <img src={selectedEthnic.img} alt={selectedEthnic.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-5xl font-black text-text-main italic uppercase leading-none">DÂN TỘC <br/><span className="text-primary">{selectedEthnic.name}</span></h3>
                        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gold/10"><p className="text-text-soft font-bold italic text-lg">"{selectedEthnic.description}"</p></div>
                        <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl border-2 border-gold/40">
                           <p className="text-gold/80 text-[10px] font-black uppercase mb-2 tracking-widest">Sản phẩm tiêu biểu:</p>
                           <p className="font-black italic text-2xl uppercase">{selectedEthnic.heritage}</p>
                        </div>
                        <button onClick={() => navigate(`/marketplace?ethnic=${encodeURIComponent(selectedEthnic.name.toUpperCase())}`)} className="w-full bg-gold py-6 rounded-[2.5rem] font-black text-primary uppercase text-sm tracking-widest shadow-xl active:scale-95 mb-10">VÀO CHỢ PHIÊN</button>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A11D1D; border-radius: 10px; }
        @keyframes slide-up-slow { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up-slow { animation: slide-up-slow 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
        .ethnic-marker-container { background: transparent !important; }
        .ease-out-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
    </div>
  );
};

export const storiesData = [
  { id: 'su-thi-dam-san', title: 'Sử Thi Đam San', subtitle: 'Huyền thoại Ê Đê', themeColor: '#A11D1D', image: 'https://cdn.luatminhkhue.vn/lmk/article/2023/Abt%20(3)(23).png', content: ["Thuở xưa, tù trưởng Đam San mạnh như thần...", "Mặc lời can ngăn...", "Đam San chết đi..."] },
  { id: 'chuyen-tinh-khau-vai', title: 'Lời Thề Khâu Vai', subtitle: 'Hà Giang - Mèo Vạc', themeColor: '#3E1C1C', image: 'https://image.vovworld.vn/w500/uploaded/vovworld/rdywf/2020_01_25/chuong_1__arts_yogq.png', content: ["Ngày xưa...", "Nhìn xuống bản làng...", "Từ đó, Chợ Tình Khâu Vai ra đời."] },
  { id: 'su-tich-trau-cau', title: 'Sự Tích Trầu Cau', subtitle: 'Văn hóa người Kinh', themeColor: '#D4AF37', image: 'https://sachhoc.com/image/cache/catalog/Truyen/Truyen-tranh/Su-tich-trau-cau-500x554.jpg', content: ["Vào đời vua Hùng...", "Tân đi tìm em...", "Vua Hùng đi qua..."] }
];

export default Home;
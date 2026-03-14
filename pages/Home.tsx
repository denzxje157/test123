import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, ZoomControl, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { ethnicData, EthnicGroup } from '../data/mockData.ts'; 
import { supabase } from '../services/supabaseClient.ts';

interface Story {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  image: string;
  themeColor: string;
}

const MAP_CENTER: [number, number] = [16.0, 108.0];

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

const EthnicButton = React.memo(({ ethnic, isSelected, onClick, onHover }: any) => (
  <button
    onMouseEnter={() => onHover(ethnic.name)}
    onMouseLeave={() => onHover(null)}
    onClick={() => onClick(ethnic)}
    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 flex items-center gap-4 group ${
      isSelected 
      ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white shadow-lg translate-x-1' 
      : 'bg-white border-transparent hover:border-gold/30 shadow-sm'
    }`}
  >
    <div className={`size-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-inner transition-colors duration-300 ${
      isSelected ? 'bg-white/20 text-white' : 'bg-[#FDFBF7] border border-gold/20 text-[#8B1A1A]'
    }`}>
      {ethnic.name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-black uppercase text-[12px] tracking-tight truncate">{ethnic.name}</h4>
      <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isSelected ? 'text-white/70' : 'text-text-soft'}`}>
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
      <div className="bg-white w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 animate-slide-up flex overflow-hidden border-4 border-[#8B1A1A]/30 flex-col md:flex-row">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-[#8B1A1A] hover:bg-red-800 text-white px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 border-2 border-white"
        >
          <span>ĐÓNG CỬA SỔ</span>
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="w-full md:w-[60%] h-1/2 md:h-auto relative bg-[#F2EFE6] group border-b md:border-b-0 md:border-r border-gold/10 shrink-0">
          <img src={story.image} alt={story.title} className="w-full h-full object-cover grayscale-[10%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white max-w-2xl p-2 pr-10">
             <div className="inline-block px-4 py-1.5 bg-[#8B1A1A]/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 md:mb-4 border border-white/20 shadow-lg">
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
                <span className="w-8 h-1 bg-[#8B1A1A] rounded-full"></span>
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
                <p className="font-serif italic text-[#8B1A1A] font-bold text-sm">"Lắng nghe ngàn xưa vọng lại..."</p>
             </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Home: React.FC = () => {
  const [ethnicList, setEthnicList] = useState<EthnicGroup[]>(ethnicData);
  const [selectedEthnic, setSelectedEthnic] = useState<EthnicGroup | null>(null);
  const [hoveredEthnicName, setHoveredEthnicName] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]); 
  
  const navigate = useNavigate();
  const mapSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ethnicDataRes, error: ethnicError } = await supabase.from('dan_toc').select('*');
        if (ethnicError) throw ethnicError;
        if (ethnicDataRes && ethnicDataRes.length > 0) {
          const mappedData = ethnicDataRes.map((item: any) => ({
            name: item.name || item.ten || item.ten_dan_toc,
            location: item.location || item.vi_tri || item.dia_ban, 
            population: item.population || item.dan_so,
            coords: typeof item.toa_do === 'string' ? JSON.parse(item.toa_do) : item.toa_do, 
            description: item.mo_ta,
            heritage: item.di_san,
            img: item.anh_dai_dien
          }));
          setEthnicList(mappedData);
        }

        const { data: productData, error: productError } = await supabase
          .from('san_pham')
          .select('*, dan_toc(ten_dan_toc)')
          .limit(5);
        if (productError) throw productError;
        if (productData) {
          setTrendingProducts(productData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ Supabase:", error);
      }
    };

    fetchData();
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
          <div class="absolute inset-0 bg-[#8B1A1A] rounded-full border-2 ${isSelected ? 'border-gold scale-110 shadow-2xl' : 'border-white/50 shadow-md'} flex items-center justify-center overflow-hidden">
             <span class="text-white font-black" style="font-size: ${size * 0.4}px;">${ethnic.name.charAt(0)}</span>
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen font-display bg-[#FDFBF7] scroll-smooth overflow-x-hidden">
      {activeStory && <StoryModal story={activeStory} onClose={() => setActiveStory(null)} />}

      <div className="pt-20 px-3 md:px-6 pb-8 bg-[#FDFBF7] min-h-screen">
        
        {/* HERO SECTION */}
        <section className="px-4 md:px-8 lg:px-20 py-0 max-w-[1800px] mx-auto"> 
          <div className="relative w-full h-[400px] md:h-[65vh] min-h-[400px] md:min-h-[500px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mt-4">
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="https://cdn.nhandan.vn/assets/web/styles/img/54dantoc/zone-1-1.png" 
                alt="Vietnam Heritage" 
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-black/40 md:bg-black/20"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 max-w-4xl">
              <span className="text-white font-bold tracking-[0.2em] uppercase mb-4 text-[10px] md:text-xs drop-shadow-md">
                Gìn giữ bản sắc Việt
              </span>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 drop-shadow-xl">
                Mỗi sản phẩm là<br className="hidden md:block" />một câu chuyện<br className="hidden md:block" />văn hóa
              </h1>
              <button 
                onClick={() => navigate('/marketplace')} 
                className="bg-[#8B1A1A] text-white px-8 py-3.5 mt-2 rounded-full font-bold hover:bg-red-800 hover:scale-105 shadow-xl transition-all duration-300 active:scale-95 text-sm inline-flex items-center justify-center"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </section>

        {/* SỨ MỆNH */}
        <section className="relative py-16 max-w-[1800px] mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-16">
               <h2 className="text-[#8B1A1A] font-bold uppercase tracking-widest text-sm mb-6">Sứ mệnh của chúng tôi</h2>
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

        {/* SẢN PHẨM NỔI BẬT SECTION */}
        <section className="relative py-16 max-w-[1800px] mx-auto px-4 border-t border-gold/20 bg-[#FDFBF7]">
          <RevealSection>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-[#8B1A1A] font-bold uppercase tracking-widest text-sm mb-2">Chợ phiên vùng cao</h2>
                <h3 className="text-3xl md:text-4xl font-black text-[#4A2511] italic uppercase tracking-tighter">Sản phẩm nổi bật</h3>
              </div>
              <button onClick={() => navigate('/marketplace')} className="text-sm font-bold text-text-soft hover:text-[#8B1A1A] transition-colors flex items-center gap-1 group">
                Xem tất cả <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* MOBILE VUỐT NGANG, DESKTOP LƯỚI 5 Ô */}
            <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 pb-6 md:pb-0 no-scrollbar">
              {trendingProducts.map(product => (
                <div key={product.id} onClick={() => navigate('/marketplace')} className="w-[80vw] sm:w-[45vw] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none group rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gold/20 bg-white flex flex-col h-full cursor-pointer relative">
                  
                  <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0 bg-[#F9F7F2]">
                    <img src={product.anh_san_pham?.replace('/public/images/', '/public/images-sacviet/')} alt={product.ten_san_pham} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-[#8B1A1A] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                      {product.dan_toc?.ten_dan_toc || 'BA NA'}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <h4 className="text-sm font-black text-text-main tracking-tight mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2 min-h-[2.5rem]">
                      {product.ten_san_pham}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[10px] font-bold text-text-soft flex items-center gap-1">
                         <span className="material-symbols-outlined text-xs text-[#8B1A1A]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                         {Math.floor(Math.random() * 200) + 50}
                       </span>
                       <span className="text-gray-300 text-[10px]">|</span>
                       <span className="text-[10px] font-bold text-green-700 flex items-center gap-0.5">
                         <span className="material-symbols-outlined text-[12px]">eco</span> Thủ công
                       </span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gold/10 flex flex-col gap-3">
                      <span className="text-[#8B1A1A] font-black text-base line-clamp-1">{product.gia}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate('/marketplace'); }} className="border border-gold text-text-main rounded-lg py-2 text-[10px] font-black uppercase hover:bg-gold/10 transition-colors z-10">
                          Tìm hiểu
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/marketplace'); }} className="rounded-lg py-2 text-[10px] font-black uppercase text-white transition-all z-10 bg-[#8B1A1A] hover:brightness-110 shadow-lg shadow-[#8B1A1A]/30 active:scale-95">
                          Đặt mua
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* MAP SECTION - FIX DỨT ĐIỂM LỖI MOBILE */}
        <section ref={mapSectionRef} className="py-12 md:py-20 border-t border-gold/20">
          <div className="max-w-[1500px] mx-auto px-4 md:px-6">
            <RevealSection>
              <div className="mb-8 text-center flex flex-col items-center">
                <h2 className="text-4xl md:text-7xl font-black text-[#4A2511] italic uppercase tracking-tighter leading-none mb-2">
                  BẢN ĐỒ 54 DÂN TỘC
                </h2>
              </div>
            </RevealSection>
            
            {/* KHUNG TỔNG */}
            <div className="flex flex-col lg:flex-row h-auto lg:h-[650px] gap-6 lg:gap-10">
              
              {/* BẢN ĐỒ: Cố định min-h-[450px] trên mobile */}
              <div className="w-full min-h-[450px] shrink-0 lg:min-h-0 lg:flex-1 relative rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden border-[4px] md:border-[6px] border-[#8B1A1A]/10 shadow-2xl bg-[#e4e9f0] z-0 isolate">
                 <MapContainer center={MAP_CENTER} zoom={6} className="absolute inset-0 w-full h-full" zoomControl={false} attributionControl={false}>
                    <MapFixer />
                    <TileLayer url="https://mt1.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}" />
                    <ZoomControl position="bottomright" />
                    {selectedEthnic && <ChangeView coords={selectedEthnic.coords} />}
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

              {/* DANH SÁCH BÊN DƯỚI */}
              <div className="w-full lg:w-[400px] shrink-0 bg-white rounded-[2.5rem] lg:rounded-[3rem] flex flex-col overflow-hidden border-[4px] border-gold/20 shadow-2xl relative h-[450px] lg:h-auto">
                <div className="p-6 md:p-8 bg-[#8B1A1A] shrink-0 text-white text-center">
                  <h2 className="text-xl md:text-2xl font-black italic uppercase">CỘNG ĐỒNG <br/><span className="text-gold">VIỆT NAM</span></h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#FDFBF7]">
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
                  <div className="absolute inset-0 z-[100] bg-[#FDFBF7] p-6 animate-slide-up-slow flex flex-col overflow-y-auto custom-scrollbar">
                     <button onClick={() => setSelectedEthnic(null)} className="self-end size-10 rounded-full border-2 border-[#8B1A1A]/30 flex items-center justify-center bg-white shadow-xl hover:bg-[#8B1A1A] hover:text-white transition-all"><span className="material-symbols-outlined text-xl">close</span></button>
                     <div className="mt-4 space-y-5 text-left">
                        <div className="rounded-[2rem] overflow-hidden aspect-[4/3] border-[4px] border-white shadow-xl">
                          <img src={selectedEthnic.img} alt={selectedEthnic.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-3xl font-black text-text-main italic uppercase leading-none">DÂN TỘC <br/><span className="text-[#8B1A1A]">{selectedEthnic.name}</span></h3>
                        <div className="bg-white p-5 rounded-2xl border border-gold/20 shadow-sm"><p className="text-text-main font-medium text-sm leading-relaxed">"{selectedEthnic.description}"</p></div>
                        <button onClick={() => navigate(`/marketplace?ethnic=${encodeURIComponent(selectedEthnic.name.toUpperCase())}`)} className="w-full bg-[#8B1A1A] py-4 rounded-2xl font-black text-white uppercase text-sm tracking-widest shadow-xl active:scale-95 mb-6 hover:brightness-110">VÀO CHỢ PHIÊN</button>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8B1A1A; border-radius: 10px; }
        @keyframes slide-up-slow { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up-slow { animation: slide-up-slow 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
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
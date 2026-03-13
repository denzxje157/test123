/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '../services/communityService.ts'; 
import { useAuth } from '../context/AuthContext.tsx'; 

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- UTILITIES ---
const getLunarDate = (solarDate: Date) => {
  const anchorDate = new Date(2026, 1, 17); 
  const diffTime = solarDate.getTime() - anchorDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let lDay, lMonth, yearLabel;
  if (diffDays >= 0) {
     let totalDays = diffDays; lMonth = 1; lDay = 1;
     while (totalDays > 0) { const daysInMonth = (lMonth % 2 !== 0) ? 30 : 29; if (totalDays < daysInMonth) { lDay += totalDays; totalDays = 0; } else { totalDays -= daysInMonth; lMonth++; if (lMonth > 12) lMonth = 1; } }
     yearLabel = 'Bính Ngọ';
  } else {
     let totalDays = Math.abs(diffDays); lMonth = 12; lDay = 29; 
     while (totalDays > 0) { const daysInMonth = (lMonth % 2 !== 0) ? 30 : 29; if (totalDays < daysInMonth) { lDay -= totalDays; if (lDay <= 0) { lMonth--; lDay += ((lMonth % 2 !== 0) ? 30 : 29); } totalDays = 0; } else { totalDays -= daysInMonth; lMonth--; if (lMonth < 1) lMonth = 12; } }
     yearLabel = 'Ất Tỵ';
  }
  return { day: Math.max(1, Math.floor(lDay)), month: lMonth, yearLabel };
};

const getRelativeTime = (dateString?: string) => {
  if (!dateString) return 'Vừa xong';
  const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
  const timeDiff = new Date(dateString).getTime() - new Date().getTime();
  const daysDiff = Math.round(timeDiff / 86400000);
  const hoursDiff = Math.round(timeDiff / 3600000);
  const minsDiff = Math.round(timeDiff / 60000);
  if (Math.abs(daysDiff) > 0) return rtf.format(daysDiff, 'day');
  if (Math.abs(hoursDiff) > 0) return rtf.format(hoursDiff, 'hour');
  if (Math.abs(minsDiff) > 0) return rtf.format(minsDiff, 'minute');
  return 'Vừa xong';
};

// --- INTERFACES ---
interface CommentDef { id: string; user: string; avatar: string; text: string; time: string; }
interface Post { id: string; author: string; avatar: string; time: string; timestamp: number; location: string; content: string; image?: string; likes: number; commentsCount: number; tags: string[]; localComments: CommentDef[]; }
interface QuizQuestion { id: number; question: string; options: string[]; correctAnswerStr: string; explanation: string; }
interface FestivalDisplay { id: string; name: string; solarDate: string; lunarDateStr: string; location: string; daysLeft: number; }

const MOCK_CURRENT_USER = { name: "Khách", avatar: "K" };

const INITIAL_POSTS: Post[] = [
  { id: '1', author: 'Minh Nguyễn', avatar: 'M', time: '2 giờ trước', timestamp: Date.now() - 7200000, location: 'Làng cổ Đường Lâm', content: 'Về Đường Lâm một chiều nắng nhạt, cảm giác như thời gian ngưng đọng.', image: 'https://images.unsplash.com/photo-1599708153386-62bf21c4b4a1?q=80&w=1000&auto=format&fit=crop', likes: 156, commentsCount: 2, tags: ['KienTruc', 'BacBo'], localComments: [{ id: 'c1', user: 'Hải Phạm', avatar: 'H', text: 'Đẹp quá bạn ơi, cho mình xin kinh nghiệm di chuyển với!', time: '1 giờ trước' }, { id: 'c2', user: 'Minh Nguyễn', avatar: 'M', text: 'Bạn đi xe buýt số 20A từ Cầu Giấy là tới thẳng cổng làng nhé.', time: '30 phút trước' }] },
  { id: '2', author: "H'Hen Niê", avatar: 'H', time: '5 giờ trước', timestamp: Date.now() - 18000000, location: 'Buôn Đôn, Đắk Lắk', content: 'Tiếng cồng chiêng vang vọng giữa đại ngàn...', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop', likes: 342, commentsCount: 0, tags: ['TayNguyen', 'LeHoi'], localComments: [] }
];

const FALLBACK_QUIZ = [{ id: 1, question: "Lễ hội 'Cấp Sắc' là của dân tộc nào?", options: ["H'Mông", "Dao", "Tày", "Thái"], correctAnswerStr: "Dao", explanation: "Lễ quan trọng của đàn ông Dao." }];
const FALLBACK_FESTIVALS = [
  { id: 'f1', name: 'Giỗ Tổ Hùng Vương', solarDate: '2026-04-26', lunarDateStr: '10/03 Âm lịch', location: 'Phú Thọ' }, 
  { id: 'f2', name: 'Lễ hội Katê', solarDate: '2026-10-10', lunarDateStr: '01/07 Chăm', location: 'Ninh Thuận' },
  { id: 'f3', name: 'Tết Nguyên Tiêu', solarDate: '2026-03-03', lunarDateStr: '15/01 Âm lịch', location: 'Toàn quốc' }
];

// --- COMPONENTS ---
const CalendarModal = ({ onClose, initialDate, festivals }: { onClose: () => void, initialDate: Date, festivals: FestivalDisplay[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); 
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const gotoToday = () => setCurrentDate(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  const getFestivalOnDate = (day: number) => {
    const checkDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return festivals.find(f => f.solarDate === checkDateStr);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-24 bg-background-light/30 border border-gold/10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const festival = getFestivalOnDate(day);
      const isToday = day === initialDate.getDate() && currentDate.getMonth() === initialDate.getMonth() && currentDate.getFullYear() === initialDate.getFullYear();
      const dateForLunar = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const lunar = getLunarDate(dateForLunar);
      const isSunday = dateForLunar.getDay() === 0;

      days.push(
        <div key={day} className={`h-16 md:h-24 border border-gold/10 relative p-1 md:p-2 transition-colors hover:bg-gold/5 flex flex-col justify-between group overflow-hidden ${isToday ? 'bg-gold/10 ring-1 md:ring-2 ring-gold inset-0 shadow-inner' : 'bg-white'}`}>
           <div className="flex justify-between items-start">
              <span className={`text-xs md:text-lg font-black leading-none ${isSunday ? 'text-primary' : 'text-text-main'} ${isToday ? 'text-primary scale-110' : ''}`}>{day}</span>
              <div className="flex flex-col items-end hidden md:flex">
                  <span className={`text-[8px] md:text-[10px] font-medium ${lunar.day === 1 || lunar.day === 15 ? 'text-primary font-bold' : 'text-text-soft/60'}`}>{lunar.day}/{lunar.month}</span>
              </div>
           </div>
           {isToday && <div className="absolute top-0 md:top-1 left-1/2 -translate-x-1/2"><span className="text-[5px] md:text-[8px] bg-primary text-white px-1 py-0.5 rounded font-bold uppercase tracking-wider">Hôm nay</span></div>}
           {festival && (
             <div className="mt-auto md:mt-1">
                <div className="bg-primary text-white text-[5px] md:text-[8px] font-bold px-1 py-0.5 rounded leading-tight truncate border border-gold/30 shadow-sm" title={festival.name}>{festival.name}</div>
             </div>
           )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-black/70 animate-fade-in" onClick={onClose}></div>
      <div className="w-full max-w-4xl bg-[#F7F3E9] rounded-2xl md:rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border-2 md:border-4 border-gold/20 animate-slide-up flex flex-col max-h-[90vh] md:max-h-[85vh]">
         <div className="p-3 md:p-6 bg-primary text-white flex items-center justify-between shrink-0">
            <h2 className="text-base md:text-2xl font-black uppercase tracking-widest flex items-center gap-2 md:gap-3"><span className="material-symbols-outlined text-xl md:text-2xl">calendar_month</span>Lịch Lễ Hội {currentDate.getFullYear()}</h2>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-1 md:p-2 rounded-full transition-colors flex items-center text-white"><span className="material-symbols-outlined text-lg">close</span></button>
         </div>
         <div className="flex items-center justify-between px-2 md:px-8 py-2 md:py-4 bg-white border-b border-gold/10">
            <button onClick={prevMonth} className="p-1 md:p-2 hover:bg-background-light rounded-full text-primary"><span className="material-symbols-outlined">chevron_left</span></button>
            <div className="cursor-pointer hover:bg-background-light px-3 py-1 rounded-xl transition-colors text-center" onClick={gotoToday}><span className="text-sm md:text-xl font-black text-text-main uppercase">{monthNames[currentDate.getMonth()]} / {currentDate.getFullYear()}</span></div>
            <button onClick={nextMonth} className="p-1 md:p-2 hover:bg-background-light rounded-full text-primary"><span className="material-symbols-outlined">chevron_right</span></button>
         </div>
         <div className="grid grid-cols-7 bg-gold/10 border-b border-gold/10">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (<div key={d} className={`py-2 md:py-3 text-center text-[8px] md:text-xs font-black uppercase ${i===0 ? 'text-primary' : 'text-text-soft'}`}>{d}</div>))}
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar bg-white"><div className="grid grid-cols-7">{renderDays()}</div></div>
      </div>
    </div>
  );
};

const FestivalWidget = () => {
  const [events, setEvents] = useState<FestivalDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchFestivals = useCallback(async () => {
    setLoading(true);
    try {
      if (!API_KEY) throw new Error("Missing API Key");
      const today = new Date();
      const prompt = `Bạn là Già làng am hiểu văn hóa. Dựa vào thời điểm hiện tại là năm ${today.getFullYear()}, hãy liệt kê 10 lễ hội văn hóa lớn của các dân tộc Việt Nam diễn ra rải rác trong năm. Trả về JSON array: [{"id": "le-hoi-1", "name": "Tên lễ hội", "solarDate": "YYYY-MM-DD", "lunarDateStr": "Ngày/Tháng Âm lịch", "location": "Tỉnh/Thành phố"}]`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } })
      });
      
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      if (!data.candidates || !data.candidates[0]) throw new Error("Dữ liệu Gemini trả về bị rỗng");

      const rawEvents = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim());
      
      const processed = rawEvents.map((f: any) => {
        const d = new Date(f.solarDate);
        return { ...f, daysLeft: Math.ceil((d.getTime() - today.getTime()) / 86400000) };
      }).sort((a: any, b: any) => a.daysLeft - b.daysLeft); 
      
      setEvents(processed.length ? processed : processFallback(today));
    } catch (e) {
      console.warn("Lỗi tải Lễ hội, tự động chuyển về giao diện dự phòng.", e);
      setEvents(processFallback(new Date()));
    } finally { setLoading(false); }
  }, []);

  const processFallback = (today: Date) => FALLBACK_FESTIVALS.map(f => {
    const d = new Date(f.solarDate); return { ...f, daysLeft: Math.ceil((d.getTime() - today.getTime()) / 86400000) };
  }).sort((a,b) => a.daysLeft - b.daysLeft);

  useEffect(() => { fetchFestivals(); }, [fetchFestivals]);

  const upcomingEvents = events.filter(f => f.daysLeft >= 0).slice(0, 3);

  return (
    <>
      <div className="bg-white rounded-2xl md:rounded-[2rem] border border-gold/20 shadow-lg p-4 md:p-5 w-full animate-fade-in delay-100">
        <div className="flex items-center justify-between mb-4 border-b border-gold/10 pb-3">
           <h3 className="font-black text-text-main text-sm md:text-base uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">event_upcoming</span>Mùa Lễ Hội</h3>
           <div className="flex items-center gap-2">
               <button onClick={() => setShowCalendar(true)} className="text-[10px] md:text-xs text-primary font-bold hover:bg-background-light px-2 py-1 rounded-lg border border-gold/20 shadow-sm transition-transform active:scale-95 flex items-center gap-1">Xem lịch <span className="material-symbols-outlined text-[12px] md:text-[14px]">calendar_month</span></button>
               <button onClick={fetchFestivals} className="text-primary hover:rotate-180 transition-transform p-1"><span className="material-symbols-outlined text-sm md:text-base">sync</span></button>
           </div>
        </div>
        <div className="space-y-3 md:space-y-4">
           {loading ? (
              <div className="text-center py-4 text-xs font-bold text-text-soft animate-pulse">Già làng đang xem lịch...</div>
           ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-4 text-xs font-bold text-text-soft">Đã hết lễ hội nổi bật năm nay.</div>
           ) : upcomingEvents.map(f => (
              <div key={f.id} className="flex gap-3 md:gap-4 items-center group cursor-pointer hover:bg-gold/5 p-2 rounded-xl transition-colors">
                 <div className="bg-primary/10 text-primary rounded-xl p-2 w-14 md:w-16 text-center shrink-0 border border-primary/20 flex flex-col justify-center">
                    <span className="block text-lg md:text-xl font-black leading-none my-0.5">{f.daysLeft}</span>
                    <span className="block text-[7px] md:text-[8px] font-bold uppercase opacity-70">Ngày</span>
                 </div>
                 <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-text-main text-xs md:text-sm group-hover:text-primary transition-colors truncate">{f.name}</h4>
                    <div className="flex items-center gap-1 md:gap-2 mt-1"><span className="text-[8px] md:text-[9px] bg-gold/20 text-text-main px-1.5 rounded font-bold">{f.lunarDateStr}</span></div>
                    <p className="text-[9px] md:text-[10px] text-bronze flex items-center gap-1 font-bold mt-1 truncate"><span className="material-symbols-outlined text-[10px]">location_on</span>{f.location}</p>
                 </div>
              </div>
           ))}
        </div>
      </div>
      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} initialDate={new Date()} festivals={events} />}
    </>
  );
};

const QuizWidget = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  
  const initQuiz = useCallback(async () => {
    setGenerating(true); setQIndex(0); setScore(0); setSelected(null);
    try {
      if (!API_KEY) throw new Error("Missing API Key");
      const prompt = `Đóng vai "Già làng Di Sản", tạo 5 câu hỏi trắc nghiệm ĐỘC ĐÁO về văn hóa, phong tục, lễ hội của 54 dân tộc Việt Nam. Trả về JSON array chính xác: [{"id": 1, "question": "...", "options": ["A", "B", "C", "D"], "correctAnswerStr": "A", "explanation": "..."}]`;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9 } }) });
      
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      if (!data.candidates || !data.candidates[0]) throw new Error("Dữ liệu trả về rỗng");

      setQuestions(JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim()));
    } catch (e) { 
      console.warn("Lỗi tải Câu hỏi, tự động chuyển về câu hỏi dự phòng.", e);
      setQuestions([...FALLBACK_QUIZ]); 
    } 
    finally { setGenerating(false); }
  }, []);

  useEffect(() => { initQuiz(); }, [initQuiz]);

  const currentQ = questions[qIndex];
  return (
    <div className="bg-white rounded-2xl md:rounded-[2rem] border-2 border-gold/30 shadow-xl overflow-hidden flex flex-col min-h-[250px] md:min-h-[300px] w-full">
      <div className="bg-primary p-3 md:p-4 text-center relative overflow-hidden shrink-0"><h3 className="text-white font-black uppercase text-xs md:text-sm tracking-widest relative z-10 flex items-center justify-center gap-2"><span className="material-symbols-outlined text-gold">school</span>Trạng Nguyên Di Sản</h3></div>
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        {generating ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in space-y-3 md:space-y-4 py-6 md:py-8">
              <div className="size-12 md:size-16 border-4 border-gold/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs md:text-sm font-bold text-text-main animate-pulse">Già làng đang soạn đề...</p>
           </div>
        ) : qIndex >= questions.length && questions.length > 0 ? (
          <div className="text-center py-4 animate-fade-in flex-1 flex flex-col justify-center">
             <div className="size-20 md:size-24 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-3 md:mb-4 relative"><span className="material-symbols-outlined text-4xl md:text-5xl text-primary">workspace_premium</span></div>
             <p className="text-text-soft text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Điểm của bạn</p>
             <h2 className="text-2xl md:text-3xl font-black text-primary mb-4 md:mb-6 uppercase">{score} Điểm</h2>
             <button onClick={initQuiz} className="w-full py-2.5 md:py-3 border-2 border-gold/30 rounded-full text-text-main font-bold text-xs uppercase hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined text-sm">refresh</span> Thi lại</button>
          </div>
        ) : currentQ ? (
          <div className="animate-slide-up flex-1">
            <div className="flex justify-between items-center mb-3 md:mb-4"><span className="text-[9px] md:text-[10px] font-black text-bronze uppercase tracking-widest">Câu {qIndex + 1}/{questions.length}</span><span className="text-primary font-black text-xs md:text-sm">{score} điểm</span></div>
            <p className="font-bold text-text-main mb-4 md:mb-6 text-sm">{currentQ.question}</p>
            <div className="space-y-2 md:space-y-3">
              {currentQ.options.map((opt, i) => (
                <button key={i} disabled={!!selected} onClick={() => { setSelected(opt); if (opt === currentQ.correctAnswerStr) setScore(s => s + 20); }} className={`w-full text-left p-2.5 md:p-3 rounded-xl border transition-all text-xs md:text-sm font-medium ${selected ? (opt === currentQ.correctAnswerStr ? 'bg-green-50 border-green-500 text-green-800' : opt === selected ? 'bg-red-50 border-red-300 text-red-800' : 'opacity-40') : 'hover:bg-gold/10'}`}>{opt}</button>
              ))}
            </div>
            {selected && (
               <div className="mt-3 md:mt-4 animate-fade-in">
                  <p className="text-[10px] md:text-xs text-text-soft italic mb-2 md:mb-3 border-l-2 border-gold pl-2 md:pl-3 bg-background-light p-2 rounded-r-lg">{currentQ.explanation}</p>
                  <button onClick={() => { setQIndex(i => i + 1); setSelected(null); }} className="w-full bg-primary text-white py-2.5 md:py-3 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:brightness-110 shadow-lg active:scale-95">Tiếp tục</button>
               </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const PostComposer = ({ onPost, currentUser }: { onPost: (content: string, image?: string) => void, currentUser: any }) => {
  const [content, setContent] = useState(''); const [img, setImg] = useState('');
  const submit = () => { if(content||img) { onPost(content, img); setContent(''); setImg(''); } };
  return (
    <div className="bg-white border-2 border-gold/10 rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-xl relative overflow-hidden group hover:border-gold/30 transition-colors w-full">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 relative z-10">
         <div className="flex items-center gap-3 md:block">
            <div className="size-10 md:size-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 font-black shadow-md">{currentUser.avatar}</div>
            <span className="font-bold text-sm md:hidden text-text-main">{currentUser.name}</span>
         </div>
         <div className="flex-1 w-full">
           <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-background-light border-2 border-gold/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm font-medium outline-none resize-none min-h-[80px] md:min-h-[100px] focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder={`Bạn có chuyện gì vui kể nghe nào?`}></textarea>
           {img && <div className="relative mt-2 h-24 md:h-32 bg-black/5 rounded-xl border border-gold/20 overflow-hidden"><img src={img} className="h-full w-full object-contain"/><button onClick={()=>setImg('')} className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded-full hover:bg-red-500 transition-colors"><span className="material-symbols-outlined text-xs md:text-sm">close</span></button></div>}
           <div className="flex justify-between mt-2 md:mt-3 items-center">
              <button onClick={() => { const url = prompt("Nhập URL ảnh:"); if(url) setImg(url); }} className="p-1.5 md:p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg md:text-xl">image</span></button>
              <button onClick={submit} disabled={!content && !img} className="bg-primary px-5 md:px-8 py-2 md:py-2.5 rounded-xl text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-gold hover:text-text-main transition-colors active:scale-95 shadow-lg shadow-primary/20">Đăng bài</button>
           </div>
         </div>
      </div>
    </div>
  );
};

const PostCard = React.memo(({ post, currentUser }: { post: Post, currentUser: any }) => {
  const [liked, setLiked] = useState(false); 
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentDef[]>(post.localComments || []);
  const [newComment, setNewComment] = useState('');

  const sendComment = () => {
     if(!newComment.trim()) return;
     const newC: CommentDef = { id: Date.now().toString(), user: currentUser.name, avatar: currentUser.avatar, text: newComment, time: 'Vừa xong' };
     setCommentsList([...commentsList, newC]);
     setNewComment('');
  };

  return (
    <article className="break-inside-avoid mb-6 bg-white border border-gold/15 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all group animate-slide-up w-full">
       <div className="p-4 md:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="size-8 md:size-10 rounded-full bg-gold-light border border-gold/20 flex items-center justify-center text-text-main font-black text-xs md:text-base shadow-sm">{post.avatar}</div>
            <div><p className="text-xs md:text-sm font-black text-text-main leading-tight">{post.author}</p><p className="text-[9px] md:text-[10px] text-bronze uppercase font-bold tracking-widest mt-0.5">{post.time}</p></div>
          </div>
          <button className="text-text-soft/30 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
       </div>
       <div className="px-4 md:px-5 pb-3 md:pb-4"><p className="text-xs md:text-sm text-text-soft font-medium whitespace-pre-wrap leading-relaxed">{post.content}</p></div>
       {post.image && <div className="w-full overflow-hidden bg-black/5 relative"><img src={post.image} className="w-full max-h-[300px] md:max-h-[500px] object-contain transition-transform duration-[2s] group-hover:scale-[1.02]" loading="lazy" /></div>}

       <div className="p-3 md:p-4 flex items-center gap-4 md:gap-6 border-t border-gold/5 bg-background-light/30">
         <button onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }} className={`flex items-center gap-1 md:gap-1.5 font-black text-[10px] md:text-xs transition-colors ${liked ? 'text-primary' : 'text-text-soft hover:text-primary'}`}>
           <span className={`material-symbols-outlined text-base md:text-lg ${liked ? 'fill-1 animate-ping-once' : ''}`}>{liked ? 'favorite' : 'favorite_border'}</span> {likes}
         </button>
         <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 md:gap-1.5 text-text-soft font-black text-[10px] md:text-xs hover:text-primary transition-colors">
           <span className="material-symbols-outlined text-base md:text-lg">chat_bubble</span> {commentsList.length}
         </button>
       </div>

       {showComments && (
         <div className="p-3 md:p-4 bg-background-light border-t border-gold/10 animate-fade-in">
            <div className="space-y-3 md:space-y-4 mb-3 md:mb-4 max-h-[200px] md:max-h-[300px] overflow-y-auto custom-scrollbar">
               {commentsList.length === 0 ? <p className="text-[10px] md:text-xs text-center text-text-soft italic">Hãy là người đầu tiên bình luận!</p> : null}
               {commentsList.map(c => (
                  <div key={c.id} className="flex gap-2 md:gap-3">
                     <div className="size-6 md:size-8 rounded-full bg-white border border-gold/20 flex items-center justify-center text-[10px] md:text-xs font-black shrink-0 shadow-sm">{c.avatar}</div>
                     <div className="flex-1 bg-white p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tl-none border border-gold/10 shadow-sm">
                        <div className="flex items-baseline justify-between mb-0.5 md:mb-1"><span className="text-[10px] md:text-xs font-black text-text-main">{c.user}</span><span className="text-[8px] md:text-[9px] text-text-soft font-medium">{c.time}</span></div>
                        <p className="text-[10px] md:text-xs text-text-soft font-medium">{c.text}</p>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="flex gap-2 items-center mt-2 relative">
               <div className="size-6 md:size-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] md:text-xs font-black shrink-0">{currentUser.avatar}</div>
               <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendComment()} placeholder="Viết bình luận..." className="flex-1 bg-white border border-gold/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
               <button onClick={sendComment} disabled={!newComment.trim()} className="absolute right-1 md:right-2 p-1 text-primary disabled:text-text-soft/40 transition-colors"><span className="material-symbols-outlined text-lg md:text-xl">send</span></button>
            </div>
         </div>
       )}
    </article>
  );
});

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  let auth: any = null; try { auth = useAuth(); } catch (e) {}
  const currentUserData = { name: auth?.user?.fullName || MOCK_CURRENT_USER.name, avatar: auth?.user?.fullName?.charAt(0).toUpperCase() || MOCK_CURRENT_USER.avatar };

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const data = await communityService.getPosts();
        if (data && data.length > 0) {
           const mapped = data.map((p: any) => ({
             id: p.id || Math.random().toString(), author: p.author_name || 'Khách', avatar: p.author_avatar || 'K', time: getRelativeTime(p.created_at), timestamp: new Date(p.created_at).getTime(), location: p.location || 'Cộng đồng Sắc Việt', content: p.content || '', image: p.image_url, likes: p.likes || 0, commentsCount: 0, tags: [], localComments: []
           }));
           setPosts([...mapped, ...INITIAL_POSTS]);
        }
      } catch (e) { console.warn("Lỗi load bài viết từ DB", e); }
    };
    fetchDB();
  }, []);

  const handlePost = (content: string, img: string = '') => {
      const newP: Post = { id: Date.now().toString(), author: currentUserData.name, avatar: currentUserData.avatar, time: 'Vừa xong', timestamp: Date.now(), location: '', content, image: img, likes: 0, commentsCount: 0, tags: [], localComments: [] };
      setPosts([newP, ...posts]);
  };

  return (
    <div className="min-h-screen font-display bg-[#F7F3E9] py-8 md:py-12 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-8 md:mb-12 text-center animate-fade-in">
          <div className="inline-block px-4 md:px-6 py-2 border border-gold/30 rounded-full mb-4 bg-white/50 backdrop-blur-sm"><span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Mạng Xã Hội Di Sản</span></div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-main italic mb-3 md:mb-4">Mái Đình <span className="text-gold">Chung</span></h2>
          <p className="text-text-soft font-serif italic text-sm md:text-lg max-w-2xl mx-auto px-4">"Nơi kết nối những trái tim yêu văn hóa, cùng trò chuyện và chia sẻ."</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <aside className="w-full lg:w-80 shrink-0 space-y-6 md:space-y-8 lg:sticky lg:top-24 order-1 lg:order-2">
             <QuizWidget />
             <FestivalWidget />
          </aside>
          
          <div className="flex-1 w-full order-2 lg:order-1 flex flex-col gap-6 md:gap-8">
             <PostComposer onPost={handlePost} currentUser={currentUserData} />
             <div className="columns-1 md:columns-2 gap-6 md:gap-8 space-y-6 md:space-y-8">
               {posts.map(p => <PostCard key={p.id} post={p} currentUser={currentUserData} />)}
             </div>
             <div className="mt-8 text-center animate-fade-in pb-10"><button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">Tải thêm bài viết</button></div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; } .fill-1 { font-variation-settings: 'FILL' 1; } @keyframes ping-once { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } } .animate-ping-once { animation: ping-once 0.3s ease-out; }`}</style>
    </div>
  );
};
export default Community;
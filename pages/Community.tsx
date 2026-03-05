import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '../services/communityService.ts'; 
import { useAuth } from '../context/AuthContext.tsx'; 

const getLunarDate = (solarDate: Date) => {
  const anchorDate = new Date(2026, 1, 17); 
  const diffTime = solarDate.getTime() - anchorDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let lDay, lMonth, yearLabel;
  if (diffDays >= 0) {
     let totalDays = diffDays;
     lMonth = 1; lDay = 1;
     while (totalDays > 0) {
        const daysInMonth = (lMonth % 2 !== 0) ? 30 : 29;
        if (totalDays < daysInMonth) { lDay += totalDays; totalDays = 0; } else { totalDays -= daysInMonth; lMonth++; if (lMonth > 12) lMonth = 1; }
     }
     yearLabel = 'Bính Ngọ';
  } else {
     let totalDays = Math.abs(diffDays);
     lMonth = 12; lDay = 29; 
     while (totalDays > 0) {
        const daysInMonth = (lMonth % 2 !== 0) ? 30 : 29;
        if (totalDays < daysInMonth) { lDay -= totalDays; if (lDay <= 0) { lMonth--; lDay += ((lMonth % 2 !== 0) ? 30 : 29); } totalDays = 0; } else { totalDays -= daysInMonth; lMonth--; if (lMonth < 1) lMonth = 12; }
     }
     yearLabel = 'Ất Tỵ';
  }
  return { day: Math.max(1, Math.floor(lDay)), month: lMonth, yearLabel };
};

const getRelativeTime = (dateString?: string) => {
  if (!dateString) return 'Vừa xong';
  const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
  const timeDiff = new Date(dateString).getTime() - new Date().getTime();
  const daysDifference = Math.round(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.round(timeDiff / (1000 * 60 * 60));
  const minutesDifference = Math.round(timeDiff / (1000 * 60));

  if (Math.abs(daysDifference) > 0) return rtf.format(daysDifference, 'day');
  if (Math.abs(hoursDifference) > 0) return rtf.format(hoursDifference, 'hour');
  if (Math.abs(minutesDifference) > 0) return rtf.format(minutesDifference, 'minute');
  return 'Vừa xong';
};

interface Post { id: string; author: string; avatar: string; time: string; timestamp: number; location: string; content: string; image?: string; likes: number; comments: number; tags: string[]; }
interface QuizQuestion { id: number; question: string; options: string[]; correctAnswerStr: string; explanation: string; }
interface FestivalDef { id: string; name: string; lunarDateStr: string; location: string; solarDates: Record<number, string>; }
interface FestivalDisplay { id: string; name: string; solarDate: string; lunarDateStr: string; location: string; daysLeft: number; }

const MOCK_CURRENT_USER = { name: "Khách thăm", avatar: "K" };

const INITIAL_POSTS: Post[] = [
  { id: '1', author: 'Minh Nguyễn', avatar: 'M', time: '2 giờ trước', timestamp: Date.now() - 7200000, location: 'Làng cổ Đường Lâm, Hà Nội', content: 'Về Đường Lâm một chiều nắng nhạt...', image: 'https://images.vietnamtourism.gov.vn/vn/images/2020/thang_5/2805_duong_lam_2.jpg', likes: 156, comments: 24, tags: ['KienTruc', 'BacBo'] },
  { id: '2', author: "H'Hen Niê", avatar: 'H', time: '5 giờ trước', timestamp: Date.now() - 18000000, location: 'Buôn Đôn, Đắk Lắk', content: 'Tiếng cồng chiêng vang vọng...', image: 'https://cdn.tuoitre.vn/thumb_w/730/2022/3/13/le-hoi-dam-trau-164716265738676239105.jpg', likes: 342, comments: 56, tags: ['TayNguyen', 'LeHoi'] },
  { id: '3', author: 'Lê Văn Khoa', avatar: 'K', time: '1 ngày trước', timestamp: Date.now() - 86400000, location: 'Hội An, Quảng Nam', content: 'Đèn lồng phố Hội...', image: 'https://images.vietnamtourism.gov.vn/vn//images/2023/cd_hoi_an5.jpeg', likes: 210, comments: 15, tags: ['DiSan', 'HoiAn'] },
];

const RAW_QUIZ_DATA: QuizQuestion[] = [
  { id: 1, question: "Lễ hội 'Cấp Sắc' là nghi lễ trưởng thành của người đàn ông dân tộc nào?", options: ["H'Mông", "Dao", "Tày", "Thái"], correctAnswerStr: "Dao", explanation: "Lễ Cấp Sắc là nghi lễ quan trọng nhất của đàn ông Dao." },
];

const FESTIVAL_LIBRARY: FestivalDef[] = [
  { id: 'tet-nguyen-dan', name: 'Tết Nguyên Đán', lunarDateStr: '01/01 Âm lịch', location: 'Toàn quốc', solarDates: { 2025: '2025-01-29', 2026: '2026-02-17' } },
  { id: 'tet-nguyen-tieu', name: 'Tết Nguyên Tiêu', lunarDateStr: '15/01 Âm lịch', location: 'Toàn quốc', solarDates: { 2025: '2025-02-12', 2026: '2026-03-03' } },
];

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
      days.push(<div key={`empty-${i}`} className="h-16 md:h-24 bg-background-light/30 border border-gold/10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const festival = getFestivalOnDate(day);
      const isToday = day === initialDate.getDate() && currentDate.getMonth() === initialDate.getMonth() && currentDate.getFullYear() === initialDate.getFullYear();
      const dateForLunar = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const lunar = getLunarDate(dateForLunar);
      const dayOfWeek = dateForLunar.getDay();
      const isSunday = dayOfWeek === 0;

      days.push(
        <div key={day} className={`h-16 md:h-24 border border-gold/10 relative p-1 md:p-2 transition-colors hover:bg-gold/5 flex flex-col justify-between group ${isToday ? 'bg-gold/10 ring-2 ring-gold inset-0 shadow-inner' : 'bg-white'}`}>
           <div className="flex justify-between items-start">
              <span className={`text-sm md:text-lg font-black leading-none ${isSunday ? 'text-primary' : 'text-text-main'} ${isToday ? 'text-primary scale-110' : ''}`}>{day}</span>
              <div className="flex flex-col items-end">
                  <span className={`text-[8px] md:text-[10px] font-medium ${lunar.day === 1 || lunar.day === 15 ? 'text-primary font-bold' : 'text-text-soft/60'}`}>{lunar.day}/{lunar.month}</span>
              </div>
           </div>
           {isToday && <div className="absolute top-1 left-1/2 -translate-x-1/2"><span className="text-[6px] md:text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">Hôm nay</span></div>}
           {festival && (
             <div className="mt-1">
                <div className="bg-primary text-white text-[6px] md:text-[8px] font-bold px-1.5 py-0.5 rounded leading-tight truncate border border-gold/30 shadow-sm">{festival.name}</div>
             </div>
           )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="w-full max-w-4xl bg-[#F7F3E9] rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border-4 border-gold/20 animate-slide-up flex flex-col max-h-[85vh]">
         <div className="p-4 md:p-6 bg-primary text-white flex items-center justify-between shrink-0">
            <div><h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3"><span className="material-symbols-outlined">calendar_month</span>Lịch Lễ Hội {currentDate.getFullYear()}</h2></div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors flex items-center text-white"><span className="material-symbols-outlined">close</span></button>
         </div>
         <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gold/10">
            <button onClick={prevMonth} className="p-2 hover:bg-background-light rounded-full text-primary transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
            <div className="flex flex-col items-center cursor-pointer hover:bg-background-light px-4 py-1 rounded-xl transition-colors" onClick={gotoToday}><span className="text-lg md:text-xl font-black text-text-main uppercase">{monthNames[currentDate.getMonth()]} / {currentDate.getFullYear()}</span></div>
            <button onClick={nextMonth} className="p-2 hover:bg-background-light rounded-full text-primary transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
         </div>
         <div className="grid grid-cols-7 bg-gold/10 border-b border-gold/10">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (<div key={d} className={`py-3 text-center text-[10px] md:text-xs font-black uppercase ${i===0 ? 'text-primary' : 'text-text-soft'}`}>{d}</div>))}
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar bg-white"><div className="grid grid-cols-7">{renderDays()}</div></div>
      </div>
    </div>
  );
};

const FestivalWidget = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [today, setToday] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setToday(new Date()), 60000); return () => clearInterval(timer); }, []);
  const computedFestivals = useMemo(() => {
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let events: FestivalDisplay[] = [];
    FESTIVAL_LIBRARY.forEach(def => {
       if (def.solarDates[currentYear]) { const d = new Date(def.solarDates[currentYear]); const diffTime = d.getTime() - todayZero.getTime(); const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); events.push({ ...def, solarDate: def.solarDates[currentYear], daysLeft }); }
       if (def.solarDates[nextYear]) { const d = new Date(def.solarDates[nextYear]); const diffTime = d.getTime() - todayZero.getTime(); const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); events.push({ ...def, solarDate: def.solarDates[nextYear], daysLeft }); }
    });
    return events;
  }, [today]);
  const upcomingEvents = useMemo(() => computedFestivals.filter(f => f.daysLeft >= 0).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3), [computedFestivals]);

  return (
    <>
      <div className="bg-white rounded-[2rem] border border-gold/20 shadow-lg overflow-hidden mt-8 animate-fade-in delay-100">
        <div className="p-5 border-b border-gold/10 bg-background-light flex items-center justify-between">
           <h3 className="font-black text-text-main text-sm uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-primary">event_upcoming</span>Mùa Lễ Hội {today.getFullYear()}</h3>
           <button onClick={() => setShowCalendar(true)} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gold/20 shadow-sm transition-transform active:scale-95">Xem lịch <span className="material-symbols-outlined text-[14px]">calendar_month</span></button>
        </div>
        <div className="p-4 space-y-4">
           {upcomingEvents.map(festival => (
              <div key={`${festival.id}-${festival.solarDate}`} className="flex gap-4 items-center group cursor-pointer hover:bg-gold/5 p-2 rounded-xl transition-colors">
                 <div className="bg-primary/10 text-primary rounded-xl p-2 w-16 text-center shrink-0 border border-primary/20 flex flex-col justify-center">
                    <span className="block text-[8px] font-black uppercase opacity-70">Còn</span>
                    <span className="block text-xl font-black leading-none my-0.5">{festival.daysLeft}</span>
                    <span className="block text-[8px] font-bold opacity-70">Ngày</span>
                 </div>
                 <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-text-main text-sm group-hover:text-primary transition-colors truncate">{festival.name}</h4>
                    <div className="flex items-center gap-2 mt-1"><span className="text-[9px] bg-gold/20 text-text-main px-1.5 rounded font-bold">{festival.lunarDateStr}</span></div>
                    <p className="text-[10px] text-bronze flex items-center gap-1 font-bold mt-1"><span className="material-symbols-outlined text-[10px]">location_on</span>{festival.location}</p>
                 </div>
              </div>
           ))}
           {upcomingEvents.length === 0 && <div className="text-center py-6 px-4"><span className="material-symbols-outlined text-4xl text-gold/30 mb-2">event_busy</span><p className="text-xs text-text-soft font-medium">Đã hết lễ hội trong năm nay.</p></div>}
        </div>
      </div>
      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} initialDate={today} festivals={computedFestivals} />}
    </>
  );
};

const QuizWidget = () => {
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  const initQuiz = useCallback(() => {
    const shuffled = [...RAW_QUIZ_DATA].sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffled.slice(0, 5));
    setCurrentQIndex(0); setScore(0); setShowResult(false); setSelectedOption(null); setIsAnswered(false);
  }, []);
  useEffect(() => { initQuiz(); }, [initQuiz]);
  useEffect(() => { if (sessionQuestions.length > 0 && currentQIndex < sessionQuestions.length) { const q = sessionQuestions[currentQIndex]; setShuffledOptions([...q.options].sort(() => Math.random() - 0.5)); } }, [sessionQuestions, currentQIndex]);
  const currentQ = sessionQuestions[currentQIndex];
  const handleAnswer = (option: string) => { if (isAnswered) return; setSelectedOption(option); setIsAnswered(true); if (option === currentQ.correctAnswerStr) { setScore(s => s + 20); } };
  const handleNext = () => { if (currentQIndex < sessionQuestions.length - 1) { setCurrentQIndex(prev => prev + 1); setSelectedOption(null); setIsAnswered(false); } else { setShowResult(true); } };
  const getRank = (s: number) => { if (s >= 100) return 'Trạng Nguyên'; if (s >= 80) return 'Bảng Nhãn'; if (s >= 60) return 'Thám Hoa'; return 'Hương Cống'; };
  if (!currentQ) return <div className="p-4 text-center">Đang tải câu hỏi...</div>;

  return (
    <div className="bg-white rounded-[2rem] border-2 border-gold/30 shadow-xl overflow-hidden relative animate-fade-in delay-200">
      <div className="bg-primary p-4 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
         <h3 className="text-white font-black uppercase text-sm tracking-widest relative z-10 flex items-center justify-center gap-2"><span className="material-symbols-outlined text-gold">school</span>Trạng Nguyên Di Sản</h3>
      </div>
      <div className="p-6">
        {!showResult ? (
          <div key={currentQIndex} className="animate-slide-up">
            <div className="flex justify-between items-center mb-4"><span className="text-[10px] font-black text-bronze uppercase tracking-widest">Câu hỏi {currentQIndex + 1}/{sessionQuestions.length}</span><span className="text-primary font-black text-sm">{score} điểm</span></div>
            <p className="font-bold text-text-main mb-6 min-h-[3rem] text-sm md:text-base">{currentQ.question}</p>
            <div className="space-y-3">
              {shuffledOptions.map((option, idx) => {
                const isSelected = option === selectedOption; const isCorrect = option === currentQ.correctAnswerStr;
                let btnClass = "w-full text-left p-3 rounded-xl border transition-all text-sm font-medium relative overflow-hidden ";
                if (isAnswered) { if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500"; else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-300 text-red-800"; else btnClass += "border-gold/10 opacity-40"; } else { btnClass += "border-gold/20 hover:bg-gold/10 hover:border-gold text-text-soft"; }
                return (
                  <button key={idx} onClick={() => handleAnswer(option)} className={btnClass} disabled={isAnswered}>
                    <span className="relative z-10">{option}</span>
                    {isAnswered && isCorrect && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-lg">check_circle</span>}
                    {isAnswered && isSelected && !isCorrect && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">cancel</span>}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
               <div className="mt-4 animate-fade-in">
                  <p className="text-xs text-text-soft italic mb-3 border-l-2 border-gold pl-3 bg-background-light p-2 rounded-r-lg">{currentQ.explanation}</p>
                  <button onClick={handleNext} className="w-full bg-primary text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">{currentQIndex < sessionQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}<span className="material-symbols-outlined text-sm">arrow_forward</span></button>
               </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 animate-fade-in">
             <div className="size-24 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-4 relative"><span className="material-symbols-outlined text-5xl text-primary">workspace_premium</span><div className="absolute -top-1 -right-1 size-8 bg-primary rounded-full flex items-center justify-center text-white font-black text-xs border-2 border-white shadow-md">{score}</div></div>
             <p className="text-text-soft text-sm font-bold uppercase tracking-widest mb-1">Danh hiệu của bạn</p>
             <h2 className="text-3xl font-black text-primary mb-2 uppercase">{getRank(score)}</h2>
             <p className="text-text-soft text-sm mb-6 px-4">Bạn đã hoàn thành xuất sắc phần thi của mình. Hãy tiếp tục khám phá!</p>
             <button onClick={initQuiz} className="w-full py-3 border-2 border-gold/30 rounded-full text-text-main font-bold text-xs uppercase hover:bg-gold hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"><span className="material-symbols-outlined text-sm">refresh</span> Thử thách lại</button>
          </div>
        )}
      </div>
    </div>
  );
};

const PostComposer = ({ onPost, currentUser }: { onPost: (content: string, image?: string) => void, currentUser: any }) => {
  const [content, setContent] = useState(''); 
  const [imageUrl, setImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleAddImage = () => {
    const url = prompt("Nhập đường dẫn hình ảnh (URL):");
    if (url) setImageUrl(url);
  };

  const handleSubmit = () => { 
    if (!content.trim() && !imageUrl) return; 
    setIsPosting(true); 
    setTimeout(() => { 
      onPost(content, imageUrl); 
      setContent(''); 
      setImageUrl('');
      setIsPosting(false); 
    }, 500); 
  };

  return (
    <div className="bg-white border-2 border-gold/10 rounded-[2rem] p-6 mb-10 shadow-xl relative overflow-hidden group hover:border-gold/30 transition-colors animate-fade-in">
      <div className="absolute -right-20 -bottom-20 size-60 bg-gold/5 rounded-full pointer-events-none"></div>
      <div className="flex gap-4 relative z-10">
         <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 font-black shadow-lg border-2 border-white">
           {currentUser.avatar}
         </div>
         <div className="flex-1">
           <textarea 
             value={content} 
             onChange={(e) => setContent(e.target.value)} 
             className="w-full bg-background-light border-2 border-gold/10 rounded-2xl p-4 text-text-main placeholder:text-text-soft/40 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none min-h-[100px] text-sm font-medium transition-all" 
             placeholder={`Chào ${currentUser.name}, bạn có câu chuyện di sản nào muốn chia sẻ hôm nay?`} 
             disabled={isPosting}>
           </textarea>
           
           {imageUrl && (
             <div className="relative mt-2 rounded-xl overflow-hidden h-32 md:h-48 border border-gold/20 bg-black/5">
               <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
               <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                 <span className="material-symbols-outlined text-sm">close</span>
               </button>
             </div>
           )}

           <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button onClick={handleAddImage} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors tooltip" title="Thêm ảnh">
                  <span className="material-symbols-outlined text-xl">image</span>
                </button>
                <button className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors tooltip" title="Check-in"><span className="material-symbols-outlined text-xl">location_on</span></button>
              </div>
              <button onClick={handleSubmit} disabled={(!content.trim() && !imageUrl) || isPosting} className={`bg-primary px-8 py-2.5 rounded-xl font-black text-white uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 ${((!content.trim() && !imageUrl) || isPosting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold hover:text-text-main'}`}> 
                {isPosting ? (<span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>) : (<>Đăng bài <span className="material-symbols-outlined text-sm">send</span></>)}
              </button>
           </div>
         </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// POST CARD (BẢN ĐÃ TÍCH HỢP NÚT CHIA SẺ VÀ XÓA CỦA ADMIN)
// ---------------------------------------------------------
const PostCard = React.memo(({ post, isAdmin, onDelete }: { post: Post, isAdmin: boolean, onDelete: (id: string) => void }) => {
  const [liked, setLiked] = useState(false); 
  const [likeCount, setLikeCount] = useState(post.likes);
  
  // State quản lý Menu Chia sẻ
  const [showShareMenu, setShowShareMenu] = useState(false);
  const currentUrl = window.location.href; // Lấy link hiện tại để share

  const handleLike = () => { setLikeCount(prev => liked ? prev - 1 : prev + 1); setLiked(!liked); };
  
  const shareToFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Đã sao chép liên kết thành công!');
    setShowShareMenu(false);
  };

  return (
    <article className="break-inside-avoid mb-6 bg-white border border-gold/15 rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-slide-up">
       <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gold-light border border-gold/20 flex items-center justify-center text-text-main font-black shadow-sm">{post.avatar}</div>
            <div>
              <p className="text-sm font-black text-text-main leading-tight">{post.author}</p>
              <p className="text-[10px] text-bronze uppercase font-bold tracking-widest mt-0.5">{post.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             {isAdmin && (
               <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors tooltip" title="Xóa bài (Dành cho Admin)">
                 <span className="material-symbols-outlined text-lg">delete</span>
               </button>
             )}
             <button className="text-text-soft/30 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
       </div>
       
       <div className="px-5 pb-4">
         <p className="text-sm text-text-soft leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
         {post.tags && post.tags.length > 0 && (
           <div className="flex flex-wrap gap-2 mt-3">
             {post.tags.map(tag => (<span key={tag} className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">#{tag}</span>))}
           </div>
         )}
       </div>
       
       {post.image && (
         <div className="w-full overflow-hidden relative bg-black/5">
           <img src={post.image} alt="Post" onError={(e) => e.currentTarget.style.display = 'none'} className="w-full object-contain max-h-[500px] transition-transform duration-[2s] group-hover:scale-[1.02]" loading="lazy" />
         </div>
       )}

       <div className="p-4 flex items-center gap-6 border-t border-gold/5 bg-background-light/30">
         <button onClick={handleLike} className={`flex items-center gap-1.5 font-black text-xs transition-colors ${liked ? 'text-primary' : 'text-text-soft hover:text-primary'}`}>
           <span className={`material-symbols-outlined text-lg ${liked ? 'fill-1 animate-ping-once' : ''}`}>favorite</span> {likeCount}
         </button>
         <button className="flex items-center gap-1.5 text-text-soft font-black text-xs hover:text-primary transition-colors">
           <span className="material-symbols-outlined text-lg">chat_bubble</span> {post.comments}
         </button>
         
         {/* KHU VỰC MENU CHIA SẺ NẰM BÊN PHẢI */}
         <div className="relative ml-auto">
           <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-1.5 text-text-soft font-black text-xs hover:text-primary transition-colors">
             <span className="material-symbols-outlined text-lg">share</span>
           </button>
           
           {showShareMenu && (
             <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-xl shadow-xl border border-gold/20 overflow-hidden z-50 animate-fade-in">
               <button onClick={shareToFB} className="w-full text-left px-4 py-3 text-xs font-bold text-white bg-[#1877F2] hover:brightness-110 flex items-center gap-2 transition-colors">
                 <span className="material-symbols-outlined text-base">public</span> Facebook
               </button>
               <button onClick={copyLink} className="w-full text-left px-4 py-3 text-xs font-bold text-text-main hover:bg-background-light flex items-center gap-2 border-t border-gold/10 transition-colors">
                 <span className="material-symbols-outlined text-base">link</span> Copy Link
               </button>
             </div>
           )}
         </div>
       </div>
    </article>
  );
});

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  let auth: any = null;
  try {
     auth = useAuth(); 
  } catch (error) {
     console.warn("Chưa bọc AuthProvider hoặc sai đường dẫn.");
  }
  
  const isAdmin = auth?.user?.role === 'admin';
  const currentUserData = {
     name: auth?.user?.fullName || MOCK_CURRENT_USER.name,
     avatar: auth?.user?.fullName?.charAt(0).toUpperCase() || MOCK_CURRENT_USER.avatar
  };

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await communityService.getPosts();
      if (data && data.length > 0) {
        const mappedPosts: Post[] = data.map(p => ({
          id: p.id || Math.random().toString(),
          author: p.author_name || 'Khách',
          avatar: p.author_avatar || 'K',
          time: getRelativeTime(p.created_at),
          timestamp: p.created_at ? new Date(p.created_at).getTime() : Date.now(),
          location: p.location || 'Việt Nam',
          content: p.content || '',
          image: p.image_url,
          likes: p.likes || 0,
          comments: 0,
          tags: ['ChiaSe', 'DiSan']
        }));
        setPosts([...mappedPosts, ...INITIAL_POSTS]); 
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = useCallback(async (content: string, imageUrl?: string) => { 
    try {
      await communityService.createPost({
        author_name: currentUserData.name,
        author_avatar: currentUserData.avatar,
        content: content,
        image_url: imageUrl,
        location: 'Cộng đồng Sắc Việt',
        likes: 0
      });
      loadPosts(); 
    } catch (error) {
      console.error("Lỗi đăng bài:", error);
      alert('Đăng bài thất bại, vui lòng kiểm tra lại kết nối!');
    }
  }, [loadPosts, currentUserData]);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) return;
    try {
      await communityService.deletePost(postId); 
      setPosts(prev => prev.filter(p => p.id !== postId)); 
      alert("Đã xóa bài viết thành công!");
    } catch (error) {
      console.error("Lỗi xóa bài:", error);
      alert("Lỗi! Không thể xóa bài viết này.");
    }
  };

  return (
    <div className="relative min-h-screen font-display bg-[#F7F3E9]">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-scales.png')" }}></div>
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12 text-center animate-fade-in">
          <div className="inline-block px-6 py-2 border border-gold/30 rounded-full mb-4 bg-white/50 backdrop-blur-sm"><span className="text-primary text-xs font-black uppercase tracking-[0.3em]">Mạng Xã Hội Di Sản</span></div>
          <h2 className="text-5xl lg:text-6xl font-black text-text-main italic mb-4">Mái Đình <span className="text-gold text-shadow-glow">Chung</span></h2>
          <p className="text-text-soft font-serif italic text-lg max-w-2xl mx-auto">"Nơi kết nối những trái tim yêu văn hóa, cùng chia sẻ những khoảnh khắc và câu chuyện di sản quý giá."</p>
        </header>
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 w-full">
             
             <PostComposer onPost={handleCreatePost} currentUser={currentUserData} />
             
             {isLoading ? (
               <div className="text-center py-10 text-gold font-black uppercase tracking-widest animate-pulse">
                 Đang tải bài viết...
               </div>
             ) : (
               <div className="columns-1 md:columns-2 gap-6 space-y-6">
                 {posts.map((post) => (
                   <PostCard 
                     key={post.id} 
                     post={post} 
                     isAdmin={isAdmin}
                     onDelete={handleDeletePost}
                   />
                 ))}
               </div>
             )}
             
             <div className="mt-10 text-center animate-fade-in"><button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all">Tải thêm bài viết</button></div>
          </div>
          <aside className="w-full lg:w-80 shrink-0 space-y-8 sticky top-24"><QuizWidget /><FestivalWidget /><div className="text-center pt-8 border-t border-gold/10"><p className="text-[10px] text-text-soft/40 uppercase tracking-widest font-bold">© 2026 Sắc Việt Community</p></div></aside>
        </div>
      </div>
      <style>{` .text-shadow-glow { text-shadow: 0 0 20px rgba(212,175,55,0.5); } .fill-1 { font-variation-settings: 'FILL' 1; } @keyframes ping-once { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } } .animate-ping-once { animation: ping-once 0.3s ease-out; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .delay-100 { animation-delay: 100ms; } .delay-200 { animation-delay: 200ms; } `}</style>
    </div>
  );
};
export default Community;
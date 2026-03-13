import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Lấy chìa khóa từ Vercel
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY; 
  const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    return res.status(500).json({ error: "Thiếu biến môi trường!" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // 1. GỌI GEMINI LẤY 5 CÂU ĐỐ (JSON CHUẨN)
    const promptQuiz = `Tạo 5 câu đố trắc nghiệm văn hóa Việt Nam. Trả về mảng JSON chính xác cấu trúc này: [{"question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "A", "explanation": "..."}]`;
    const resQuiz = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptQuiz }] }], generationConfig: { responseMimeType: "application/json" } })
    });
    const dataQuiz = await resQuiz.json();
    const quizList = JSON.parse(dataQuiz.candidates[0].content.parts[0].text);

    // 2. GỌI GEMINI LẤY LỄ HỘI SẮP TỚI
    const year = new Date().getFullYear();
    const promptFest = `Liệt kê 5 lễ hội Việt Nam sắp diễn ra năm ${year}. Trả về mảng JSON chính xác cấu trúc này: [{"name": "...", "solar_date": "YYYY-MM-DD", "lunar_date_str": "...", "location": "..."}]`;
    const resFest = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptFest }] }], generationConfig: { responseMimeType: "application/json" } })
    });
    const dataFest = await resFest.json();
    const festList = JSON.parse(dataFest.candidates[0].content.parts[0].text);

    // 3. LƯU VÀO DATABASE SUPABASE CỦA BẠN
    // Xóa sạch data cũ ngày hôm qua
    await supabase.from('gemini_quiz').delete().not('id', 'is', null);
    await supabase.from('gemini_festivals').delete().not('id', 'is', null);

    // Bơm data mới của ngày hôm nay vào
    await supabase.from('gemini_quiz').insert(quizList);
    await supabase.from('gemini_festivals').insert(festList);

    return res.status(200).json({ message: "Già làng đã cập nhật data thành công!", quizCount: quizList.length, festCount: festList.length });
  } catch (error) {
    console.error("Lỗi Cron:", error);
    return res.status(500).json({ error: error.message });
  }
}
import axios from 'axios';
const handler = async (m, {conn, usedPrefix, command}) => {
    // 🚀 جلب بيانات JSON من مستودع GitHub
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/Messi.json`)).data;
    
    // اختيار رابط صورة عشوائي من القائمة
    const url = await res[Math.floor(res.length * Math.random())];
    
    // إرسال الصورة
    conn.sendFile(m.chat, url, 'error.jpg', `*🔥 ليونيل ميسي 🔥*`, m);
};

// conn.sendButton(m.chat, "*Messi*", author, url, [['⚽ SIGUIENTE ⚽', `${usedPrefix + command}`]], m)}
handler.help = ['ميسي'];
handler.tags = ['انترنت'];
handler.command = /^(ميسي)$/i; // الأمر باللغة العربية
export default handler;
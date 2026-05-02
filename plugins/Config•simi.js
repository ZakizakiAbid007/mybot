import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';
const handler = (m) => m;

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat];
  
  // التحقق إذا كان نظام الردود التلقائية مفعل
  if (chat.simi) {
    // تجاهل النصوص التي تحتوي على كلمات إيقاف
    if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
    
    let textodem = m.text;
    
    // تجاهل الكلمات المفتاحية للأوامر
    const ignoredCommands = [
      'serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 
      'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 
      'instalarbot', 'sc', 'sticker', 's', 'wm', 'qc'
    ];
    
    if (ignoredCommands.some(cmd => m.text.includes(cmd))) return;
    
    try {
      // الحصول على رد من سيمسيمي
      const ressimi = await simitalk(textodem);
      // إرسال الرد
      await conn.reply(m.chat, ressimi.resultado.simsimi, m, rcanal);
    } catch {
      throw '🍟 *حدث خطأ*';
    }
    return !0;
  }
  return true;
};

export default handler;

/**
 * دالة للتواصل مع سيمسيمي للحصول على ردود ذكية
 * @param {string} ask - السؤال أو النص المدخل
 * @param {string} apikeyyy - مفتاح API
 * @param {string} language - اللغة (افتراضي: العربية)
 * @returns {object} - نتيجة الرد
 */
async function simitalk(ask, apikeyyy = "iJ6FxuA9vxlvz5cKQCt3", language = "ar") {
    if (!ask) return { 
        status: false, 
        resultado: { 
            msg: "يجب إدخال نص للتحدث مع سيمسيمي." 
        }
    };
    
    try {
        // المحاولة الأولى مع API الأول
        const response1 = await axios.get(`https://deliriusapi-official.vercel.app/tools/simi?text=${encodeURIComponent(ask)}`);
        const trad1 = await translate(`${response1.data.data.message}`, {to: language, autoCorrect: true});
        
        // إذا كان الرد غير محدد، ننتقل للخيار الثاني
        if (trad1.text == 'indefinida' || response1 == '' || !response1.data) {
            throw new Error('رد غير محدد');
        }
        
        return { 
            status: true, 
            resultado: { 
                simsimi: trad1.text 
            }
        };        
    } catch {
        try {
            // المحاولة الثانية مع API البديل
            const response2 = await axios.get(`https://anbusec.xyz/api/v1/simitalk?apikey=${apikeyyy}&ask=${ask}&lc=${language}`);
            return { 
                status: true, 
                resultado: { 
                    simsimi: response2.data.message 
                }
            };       
        } catch (error2) {
            return { 
                status: false, 
                resultado: { 
                    msg: "فشلت جميع واجهات برمجة التطبيقات. حاول مرة أخرى في وقت لاحق.", 
                    error: error2.message 
                }
            };
        }
    }
}
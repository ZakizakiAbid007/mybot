import Jimp from "jimp";
import axios from 'axios';
// (ملاحظة: لم يعد الكود يحتاج إلى مكتبة FormData)

const handler = async (m, {conn, usedPrefix, command}) => {
 try {    
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || "";
  
  if (!mime) return m.reply(`🚩 *طريقة الاستخدام:*\nقم بإرسال صورة أو الرد على صورة موجودة باستخدام الأمر: ${usedPrefix + command}`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`🍂 صيغة الملف (${mime}) غير مدعومة، يجب أن تكون الصورة بصيغة JPEG أو PNG.`);
  
  conn.reply(m.chat, `🚩 *جاري تحسين جودة الصورة... قد يستغرق الأمر بعض الوقت.*`, m, {
  contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
  title: packname,
  body: dev,
  previewType: 0, thumbnail: icons,
  sourceUrl: channel }}})
  
  let img = await q.download?.();
  
  // 2. استدعاء دالة remini التي تستخدم API zahwazein
  let pr = await remini(img); 
  
  conn.sendMessage(m.chat, {image: pr, caption: `✅ تم تحسين الصورة بنجاح!`}, {quoted: fkontak});
 } catch (e) {
  console.error('❌ خطأ في معالج Remini:', e.message);
  // رسالة خطأ بسيطة
  return m.reply("❌ *حدث خطأ أثناء معالجة الطلب.*");
 }
};

// 3. إضافة الأمر "جودة" إلى قائمة الأوامر
handler.help = ["remini", "hd", "enhance", "جودة"];
handler.tags = ["ai", "tools"];
handler.command = ["remini", "hd", "enhance", "جودة"];
export default handler;

// ===============================================
// 🛠️ دالة remini (التي تستخدم API zahwazein المذكور)
// ===============================================
async function remini(imageData) {
    // 🚨 نقطة نهاية zahwazein (تم تضمين المفتاح العام كما طلبت)
    const API_URL = "https://api.zahwazein.xyz/api/image/remini?apikey=zahwazein"; 
    
    try {
        // 1. قراءة الصورة وتحويلها إلى Base64
        const jimpImage = await Jimp.read(imageData);
        const base64Image = await jimpImage.getBase64Async(Jimp.MIME_JPEG).then(b64 => b64.split(';base64,')[1]);

        // 2. إرسال الطلب عبر Axios
        const response = await axios.post(API_URL, {
            image: base64Image
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        // 3. التحقق من الاستجابة (API zahwazein يرجع JSON به رابط)
        if (response.data && response.data.result && response.data.result.url) {
            const imageUrl = response.data.result.url;
            
            // 4. تحميل الصورة المحسنة من الرابط الجديد
            const imageDownloadResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            
            // 5. التحقق من المحتوى
            const contentType = imageDownloadResponse.headers['content-type'];
            if (!contentType || (!contentType.includes('image/jpeg') && !contentType.includes('image/png'))) {
                 throw new Error(`API returned a bad image link or non-image data.`);
            }
            
            return Buffer.from(imageDownloadResponse.data);
            
        } else {
            // معالجة حالة فشل التحسين قبل إرجاع الرابط
             throw new Error(`API returned an error or unexpected format: ${JSON.stringify(response.data)}`);
        }

    } catch (error) {
        const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`فشل الاتصال بواجهة API الخارجية: ${errorMessage}`);
    }
}
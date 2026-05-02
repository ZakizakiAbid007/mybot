import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Buffer } from 'buffer';
import path from 'path';

/**
 * ترجمة النص إلى الإنجليزية (مطلوبة لأن CreArt لا تفهم العربية)
 * @param {string} text - النص المدخل (عربي/إنجليزي)
 * @returns {Promise<string>} - النص المترجم للإنجليزية
 */
async function translateToEnglish(text) {
  try {
    const url = "https://translate.googleapis.com/translate_a/single";
    const params = {
      client: "gtx",
      sl: "auto",
      tl: "en",
      dt: "t",
      q: text,
    };

    const res = await axios.get(url, { params });
    return res.data[0][0][0];
  } catch (err) {
    console.error("خطأ في الترجمة:", err.message);
    return text;
  }
}

/**
 * إنشاء صورة من النص
 * @param {string} prompt - النص الوصفي للصورة (عربي/إنجليزي)
 * @returns {Promise<Buffer>} - بيانات الصورة الناتجة
 */
async function creartTxt2Img(prompt) {
  try {
    const translatedPrompt = await translateToEnglish(prompt);

    const form = new FormData();
    form.append("prompt", translatedPrompt);
    form.append("input_image_type", "text2image");
    form.append("aspect_ratio", "4x5");
    form.append("guidance_scale", "9.5");
    form.append("controlnet_conditioning_scale", "0.5");

    const response = await axios.post(
      "https://api.creartai.com/api/v2/text2image",
      form,
      {
        headers: form.getHeaders(),
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (err) {
    throw new Error("❌ فشل في إنشاء الصورة (نص إلى صورة): " + (err?.message || err));
  }
}

/**
 * إنشاء صورة من صورة أخرى
 * @param {string} prompt - النص الوصفي للصورة (عربي/إنجليزي)
 * @param {string} imagePath - مسار ملف الصورة المدخلة
 * @returns {Promise<Buffer>} - بيانات الصورة الناتجة
 */
async function creartImg2Img(prompt, imagePath) {
  try {
    const translatedPrompt = await translateToEnglish(prompt);

    const form = new FormData();
    form.append("prompt", translatedPrompt);
    form.append("input_image_type", "image2image");
    form.append("aspect_ratio", "4x5");
    form.append("guidance_scale", "9.5");
    form.append("controlnet_conditioning_scale", "0.5");
    form.append("image_file", fs.createReadStream(imagePath));

    const response = await axios.post(
      "https://api.creartai.com/api/v2/image2image",
      form,
      {
        headers: form.getHeaders(),
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (err) {
    throw new Error("❌ فشل في إنشاء الصورة (صورة إلى صورة): " + (err?.message || err));
  }
}

let handler = async (m, { conn, command, text }) => {
  if (command === 'تخيل-انمي') {
    let taguser = m.sender.split('@')[0];
    
    // التحقق من وجود نص
    if (!text) {
      return conn.sendMessage(m.chat, { 
        text: `*⟣┈┈┈┈┈⟢┈┈┈⟣┈┈┈┈┈⟢*\n❌┊⇇ يـا @${taguser} يـرجـى إدخـال وصـف للـصـورة\n*⟣┈┈┈┈┈⟢┈┈┈⟣┈┈┈┈┈⟢*`,
        mentions: [m.sender]
      }, { quoted: m });
    }
    
    try {
      // التحقق من وجود صورة مرفقة
      let quoted = m.quoted ? m.quoted : m;
      let mime = (quoted.msg || quoted).mimetype || '';
      let isImage = /image\/(jpe?g|png|webp)/.test(mime);
      
      let imageBuffer;
      
      if (isImage) {
        // حفظ الصورة المرفقة مؤقتاً
        let media = await quoted.download();
        let imagePath = path.join('/tmp', `input_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, media);
        
        console.log("جاري إنشاء صورة أنمي من الصورة المرفقة...");
        imageBuffer = await creartImg2Img(text, imagePath);
        fs.unlinkSync(imagePath); // حذف الصورة المؤقتة
      } else {
        console.log("جاري إنشاء صورة أنمي من النص...");
        imageBuffer = await creartTxt2Img(text);
      }
      
      // حفظ الصورة الناتجة مؤقتاً
      const outputPath = path.join('/tmp', `anime_output_${Date.now()}.png`);
      fs.writeFileSync(outputPath, imageBuffer);
      
      // إرسال الصورة الناتجة
      await conn.sendMessage(m.chat, {
        image: fs.readFileSync(outputPath),
        caption: `*⟣┈┈┈┈┈⟢┈┈┈⟣┈┈┈┈┈⟢*\n✅┊⇇ تـم إنـشـاء صـورة الأنـمـي بـنـجـاح يـا @${taguser}\n*⟣┈┈┈┈┈⟢┈┈┈⟣┈┈┈┈┈⟢*`,
        mentions: [m.sender]
      }, { quoted: m });
      
      // حذف الصورة المؤقتة
      fs.unlinkSync(outputPath);
      
    } catch (error) {
      console.error(error.message);
      await conn.sendMessage(m.chat, { 
        text: `*⟣┈┈┈┈┈⟢┈┈┈⟣┈┈┈┈┈⟢*\n❌┊⇇ حـدث خـطأ فـي إنـشـاء الـصـورة يـا @${taguser}\n*⟣┈┈┈┈┈⟢┈┈┈⟣┈┈┈┈┈⟢*`,
        mentions: [m.sender]
      }, { quoted: m });
    }
  }
};

handler.help = ['تخيل-انمي <وصف>'];
handler.tags = ['tools'];
handler.command = ['تخيل-انمي'];

export default handler;
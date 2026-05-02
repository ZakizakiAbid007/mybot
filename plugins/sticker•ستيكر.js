//código creado x The Carlos 👑 
import Jimp from "jimp";
import { sticker } from '../lib/sticker.js';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text }) => {
  
  // 1. التحقق من الإدخال
  if (!text) return m.reply("⚠️ اكتب شيئًا بعد .ملصق_ملاحظة\nمثال: *.ملصق_ملاحظة مرحباً*");

  // 2. تقييد طول النص بـ 20 كلمة
  let words = text.split(/\s+/).slice(0, 20);
  text = words.join(' ');

  // 3. قراءة الصورة الأساسية للملصق (الخلفية)
  let image = await Jimp.read("./src/sticker/nota.jpg"); // يفترض وجود الصورة هنا 

[Image of a stylized paper note background]


  // 4. إعدادات الخط وحجم النص
  let fontSize = 200;
  let font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK); // البدء بخط كبير نسبياً
  const maxWidth = image.bitmap.width - 60; // أقصى عرض للنص (مع ترك هامش 30 بكسل من كل جانب)
  const maxHeight = 500; // أقصى ارتفاع مسموح للنص

  // 5. تعديل حجم الخط ديناميكياً ليناسب المساحة المحددة (Dynamic Font Size)
  while (Jimp.measureTextHeight(font, text, maxWidth) > maxHeight && fontSize > 64) {
    fontSize -= 16;
    // اختيار الخط المناسب حسب الحجم لتقليل استهلاك الذاكرة
    font = await Jimp.loadFont(
      fontSize > 128 ? Jimp.FONT_SANS_128_BLACK :
      fontSize > 64 ? Jimp.FONT_SANS_64_BLACK :
      Jimp.FONT_SANS_32_BLACK
    );
  }

  // 6. حساب موضع النص العمودي (التوسيط العمودي)
  const textHeight = Jimp.measureTextHeight(font, text, maxWidth);
  const y = (image.bitmap.height - textHeight) / 2; // توسيط النص في منتصف الصورة

  // 7. طباعة النص على الصورة
  image.print(
    font,
    30, // موضع البدء الأفقي (هامش يسار)
    y, // موضع البدء العمودي (المُحسوب للتوسيط)
    {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, // توسيط أفقي للنص داخل المساحة
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    },
    maxWidth,
    textHeight
  );

  // 8. تحويل الصورة الناتجة إلى Buffer ثم إلى ملصق
  let buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  let stiker = await sticker(buffer, false, '𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊𝖗', 'The Carlos 👑'); // تخصيص اسم الحزمة والمؤلف

  if (!stiker) return m.reply("❌ لم نتمكن من توليد الملصق.");

  // 9. تزيين رسالة الإرسال (Context Info)
  const imgFolder = path.join('./src/img');
  let imgFiles = [];
  if (fs.existsSync(imgFolder)) {
    imgFiles = fs.readdirSync(imgFolder).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  }
  let contextInfo = {};
  if (imgFiles.length > 0) {
    // يستخدم الكود هنا أول صورة يجدها في المجلد كـ Thumbnail
    contextInfo = {
      externalAdReply: {
        title: '𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊𝖗 | ملاحظة 📝',
        body: 'Dev • The Carlos 👑',
        mediaType: 2,
        thumbnail: fs.readFileSync(path.join(imgFolder, imgFiles[0]))
      }
    };
  }

  // 10. إرسال الملصق
  await conn.sendMessage(m.chat, { sticker: stiker, contextInfo }, { quoted: m });
};

handler.help = ['n', 'nota', 'ستيك'];
handler.tags = ['sticker'];
handler.command = ['n', 'nota', 'ستيك', 'ملصق_ملاحظة'];
handler.group = false;
handler.register = true;
export default handler;
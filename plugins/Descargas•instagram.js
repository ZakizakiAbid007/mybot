import { igdl } from "ruhend-scraper"
// يجب أن تكون المتغيرات العامة (global) مُعرفة في ملف handler.all مثل rwait, error, packname, dev, icons, channel, fkontak, textbot.

let handler = async (m, { args, conn }) => { 
    // 1. التحقق من وجود الرابط
    if (!args[0]) {
        return conn.reply(m.chat, '🍟 *أمر ملكي! أدخل رابط إنستجرام للتحميل يا مالكي.*', m, global.rcanal);
    }
  
    try {
        await m.react(global.rwait); // تفاعل (جاري الانتظار)
        
        // رسالة جار التحميل المتقدمة
        conn.reply(m.chat, `🕒 *تنفيذ أمر الملك! جاري جلب محتوى إنستجرام...*`, m, {
          contextInfo: { 
              externalAdReply: { 
                mediaUrl: null, 
                mediaType: 1, 
                showAdAttribution: true,
                title: global.packname,
                body: global.dev,
                previewType: 0, 
                thumbnail: global.icons,
                sourceUrl: global.channel 
              }
          }
        });      
     
        // 2. جلب البيانات
        let res = await igdl(args[0]);
        let data = res.data;       
       
        // 3. التحقق من وجود نتائج
        if (!data || data.length === 0) {
            await m.react(global.error);
            return conn.reply(m.chat, 
                `❌ *لم يتم العثور على أي محتوى صالح لهذا الرابط يا مالكي!*
                \nيرجى التأكد من أن:\n• الرابط صحيح.\n• الحساب عام وليس خاصاً (Private).`, 
                m, global.fake);
        }

        // 4. إرسال الوسائط بشكل متسلسل
        for (let media of data) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // تأخير بين كل ملف
          await conn.sendFile(m.chat, media.url, 'instagram.mp4', 
            `👑 *بأمر من الملك تنغن*\n\n🍟 *إليك محتوى إنستجرام المطلوب*`, 
            global.fkontak); // استخدام fkontak للرد المقتبس
        }
        
        await m.react(global.done); // تفاعل (تم بنجاح)

    } catch (e) {
        await m.react(global.error);
        console.error("خطأ في تنزيل إنستجرام:", e);
        conn.reply(m.chat, '🚩 *حدث خطأ فادح في عملية التنزيل. قد يكون الرابط خاطئاً أو الخدمة معطلة.*', m, global.fake);
    }
}

handler.command = ['انستا', 'ig', 'انستغرام']
handler.tags = ['downloads', 'تنزيل']
handler.help = ['instagram', 'ig']
handler.cookies = 1
handler.register = true

export default handler
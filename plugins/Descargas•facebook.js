import { igdl } from 'ruhend-scraper' // ملاحظة: اسم igdl قد يوحي بتنزيل إنستجرام، لكن الكود يستخدمه للفيسبوك

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
    // 1. التحقق من وجود الرابط
    if (!args[0]) {
        return conn.reply(m.chat, `🍟 *يا مالكي، يجب إدخال رابط فيديو فيسبوك للتحميل!*`, m, rcanal);
    }
  
    let res;
    try {
        // رسالة جار التحميل المتقدمة
        conn.reply(m.chat, `🕒 *أمر ملكي بالتحميل! جاري جلب الفيديو من الفيسبوك...*`, m, {
          contextInfo: { 
              externalAdReply: { 
                mediaUrl: null, 
                mediaType: 1, 
                showAdAttribution: true,
                title: global.packname, // يجب أن تكون معرفة كـ global
                body: global.dev, // يجب أن تكون معرفة كـ global
                previewType: 0, 
                thumbnail: global.icons, // يجب أن تكون معرفة كـ global
                sourceUrl: global.channel // يجب أن تكون معرفة كـ global
              }
          }
        });
        await m.react(global.rwait); // تفاعل (جاري الانتظار)
        
        // 2. جلب البيانات من API
        res = await igdl(args[0]);
    } catch (e) {
        await m.react(global.error);
        // رسالة خطأ واضحة
        return conn.reply(m.chat, '🚩 *خطأ في الاتصال أو الرابط. تأكد من أن الفيديو عام وغير محظور.*', m, global.fake);
    }
  
    let result = res.data;
    // 3. التحقق من عدم وجود نتائج (لم يتم العثور على النتائج)
    if (!result || result.length === 0) {
        await m.react(global.error);
        return conn.reply(m.chat, 
            `❌ *لم يتم العثور على أي فيديو صالح لهذا الرابط يا مالكي!*
            \nيرجى التأكد من أن:\n• الرابط صحيح.\n• الفيديو ليس خاصاً (Private).`, 
            m, global.fake);
    }
  
    let data;
    try {
        // 4. محاولة الحصول على أفضل دقة متاحة
        data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
    } catch (e) {
        await m.react(global.error);
        return conn.reply(m.chat, '🚩 *خطأ داخلي في معالجة جودة الفيديو*', m, global.rcanal);
    }
  
    if (!data) {
        await m.react(global.error);
        return conn.reply(m.chat, '🚩 *لم يتم العثور على دقة 720p أو 360p للفيديو.*', m, global.rcanal);
    }
  
    let video = data.url;
    
    // 5. إرسال الفيديو للمستخدم
    try {
        await m.react(global.rwait);
        await conn.sendMessage(m.chat, { 
          video: { url: video }, 
          caption: `👑 *بأمر من الملك تنغن* 👑\n\n🍟 *فيديو الفيسبوك جاهز*\n` + global.textbot, // يجب أن تكون global.textbot معرفة
          fileName: 'fb.mp4', 
          mimetype: 'video/mp4' 
        }, { quoted: global.fkontak }); // استخدام fkontak لرد احترافي
        
        await m.react(global.done);
    } catch (e) {
        await m.react(global.error);
        // يمكن أن يفشل الإرسال بسبب حجم الفيديو الكبير جداً
        return conn.reply(m.chat, '🚩 *خطأ في إرسال الفيديو. قد يكون حجمه كبيراً جداً.*', m, global.rcanal);
    }
}

handler.help = ['facebook', 'fb', 'تحميل_فيسبوك']
handler.tags = ['downloads', 'تنزيل']
handler.command = ['facebook', 'fb', 'فيسبوك']
handler.cookies = 1
handler.register = true

export default handler
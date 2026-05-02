import axios from "axios"
import fs from 'fs'
import path from 'path'

let handler = async (m, { command, conn }) => {
    try {
        // 1. جلب بيانات الصور من الرابط الخارجي بناءً على اسم الأمر (command)
        let res = (await axios.get(`https://raw.githubusercontent.com/davidprospero123/api-anime/main/BOT-JSON/anime-${command}.json`)).data
        
        // اختيار صورة عشوائية من القائمة التي تم جلبها
        let image = res[Math.floor(Math.random() * res.length)]
        
        // بناء التسمية التوضيحية (Caption)
        let caption = `*${command}*\n\nكود تم إنشاؤه بواسطة The Carlos 👑`

        // 2. محاولة جلب صورة مصغرة (Thumbnail) محلية من مجلد 'src/img'
        let imgFolder = path.join('./src/img')
        // تصفية الملفات التي تنتهي بـ (jpg, png, webp)
        let imgFiles = fs.existsSync(imgFolder) ? fs.readdirSync(imgFolder).filter(f => /\.(jpe?g|png|webp)$/i.test(f)) : []
        
        let thumbnail = null
        if (imgFiles.length > 0) {
            // اختيار صورة مصغرة عشوائية وقراءتها
            let imgPath = path.join(imgFolder, imgFiles[Math.floor(Math.random() * imgFiles.length)])
            thumbnail = fs.readFileSync(imgPath)
        }

        // 3. إرسال الرسالة
        await conn.sendMessage(
            m.chat,
            {
                image: { url: image }, // الصورة الرئيسية
                caption, // التسمية التوضيحية
                // إضافة ContextInfo إذا توفرت صورة مصغرة (Thumbnail)
                contextInfo: thumbnail ? { externalAdReply: { mediaType: 2, title: "أنمي", body: "بواسطة The Carlos", thumbnail } } : {}
            },
            { quoted: m }
        )

    } catch (e) {
        // رسالة الخطأ
        await conn.sendMessage(m.chat, { text: `⚠️ خطأ في جلب صور *${command}*. تأكد من وجود اسم الشخصية بشكل صحيح.` }, { quoted: m })
        console.error(e)
    }
}

// تعريف الأوامر والصلاحيات
handler.command = handler.help = [
    'اليزا','ايهوشينو','ريمشام','اكيرا','اكياما','آنا','اسونا','ايوزاوا','بوروتو','شيهو','شيتوجي',
    'ديدارا','ايرزا','ايلاينا','ايبا','ايميليا','هيستيا','هيناتا','اينوري','ايسوزو','ايتاشي','ايتوري','كاجا',
    'كاجورا','كاوري','كنيكي','كوتوري','كوروميتوكيساكي','مادارا','ميكاسا','ميكو','ميناتو','ناروتو',
    'نيزوكو','ساجيري','ساسكي','ساكورا',
    // الأوامر الأصلية مضافة كبديل
    'alisa','aihoshino','remcham','akira','akiyama','anna','asuna','ayuzawa','boruto','chiho','chitoge',
    'deidara','erza','elaina','eba','emilia','hestia','hinata','inori','isuzu','itachi','itori','kaga',
    'kagura','kaori','keneki','kotori','kurumitokisaki','madara','mikasa','miku','minato','naruto',
    'nezuko','sagiri','sasuke','sakura'
]
handler.tags = ['انمي']
handler.register = true // يفترض أن هذا الأمر يتطلب التسجيل

export default handler
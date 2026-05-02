const handler = async (m, { usedPrefix, command }) => {
    // جلب مدة التشغيل بالثواني من عملية Node.js
    let uptime = await process.uptime();
    
    // بناء رسالة مدة التشغيل المعرَّبة
    let runtime = `${global.packname}

✰ *مـدة الـتـشـغـيـل:* ${rTime(uptime)}`;
    
    // إرسال الرد برسالة متقدمة (External Ad Reply)
    conn.reply(m.chat, runtime, m, { 
        contextInfo: { 
            externalAdReply: { 
                mediaUrl: false, 
                mediaType: 1, 
                description: false, 
                title: packname, // يجب أن تكون packname معرفة كـ global
                body: dev, // يجب أن تكون dev معرفة كـ global
                previewType: 0, 
                thumbnail: icons, // يجب أن تكون icons معرفة كـ global
                sourceUrl: channel // يجب أن تكون channel معرفة كـ global
            }
        }
    });
};

// معلومات تعريف الأمر
handler.help = ['runtime', 'مدة_التشغيل']
handler.tags = ['main']
handler.command = ['uptime', 'runtime', 'مدة_التشغيل', 'نشط']

export default handler

// *** دالة تنسيق الوقت المعرَّبة ***

// ملاحظة: تم حذف المتغيرات dd و time لأنها غير مستخدمة في الدالة الحالية
// وكانت تظهر في الكود الأصلي لكنها لا تؤثر على rTime.

function rTime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    
    // تعريب وحدات الوقت:
    var dDisplay = d > 0 ? d + (d == 1 ? " يوم, " : " أيام, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " ساعة, " : " ساعات, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " دقيقة, " : " دقائق, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " ثانية" : " ثواني") : "";
    
    // إزالة الفواصل الزائدة في النهاية إذا كانت النتيجة فارغة
    let result = (dDisplay + hDisplay + mDisplay + sDisplay).trim();
    if (result.endsWith(',')) {
        result = result.slice(0, -1);
    }
    
    return result || "لحظات"; // في حال كانت مدة التشغيل قصيرة جداً
};
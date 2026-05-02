// الملف: ق10.js - أزرار أوامر المطور المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg';

// **رقم المالك (تنسيق JID):**
const OWNER_JID = '212706595340@s.whatsapp.net';

const handler = async (m, { conn }) => {
    
    // 🛑 التعديل هنا: نتحقق فقط من رقم المرسل (m.sender) 🛑
    // إذا كان المرسل ليس هو المالك المحدد، يتم الرفض
    if (m.sender !== OWNER_JID) {
        return conn.reply(m.chat, 'هذا القسم خاص بالـمَـلِـكِ **تِـنْغَـنْ** وحده.', m);
    }
    // ملاحظة: إذا كان البوت يضيف أرقام أخرى كمالكين، يمكنك استخدام:
    // if (m.sender !== OWNER_JID && !m.isOwner) { ... }
    // ولكن للحل الفوري، سنعتمد على رقمك فقط.
    

    let name = conn.getName(m.sender) || 'مطور'
    await conn.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ ⚙️ قِـسْـمُ الْـمُـطَـوِّرِ - بَـوَابَـةُ الـمَـلِـكِ*\n*╰─────────•『👑』•─────────╯*\n\n*يَـا ${name}، أَوَامِـرُ الـسَّـيْـطَـرَةِ جَـاهِـزَةٌ:* 👇`

    // تم تنظيم القائمة وتنسيق الرموز التعبيرية (الإيموجي)
    const commandList = [
        // 1. إدارة المطورين (Developers)
        { title: 'عملية إعادة التشغيل 🔄', id: '.ريستارت' },
        { title: 'حذف_بيانات_كاملة 💥', id: '.حذف_بيانات_كاملة' },
        { title: 'اسم_جديد_للبوت ✏️', id: '.اسم_جديد_للبوت' },
        { title: 'ضف_مطور ➕', id: '.ضف_مطور' },
        { title: 'حذف_مطور ➖', id: '.حذف_مطور' },
        
        // 2. إدارة النظام والصيانة (System & Maintenance)
        { title: 'حذف-جلسات 🗑️', id: '.حذف-جلسات' },
        { title: 'مسح_مؤقت جلسات ⏱️', id: '.مسح_مؤقت' },
        { title: 'تنفيد الكوموند للمنصة 💻', id: '.شيل' },
        { title: 'ضف_كود بلونز مباشرة ⌨️', id: '.ضف_كود' },
        
        // 3. الإذاعة والشبكة (Broadcasting)
        { title: 'البث للجميع 📢', id: '.ارسال' },
        { title: 'بث_البوتات للمجموعات 📣', id: '.بث_البوتات' },
        { title: 'ارسال_للفروع 📡', id: '.اتباعي_نشر' },
        
        // 4. التحكم بالمجموعات (Groups)
        { title: 'الخروج من المجموعة 🚪', id: '.اخرج' },
        { title: 'الحصول على قائمة_المجموعات 🗂️', id: '.قائمة_المجموعات' },
        
        // 5. إدارة المستخدمين والاقتصاد (Economy)
        { title: 'إضافة مال للمستخدم 💰', id: '.منح' },
        { title: 'وضع_لامحدود (EXP) ⭐', id: '.وضع_لامحدود' }
    ];

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ قِـسْـمِ الْـمُـطَـوِّرِ`,
                sections: [{
                    title: 'اخـتـر الأمـر',
                    rows: commandList.map(cmd => ({ title: cmd.title, id: cmd.id }))
                }]
            })
        }
    ]

    await conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: menuText },
                    footer: { text: YOUR_NAME_TITLE },
                    header: { hasMediaAttachment: true, imageMessage: messa.imageMessage },
                    nativeFlowMessage: { buttons }
                }
            }
        }
    }, {})
}

handler.command = /^(ق10)$/i;
// 🛑 تم إزالة handler.owner = true للسماح بدخول الدالة أولاً.
// handler.owner = true 

export default handler;
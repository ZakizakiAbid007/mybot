// الملف: ق5.js - أزرار أوامر التحميل المباشرة (مُصحح)
import { prepareWAMessageMedia } from '@whiskeysockets/baileys'

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/T1CG4GHh/c4bac4df1cf0be95920442ceae42fa8e.jpg';

const handler = async (m, { conn }) => {
    try {
        let name = conn.getName(m.sender) || 'مستخدم'
        
        // إضافة تفاعل
        await conn.sendMessage(m.chat, { react: { text: '🎵', key: m.key } })

        // تحضير الصورة
        const messa = await prepareWAMessageMedia(
            { image: { url: CUSTOM_IMAGE_URL } }, 
            { upload: conn.waUploadToServer }
        )

        const menuText = `*╭─────────•『👑』•─────────╮*
*│ 🎵 قِـسْـمُ تَـحْـمِـيـلِ الْـمِـيـدِيَـا*
*╰─────────•『👑』•─────────╯*

*أَوَامِـرُ تَـحْـمِـيـلِ الـمُـحْـتَـوَى جَـاهِـزَةٌ:* 👇`

        // قائمة الأوامر مع الفواصل الصحيحة
        const commandList = [
            { title: 'تحميل فيديو 🎥', id: '.فيديو' },
            { title: 'تشغيل صوت 🎵', id: '.شغل' },
            { title: 'تحميل أغنية 🎶', id: '.اغنية' },
            { title: 'تحميل من سبوتيفاي 🎧', id: '.سبوتيفاي' },
            { title: 'ميديافاير .mf ⬆️', id: '.mf' },
            { title: 'تحميل من يوتيوب 📺', id: '.يوتيوب' },
            { title: 'تحميل تطبيق 📱', id: '.تطبيق' },
            { title: 'تحميل من انستا 📸', id: '.انستا' },
            { title: 'تحميل من تيك توك 🎵', id: '.تيك' },
            { title: 'تحميل من بينتيريست 📌', id: '.صور' },  // ← الفاصلة المضافة هنا
            { title: 'روابط مشاهدة انمي 📌', id: '.روابط_انمي' } , 
        ]

        const buttons = [
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: `📜 أوَامِـرُ الْـتَّـحْـمِـيـلَاتِ`,
                    sections: [{
                        title: 'اخـتـر الأمـر الـمـنـاسـب',
                        rows: commandList.map(cmd => ({
                            title: cmd.title,
                            id: cmd.id,
                            description: `اضغط لتنفيذ: ${cmd.id}`
                        }))
                    }]
                })
            }
        ]

        // إرسال الرسالة التفاعلية
        await conn.relayMessage(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: menuText },
                        footer: { text: YOUR_NAME_TITLE },
                        header: { 
                            hasMediaAttachment: true, 
                            imageMessage: messa.imageMessage 
                        },
                        nativeFlowMessage: { buttons }
                    }
                }
            }
        }, {})

    } catch (error) {
        console.error('خطأ في عرض القائمة:', error)
        
        // بديل في حالة فشل الرسالة التفاعلية
        await conn.sendMessage(m.chat, {
            text: `❌ حدث خطأ في عرض القائمة التفاعلية\n\n*يمكنك استخدام:*\n${commandList.map(cmd => `📍 ${cmd.id} - ${cmd.title}`).join('\n')}`,
            mentions: [m.sender]
        }, { quoted: m })
    }
}

// الأوامر المسجلة
handler.help = ['ق5']
handler.tags = ['الأوامر']
handler.command = /^(ق5|تحميل|ميديا)$/i

export default handler
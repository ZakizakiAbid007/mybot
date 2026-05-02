// الملف: ق7.js - أزرار أوامر الذكاء الاصطناعي والمعلومات المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🧠', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 🧠 قِـسْـمُ الـذَّكَـاءِ الْاِصْـطِـنَاعِـي*\n*╰─────────•『👑』•─────────╯*\n\n*أَوَامِـرُ الْـتَّـفَـاعُـلِ الـذَّكِـيِّ جَـاهِـزَةٌ:* 👇`

    const commandList = [
        // الذكاء الاصطناعي
        { title: 'الرد الذكي (AI) 🧠', id: '.بوت' },
        { title: 'الدردشة (لوفي ⚓) 💬', id: '.لوفي' },
        { title: 'ترجمة نص 🌐', id: '.ترجم' },
        { title: 'توليد صور (تخيل) 🎨', id: '.تخيل' },
        { title: '🍥إنشاء صورة أنمي', id: '.تخيل-انمي' },
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ الـذَّكَـاءِ الْاِصْـطِـنَاعِـي`,
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

handler.command = /^(ق7)$/i;
export default handler;
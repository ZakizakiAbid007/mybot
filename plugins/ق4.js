// الملف: ق4.js - أزرار أوامر التحويلات المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/tqbQxZcP/c8c75a230d652e70a57f364f2c3c20b9.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 🎨 قِـسْـمُ الْـوَسَـائِـطِ وَ الـتَّـحْـوِيـلِ*\n*╰─────────•『👑』•─────────╯*\n\n*أَوَامِـرُ الـتَّـحْوِيـلِ وَ الـتَّـصـمـيـمِ جَـاهِـزَةٌ:* 👇`

    const commandList = [
        { title: 'تحويل لجودة عالية 🎨', id: '.جودة' },
        { title: 'تحويل لملصق 🏷️', id: '.لملصق' },
        { title: 'صنع ملصق 📌', id: '.بات' },
        { title: 'تحويل لصورة 🖼️', id: '.لصورة' },
        { title: 'نص الى صوت(قل) 💬', id: '.قل' },
        { title: 'نص الى صوت انمي(صوت)📲', id: '.سوكونا' },
        { title: 'صوت سريع(💨)', id: '.سريع' },
        { title: 'صوت سنجاب🐿️  ', id: '.سنجاب' },
        { title: 'تحويل الفيديو🎭GIF', id: '.لجيف' },
        { title: 'فضح مرة واحدة 👁️', id: '.فضح' },
        { title: ' حقوق الملصق 👤', id: '.حقوق' },
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ الْـتَّـحْـوِيـلَاتِ`,
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

handler.command = /^(ق4)$/i;
export default handler;
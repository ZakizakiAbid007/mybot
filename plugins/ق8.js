// الملف: ق8.js - أزرار أوامر الإنترنت والمعلومات المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🌐', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 🌐 قِـسْـمُ الْـإِنْـتِـرْنِـتِ وَ الْـمَـعْـلُـومَـاتِ*\n*╰─────────•『👑』•─────────╯*\n\n*أَوَامِـرُ الْـبَـحْـثِ وَ الْـاِتِّـصَـالِ جَـاهِـزَةٌ:* 👇`

    const commandList = [
        { title: 'معلومات المانغا 🍟', id: '.manga' },
        { title: 'سرعة البوت⏱', id: '.سرعة' },
        { title: '📊 إحـصـائـيـات بـوت تـنـغـن', id: '.احصائيات' },
        { title: 'البحث في جيثب 💻', id: '.جيثب' },
        { title: 'معلومات انستجرام 📷', id: '.انستجرام' },
        { title: 'معلومات عدد-اوامر 👥', id: '.عدد-اوامر' },
        { title: 'سكرين شوت 📸', id: '.سكرين_شوت' },
        { title: 'تخفيض رابط 🔗', id: '.تخفيض_رابط' }
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ الْـإِنْـتِـرْنِـتِ`,
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

handler.command = /^(ق8)$/i;
export default handler;
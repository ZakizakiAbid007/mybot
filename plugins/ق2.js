// الملف: ق2.js - أزرار أوامر الأنمي والرياكشن المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/7Py6bZ31/c4bac4df1cf0be95920442ceae42fa8e.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🎎', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 🎌 قِـسْـمُ الْأَنْـمِـي وَ الرِّيَـاكْـشِـن*\n*╰─────────•『👑』•─────────╯*\n\n*اخـتَـرْ إِجْـرَاءَكَ مُـبَـاشَـرَةً:* 👇`

    const commandList = [
        { title: 'صور+اي صرة تريد او أنمي 🎎', id: '.صور انمي' },
        { title: 'رياكشن بكاء 😢', id: '.بكاء' },
        { title: 'رياكشن عناق 🤗', id: '.عناق' },
        { title: 'رياكشن صفع 👊', id: '.صفع' },
        { title: 'يأخذ قيلولة 😴', id: '.نعاس' },
        { title: 'رقص💃', id: '.رقص' },
        { title: 'خجلان 😳', id: '.خجل' },
        { title: 'تطقيم_بنات ❤️', id: '.طقمي' },
        { title: 'رعب 😨', id: '.خائف' },
        { title: 'زنوج من فصيلة زنجاب 💀', id: '.زنجي' },
        { title: ' من فصيلة حيوان 🦁🌲', id: '.حيوان' },
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ قِـسْـمِ الْأَنْـمِـي`,
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

handler.command = /^(ق2)$/i;
export default handler;
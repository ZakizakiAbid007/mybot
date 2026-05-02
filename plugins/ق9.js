// الملف: ق9.js - أزرار أوامر الترفيه والمزاح المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/7w2FmNyC/41187c79fcad726d466fa80e90a51207.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🎭', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 🎭 قِـسْـمُ الْـتَّـرْفِـيـه وَ المعرفة*\n*╰─────────•『👑』•─────────╯*\n\n*الْـمَـهْـرَجَـانَـاتُ تُـنَـادِي! اخـتَـرْ لِـتَـبْـدَأ:* 👇`

    const commandList = [
        { title: 'شخصية 🎭', id: '.اوصف•.' },
        { title: ' .غباء 🤪', id: '.غباء' },
        { title: '10 توب. 🏅', id: '.توب' },
        { title: 'اصدقاء عشوائي 📜', id: '.صداقة' },
        { title: 'زواج 🖼️', id: '.زواج' },
        { title: 'جمال مع المنشن 😂', id: '.جمال' },
        { title: 'حكمة 💡', id: '.حكمة' },
        { title: 'طلاق ℹ️', id: '.طلاق' },
        { title: 'اقتباس 🌟', id: '.اقتباس' },
        { title: 'قمع 🎭', id: '.قمع' },
        { title: 'مغازلة 💘', id: '.مغازلة' },
        { title: 'لعبة هل ❓', id: '.هل' },
        { title: 'هل أنت غبي؟ 🤦', id: '.غبي' },
        { title: 'نسبة حب 📊', id: '.حب' },
        { title: 'بيكرهك 🔪', id: '.بيكرهني' },
        { title: 'مات ⚰️', id: '.مات' },
        { title: 'بيحبك 💖', id: '.بيحبني' },
        { title: 'المتصلين 📞', id: '.المتصلين' },
        { title: 'اديت انمي🎯', id: '.اديت'}, 
        { title: '👻 قائمة الأشباح', id: '.الاشباح' },
        { title: 'تهكير💻', id: '.تهكير' }, 
        { title: 'اديت-كورة ⚽', id: '.اديت-كورة' },
        { title: 'االنسبة المئوية كسول 😏💦', id: '.كسول' },
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ الْـتَّـرْفِـيـه`,
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

handler.command = /^(ق9)$/i;
export default handler;
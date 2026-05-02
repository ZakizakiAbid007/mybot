// الملف: ق1.js - أزرار أوامر الألعاب المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const BOT_NAME = 'تِـنْـغَـنْ';
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/Ls393WJK/mntnmanlanlamlt.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🕹️', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*
*│ 🎮 قِـسْـمُ الْأَلْـعَـابِ - مَـمْـلَـكَةُ ${BOT_NAME}*
*╰─────────•『👑』•─────────╯*

*مَـرْحَـبـاً بِـكَ يَا ${name}، اخـتَـرْ لُـعْـبَـتَـكَ الـمُـفَـضَّـلَـةَ مُـبَـاشَـرَةً:* 👇`

    const commandList = [
        { title: 'احزر العلم 🚩', id: '.علم' },
        { title: 'احزر شخصية انمي 🧠', id: '.احزر' },
        { title: 'لعبة العين 👁️', id: '.عين' },
        { title: 'لعبة المارد 🧞 الأزرق', id: '.مارد' },
        { title: 'تفكيك الكلمات 🧩', id: '.تفكيك' },
        { title: 'ترتيب شخصية انمي 🔄', id: '.ترتيب' },
        { title: '🥕 لعبة الخضار والفواكه 🍉', id: '.خضار' },
        { title: 'احزر الإيموجي 😊', id: '.ايموجي' },
        { title: 'أسئلة رياضية 🏃', id: '.رياضه' },
        { title: 'سؤال انمي ❓', id: '.سؤال' },
        { title: 'خمن بطل انمي 🤔', id: '.خمن' },
        { title: 'لعبة التاج 👑', id: '.تاج' },
        { title: 'اكس أو ❌⭕', id: '.اكس او' },
        { title: 'لعبة لو 🎰', id: '.لو' },
        { title: 'احزر الحرف مفقود ⛏️', id: '.شنق' },
        { title: 'ثقافة عامة 📚', id: '.ثقافة' },
        { title: 'تحدي ⚔️', id: '.تحدي' },
        { title: 'صراحة 💬', id: '.صراحة' },
        { title: 'لغز انمي ✨️', id: '.لغز' },
        { title: 'سـرعة الكـتـابـة كت ✍️', id: '.كت' },
        { title: 'ما هي عاصمة 🌍 🤔', id: '.عاصمه' },
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ قِـسْـمِ الْأَلْـعَـابِ`,
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

handler.command = /^(ق1)$/i;
export default handler;
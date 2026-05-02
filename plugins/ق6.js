// الملف: ق6.js - أزرار أوامر البنك والاقتصاد المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '🏦', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 💰 قِـسْـمُ الْاِقْـتِـصَادِ وَ الْـبَـنْـكِ*\n*╰─────────•『👑』•─────────╯*\n\n*تَـعَـامَـلْ مَـعَ ثَـرْوَاتِـكَ مُـبَـاشَـرَةً:* 👇`

    const commandList = [
        { title: 'حالة البنك 🏦', id: '.بنك' },
        { title: 'بنوك سداد . 🏦', id: '.بنوك سداد' },
        { title: 'بنوك طلب .🏦', id: '.بنوك طلب' },
        { title: 'إيداع أموال 💳', id: '.ايداع' },
        { title: 'سرقة أموال 💰', id: '.سرقة' },
        { title: 'اضافة العملات  👛', id: '.عملات' },
        { title: 'مستواك الحالي 📊', id: '.مستوى' },
        { title: 'أعلى الأثرياء 🏆', id: '.الترتيب' },
        { title: 'ممارسة العمل 💼', id: '.عمل' },
        { title: 'المكافأة اليومية 📅', id: '.يومي' },
        { title: 'ممارسة الصيد 🏹', id: '.صيد' },
        { title: 'حظ هدية 🎁', id: '.هدية' },
        { title: '💎 عدد الماس ', id: '.الماس' },
        { title: 'عملة إضافية ⛏️ 🪙', id: '.تعدين' },
        { title: 'عـمـلاتـك  🪙', id: '.عملاتي' },
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ الْـبَـنْـكِ`,
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

handler.command = /^(ق6)$/i;
export default handler;
// الملف: menu_main.js (القائمة الرئيسية المزخرفة للملك تنغن)
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن (البيانات المحدثة)
const TENGEN_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'; // رابط قناة تنغن
const DEVELOPER_NUMBER = '+212602686838'; // رقم المطور تنغن
const BOT_NAME = 'تِـنْـغَـنْ';
const YOUR_NAME_TITLE = 'تِنْـغَـنْ👑مَـلِـكُ الـمَـهْـرَجَـانَـاتِ';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/C0rsdTnJ/fe5a547f50ff075c6697d8802c96f31f.jpg';

function clockString(ms) {
let h = Math.floor(ms / 3600000)
let m = Math.floor((ms % 3600000) / 60000)
let s = Math.floor((ms % 60000) / 1000)
return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender] || {}
let name = conn.getName(m.sender) || 'مستخدم'
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
await conn.sendMessage(m.chat, { react: { text: '👑', key: m.key } })

// 📸 إعداد الصورة 📸
const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

// 📜 النص الرئيسي
const menuText = `
*╭┄┄┄┄┄┄┄ ♔ ┄┄┄┄┄┄┄╮*
*│ 👑 مَـمْـلَـكَةُ ${BOT_NAME} 👑*
*│ ${YOUR_NAME_TITLE}*
*╰┄┄┄┄┄┄┄ ♔ ┄┄┄┄┄┄┄╯*
*أَهْـلَـاً بِـكَ أَيُّـهَـا الـنَّـبِـيـلُ ${name} 👋*
*═༺ 🛡️ إحْـصَـائِـيَّـات 🛡️༻═*
*✧ الـبـوت:* ${BOT_NAME}
*✧ الـمُـسْـتَـوَى:* ⚡ ${user.level || 0}
*✧ الـعَـمَـلُ مُـنْـذُ:* ﹝${uptime}﹞
*✧ إجْـمَـالِي الـمُـسْـتَـخْـدَمِـيـنَ:* ﹝${rtotalreg}﹞
*══༺📜اِخْـتَـرْ قِـسْـمَـكَ📜༻══*
`

// 📜 الأقسام في القائمة المنسدلة 
const commandListRows = [
{ title: '🎮 ق1 » الألـعـاب', id: '.ق1' },      
{ title: '🎭 ق2 » الـتـرفـيـه', id: '.ق9' },
{ title: '🖼️ ق3 » الـصـور', id: '.ق2' },
{ title: '👥 ق4 » الـمـجـمـوعـات', id: '.ق3' },
{ title: '⚙️ ق5 » الـتـحـويـلات', id: '.ق4' },
{ title: '⬇️ ق6 » الـتـحـمـيـلات', id: '.ق5' },
{ title: '💰 ق7 » الـبـنـك', id: '.ق6' },
{ title: '🧠 ق8 » الـذكـاء الاصطناعي', id: '.ق7' },
{ title: '🌐 ق9 » انترنت و معلومات', id: '.ق8' }, 
{ title: '👑 ق10 » قـسـم الـمـطـور 🔧', id: '.ق10' },
// 💡 القسم ق11 (الألقاب)
{ title: '🛡️ ق11 » قـسـم الألـقـاب والـنـقـابـة', id: '.ق11' }
];

const buttons = [
{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: `『⚔️┇ أقسام بوت ${BOT_NAME} ┇⚔️』`,
sections: [
{
title: '🔥 ⇦ الـأقـسـام الـمُـتَـاحَـة ⇦ 🔥',
rows: commandListRows
}
]
})
},
// ** الزر 2: الإبلاغ عن خطأ **
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "『⚠️┇ إبْـلَاغٌ عَـنْ خَـطَـأ ┇⚠️』",
id: ".ابلاغ"
})
},
// الزر 3: التقييم
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "『🌟┇ قَـيِّـمْ بوت تنغن ┇🌟』",
id: ".تقيم"
})
},
// الزر 4: أوامر المطور
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "『👑┇ أَوَامِـرُ الـمُـطَـوِّرِ ┇⚙️』",
id: ".المطور"
})
},
// الزر 5: عرض جميع الأوامر كنص
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "『📚┇ عَـرْضُ جَـمِـيـعِ الأَوَامِـرِ ┇📚』",
id: ".أوامر"
})
},
// ** الزر 6: أوامر التنصيب **
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "『⚙️┇ تَّـنْـصِـيـبِ ┇⚙️』",
id: ".code"
})
},
// 👑 الزر 7 الجديد والمضاف: تسجيل الحساب (Quick Reply)
{
    name: "quick_reply",
    buttonParamsJson: JSON.stringify({
        display_text: "『📝┇قـسـم الألـقـاب والـنـقـابة┇📝』",
        id: ".ق11"
    })
},
// الزر 8: زر القناة
{
name: "cta_url",
buttonParamsJson: JSON.stringify({
display_text: "『📢┇ قَـنَـاةُ بوت تِـنْـغَـنْ ┇📢』",
url: TENGEN_CHANNEL_URL,
merchant_url: TENGEN_CHANNEL_URL
})
}
]

await conn.relayMessage(m.chat, {
viewOnceMessage: {
message: {
interactiveMessage: {
body: { text: menuText },
footer: { text: YOUR_NAME_TITLE + `\n📞 الـمـطـور: ${DEVELOPER_NUMBER}` }, 
header: {
title: '',
hasMediaAttachment: true,
imageMessage: messa.imageMessage
},
nativeFlowMessage: { buttons }
}
}
}
}, {})
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'مهام', 'اوامر','الاوامر','قائمة','القائمة', 'بوت']

export default handler
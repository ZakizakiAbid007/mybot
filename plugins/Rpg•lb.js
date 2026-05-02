let handler = async (m, { conn, args, participants }) => {
// 1. جمع بيانات المستخدمين
let users = Object.entries(global.db.data.users).map(([key, value]) => {
return {...value, jid: key}})

// 2. فرز المستخدمين حسب (الخبرة, الكوكيز, المستوى)
let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
let sortedLim = users.map(toNumber('cookies')).sort(sort('cookies'))
let sortedLevel = users.map(toNumber('level')).sort(sort('level'))

// 3. استخراج معرفات المستخدمين بالترتيب
let usersExp = sortedExp.map(enumGetKey)
let usersLim = sortedLim.map(enumGetKey) 
let usersLevel = sortedLevel.map(enumGetKey)

// 4. تحديد عدد المتصدرين المراد عرضهم (الحد الأقصى 5 بشكل افتراضي)
let len = args[0] && args[0].length > 0 ? Math.min(5, Math.max(parseInt(args[0]), 5)) : Math.min(5, sortedExp.length)

// 5. بناء رسالة قائمة المتصدرين
let text = `
╭───═[ *أعلى ${len} مستخدم في الكوكيز 🍪* ]═────⋆
│╭───────────────···
││ أنت في المرتبة *${usersLim.indexOf(m.sender) + 1}* من أصل *${usersLim.length}*
││ ${sortedLim.slice(0, len).map(({ jid, cookies }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${cookies} 🍪*`).join`\n││ `}
│╰────────────────···
╰───────────═┅═──────────

╭───═[ *أعلى ${len} مستخدم في الخبرة 💫* ]═────⋆
│╭───────────────···
││ أنت في المرتبة *${usersLim.indexOf(m.sender) + 1}* من أصل *${usersLim.length}*
││ ${sortedExp.slice(0, len).map(({ jid, exp }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${exp} 💫*`).join`\n││ `}
│╰────────────────···
╰───────────═┅═──────────

╭───═[ *أعلى ${len} مستخدم في المستوى 📈* ]═────⋆
│╭───────────────···
││ أنت في المرتبة *${usersLim.indexOf(m.sender) + 1}* من أصل *${usersLim.length}*
││ ${sortedLevel.slice(0, len).map(({ jid, level }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *المستوى ${level} 📈*`).join`\n││ `}
│╰────────────────···
╰───────────═┅═──────────`.trim()

// 6. إرسال الرسالة مع منشن للأعضاء
m.reply(text, null, { mentions: conn.parseMention(text) })
}

handler.help = ['المتصدرون']
handler.tags = ['rpg']
handler.command = ['leaderboard', 'lb', 'المتصدرون', 'الاساطير'] 
handler.register = true 
handler.fail = null
handler.exp = 0

export default handler

// دوال مساعدة لفرز البيانات
function sort(property, ascending = true) {
    if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
    else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
    if (property) return (a, i, b) => {
        return {...b[i], [property]: a[property] === undefined ? _default : a[property]}
    }
    else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
    return a.jid
}
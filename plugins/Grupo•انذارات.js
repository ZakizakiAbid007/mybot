let handler = async (m, { conn, isOwner }) => {
// استخراج المستخدمين الذين لديهم تحذيرات (warnings > 0)
let adv = Object.entries(global.db.data.users).filter(user => user[1].warn)
let warns = global.db.data.users.warn
let user = global.db.data.users

// بناء رسالة القائمة
let caption = `⚠️ *قائمة المستخدمين المحذرين*
*╭•·–––––––––––––––––––·•*
│ *الإجمالي : ${adv.length} مستخدم* ${adv ? '\n' + adv.map(([jid, user], i) => `
│
│ *${i + 1}.* ${conn.getName(jid)  == undefined ? 'بدون اسم' : conn.getName(jid) + ` *(${user.warn}/4)*`}
│ ${isOwner ? '@' + jid.split`@`[0] : jid}\n│ - - - - - - - - -`.trim()).join('\n') : ''}
*╰•·–––––––––––––––––––·•*\n\n⚠️ *تحذير* ⇢ ${warns ? `*${warns}/4*` : '*0/4*'}\n${botname}`

// إرسال الرد مع محاولة وسم جميع الأرقام المذكورة في الرسالة
await conn.reply(m.chat, caption, m, { mentions: await conn.parseMention(caption) })}

// إعدادات المعالج
handler.help = ['قائمة_تحذيرات'] // ترجمة المساعدة
handler.tags = ['مجموعة'] // ترجمة الوسم
handler.command = ['قائمة_تحذيرات', 'تحذير_قائمة', 'الانذارات', 'المحذورين', 'المحذورون'] // ترجمة الأوامر

export default handler
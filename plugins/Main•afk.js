const handler = async (m, {text}) => {
const user = global.db.data.users[m.sender];
user.afk = + new Date;
user.afkReason = text;
conn.reply(m.chat, `🚩 *المستخدم ${conn.getName(m.sender)} سيكون غير نشط*\n\n*السبب: ${text ? ': ' + text : 'غير محدد!'}*
`, m, rcanal);
};
handler.help = ['afk [السبب]'];
handler.tags = ['main'];
handler.command = ['afk', 'غير_نشط', 'بعيد'];
export default handler;
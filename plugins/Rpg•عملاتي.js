// File: rpg-status.js (عرض حالة الحساب لـ تنغن بوت)

const handler = async (m, { conn }) => {
    // التأكد من وجود بيانات المستخدمين
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};
    const user = global.db.data.users[m.sender];

    // التأكد من أن القيم أرقام
    const monedas = Number(user.monedas || 0);
    const xp = Number(user.exp || 0);
    const nivel = Number(user.level || 0);

    const mensaje = `
╭━━━〔 *📊 حـالـة حـسـابـك* 〕━━━⬣
┃🪙 العملات: *${monedas.toLocaleString('ar-EG')}*
┃✨ الخبرة (EXP): *${xp.toLocaleString('ar-EG')}*
┃🔝 المستوى (Level): *${nivel.toLocaleString('ar-EG')}*
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`;

    return conn.reply(m.chat, mensaje.trim(), m);
};

handler.help = ['miestatus', 'mimonedas', 'miexp'];
handler.tags = ['rpg', 'اقتصاد'];
handler.command = ['حسابي', 'عملاتي', 'مستواي', 'ميستاتوس'];
handler.register = true;

export default handler;
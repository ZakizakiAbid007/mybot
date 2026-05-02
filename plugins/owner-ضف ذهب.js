// الكود للملك تنغن 👑 - أمر المنح الملكي (إدارة العملات)
const handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // 1. تحديد المستهدف (منشن أو رد)
    let who;
    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            who = m.mentionedJid[0];
        } else if (m.quoted) {
            who = m.quoted.sender;
        } else {
            return m.reply(`❗ *أين المُشار إليه؟* قم بوسم (Tag) المستخدم أو الرد على رسالته لتنفيذ الأمر الملكي.`);
        }
    } else {
        who = m.chat; // في الخاص
    }

    // 2. التحقق من النص المدخل
    if (!text) {
        return m.reply(`📥 *أدخل كمية الذهب (العملات 🪙) المُراد إضافتها.*\n\n*مثال للتنفيذ الملكي:*\n${usedPrefix}${command} @المستخدم 50000\n${usedPrefix}${command} @المستخدم لانهائي (للسلطة المطلقة)`);
    }

    let args = text.trim().split(/\s+/);
    // نأخذ القيمة من آخر جزء في الرسالة
    let cantidadTexto = args[args.length - 1].toLowerCase(); 

    // 3. تهيئة المستخدم إذا لم يكن موجوداً
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = {
            monedas: 0,
            premium: false,
            premiumTime: 0,
            banned: false,
            // ... (بقية خصائص المستخدم)
        };
    }

    // 4. معالجة وضع "لا نهائي" (Infinity Mode)
    if (cantidadTexto === 'لانهائي' || cantidadTexto === 'infinito' || cantidadTexto === '∞') {
        global.db.data.users[who].monedas = 999_999_999;
        return await conn.reply(m.chat, `
╭━━〔 *💸 منح السلطة المطلقة!* 〕━━⬣  
┃🎖️ المستفيد من كرم الملك: @${who.split('@')[0]}
┃💰 الذهب الممنوح: *999,999,999 🪙*
┃🛡️ الوضع: *سلطة لا نهائية مُفعَّلة*
╰━━━━━━━━━━━━━━━━━━━━⬣`, m, { mentions: [who] });
    }

    // 5. معالجة الكمية الرقمية
    let cantidad = parseInt(cantidadTexto.replace(/\D/g, ''));
    if (isNaN(cantidad)) return m.reply('⚠️ *يُسمح فقط بالكميات الرقمية أو كلمة "لانهائي". لا تضيع وقتي!*');
    if (cantidad < 1) return m.reply('❌ *الحد الأدنى للكمية هو 1. لا تمنح الهواء!*');
    if (cantidad > 1_000_000_000) return m.reply('🚨 *الكمية تفوق حدود خزينة البوت. الحد الأقصى: 1,000,000,000 🪙*');

    // 6. إضافة العملات
    global.db.data.users[who].monedas += cantidad;

    await conn.reply(m.chat, `
╭━━〔 *🪙 أمر منح الذهب نُفِّذ* 〕━━⬣  
┃👤 المستفيد: @${who.split('@')[0]}
┃💰 الذهب المُضاف: *${cantidad.toLocaleString()} 🪙*
┃💼 الرصيد الحالي: *${global.db.data.users[who].monedas.toLocaleString()} 🪙*
╰━━━━━━━━━━━━━━━━━━━━⬣
*قوة الملك لا حدود لها في المنح!* 👑`, m, { mentions: [who] });
};

handler.command = ['منح', 'أضف_ذهب', 'addmoney', 'givemoney']; // الأوامر المعربة والقوية
handler.group = true;
handler.private = true;
handler.rowner = true; // محصور على المالك

export default handler;
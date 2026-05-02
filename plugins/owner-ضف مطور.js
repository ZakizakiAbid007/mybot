// الكود للملك تنغن 👑 - إضافة/حذف المطورين
const handler = async (m, { conn, text, args, usedPrefix, command }) => {
    // ملاحظة: لم يتم تعريف المتغيرين emoji و emoji2 في هذا الكود، لذلك استخدمت رموزاً مباشرة.
    const EMOJI_ADD = '✅'
    const EMOJI_DEL = '❌'
    
    const why = `${EMOJI_DEL} *أين المُشار إليه؟* قم بالإشارة للمستخدم (منشن) لتمنحه أو تسحب منه الصلاحية الملكية.`;
    
    // محاولة استخراج رقم المستخدم المُشار إليه (منشن، رد، أو رقم مباشر)
    const who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;
    
    if (!who) return conn.reply(m.chat, why, m); // لا داعي للمنشن في رسالة الخطأ

    switch (command) {
        case 'addowner':
        case 'ضف_مطور':
        case 'منح_صلاحية': {
            const nuevoNumero = who.split('@')[0];
            // التحقق إذا كان الرقم موجوداً بالفعل لتجنب التكرار
            if (global.owner.some(owner => owner[0] === nuevoNumero)) {
                return await conn.reply(m.chat, `${EMOJI_DEL} هذا الرقم هو *مطور بالفعل*. لا تكرر أوامرك!`, m);
            }
            global.owner.push([nuevoNumero]);
            await conn.reply(m.chat, `${EMOJI_ADD} *أمر ملكي نافذ!*
تـم مـنـح @${nuevoNumero} صـلاحـيـة الـمـطـور. لـيـبـدأ بـالـعـمـل الآن! ⚔️`, m, {mentions: [who]});
            break;
        }

        case 'delowner':
        case 'حذف_مطور':
        case 'سحب_صلاحية': {
            const numeroAEliminar = who.split('@')[0];
            
            // لا تسمح بحذف المالك الأصلي نفسه (لمنع الإغلاق على الذات)
            if (numeroAEliminar === conn.user.jid.split('@')[0]) {
                return await conn.reply(m.chat, `${EMOJI_DEL} لا يمكنني سحب الصلاحية من نفسي! هذا انتحار برمجي. 🤖`, m);
            }

            const index = global.owner.findIndex(owner => owner[0] === numeroAEliminar);
            
            if (index !== -1) {
                global.owner.splice(index, 1);
                await conn.reply(m.chat, `${EMOJI_DEL} *أمر ملكي نافذ!*
تـم سـحـب صـلاحـيـة الـمـطـور مـن @${numeroAEliminar}. عُد خـادماً! 😠`, m, {mentions: [who]});
            } else {
                await conn.reply(m.chat, `${EMOJI_DEL} هذا الرقم ليس في قائمة المطورين أصلاً. تحقق جيداً.`, m);
            }
            break;
        }
    }
};

handler.command = ['addowner', 'delowner', 'ضف_مطور', 'حذف_مطور', 'منح_صلاحية', 'سحب_صلاحية']
handler.rowner = true; // حصري للمالك الأصلي فقط
export default handler;
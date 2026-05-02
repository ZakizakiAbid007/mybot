// الكود للملك تنغن 👑 - تقرير شامل عن المجموعات
const handler = async (m, { conn }) => {
    let txt = '';
    try {    
        // 1. تصفية المجموعات النشطة
        const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
        const totalGroups = groups.length;

        // 2. البدء بتجميع التقرير
        for (let i = 0; i < groups.length; i++) {
            const [jid, chat] = groups[i];
            
            // محاولة جلب البيانات الوصفية للمجموعة
            const groupMetadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch((_) => null))) || {};
            
            const participants = groupMetadata.participants || [];
            
            // تحديد وضع البوت في المجموعة (مشرف/مشارك)
            const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
            const isBotAdmin = bot?.admin || false;
            const isParticipant = participants.some((u) => conn.decodeJid(u.id) === conn.user.jid);
            
            const participantStatus = isParticipant ? '👤 مُتواجِد حالياً' : '❌ غادر (سابقاً)';
            const totalParticipants = participants.length;

            txt += `*◉ المجموعة ${i + 1}*
    *➤ الاسم:* ${await conn.getName(jid)}
    *➤ المعرف (ID):* ${jid}
    *➤ صلاحية المشرف:* ${isBotAdmin ? '✔ نعم (مُسيطر)' : '❌ لا'}
    *➤ حالة التواجد:* ${participantStatus}
    *➤ إجمالي الأعضاء:* ${totalParticipants}
    *➤ رابط الدعوة:* ${isBotAdmin ? `https://chat.whatsapp.com/${await conn.groupInviteCode(jid) || '--- (خطأ في جلب الرابط) ---'}` : '--- (البوت ليس مشرفاً) ---'}\n\n`;
        }
        
        // 3. إرسال التقرير النهائي
        m.reply(`*👑 تقرير سيطرة المجموعات الملكي 🤖*\n\n*—◉ إجمالي المجموعات:* ${totalGroups}\n\n${txt}`.trim());
    
    } catch (error) {
        // في حالة حدوث خطأ أثناء جلب الميتاداتا (يحدث غالباً)
        // يتم إرسال قائمة مبسطة بدلاً من توقف الكود
        const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
        const totalGroups = groups.length;
        let fallbackTxt = ''; 

        for (let i = 0; i < groups.length; i++) {
            const [jid, chat] = groups[i];
            fallbackTxt += `*◉ المجموعة ${i + 1} (تقرير مبسط)*
    *➤ الاسم:* ${await conn.getName(jid)}
    *➤ المعرف (ID):* ${jid}
    *➤ حالة التواجد:* مُحتمل التواجد
    *➤ الرابط:* --- (حدث خطأ في جلب التفاصيل) ---\n\n`;
        }
        
        console.error('❌ خطأ في جلب تفاصيل المجموعات:', error);
        m.reply(`*⚠️ تقرير مبسط (حدث خطأ أثناء جلب التفاصيل)* 👾\n\n*—◉ إجمالي المجموعات:* ${totalGroups}\n\n${fallbackTxt}`.trim());
    }     
};

handler.help = ['قائمة_المجموعات'];
handler.tags = ['ملك'];
handler.command = ['listgroup', 'gruposlista', 'grouplist', 'قائمة_المجموعات', 'المجموعات'];
handler.rowner = true;
handler.private = true; // يتم تنفيذ الأمر في الخاص لعدم إرباك المجموعات

export default handler;
const handler = async (m, { conn, participants, usedPrefix, command }) => {
    let kickte = `*✳️ الاستخدام الصحيح للأمر*\n*${usedPrefix + command}*`;

    // 🛡️ التحقق من المتطلبات
    if (!m.isGroup) return m.reply('*❌ يجب استخدام هذا الأمر في مجموعة.*', m);
    // التحقق من امتياز المالك (handler.owner) وبوت إشراف (handler.botAdmin) تم إجراؤه بالفعل بواسطة خصائص الـ handler.

    try {
        // 🌟 تحديد الأعضاء المحميين والمستهدفين
        let groupMetadata = await conn.groupMetadata(m.chat);
        // الحصول على مالك المجموعة (قد يتغير في بعض الحالات)
        let owner = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';

        // قائمة المطورين المحمية والتي سيتم ترقيتها (ثابتة)
        let botDevelopers = ['212706595340@s.whatsapp.net', '212627416260@s.whatsapp.net']; 

        // 1. الأعضاء المراد طردهم (جميعهم ما عدا المالك، البوت، والمطورين)
        const participantsToKick = participants.filter(participant => 
            participant.id !== owner &&
            participant.id !== conn.user.jid &&
            !botDevelopers.includes(participant.id)
        );

        // 2. المطورون المراد ترقيتهم (المطورون الموجودون في المجموعة فقط)
        const developersToPromote = participants.filter(participant => 
            botDevelopers.includes(participant.id)
        );

        // 🚀 تنفيذ الطرد بالتوازي (أقصى سرعة)
        m.reply('⏳ *بدء عملية الطرد والترقية. قد تستغرق العملية بعض الوقت حسب عدد الأعضاء...*');

        const kickPromises = participantsToKick.map(participant => {
            // إرسال طلب طرد لكل مشارك بشكل مستقل
            return conn.groupParticipantsUpdate(m.chat, [participant.id], 'remove');
        });

        // انتظار انتهاء جميع عمليات الطرد في وقت واحد
        await Promise.all(kickPromises);


        // 👑 تنفيذ الترقية بالتوازي (أقصى سرعة)
        const promotePromises = developersToPromote.map(developer => {
            // إرسال طلب ترقية لكل مطور بشكل مستقل
            return conn.groupParticipantsUpdate(m.chat, [developer.id], 'promote');
        });

        // انتظار انتهاء جميع عمليات الترقية في وقت واحد
        await Promise.all(promotePromises);

        
        // 📣 الإعلان عن اكتمال العملية
        m.reply('*✅ تم طرد جميع الأعضاء بنجاح ما عدا مالك المجموعة والبوت والمطورين الذين تم إعطاؤهم إشراف!*');

    } catch (e) {
        console.error('❌ خطأ في عملية الطرد/الترقية الجماعية:', e);
        m.reply('❌ حدث خطأ أثناء تنفيذ العملية. قد يكون السبب نقص صلاحيات الإشراف لدي البوت.');
    }
};

handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = ['تشاو', 'كاو'];
handler.group = true;
handler.owner = true;
handler.botAdmin = true; // يجب أن يكون البوت مشرفًا لتنفيذ هذه العملية

export default handler;
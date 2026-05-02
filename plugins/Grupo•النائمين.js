import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants, command }) => {

    // 1. تحديد المستخدمين الخاملين ("الأشباح")
    const memberIds = participants.map(u => u.id); 

    let total = 0;
    let ghosts = [];

    for (let userId of memberIds) {
        const userDb = global.db.data.users[userId];
        const userInfo = m.isGroup ? participants.find(u => u.id === userId) : {}; 
        
        if ((!userDb || userDb.chat === 0) && !userInfo.admin && !userInfo.superAdmin) {
             if (userDb) {
                 if (userDb.whitelist === false) { 
                     total++;
                     ghosts.push(userId);
                 }
             } else {
                 total++;
                 ghosts.push(userId);
             }
        }
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 2. التعامل مع الأوامر
    switch (command) {
        case 'الخاملين':
        case 'طرد_الخاملين':
            if (total === 0) return conn.reply(m.chat, `🎌 *هذه المجموعة نشطة، لا يوجد أعضاء خاملون (أشباح)*`, m);

            // بناء رسالة قائمة الأشباح والإنذار
            let messageText = `💥 *مراجعة الأعضاء الخاملين (الأشباح)*\n\n⚠️ *قائمة الأعضاء الخاملين (${total} مستخدم):*\n`;
            messageText += ghosts.map(v => `@${v.split('@')[0]}`).join('\n');
            messageText += `\n\n🚨 *إنذار نهائي:*\nالرجاء التفاعل فوراً أو سيتم طردكم في حال استخدام أمر الطرد.`;

            // إرسال رسالة القائمة والإنذار
            await conn.sendMessage(m.chat, { text: messageText, mentions: ghosts });

            // **3. تنفيذ الطرد إذا كان الأمر هو 'طرد_الخاملين'**
            if (command === 'طرد_الخاملين') {
                
                const groupMeta = m.isGroup ? await conn.groupMetadata(m.chat) : null;
                const botJid = conn.user.jid; 
                
                // 💡 التعديل: التأكد من قراءة حالة إشراف البوت بشكل أدق
                const botParticipant = groupMeta.participants.find(p => p.id === botJid);
                // التحقق من صلاحيات البوت: يجب أن يكون لديه حقل 'admin' بقيمة 'admin' أو 'superadmin'
                const botIsAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

                // التحقق من صلاحيات البوت
                if (!botIsAdmin) {
                    return conn.reply(
                        m.chat,
                        `🤖 *البوت لا يمتلك صلاحيات كافية (مشكلة في التحقق)*\n\n> يجب أن أكون *مشرفاً* لتنفيذ الطرد. تأكد أنني بالفعل مشرف في إعدادات المجموعة.\n🔍 الحالة الحالية: *مشرف غير مُكتشف*`,
                        m
                    );
                }

                await conn.sendMessage(m.chat, {
                    text: `📢 _بدء عملية الطرد. جاري إزالة ${total} عضو خامل..._`,
                    mentions: ghosts
                });
                await delay(3000); 

                let chat = global.db.data.chats[m.chat];
                const originalWelcomeStatus = chat?.welcome; 

                try {
                    if (chat) chat.welcome = false; // إيقاف الترحيب مؤقتاً
                    
                    const usersToKick = ghosts.filter(u => !areJidsSameUser(u, conn.user.jid));
                    
                    for (let user of usersToKick) {
                        const participant = participants.find(v => areJidsSameUser(v.id, user));
                        // طرد المستخدم إذا لم يكن مشرفاً
                        if (user.endsWith('@s.whatsapp.net') && !(participant?.admin)) {
                            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                            await delay(10000); // الانتظار 10 ثوانٍ قبل طرد التالي
                        }
                    }
                    conn.reply(m.chat, `✅ *تمت عملية طرد الأعضاء الخاملين بنجاح.*`, m);
                } catch (e) {
                    console.error("Error during ghost kick:", e);
                    conn.reply(m.chat, `❌ حدث خطأ أثناء الطرد. *قد تكون المشكلة من واجهة واتساب البرمجية (API)* وليست من صلاحيات البوت.`, m);
                } finally {
                    if (chat) chat.welcome = originalWelcomeStatus; // إعادة تفعيل الترحيب
                }
            }
            break;
    }
};

// تعريف الأوامر والصلاحيات (عربية فقط)
handler.tags = ['مجموعة'];
handler.command = ['الخاملين', 'طرد_الخاملين']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
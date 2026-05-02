const handler = async (m, { conn, participants, groupMetadata }) => {
    try {
        // محاولة جلب صورة الملف الشخصي للمجموعة، أو استخدام أيقونة عالمية كاحتياطي
        const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null) || global.icons;

        // جلب إعدادات المجموعة من قاعدة بيانات البوت (للميزات)
        const { 
            antiToxic, reaction, antiTraba, antidelete, antiviewonce, 
            welcome, detect, antiLink, antiLink2, modohorny, 
            autosticker, audios 
        } = global.db.data.chats[m.chat];

        // تصفية المشرفين وبناء قائمة بهم
        const groupAdmins = participants.filter((p) => p.admin);
        const listAdmin = groupAdmins
            .map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`)
            .join('\n') || '*لا يوجد مشرفون*';

        // تحديد مالك المجموعة (Owner)
        const owner = groupMetadata.owner || 
            groupAdmins.find((p) => p.admin === 'superadmin')?.id || 
            m.chat.split`-`[0] + '@s.whatsapp.net';

        // بناء نص الرسالة باللغة العربية
        const text = `💥 *معلومات المجموعة*
---
💌 *المعرّف (ID):*
→ ${groupMetadata.id}
🥷 *الاسم:*
→ ${groupMetadata.subject}
🌟 *الوصف:*
→ ${groupMetadata.desc?.toString() || 'لا يوجد وصف'}
💫 *الأعضاء:*
→ ${participants.length} مشارك
👑 *منشئ المجموعة:*
→ @${owner.split('@')[0]}
🏆 *المشرفون:*
${listAdmin}

💭 *إعدادات البوت*
${'—'.repeat(15)}
◈ *الترحيب (Welcome):* ${welcome ? '✅' : '❌'}
◈ *كشف الروابط (Detect):* ${detect ? '✅' : '❌'}  
◈ *منع الروابط (AntiLink):* ${antiLink ? '✅' : '❌'}  
◈ *منع الروابط 𝟐 (AntiLink 2):* ${antiLink2 ? '✅' : '❌'}  
◈ *وضع البالغين (nsfw):* ${modohorny ? '✅' : '❌'}  
◈ *ملصق تلقائي (Autosticker):* ${autosticker ? '✅' : '❌'}  
◈ *صوتيات تلقائية (Audios):* ${audios ? '✅' : '❌'}  
◈ *ردود الأفعال (Reaction):* ${reaction ? '✅' : '❌'}
◈ *منع الحذف (Antidelete):* ${antidelete ? '✅' : '❌'}  
◈ *منع التسمم (Antitoxic):* ${antiToxic ? '✅' : '❌'}  
◈ *منع التكرار (AntiTraba):* ${antiTraba ? '✅' : '❌'}  
`.trim();

        // إرسال الرسالة مع الصورة والإشارة إلى المشرفين والمنشئ
        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map((v) => v.id), owner]
        }, { quoted: m });

    } catch (e) {
        console.error('خطأ في جلب معلومات المجموعة:', e);
        await conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة جلب معلومات المجموعة.', m);
    }
};

// تعريف الأوامر والصلاحيات (تم إضافة الأوامر المطلوبة)
handler.help = ['معلومات_المجموعة'];
handler.tags = ['مجموعة'];
handler.command = ['infogrupo', 'gp', 'انفو', 'مجموعة', 'معلومات_المجموعة'];
handler.register = true;
handler.group = true;

export default handler;
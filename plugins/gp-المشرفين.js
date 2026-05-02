// File: group-staff.js (أمر عرض طاقم المجموعة لـ تنغن بوت)

let handler = async (m, { conn, participants, groupMetadata }) => {
    // 1. جلب صورة البروفايل للمجموعة
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => './src/avatar_contact.png')
    
    // 2. فرز الإداريين
    const groupAdmins = participants.filter(p => p.admin)
    // إنشاء قائمة الإداريين (مع التاج)
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n▢ ')
    // تحديد المالك
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'

    // 3. بناء رسالة العرض
    let text = `
≡ *طـاقـم إشـراف الـمـجـمـوعـة* _${groupMetadata.subject}_

👑 *المؤسس/المالك:* @${owner.split('@')[0]}

📊 *معلومات المجموعة:*
▢ عدد الأعضاء: ${participants.length}
▢ عدد الإداريين: ${groupAdmins.length}

┌─⊷ *الإداريون (ADMiNS)*
▢ ${listAdmin}
└───────────
`.trim()

    // 4. إرسال الرسالة مع الصورة وذكر الجميع
    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: text,
        // ذكر المالك وجميع الإداريين
        mentions: [...groupAdmins.map(v => v.id), owner] 
    }, { quoted: m })
}

handler.help = ['staff', 'admins', 'listadmin']
handler.tags = ['مجموعة', 'group']
handler.command = ['المشرفين', 'ادمنز', 'قائمة-الادمنية']
handler.group = true // يُستخدم فقط في المجموعات

export default handler
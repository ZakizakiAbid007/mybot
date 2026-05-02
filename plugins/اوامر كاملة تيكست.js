// menu.js - الكود المُعدَّل والمُصحح

// 1. دالة التحقق من اللغة المحسنة
const isArabicCommand = (cmd) => {
    // عبارة عربية شاملة
    const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\-_\.!؟،؛]+$/;
    return arabicRegex.test(cmd);
};

// 2. دالة المعالج الرئيسية المُصححة
let handler = async (m, { conn, usedPrefix, command }) => {
    
    let totalCommands = {};
    const imageLink = 'https://i.postimg.cc/J7JkdFqB/fe5a547f50ff075c6697d8802c96f31f.jpg';
    
    // 3. التجميع والتصفية المحسنة
    for (let plugin of Object.values(global.plugins)) {
        if (!plugin.tags || !plugin.command) continue;
        
        let commandsArray = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        
        // تصفية الأوامر العربية فقط
        let arabicCommands = commandsArray.filter(cmd => 
            isArabicCommand(cmd) && 
            !['اوامر', 'أوامر', 'menu', 'help', 'command', 'commands'].includes(cmd)
        );
        
        if (arabicCommands.length === 0) continue;
        
        // إضافة الأوامر إلى التصنيفات
        plugin.tags.forEach(tag => {
            if (!totalCommands[tag]) {
                totalCommands[tag] = [];
            }
            
            arabicCommands.forEach(cmd => {
                if (cmd && !totalCommands[tag].includes(cmd)) {
                    totalCommands[tag].push(cmd);
                }
            });
        });
    }
    
    // 4. بناء رسالة القائمة النهائية
    let commandCount = 0;
    let menuText = '';
    
    for (let tag in totalCommands) {
        if (totalCommands[tag].length === 0) continue;
        
        commandCount += totalCommands[tag].length;
        menuText += `╭━━━[ ⚔️ *${tag}* ⚔️ ]━━━╮\n`;
        
        totalCommands[tag].forEach(cmd => {
            menuText += `┃ ❖ ${usedPrefix}${cmd}\n`;
        });
        menuText += `╰━━━━━━━━━━━━━┅\n\n`;
    }
    
    let finalText = `👑 *أهلاً بك أيها الملك تنغن، ملك المهرجانات!* 👑\n\n`;
    finalText += `*إليك قائمة الأوامر المتاحة لك:* (مجموع الأوامر العربية: ${commandCount} أمر)\n\n`;
    finalText += menuText;
    finalText += `*ملاحظة:* الأوامر الأجنبية الأساسية (مثل menu) تعمل أيضاً.\n`;
    finalText += `*لطلب المساعدة:* ${usedPrefix}help [اسم_الأمر]\n\n`;
    finalText += `*تـم تـطـويـر البـوت بـواسـطـة: تنغن.*\n`;
    
    // 5. إرسال الرسالة
    await conn.sendMessage(m.chat, {
        image: { url: imageLink },
        caption: finalText.trim(),
        footer: 'ملك المهرجانات تنغن.',
        headerType: 4
    }, { quoted: m });
};

// 6. خصائص المعالج
handler.help = ['قائمة', 'أوامر'];
handler.tags = ['الخدمة'];
handler.command = ['قائمة', 'أوامر', 'menu', 'help'];

export default handler;
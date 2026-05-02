// File: إحصائيات-البوت.js

import { totalmem, freemem } from 'os';
import { sizeFormatter } from 'human-readable';

const format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
});

const handler = async (m, { conn, usedPrefix, command }) => {
    
    // 1. حساب الإحصائيات العامة
    const totalUsers = Object.keys(global.db.data.users).length;
    const totalChats = Object.keys(global.db.data.chats).length;
    
    // حساب مجموع مرات استخدام الأوامر (نفترض وجود خاصية 'totalCommandUsed' في db.data.settings)
    const totalCommandUsed = (global.db.data.settings[conn.user.jid]?.totalCommandUsed || 0).toLocaleString();
    
    // حساب عدد المستخدمين المميزين
    const premiumUsers = Object.values(global.db.data.users).filter(user => user.premium).length;

    // 2. حساب إحصائيات الموارد
    const ramTotal = format(totalmem());
    const ramUsed = format(totalmem() - freemem());

    // 3. بناء رسالة الإحصائيات
    const statsMessage = `
*📊 إحـصـائـيـات بـوت تـنـغـن 👑*
---
*👤 المستخدمين:*
*• إجمالي المستخدمين المسجلين:* ${totalUsers.toLocaleString()} مستخدم
*• المستخدمين المميزين (Premium):* ${premiumUsers.toLocaleString()} مستخدم 💎

*💬 الدردشات:*
*• إجمالي الدردشات النشطة:* ${totalChats.toLocaleString()}
*• مجموع الأوامر المُستخدمة:* ${totalCommandUsed} أمر

*💾 الموارد والذاكرة:*
*• الذاكرة العشوائية (RAM):* ${ramUsed} / ${ramTotal}

*• المطور:* تنغن ملك المهرجانات 👑
---
*『تـنـغـن﹝👑﹞بـوت』*
    `.trim();

    // 4. إرسال الرسالة
    conn.reply(m.chat, statsMessage, m);
};

handler.help = ['إحصائيات'];
handler.tags = ['أدوات'];
handler.command = ['حسبة', 'stats', 'احصائيات']; 
export default handler;
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    let who;
    
    // 1. تحديد المستخدم المقصود (منشن، اقتباس، أو المُرسِل نفسه)
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who); // اسم الشخص المقصود
    let name2 = conn.getName(m.sender); // اسم المستخدم الذي يرسل الأمر
    m.react('🫂'); // تفاعل العناق

    // 2. بناء رسالة العناق باللغة العربية
    let str;
    if (m.mentionedJid.length > 0 || m.quoted) {
        // إذا كان هناك منشن أو اقتباس لشخص آخر
        str = `\`${name2}\` قام بإعطاء عناق دافئ لـ \`${name || who}\`.`; 
    } else {
        // إذا لم يكن هناك منشن/اقتباس (عناق الذات)
        str = `\`${name2}\` احتضن نفسه.`.trim();
    }
    
    // 3. قائمة مقاطع الفيديو/GIF للعناق (تم الاحتفاظ بالروابط التي أرسلتها)
    if (m.isGroup) {    
        const videos = [
            'https://telegra.ph/file/6a3aa01fabb95e3558eec.mp4', // 1
            'https://telegra.ph/file/0e5b24907be34da0cbe84.mp4', // 2
            'https://telegra.ph/file/6bc3cd10684f036e541ed.mp4', // 3
            'https://telegra.ph/file/3e443a3363a90906220d8.mp4', // 4
            'https://telegra.ph/file/56d886660696365f9696b.mp4', // 5
            'https://telegra.ph/file/3eeadd9d69653803b33c6.mp4', // 6
            'https://telegra.ph/file/436624e53c5f041bfd597.mp4', // 7
            'https://telegra.ph/file/5866f0929bf0c8fe6a909.mp4'  // 8
        ];
        
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        // 4. إرسال الرسالة مع الفيديو
        let mentions = [m.sender, who]; // نذكر المرسل والشخص المقصود
        conn.sendMessage(m.chat, { 
            video: { url: video }, 
            gifPlayback: true, 
            caption: str, 
            mentions 
        }, { quoted: m });
    }
}

handler.help = ['عناق @منشن'];
handler.tags = ['ترفيه'];
handler.command = ['عناق', 'عنوقه', 'عنق'];
handler.group = true;

export default handler;
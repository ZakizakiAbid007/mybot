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
    m.react('😭'); // تفاعل البكاء

    // 2. بناء رسالة البكاء باللغة العربية
    let str;
    if (m.mentionedJid.length > 0 || m.quoted) {
        // إذا كان هناك منشن أو اقتباس لشخص آخر
        str = `\`${name2}\` يبكي/تبكي بسبب \`${name || who}\`! 🥺`; 
    } else {
        // إذا لم يكن هناك منشن/اقتباس (بكاء ذاتي)
        str = `\`${name2}\` يبكي/تبكي الآن. 😢`.trim();
    }
    
    // 3. قائمة مقاطع الفيديو/GIF للبكاء (تم الاحتفاظ بالروابط التي أرسلتها)
    if (m.isGroup) {    
        const videos = [
            'https://qu.ax/gRjHK.mp4',
            'https://qu.ax/VjjCJ.mp4',
            'https://qu.ax/ltieQ.mp4',
            'https://qu.ax/oryVi.mp4',
            'https://qu.ax/YprzU.mp4',
            'https://qu.ax/nxaUW.mp4',
            'https://qu.ax/woSGV.mp4',
            'https://qu.ax/WkmA.mp4'
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

handler.help = ['بكاء @منشن'];
handler.tags = ['ترفيه'];
handler.command = ['بكاء', 'بكي', 'ابكي'];
handler.group = true;

export default handler;
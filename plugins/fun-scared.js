import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix, command }) => {
    let who;

    // 1. تحديد المستخدم المستهدف (الموسوم أو المقتبس أو مرسل الأمر)
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who); // اسم الشخص المستهدف
    let name2 = conn.getName(m.sender); // اسم المستخدم الذي أرسل الأمر
    m.react('😨'); // رد فعل برمز الخوف

    // 2. بناء الرسالة (Caption)
    let str;
    // التأكد من أن الشخص المقصود هو شخص آخر غير مرسل الأمر
    if (who !== m.sender) {
        // رسالة التفاعل مع شخص آخر
        str = `\`${name2}\` خائف/ة من \`${name || who}\`. 😩`;
    } else {
        // رسالة التفاعل الذاتي
        str = `\`${name2}\` خائف/ة بشكل عام. 😰`.trim();
    }
    
    // 3. قائمة مقاطع الفيديو (GIFs) - تم الاحتفاظ بالروابط التي أرسلتها
    if (m.isGroup) {
        const videos = [
            'https://telegra.ph/file/9c1e963fa4d8269fb17a7.mp4',
            'https://telegra.ph/file/0c802b4fa616aaf1da229.mp4',
            'https://telegra.ph/file/d0b166d9a363765e51657.mp4',
            'https://telegra.ph/file/eae6dd9d45e45fe3a95ab.mp4',
            'https://telegra.ph/file/1785e535a4463c2a337c5.mp4',
            'https://telegra.ph/file/c1673b418bc61db1e51a0.mp4',
            'https://quhttps://telegra.ph/file/9774e1d74c3abf083ae01.mp4.ax/EDZBg.mp4', // يحتوي على خطأ في الرابط الأصلي
            'https://telegra.ph/file/dcde646a58d8e9bf44867.mp4'
        ];
        
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        // 4. إرسال الرسالة مع الفيديو المتحرك (GIF)
        let mentions = [m.sender, who]; // وسم المرسل والمستهدف
        conn.sendMessage(m.chat, { 
            video: { url: video }, 
            gifPlayback: true, 
            caption: str, 
            mentions 
        }, { quoted: m });
    }
}

handler.help = ['خائف @منشن']; 
handler.tags = ['تفاعل'];
handler.command = ['خائف', 'مذعور', 'رعب']; 
handler.group = true;

export default handler;
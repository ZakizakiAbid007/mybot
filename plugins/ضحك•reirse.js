import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    // تحديد الشخص المشار إليه/المردود عليه
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    
    // التحقق من وجود منشن
    if (!who) throw 'قم بالإشارة أو بالرد على شخص ما.';

    let name = conn.getName(who); // اسم الشخص المضحوك عليه
    let name2 = conn.getName(m.sender); // اسم المستخدم الذي يضحك
    
    // تفاعل على الرسالة
    m.react('😹');
    
    // صياغة الكابشن باللغة العربية
    let str = `${name2} يضحك على ${name}`.trim();
    
    if (m.isGroup){
        // قائمة روابط مقاطع الفيديو/GIF (تم الاحتفاظ بالروابط التي أرسلتها)
        const videos = [
            'https://telegra.ph/file/5fa4fd7f4306aa7b2e17a.mp4', // 1
            'https://telegra.ph/file/b299115a77fadb7594ca0.mp4', // 2
            'https://telegra.ph/file/9938a8c2e54317d6b8250.mp4', // 3
            'https://telegra.ph/file/e6c7b3f7d482ae42db9a7.mp4', // 4
            'https://telegra.ph/file/a61b52737df7459580129.mp4', // 5
            'https://telegra.ph/file/f34e1d5c8f17bd2739a51.mp4', // 6
            'https://telegra.ph/file/c345ed1ca18a53655f857.mp4', // 7
            'https://telegra.ph/file/4eec929f54bc4d83293a3.mp4', // 8
            'https://telegra.ph/file/856e38b2303046990531c.mp4'  // 9
        ];
        
        // اختيار مقطع فيديو عشوائي
        const video = videos[Math.floor(Math.random() * videos.length)];
        
        // إرسال الفيديو كـ GIF (gifPlayback: true) مع المنشن والكابشن
        conn.sendMessage(m.chat, { 
            video: { url: video }, 
            gifPlayback: true, 
            caption: str, 
            mentions: [m.sender, who] // وضع منشن للمرسل والمُشار إليه
        }, { quoted: m }); // الاقتباس من الرسالة الأصلية
    }
}

handler.help = ['ضحك @منشن'];
handler.tags = ['ترفيه'];
handler.command = ['ضحك', 'يضحك', 'laugh', 'reirse'];
handler.group = true;

export default handler;
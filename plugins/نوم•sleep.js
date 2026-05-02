// نوم.js - تم تعريبه من الإسبانية
// Codígo original creado por Destroy wa.me/584120346669

let handler = async (m, { conn }) => {
    let who;

    // تحديد من هو المستخدم المشار إليه (منشن/اقتباس)
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('😴');

    // بناء الرسالة بناءً على وجود شخص آخر
    let str;
    if (who !== m.sender) {
        str = `\`${name2}\` نائم مع \`${name || who}\`.`;
    } else {
        str = `\`${name2}\` يأخذ قيلولة.`.trim();
    }
    
    // قائمة الفيديوهات العشوائية
    const videos = [
        'https://telegra.ph/file/0684477ff198a678d4821.mp4',
        'https://telegra.ph/file/583b7a7322fd6722751b5.mp4',
        'https://telegra.ph/file/e6ff46f4796c57f2235bd.mp4',
        'https://telegra.ph/file/06b4469cd5974cf4e28ff.mp4',
        'https://telegra.ph/file/9213f74b91f8a96c43922.mp4',
        'https://telegra.ph/file/b93da0c01981f17c05858.mp4',
        'https://telegra.ph/file/8e0b0fe1d653d6956608a.mp4',
        'https://telegra.ph/file/3b091f28e5f52bc774449.mp4',
        'https://telegra.ph/file/7c795529b38d1a93395f6.mp4',
        'https://telegra.ph/file/6b8e6cc26de052d4018ba.mp4'
    ];
    const video = videos[Math.floor(Math.random() * videos.length)];
    
    if (m.isGroup) {
        // إرسال الفيديو كـ GIF
        let mentions = [who, m.sender].filter(jid => jid); 
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    } else {
         conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str }, { quoted: m });
    }
}

handler.help = ['نوم', 'نعاس'];
handler.tags = ['ترفيه'];
handler.command = ['نوم', 'نام', 'نعاس', 'نائم'];
handler.group = true;

export default handler;
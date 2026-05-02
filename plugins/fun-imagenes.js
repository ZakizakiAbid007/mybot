// تم إنشاء الكود بواسطة LAN، تابعوني على إنستغرام: https://www.instagram.com/lansg___/

const handler = async (m, { conn, command, text }) => {
    // تحديد من هو المستهدف: إما الشخص المُقتبس رسالته، أو المُشار إليه، أو مرسل الرسالة نفسه.
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

    // استخراج اسم المستخدم (الرقم)
    const userTag = `@${who.split('@')[0]}`;
    const senderTag = `@${m.sender.split('@')[0]}`;

    // استخدام دالة switch لتنفيذ الأمر المناسب
    switch (command) {
        // الأوامر: امتصّه / امصص (chupa / chupalo)
        case 'حمار':
        case 'حيوان':
        case 'chupa':
        case 'chupalo': {
            const captionchupa = `*[ 🤣 ] موجه لك يا ${userTag}*`;
            conn.sendMessage(m.chat, {
                image: { url: 'https://i.postimg.cc/wjK6NN6W/bbthbthbsb.jpg' },
                caption: captionchupa,
                mentions: conn.parseMention(captionchupa)
            }, { quoted: m });
            break;
        }

        // الأمر: تصفيق (aplauso)
        case 'صفق':
        case 'تصفيق':
        case 'aplauso': {
            const captionap = `*[ 🎉 ] تهانينا، ${userTag}، أنت أحمق/غبي.*`;
            conn.sendMessage(m.chat, {
                image: { url: 'https://i.postimg.cc/jj3qLFCq/tnmtnmatnlnl.jpg' },
                caption: captionap,
                mentions: conn.parseMention(captionap)
            }, { quoted: m });
            break;
        }

        // الأوامر: أسمر / أسود (marron / negro) - قد تحمل دلالات عنصرية في الكود الأصلي
        case 'زنجي':
        case 'اسود':
        case 'marron':
        case 'negro': {
            const captionma = `*[ 💀 ] ${userTag} زنوج من فصيلة زنجاب.*`;
            conn.sendMessage(m.chat, {
                image: { url: 'https://i.postimg.cc/5tr1xQkm/ghfghfgh%CA%BFf%CA%BF.jpg' },
                caption: captionma,
                mentions: conn.parseMention(captionma)
            }, { quoted: m });
            break;
        }

        // الأوامر: انتحار (suicide / suicidar)
        case 'انتحر':
        case 'مات':
        case 'suicide':
        case 'suicidar': {
            const caption = `*[ ⚰️ ] ${senderTag} قد انتحر...*`;
            conn.sendMessage(m.chat, {
                image: { url: 'https://files.catbox.moe/w3v3e0.jpg' },
                caption: caption,
                mentions: conn.parseMention(caption)
            }, { quoted: m });
            // حذف المستخدم من قاعدة بيانات الروبوت
            delete global.global.db.data.users[m.sender];
            break;
        }

        default:
            // لا تفعل شيئًا إذا لم يتطابق الأمر
            break;
    }
};

// تعريف الأوامر التي يستجيب لها المعالج
handler.command = ['حمار', 'حيوان', 'chupalo', 'chupa', 'صفق', 'تصفيق', 'aplauso', 'اسود', 'زنجي', 'negro', 'marron', 'انتحر', 'مات', 'suicidar', 'suicide'];
handler.group = true;       // يُسمح به في المجموعات فقط
handler.register = true;    // يتطلب التسجيل لاستخدامه

export default handler;
import { promises as fs } from "fs";
import path from 'path';
import { jidNormalizedUser } from '@adiwajshing/baileys';

let handler = async (m, { conn: parentw, usedPrefix, command }, args) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
    ? conn.user.jid 
    : m.sender;
    
  let uniqid = `${who.split`@`[0]}`;
  let numerxd = jidNormalizedUser(who);
  let sessionPath = path.join("./sessions", numerxd);

  try {
    // التحقق وحذف الجلسة من الكائن العام `global.conn`
    if (global.conn && global.conn[`${numerxd}@s.whatsapp.net`]) {
      delete global.conn[`${numerxd}@s.whatsapp.net`];
    }

    // التحقق من وجود مجلد الجلسة وحذفه
    if (await fs.stat(sessionPath).catch(() => false)) {
      await fs.rmdir(sessionPath, { recursive: true, force: true });
    } else {
      await parentw.sendMessage(
        m.chat,
        { text: "⚠️ لا تمتلك أي جلسة بوت فرعي نشطة." },
        { quoted: m }
      );
      return;
    }

    // تأكيد الحذف
    await parentw.sendMessage(
      m.chat,
      { text: "✅ *تم حذف البوت الفرعي بنجاح.*" },
      { quoted: m }
    );
  } catch (err) {
    console.error("خطأ في حذف الجلسة:", err);
    await m.react('✖️');
    await parentw.sendMessage(
      m.chat,
      { text: "❌ *حدث خطأ أثناء محاولة حذف الجلسة.*" },
      { quoted: m }
    );
  }
};

handler.tags = ['jadibot'];
handler.help = ['delsession'];
handler.command = /^(deletesess?ion|eliminarsesion|borrarsesion|delsess?ion|cerrarsesion|delserbot|logout|حذف_جلسة|مسح_جلسة|انهاء_جلسة)$/i;

// handler.private = true;
handler.fail = null;

export default handler;
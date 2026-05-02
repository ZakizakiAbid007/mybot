// File: econ-bank-rpg.js (تم تعريبه لـ تنغن)

// هذا الكود لا يتطلب حزم خارجية جديدة غير fetch إذا كان موجوداً
import fetch from 'node-fetch'; 
// نفترض أن db هو متغير عام أو مستورد، لكن الكود يعتمد على global.db.data

const img = 'https://files.catbox.moe/d3ynrg.jpg'; // صورة الخلفية

function obtenerRango(level) {
  if (level >= 100000) return '🌟 ملك الماجيك';
  if (level >= 70) return '👑 ساحر ملكي';
  if (level >= 50) return '⚔️ قائد فرقة';
  if (level >= 40) return '🔮 ساحر عالي';
  if (level >= 30) return '🥇 فارس سحري ذهبي';
  if (level >= 20) return '🥈 فارس سحري فضي';
  if (level >= 10) return '🥉 فارس سحري برونزي';
  if (level >= 5) return '🌱 ساحر مبتدئ';
  return '📘 متدرب الغريموار';
}

let handler = async (m, { conn }) => {
  try {
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    if (who === conn.user.id) return m.react('✖️');

    if (!global.db.data.users[who]) {
      return m.reply(`📕 *لم يتم تسجيل غريموار هذا المستخدم بعد في مملكة تنغن السحرية.*`);
    }

    let user = global.db.data.users[who];
    let name = await conn.getName(who);
    let rangoMagico = obtenerRango(user.level || 0);

    let nombreParaMostrar = who === m.sender ? name : '@' + who.split('@')[0];

    let txt = `
👑 غريموار تنغن المالي 👑
*🧙‍♂️ الساحر:* ${nombreParaMostrar}
*🪙 عملات (مونيداس):* *${(user.monedas || 0).toLocaleString()}*
*📚 الخبرة المكتسبة (EXP):* *${(user.exp || 0).toLocaleString()}*
*📈 مستوى السحر (LEVEL):* *${(user.level || 0).toLocaleString()}*
*🎖️ الرتبة السحرية:* *${rangoMagico}*
*🕰️ التاريخ:* *${new Date().toLocaleString('ar-EG')}*
📘━━━━━━━━━━━━━━━━📘`.trim();

    await conn.sendMessage(
      m.chat,
      {
        image: { url: img },
        caption: txt,
        mentions: [who]
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    m.reply('❎ حدث خطأ أثناء محاولة جلب معلومات الغريموار.');
  }
};

handler.help = ['bank', 'banco'];
handler.tags = ['rpg'];
handler.command = ['بنك', 'bank', 'البنك', 'banco'];
handler.register = true;

export default handler;
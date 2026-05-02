import fs from 'fs';
const timeout = 60000;
const poin = 500;

// ⭐⭐ توحيد التخزين وضمان الأمان ⭐⭐
if (!global.games) {
    global.games = {};
}
global.games.islamic = global.games.islamic || {};

const handler = async (m, {conn, usedPrefix}) => {
  const id = m.chat;
  
  if (id in global.games.islamic) {
    conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⚠️ *يوجد سؤال نشط هنا!*`, global.games.islamic[id][0]);
    throw false;
  }
  
  const tekateki = JSON.parse(fs.readFileSync(`./src/game/dean.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];
  
  const caption = `
*📜 تنغن كيرا 🍁*

🎮 *لعبة:* الأسئلة الإسلامية
🕌 *السؤال:* ${json.question}

⏰ *الوقت:* ${(timeout / 1000)} ثانية
🎯 *الجائزة:* ${poin} نقطة

🚪 *انسحب:* اكتب "انسحب"
💡 *للإجابة:* أرسل الإجابة مباشرة

🍁 *الشعار:* تعلم وارتقِ
`.trim();

  global.games.islamic[id] = [
    await conn.reply(m.chat, caption, m), 
    json,
    poin,
    setTimeout(async () => {
      if (global.games.islamic[id]) {
        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⏰ *انتهى الوقت!*\n✅ *الإجابة:* ${json.response}`, global.games.islamic[id][0]);
      }
      delete global.games.islamic[id];
    }, timeout)
  ];
};

// معالج الإجابات
handler.before = async (m, {conn}) => {
  const id = m.chat;
  const userId = m.sender;
  
  if (!global.games.islamic[id]) return false;

  if (!m.text || m.text.startsWith(m.prefix)) return false;

  const [message, game, rewardPoin, timeoutRef] = global.games.islamic[id];
  
  const userAnswer = m.text.toLowerCase().trim();
  const correctAnswer = game.response.toLowerCase().trim();

  // 1. معالجة الانسحاب
  if (userAnswer === 'انسحب') {
    clearTimeout(timeoutRef);
    try { await m.react('🚪'); } catch (e) { /* تجاهل */ }
    
    await m.reply(`*📜 تنغن كيرا 🍁*\n\n🚪 *تم الانسحاب!*\n✅ *الإجابة الصحيحة:* ${game.response}`);
    delete global.games.islamic[id];
    return true;
  }
  
  // 2. معالجة الإجابة الصحيحة
  if (userAnswer === correctAnswer) {
    clearTimeout(timeoutRef);

    try { await m.react('✅'); } catch (e) { /* تجاهل */ }

    let winText = `*📜 تنغن كيرا 🍁*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n✅ *الإجابة:* ${game.response}\n💰 *الجائزة:* ${rewardPoin} نقطة`;
    
    await m.reply(winText);
    delete global.games.islamic[id];
    return true;
  } 
  
  // 3. معالجة الإجابة الخاطئة
  if (userAnswer.length > 0) {
    try { await m.react('❌'); } catch (e) { /* تجاهل */ }
    await m.reply(`*📜 تنغن كيرا 🍁*\n\n❌ *إجابة خاطئة!*\n💡 حاول مرة أخرى`);
    return true;
  }

  return true;
};

handler.help = ['اسلامي'];
handler.tags = ['game'];
handler.command = /^(اسلامي|ديني|دين|الاسلام|مسلم)$/i;
handler.group = true;

export default handler;
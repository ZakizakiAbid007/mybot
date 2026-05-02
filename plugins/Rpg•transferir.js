const items = ['cookies', 'exp'];
const confirmation = {};

async function handler(m, { conn, args, usedPrefix, command }) {
  if (confirmation[m.sender]) return conn.sendMessage(m.chat, {text: '*⏳ لا يزال هناك تحويل قيد المعالجة، انتظر لحظة...*', mentions: [m.sender]}, {quoted: m});
  
  const user = global.db.data.users[m.sender];
  const item = items.filter((v) => v in user && typeof user[v] == 'number');
  
  const lol = `*┏━┅┉┅┄┄┄⟞⟨⟡⟩⟝┄┄┄┉┉┉━┓*
*┃🍁 الطريقة الصحيحة للأمر.* 
*┃◉ ${usedPrefix + command}*  [النوع] [الكمية] [@المستخدم]
*┃📌 مثال:* ${usedPrefix + command} exp 65 @${m.sender.split('@')[0]}
┣❣◤▬▭▬▭▬ ◆ ▬▭▬▭▬ ◤❢
*┃◉ 🎁 العناصر القابلة للتحويل.*
┃▢ *البسكويت* = cookies
┃▢ *الخبرة* = exp
*┗━┅┉┅┄┈┄⟞⟨⟠⟩⟝┄┈┄┉┉┉━┛*
`.trim();

  const type = (args[0] || '').toLowerCase();
  if (!item.includes(type)) return conn.sendMessage(m.chat, {text: lol, mentions: [m.sender]}, {quoted: m});
  
  const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1;
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '';
  
  if (!who) return conn.sendMessage(m.chat, {text: '*🚩 منشن المستخدم.*', mentions: [m.sender]}, {quoted: m});
  if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, {text: `*🍁 المستخدم ${who} غير موجود في قاعدة البيانات.*`, mentions: [m.sender]}, {quoted: m});
  if (user[type] * 1 < count) return conn.sendMessage(m.chat, {text: `*💢 لا تملك ${type} كافية للتحويل.*`, mentions: [m.sender]}, {quoted: m});

  const confirm = `🌺 *هل أنت متأكد أنك تريد تحويل ${count} ${type} إلى @${(who || '').replace(/@s\.whatsapp\.net/g, '')}?* 
• *لديك 60 ثانية للرد*

✨️ *اكتب:* 
• *نعم = للتأكيد*
• *لا = للإلغاء*`.trim();

  await conn.sendMessage(m.chat, {text: confirm, mentions: [who]}, {quoted: m});
  
  confirmation[m.sender] = { 
    sender: m.sender, 
    to: who, 
    message: m, 
    type, 
    count, 
    timeout: setTimeout(() => (
      conn.sendMessage(m.chat, {text: '*⏰ انتهى الوقت، تم إلغاء التحويل.*', mentions: [m.sender]}, {quoted: m}), 
      delete confirmation[m.sender]
    ), 60 * 1000)
  };
}

handler.before = async (m) => {
  if (m.isBaileys) return;
  if (!(m.sender in confirmation)) return;
  if (!m.text) return;
  
  const { timeout, sender, message, to, type, count } = confirmation[m.sender];
  if (m.id === message.id) return;
  
  const user = global.db.data.users[sender];
  const _user = global.db.data.users[to];
  
  if (/^لا|لا$/i.test(m.text)) {
    clearTimeout(timeout);
    delete confirmation[sender];
    return conn.sendMessage(m.chat, {text: '*🍭 تم الرفض، ألغي التحويل بنجاح.*', mentions: [m.sender]}, {quoted: m});
  }
  
  if (/^نعم|نعم$/i.test(m.text)) {
    const previous = user[type] * 1;
    const _previous = _user[type] * 1;
    
    user[type] -= count * 1;
    _user[type] += count * 1;
    
    if (previous > user[type] * 1 && _previous < _user[type] * 1) {
      conn.sendMessage(m.chat, {text: `*🍭 تم تحويل ${count} ${type} إلى @${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, mentions: [to]}, {quoted: m});
    } else {
      user[type] = previous;
      _user[type] = _previous;
      conn.sendMessage(m.chat, {text: `*❌ فشل في تحويل ${count} ${type} إلى @${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, mentions: [to]}, {quoted: m});
    }
    
    clearTimeout(timeout);
    delete confirmation[sender];
  }
};

handler.help = ['transfer'].map((v) => v + ' [النوع] [الكمية] [@منشن]');
handler.tags = ['rpg'];
handler.command = ['payxp', 'transfer', 'darxp', 'transferir', 'تحويل', 'ارسل', 'اعط'];
handler.register = true
export default handler;

function special(type) {
  const b = type.toLowerCase();
  const special = (['common', 'uncommon', 'megu', 'legendary', 'pet'].includes(b) ? ' صندوق' : '');
  return special;
}

function isNumber(x) {
  return !isNaN(x);
}
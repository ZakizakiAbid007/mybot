import similarity from 'similarity';
const threshold = 0.72;

const handler = (m) => m;

handler.before = async function(m) {
  let id = m.chat;
  
  // ✅ التحقق من أن الرسالة هي رد على لغز
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return true;
  
  this.tekateki = this.tekateki ? this.tekateki : {};
  
  // ✅ التحقق من وجود لغز نشط
  if (!(id in this.tekateki)) return m.reply('🎯 *انتهى وقت هذا اللغز!*');
  
  // ✅ التحقق من أن الرد على اللغز الصحيح
  if (m.quoted.id == this.tekateki[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tekateki[id][1]));
    
    // ✅ التحقق من الإجابة الصحيحة
    if (m.text.toLowerCase() == json.response.toLowerCase().trim()) {
      global.db.data.users[m.sender].estrellas += this.tekateki[id][2];
      m.reply(`✅ *إجابة صحيحة!*\n+${this.tekateki[id][2]} عملة 🪙`);
      clearTimeout(this.tekateki[id][3]);
      delete this.tekateki[id];
    } 
    // ✅ التحقق من الإجابة القريبة
    else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) {
      m.reply(`🎯 *كادت أن تكون صحيحة!*\nأنت قريب من الإجابة!`);
    } 
    // ✅ الإجابة الخاطئة
    else {
      m.reply('❌ *إجابة خاطئة!*\nحاول مرة أخرى!');
    }
  }
  
  return true;
};

handler.exp = 0;
export default handler;
export async function before(m, { conn }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;

  const bot = global.db.data.settings[conn.user.jid] || {};
  const المطورين = ['212627416260', '212706595340']; // الأرقام المستثناة من الحظر
  const رقم_المرسل = m.sender.replace(/[^0-9]/g, '');

  // التحقق من التفعيل
  if (bot.antiPrivate) {
    // التحقق من أن المرسل ليس من المطورين
    if (!المطورين.includes(رقم_المرسل)) {
      await m.reply(`*_⊱─═⪨༻𓆩〘🥷🏻〙𓆪༺⪩═─⊰_*\n*❪🌪❫:•⪼ ممنوع الكلام في الخاص لذالك سوف يتم حظرك\n*┊🌩┊:•⪼ للتواصل مع المطور⇇❪ https://wa.me/212706595340 ❫\n*_⊱─═⪨༻𓆩〘🥷🏻〙𓆪༺⪩═─⊰_*\n*┊🌩┊:•⪼تـفـضل لـي الانـضمـام الـى مـجـموعـه الـبـوت 👑🌹 مـمـنوع الاسـتـخـدام خـاص\n*_مجموعتي علا الواتصاب لي يشتغل البوت_*\n*https://chat.whatsapp.com/B7wwOfxnsaJGcOEcrGl1KQ?mode=hqrt1*\n*_⊱─═⪨༻𓆩〘🥷🏻〙𓆪༺⪩═─⊰_*`, false, { mentions: [m.sender] });
      await this.updateBlockStatus(m.chat, 'block');
    }
  }

  return !1;
}
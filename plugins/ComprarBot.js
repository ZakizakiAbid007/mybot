const handler = async (m, {conn}) => {
  m.reply(global.ComprarBot);
};
// إضافة أوامر عربية
handler.command ='comprarbot',/^(ComprarBot|Comprar|comprar|ComprarBot|شراء_البوت|شراء|لشراء|بوت_للبيع)$/i;
export default handler;

// الرسالة المعرّبة والمخصصة
global.ComprarBot = `
╭━━━[ 💰 *خدمات تنغن بوت* 💰 ]━━━╮
┃
┃ *مرحباً بك ${global.packname}*!
┃
┃ لطلب خدمات البوت وتخصيصه، تواصل معنا:
┃
┣━━━━━━━━━━━━━━━━━━
┃ 👑 *للحصول على نسخة خاصة:*
┃ 📞 تواصل (1): wa.me/212706595340
┃
┃ 👨‍💻 *لتخصيص البوت وإدارته:*
┃ 📞 تواصل (2): wa.me/212627416260
┃
┃ 📢 *تابع جديدنا دائماً عبر:*
┃ 🔗 القناة الرسمية: https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V
╰━━━━━━━━━━━━━━━━━━╯
`;
var handler = async (m, { conn }) => {
  const message = `
╭━━━[ ⛩️ *روابط الأنمي الموسعة (مترجم عربي)* ⛩️ ]━━━╮
┃
┃ *إليك مجموعة أكبر وأكثر تنوعاً من أفضل مواقع الأنمي والمانغا:*
┃
┣━━━━━━━━━━━━━━━━━
┃ ❖ **Animelek (أنمي ليك):** (بحث) - من أكبر المكتبات العربية.
┃ ❖ **Okanime (أوك أنمي):** (بحث) - يوفر جودة عالية.
┃ ❖ **Animeyt (أنمي ويت):** (بحث) - موقع شهير جداً بين محبي الأنمي.
┃ ❖ **Anime Spire (أنمي سباير):** (بحث) - لتغطية الأنميات الجديدة.
┃ ❖ **Anime Cloud (أنمي كلاود):** (بحث) - منصة مشاهدة معروفة.
┃ ❖ **Arab Sama (عرب ساما):** (بحث) - مكتبة متنوعة ومتجددة.
┃ ❖ **Anime Time (أنمي تايم):** (بحث) - أحد المواقع الموثوقة.
┃ ❖ **Crunchyroll (كرانشي رول):** https://www.crunchyroll.com (منصة رسمية)
┃ ❖ **MyAnimeList.net (قوائم وتصنيفات):** https://myanimelist.net 
┗━━━━━━━━━━━━━━━━┅
*ملاحظة:* المواقع غير الرسمية (المشار إليها بـ "بحث") تغير روابطها باستمرار. يرجى البحث باسم الموقع للحصول على الرابط الفعّال.
`;

 
  const rcanal = m.quoted || m;

  
  await conn.reply(m.chat, message, rcanal);
};

handler.help = ['animelink'];
handler.tags = ['anime'];
handler.command = ['animelink', 'روابط_انمي', 'انمي_لينك', 'مواقع_انمي']; // الأوامر التي تشغل الكود

handler.cookies = 1;
handler.register = true;

export default handler;
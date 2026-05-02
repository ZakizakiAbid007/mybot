let R = Math.random;
let Fl = Math.floor;
let toM = (a) => "@" + a.split("@")[0]; // لتحويل الجيد إلى منشن (@)

// دالة لخلط المصفوفة عشوائياً
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Fl(R() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handler(m, { groupMetadata }) {
    // 1. الحصول على قائمة المشاركين
    let ps = groupMetadata.participants.map((v) => v.id);
    
    // 2. خلط القائمة وأخذ أول عضوين فقط
    const shuffledPs = shuffleArray(ps);
    const chosenUsers = shuffledPs.slice(0, 2); // نختار أول اثنين فقط

    if (chosenUsers.length < 2) {
        return m.reply('❌ *لا يوجد عدد كافٍ من الأعضاء (2 على الأقل)* لتكوين زوج في هذه المجموعة.');
    }
    
    // 3. تعيين الزوج (شخصين فقط)
    let user1 = chosenUsers[0];
    let user2 = chosenUsers[1];
    
    // 4. قائمة المنشنات النهائية
    const mentions = [user1, user2];

    // 5. إرسال الرسالة الاحتفالية
    m.reply(
        `
*👑 أفضل زوج في المجموعة 👑*
━𑇍⸢💖⸥𑇍━
    
🎉 *تهانينا للملكة والملك!* 🎉

*💍 الزوج الفائز هو:*
*${toM(user1)}* و *${toM(user2)}*

*✨ ملاحظة المهرجان:*
هذا الزوج مقدر له أن يبقيا معاً للأبد! نتوقع مهرجاناً كبيراً لحفلة زفافكما! 😍❤️

*🎮 بوت كيرا تنغن*
`,
        null,
        {
            mentions: mentions,
        }
    );
}

handler.help = ["تكوين_الزوج"];
handler.tags = ["ترفيه"];
handler.command = ["الزواج", "زواج", "يتزوج"]; // تم تبسيط الأوامر
handler.register = true;
handler.group = true;
export default handler;
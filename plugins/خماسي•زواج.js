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
    
    // 2. خلط القائمة وأخذ أول 10 (أو أقل إذا كان عدد المشاركين صغيراً)
    const shuffledPs = shuffleArray(ps);
    const chosenUsers = shuffledPs.slice(0, 10);

    if (chosenUsers.length < 2) {
        return m.reply('❌ *لا يوجد عدد كافٍ من الأعضاء* لتشكيل الأزواج في هذه المجموعة.');
    }
    
    // 3. تعيين الأزواج (أزواج 1-5)
    // نستخدم chosenUsers[0] إلى chosenUsers[9]
    let a = chosenUsers[0];
    let b = chosenUsers[1];
    let c = chosenUsers[2] || a; // احتياط
    let d = chosenUsers[3] || b; // احتياط
    let e = chosenUsers[4] || a;
    let f = chosenUsers[5] || b;
    let g = chosenUsers[6] || c;
    let h = chosenUsers[7] || d;
    let i = chosenUsers[8] || e;
    let j = chosenUsers[9] || f;
    
    // 4. قائمة المنشنات النهائية
    const mentions = [a, b, c, d, e, f, g, h, i, j].filter(id => id); // تصفية المنشنات الفارغة

    // 5. إرسال الرسالة الموحدة
    m.reply(
        `
*😍 أفضل 5 أزواج في المجموعة 😍*
━𑇍⸢👑⸥𑇍━
    
*1. ${toM(a)} و ${toM(b)}*
- هذا الزوج مقدر لهما أن يبقيا معاً للأبد! 💙

*2. ${toM(c)} و ${toM(d)}*
- هذان هما عصفوران صغيران غارقان في الحب! ✨

*3. ${toM(e)} و ${toM(f)}*
- يا إلهي، ماذا نقول عن هذا الثنائي؟ يجب أن يكون لديهما عائلة بالفعل! 🤱🧑‍🍼

*4. ${toM(g)} و ${toM(h)}*
- لقد تزوجا سراً بالفعل! 💍

*5. ${toM(i)} و ${toM(j)}*
- هذا الزوج في شهر عسل دائم! ✨🥵😍❤️

*🎮 بوت كيرا تنغن*
`,
        null,
        {
            mentions: mentions,
        }
    );
}

handler.help = ["تكوين_الأزواج"];
handler.tags = ["ترفيه"];
handler.command = ["تكوين_الأزواج", "زواج", "زوجني5"];
handler.register = true;
handler.group = true;
export default handler;
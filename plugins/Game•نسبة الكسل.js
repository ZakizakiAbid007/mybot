const handler = async (m, { conn, command, text, usedPrefix }) => {
    // التأكد من وجود منشن أو نص
    if (!text) {
        return conn.reply(m.chat, `🚩 *من فضلك، اذكر اسم المستخدم أو قم بمنشنته.*`, m, rcanal, );
    }

    // توليد نسبة مئوية عشوائية (افتراضياً من 0 إلى 500)
    // يُفترض أن .getRandom() هي دالة موجودة في إطار عمل البوت
    const percentages = (500).getRandom(); 
    let emoji = '';
    let description = '';
    let targetName = text.toUpperCase(); // اسم المستخدم المستهدف

    // 1. معالجة الأوامر المختلفة
    switch (command) {
        case 'gay':
        case 'مثلي':
            emoji = '🏳️‍🌈';
            if (percentages < 50) {
                description = `💙 تشير الحسابات إلى أن ${targetName} هو *${percentages}%* مثلي ${emoji}\n> ✰ هذه نسبة منخفضة، ربما أنت متطرف قليلاً وليس مثلياً بشكل كامل!`;
            } else if (percentages > 100) {
                description = `💜 تشير الحسابات إلى أن ${targetName} هو *${percentages}%* مثلي ${emoji}\n> ✰ أنت مثلي أكثر مما كنا نتوقع!`;
            } else {
                description = `🖤 تشير الحسابات إلى أن ${targetName} هو *${percentages}%* مثلي ${emoji}\n> ✰ هذا هو الشيء الخاص بك، أنت مثلي بشكل واضح.`;
            }
            break;
        case 'lesbiana':
        case 'سحاقية':
            emoji = '🏳️‍🌈';
            if (percentages < 50) {
                description = `👻 تشير الحسابات إلى أن ${targetName} هي *${percentages}%* ${command} ${emoji}\n✰ ربما تحتاجين إلى المزيد من الأفلام الرومانسية في حياتك.`;
            } else if (percentages > 100) {
                description = `❣️ تشير الحسابات إلى أن ${targetName} هي *${percentages}%* ${command} ${emoji}\n> ✰ هذا حب شديد للفتيات!`;
            } else {
                description = `💗 تشير الحسابات إلى أن ${targetName} هي *${percentages}%* ${command} ${emoji}\n> ✰ حافظي على ازدهار الحب!`;
            }
            break;
        case 'pajero':
        case 'pajera':
        case 'كسول':
        case 'كسولة':
            emoji = '😏💦';
            if (percentages < 50) {
                description = `🧡 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ ربما تحتاج إلى المزيد من الهوايات!`;
            } else if (percentages > 100) {
                description = `💕 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ هذه مقاومة رائعة!`;
            } else {
                description = `💞 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ استمر في العمل الجيد (بشكل فردي).`;
            }
            break;
        case 'puto':
        case 'puta':
        case 'مثير':
        case 'مثيرة':
            emoji = '🔥🥵';
            if (percentages < 50) {
                description = `😼 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✧ حظاً أوفر في فتوحاتك القادمة!`;
            } else if (percentages > 100) {
                description = `😻 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command}. ${emoji}\n> ✰ أنت/أنتِ تشتعل/ين!`;
            } else {
                description = `😺 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ حافظ على هذا السحر المشتعل!`;
            }
            break;
        case 'manco':
        case 'manca':
        case 'أخرق':
        case 'خرقاء':
            emoji = '💩';
            if (percentages < 50) {
                description = `🌟 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ لست الوحيد في هذا النادي!`;
            } else if (percentages > 100) {
                description = `💌 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ لديك موهبة خاصة جداً!`;
            } else {
                description = `🥷 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ حافظ على هذه الروح الشجاعة!`;
            }
            break;
        case 'rata':
        case 'فار':
            emoji = '🐁';
            if (percentages < 50) {
                description = `💥 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ لا بأس بالاستمتاع بالجبن!`;
            } else if (percentages > 100) {
                description = `💖 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ أنت فأر فاخر حقيقي!`;
            } else {
                description = `👑 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ تناول الجبن بمسؤولية!`;
            }
            break;
        case 'prostituto':
        case 'prostituta':
        case 'محترف':
        case 'محترفة':
            emoji = '🫦👅';
            if (percentages < 50) {
                description = `❀ تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ السوق مزدهر!`;
            } else if (percentages > 100) {
                description = `💖 تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ محترف/ة حقيقي/ة!`;
            } else {
                description = `✨️ تشير الحسابات إلى أن ${targetName} هو/هي *${percentages}%* ${command} ${emoji}\n> ✰ دائماً هو وقت العمل!`;
            }
            break;
        default:
            m.reply(`☁️ أمر غير صالح.`);
            return;
    }

    // 2. رسائل الختام العشوائية
    const responses = [
        "الكون تحدث.",
        "العلماء يؤكدون ذلك.",
        "مفاجأة!"
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const cal = `💫 *الـحـاسـبـة الـتـرفـيـهـيـة*

${description}

➤ ${response}`.trim()
    
    // 3. عرض شريط التحميل الوهمي
    async function loading() {
        var hawemod = [
            "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
            "《 ████▒▒▒▒▒▒▒▒》30%",
            "《 ███████▒▒▒▒▒》50%",
            "《 ██████████▒▒》80%",
            "《 ████████████》100%"
        ]
        
        let { key } = await conn.sendMessage(m.chat, {text: `🤍 *جاري حساب النسبة المئوية!*`, mentions: conn.parseMention(cal)}, {quoted: fkontak})
        for (let i = 0; i < hawemod.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // تأخير 1 ثانية
            await conn.sendMessage(m.chat, {text: hawemod[i], edit: key, mentions: conn.parseMention(cal)}, {quoted: fkontak});
        }
        
        // 4. إرسال النتيجة النهائية
        await conn.sendMessage(m.chat, {text: cal, edit: key, mentions: conn.parseMention(cal)}, {quoted: fkontak});
    }

    loading()
};

handler.help = ['مثلي', 'سحاقية', 'كسول', 'كسولة', 'مثير', 'مثيرة', 'أخرق', 'خرقاء', 'فار', 'محترف', 'محترفة'];
handler.tags = ['ترفيه'];
handler.register = true;
handler.group = true;
handler.command = [ 'مثلي', 'سحاقية', 'كسول', 'كسولة', 'مثير', 'مثيرة', 'أخرق', 'خرقاء', 'فار', 'محترف', 'محترفة'];

export default handler;
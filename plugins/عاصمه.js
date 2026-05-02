let timeout = 60000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.capitalsGame = conn.capitalsGame ? conn.capitalsGame : {};
    let id = m.chat;
    if (id in conn.capitalsGame) {
        conn.reply(m.chat, '*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*\n*🍂 لا يزال هناك سؤال نشط! 🍂*\n*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*', conn.capitalsGame[id][0]);
        throw false;
    }
    
    // قاعدة بيانات العواصم العربية والعالمية
    let capitals = [
        // الدول العربية
        { question: "ما هي عاصمة 🇪🇬 مصر؟", response: "القاهرة" },
        { question: "ما هي عاصمة 🇸🇦 السعودية؟", response: "الرياض" },
        { question: "ما هي عاصمة 🇦🇪 الإمارات؟", response: "أبو ظبي" },
        { question: "ما هي عاصمة 🇯🇴 الأردن؟", response: "عمان" },
        { question: "ما هي عاصمة 🇱🇧 لبنان؟", response: "بيروت" },
        { question: "ما هي عاصمة 🇶🇦 قطر؟", response: "الدوحة" },
        { question: "ما هي عاصمة 🇰🇼 الكويت؟", response: "الكويت" },
        { question: "ما هي عاصمة 🇧🇭 البحرين؟", response: "المنامة" },
        { question: "ما هي عاصمة 🇴🇲 عمان؟", response: "مسقط" },
        { question: "ما هي عاصمة 🇮🇶 العراق؟", response: "بغداد" },
        { question: "ما هي عاصمة 🇸🇾 سوريا؟", response: "دمشق" },
        { question: "ما هي عاصمة 🇾🇪 اليمن؟", response: "صنعاء" },
        { question: "ما هي عاصمة 🇩🇿 الجزائر؟", response: "الجزائر" },
        { question: "ما هي عاصمة 🇲🇦 المغرب؟", response: "الرباط" },
        { question: "ما هي عاصمة 🇹🇳 تونس؟", response: "تونس" },
        { question: "ما هي عاصمة 🇱🇾 ليبيا？", response: "طرابلس" },
        { question: "ما هي عاصمة 🇸🇩 السودان？", response: "الخرطوم" },
        { question: "ما هي عاصمة 🇸🇴 الصومال？", response: "مقديشو" },
        { question: "ما هي عاصمة 🇲🇷 موريتانيا？", response: "نواكشوط" },
        
        // دول عالمية
        { question: "ما هي عاصمة 🇺🇸 أمريكا؟", response: "واشنطن" },
        { question: "ما هي عاصمة 🇬🇧 بريطانيا؟", response: "لندن" },
        { question: "ما هي عاصمة 🇫🇷 فرنسا؟", response: "باريس" },
        { question: "ما هي عاصمة 🇩🇪 ألمانيا؟", response: "برلين" },
        { question: "ما هي عاصمة 🇮🇹 إيطاليا؟", response: "روما" },
        { question: "ما هي عاصمة 🇪🇸 إسبانيا؟", response: "مدريد" },
        { question: "ما هي عاصمة 🇨🇦 كندا؟", response: "أوتاوا" },
        { question: "ما هي عاصمة 🇦🇺 أستراليا؟", response: "كانبرا" },
        { question: "ما هي عاصمة 🇯🇵 اليابان؟", response: "طوكيو" },
        { question: "ما هي عاصمة 🇨🇳 الصين؟", response: "بكين" },
        { question: "ما هي عاصمة 🇷🇺 روسيا؟", response: "موسكو" },
        { question: "ما هي عاصمة 🇮🇳 الهند؟", response: "نيودلهي" },
        { question: "ما هي عاصمة 🇧🇷 البرازيل؟", response: "برازيليا" },
        { question: "ما هي عاصمة 🇦🇷 الأرجنتين؟", response: "بوينس آيرس" },
        { question: "ما هي عاصمة 🇹🇷 تركيا؟", response: "أنقرة" },
        { question: "ما هي عاصمة 🇮🇷 إيران؟", response: "طهران" },
        { question: "ما هي عاصمة 🇰🇷 كوريا الجنوبية؟", response: "سيول" },
        { question: "ما هي عاصمة 🇮🇩 إندونيسيا؟", response: "جاكرتا" },
        { question: "ما هي عاصمة 🇿🇦 جنوب أفريقيا؟", response: "بريتوريا" },
        { question: "ما هي عاصمة 🇳🇬 نيجيريا؟", response: "أبوجا" },
        { question: "ما هي عاصمة 🇲🇽 المكسيك؟", response: "مكسيكو سيتي" }
    ];

    let json = capitals[Math.floor(Math.random() * capitals.length)];
    
    let caption = `*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*\n\n` +
                 `*🧠 السؤال:*\n${json.question}\n\n` +
                 `*👤 اللاعب:* @${m.sender.split('@')[0]}\n` +
                 `*⏰ الوقت:* ${(timeout / 1000).toFixed(2)} ثانية\n` +
                 `*🎯 النقاط:* ${poin}\n\n` +
                 `*🍂 ── ⋆⋅☆⋅⋆ ── 🍂*\n` +
                 `*📜 تنغن كيرا 🍁*`;

    conn.capitalsGame[id] = [
        await conn.reply(m.chat, caption, m, { mentions: [m.sender] }),
        json, 
        poin,
        setTimeout(async () => {
            if (conn.capitalsGame[id]) {
                await conn.reply(m.chat, 
                    `*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*\n\n` +
                    `*⏰ انتهى الوقت!*\n` +
                    `*✅ الإجابة الصحيحة:* ${json.response}\n\n` +
                    `*🍂 ── ⋆⋅☆⋅⋆ ── 🍂*`, 
                    conn.capitalsGame[id][0]
                );
                delete conn.capitalsGame[id];
            }
        }, timeout)
    ];
};

// دالة معالجة الإجابات
handler.before = async (m, { conn }) => {
    if (!m.text || !conn.capitalsGame) return;
    
    let id = m.chat;
    if (!(id in conn.capitalsGame)) return;
    
    let gameData = conn.capitalsGame[id];
    let userAnswer = m.text.trim().toLowerCase();
    let correctAnswer = gameData[1].response.toLowerCase();
    
    // التحقق من الإجابة
    if (userAnswer === correctAnswer) {
        // الإجابة الصحيحة
        await conn.reply(m.chat, 
            `*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*\n\n` +
            `*🎉 إجابة صحيحة!*\n` +
            `*✅ الإجابة:* ${gameData[1].response}\n` +
            `*🎯 ربحت:* ${gameData[2]} نقطة\n` +
            `*👤 اللاعب:* @${m.sender.split('@')[0]}\n\n` +
            `*🍂 ── ⋆⋅☆⋅⋆ ── 🍂*`, 
            m, { mentions: [m.sender] }
        );
        clearTimeout(gameData[3]);
        delete conn.capitalsGame[id];
        
    } else if (this.isCloseAnswer(userAnswer, correctAnswer)) {
        // إجابة قريبة
        await conn.reply(m.chat, 
            `*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*\n\n` +
            `*🤔 إجابة قريبة!*\n` +
            `*💡 حاول مرة أخرى، أنت على الطريق الصحيح*\n\n` +
            `*🍂 ── ⋆⋅☆⋅⋆ ── 🍂*`, 
            m
        );
        
    } else {
        // إجابة خاطئة
        await conn.reply(m.chat, 
            `*🍁 ── ⋆⋅☆⋅⋆ ── 🍁*\n\n` +
            `*❌ إجابة خاطئة!*\n` +
            `*🔍 حاول مرة أخرى*\n\n` +
            `*🍂 ── ⋆⋅☆⋅⋆ ── 🍂*`, 
            m
        );
    }
};

// دالة للتحقق من الإجابات القريبة
handler.isCloseAnswer = (userAnswer, correctAnswer) => {
    // إزالة التشكيل والمسافات الزائدة
    userAnswer = userAnswer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();
    correctAnswer = correctAnswer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();
    
    // التحقق من التشابه
    if (userAnswer === correctAnswer) return true;
    
    // التحقق من الإجابات القريبة (70% تشابه)
    let similarity = this.calculateSimilarity(userAnswer, correctAnswer);
    return similarity >= 0.7;
};

// دالة حساب التشابه بين النصوص
handler.calculateSimilarity = (str1, str2) => {
    let longer = str1;
    let shorter = str2;
    if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
};

// دالة حساب المسافة التحريرية
handler.editDistance = (str1, str2) => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    
    let costs = [];
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
};

handler.help = ['عاصمة'];
handler.tags = ['game'];
handler.command = /^(عاصمه|عواصم|لعبةعواصم)$/i;

export default handler;
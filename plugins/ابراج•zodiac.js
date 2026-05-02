// برج.js - تم تعريبه من الإسبانية

let handler = (m, { usedPrefix, command, text }) => {
    // التحقق من الإدخال
    if (!text) throw `❌ *طريقة الاستخدام:*\nأدخل تاريخ ميلادك بالتنسيق: *السنة الشهر اليوم*\n\n*مثال:*\n${usedPrefix + command} 2000 06 09`;

    const date = new Date(text.replace(/ /g, '-')) // استبدال المسافات بشرطة لضمان عمل دالة new Date
    if (isNaN(date.getTime())) throw `❌ *تاريخ غير صالح!*\nيرجى المحاولة بالتنسيق: *السنة الشهر اليوم*\n\n*مثال: 2003 02 07*`;
    
    const d = new Date()
    const [tahun, bulan, tanggal] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    const birth = [date.getFullYear(), date.getMonth() + 1, date.getDate()]

    // حساب البرج الفلكي
    const zodiac = getZodiac(birth[1], birth[2])
    
    // حساب العمر
    const ageD = new Date(d - date)
    const age = ageD.getFullYear() - new Date(1970, 0, 1).getFullYear()

    // حساب تاريخ عيد الميلاد القادم
    const birthday = [tahun + (birth[1] < bulan || (birth[1] === bulan && birth[2] < tanggal)), ...birth.slice(1)]
    
    // رسالة عيد الميلاد
    const cekusia = bulan === birth[1] && tanggal === birth[2] ? `${age} - 🎉 عيد ميلاد سعيد! 🎉` : age

    const teks = `
*🌟 معلومات البرج الفلكي 🌟*
━𑇍⸢🍁⸥𑇍━

▢ *تاريخ الميلاد:* ${birth.join('-')}
▢ *العمر التقريبي:* ${cekusia}
▢ *تاريخ عيد الميلاد القادم:* ${birthday.join('-')}
▢ *البرج الفلكي:* ${zodiac}

🎮 *بوت كيرا تنغن*
`.trim()
    m.reply(teks)
}

handler.help = ['برج *السنة الشهر اليوم*']
handler.tags = ['ترفيه']
handler.command = ['برج', 'ابراج']

export default handler

// قائمة الأبراج (تم تعريبها)
const zodiak = [
    ["الجدي", new Date(1970, 0, 1)], // 1 يناير
    ["الدلو", new Date(1970, 0, 20)], // 20 يناير
    ["الحوت", new Date(1970, 1, 19)], // 19 فبراير
    ["الحمل", new Date(1970, 2, 21)], // 21 مارس
    ["الثور", new Date(1970, 3, 21)], // 21 أبريل
    ["الجوزاء", new Date(1970, 4, 21)], // 21 مايو
    ["السرطان", new Date(1970, 5, 22)], // 22 يونيو
    ["الأسد", new Date(1970, 6, 23)], // 23 يوليو
    ["العذراء", new Date(1970, 7, 23)], // 23 أغسطس
    ["الميزان", new Date(1970, 8, 23)], // 23 سبتمبر
    ["العقرب", new Date(1970, 9, 23)], // 23 أكتوبر
    ["القوس", new Date(1970, 10, 22)], // 22 نوفمبر
    ["الجدي", new Date(1970, 11, 22)] // 22 ديسمبر
].reverse()

function getZodiac(month, day) {
    let d = new Date(1970, month - 1, day)
    return zodiak.find(([_,_d]) => d >= _d)[0]
}
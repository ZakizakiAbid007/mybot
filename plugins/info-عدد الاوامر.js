import util from 'util' // غير مستخدم في الكود، لكنه غالباً موجود في بيئات البوت

let handler = async (m, { conn }) => {

// حساب العدد الإجمالي للوظائف (الأوامر) الصالحة
let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags // تصفية الأوامر التي تحتوي على خصائص help و tags
  ).length;

// إرسال النتيجة
conn.reply(m.chat, `🔢 إجمالي الأوامر : ${totalf}`, m)
}

// إعدادات المعالج
handler.help = ['اجمالي_الأوامر'] // ترجمة المساعدة
handler.tags = ['رئيسي'] // ترجمة الوسم
handler.command = ['عدد-اوامر', 'كل-اوامر', 'الكل'] // الأوامر
handler.register = true // يتطلب التسجيل

export default handler
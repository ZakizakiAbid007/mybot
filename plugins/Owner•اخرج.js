let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
let chat = global.db.data.chats[m.chat]
// تعطيل رسالة الترحيب في ملف إعدادات المجموعة قبل المغادرة (خطوة اختيارية)
chat.welcome = false 
// رسالة المغادرة الملكية باللغة العربية
await conn.reply(id, `《👑》 *البوت الملكي* يغادر هذه المجموعة بأمر من الملك تنغن. شكراً لكم، كان وجودي هنا رائعاً.`) 
// تنفيذ أمر مغادرة المجموعة
await conn.groupLeave(id)
try {  
// إعادة تفعيل رسالة الترحيب في ملف الإعدادات في حال بقاء إعدادات المجموعة (خطوة اختيارية)
chat.welcome = true
} catch (e) {
await m.reply(`${fg}`) 
return console.log(e)
}}
// الأوامر المعربة
handler.command = ['مغادرة', 'اخرج', 'اطلع_من_المجموعة']
handler.group = true // يعمل في المجموعات فقط
handler.rowner = true // مخصص للمالك الرئيسي
export default handler
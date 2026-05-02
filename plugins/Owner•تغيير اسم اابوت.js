let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  // التحقق من إدخال اسم جديد
  if (!text) return conn.reply(m.chat, `🚩 *ما هو الاسم الذي تريد أن تطلقه عليّ؟*`, m, rcanal)
  
  try {
    // تنفيذ أمر تحديث اسم ملف تعريف البوت
    await conn.updateProfileName(text)
    
    // رسالة النجاح
    return conn.reply(m.chat, '✅️ *تم تغيير الاسم بنجاح*', m, rcanal)
    await m.react(done)
  } catch (e) {
    // رسالة الخطأ
    console.log(e)
    await m.react(error)
    return conn.reply(m.chat, `🚩 حدث خطأ!`, m, fake)
  }
}
handler.help = ['تغيير_اسم_البوت <نص>']
handler.tags = ['owner']
handler.command = ['تغيير_اسم_البوت', 'اسم_جديد_للبوت', 'setbotname']

handler.owner = true // مخصص لمالك البوت
export default handler
let toM = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata }) {
  // جلب قائمة المشاركين في المجموعة
  let ps = groupMetadata.participants.map(v => v.id)
  
  // اختيار العضو الأول عشوائياً
  let a = ps.getRandom() 
  let b
  
  // اختيار العضو الثاني عشوائياً، مع التأكد من أنه ليس العضو الأول
  do b = ps.getRandom()
  while (b === a)
  
  const emoji = '🤝' // استخدام رمز إيموجي مناسب
  
  m.reply(`${emoji} هيا لنكوّن بعض الصداقات.\n\n*يا ${toM(a)}، تحدى ${toM(b)} في لعبة الآن لتبدأ صداقة جديدة! 🙆*\n\n*أفضل الصداقات تبدأ بلعبة 😉.*`, null, {
    // ضمان الوسم الفعلي للمستخدمين
    mentions: [a, b]
  })
}

handler.help = ['صداقة']
handler.tags = ['مرح']
handler.command = ['صديق_عشوائي','صداقة'] // ترجمة الأوامر
handler.group = true
handler.register = true

export default handler
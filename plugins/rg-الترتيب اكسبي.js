let handler = async (m, { conn, args }) => {
  try {
    // 1. جمع وفرز بيانات المستخدمين
    let users = Object.entries(global.db.data.users).map(([jid, user]) => ({
      jid,
      exp: Number(user.exp) || 0,
      level: Number(user.level) || 0,
      cookies: Number(user.cookies || user.money || 0) // العملات/الكوكيز
    }))

    // فرز المستخدمين بناءً على نقاط الخبرة (EXP) تنازلياً
    users.sort((a, b) => b.exp - a.exp)

    // 2. منطق الصفحات
    let page = Math.max(1, parseInt(args[0]) || 1) // تحديد رقم الصفحة
    let pageSize = 10 // عدد اللاعبين في الصفحة الواحدة
    let totalPages = Math.ceil(users.length / pageSize) // إجمالي عدد الصفحات
    if (page > totalPages) page = totalPages

    let start = (page - 1) * pageSize // بداية القائمة
    let end = start + pageSize // نهاية القائمة
    let usersPage = users.slice(start, end) // قائمة المستخدمين في الصفحة الحالية

    // 3. جلب الأسماء
    let names = await Promise.all(usersPage.map(async u => {
      try {
        return await conn.getName(u.jid) // جلب الاسم من واتساب
      } catch {
        return 'مستخدم' // اسم افتراضي في حال الفشل
      }
    }))

    // 4. بناء رسالة لوحة المتصدرين (النتائج)
    let text = `🎖️ *لوحة المتصدرين الملكية (XP)* 🎖️\n│\n`

    text += usersPage.map((user, i) => {
      let index = start + i + 1 // الترتيب العام
      let displayName = names[i] || `@${user.jid.split('@')[0]}` // الاسم المعروض

      return `│ ✦ ${index}. *${displayName}*\n│    ├ 🎖 المستوى: *${user.level}*\n│    ├ 🪙 العملات: *${user.cookies.toLocaleString()}*\n│    └ 💥 XP (الخبرة): *${user.exp.toLocaleString()}*`
    }).join('\n│\n')

    text += `\n╰══ 📄 الصفحة *${page}* من *${totalPages}* ══╯`
    if (page < totalPages) text += `\n\n➡️ استخدم *#لوحة_المتصدرين ${page + 1}* لعرض الصفحة التالية`

    // إرسال الرسالة مع الإشارة لجميع المستخدمين في القائمة
    await conn.reply(m.chat, text.trim(), m, {
      mentions: usersPage.map(u => u.jid)
    })

  } catch (error) {
    console.error(error)
    m.reply('❌ حدث خطأ أثناء محاولة عرض قائمة المتصدرين.')
  }
}

handler.help = ['لوحة_المتصدرين [رقم_الصفحة]']
handler.tags = ['rpg']
handler.command = ['لوحة_المتصدرين', 'الترتيب', 'top', 'lb']
handler.group = true
handler.register = true
handler.fail = null
handler.exp = 0

export default handler
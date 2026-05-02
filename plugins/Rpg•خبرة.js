// كود صرف الخبرة مقابل العملات
let handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender]
  const ratio = 100000 // معدل الصرف: 100,000 XP لكل تبديل
  const monedasPorIntercambio = 50000 // العملات المكتسبة لكل تبديل
  const LIMITE_DIARIO = 3 // الحد الأقصى للتبديلات المسموح بها يومياً

  // 1. تهيئة عداد التبديلات اليومية
  if (!user.expcambio) {
    user.expcambio = { hoy: 0, fecha: new Date().toDateString() }
  }

  // إعادة تعيين العداد إذا تغير اليوم
  if (user.expcambio.fecha !== new Date().toDateString()) {
    user.expcambio.hoy = 0
    user.expcambio.fecha = new Date().toDateString()
  }

  // 2. التحقق من الحد الأقصى اليومي
  if (user.expcambio.hoy >= LIMITE_DIARIO) {
    return m.reply(`🚫 لقد وصلت إلى *الحد الأقصى للتبديلات اليومية وهو ${LIMITE_DIARIO}*.\n📆 حاول مجدداً غداً.`)
  }

  // 3. التحقق من صيغة الإدخال
  if (!args[0] || isNaN(args[0])) {
    return m.reply(`📌 الاستخدام الصحيح: *.تبديل_الخبرة <كمية الخبرة>*\n🎯 مثال: *.تبديل_الخبرة 100000*`)
  }

  let cantidad = parseInt(args[0])
  if (cantidad <= 0) return m.reply('❌ يجب أن تكون الكمية أكبر من 0.')
  if (user.exp < cantidad) return m.reply(`❌ ليس لديك خبرة كافية.\n📊 رصيدك الحالي من الخبرة: *${user.exp.toLocaleString()}*`)

  // 4. حساب عدد مرات التبديل الممكنة
  let veces = Math.floor(cantidad / ratio)
  if (veces === 0) return m.reply(`❌ يجب أن تصرف ما لا يقل عن *${ratio.toLocaleString()}* من الخبرة للحصول على عملات.`)

  // 5. التحقق من تجاوز حد التبديل بعد الحساب
  if (user.expcambio.hoy + veces > LIMITE_DIARIO) {
    let disponibles = LIMITE_DIARIO - user.expcambio.hoy
    return m.reply(`⚠️ يمكنك إجراء *${disponibles}* تبديل(ات) أخرى فقط اليوم.\nالمستخدم حالياً: *${user.expcambio.hoy}/${LIMITE_DIARIO}*`)
  }

  // 6. تنفيذ التبديل
  let expUsada = veces * ratio
  let monedasGanadas = veces * monedasPorIntercambio

  // خصم الخبرة وإضافة العملات
  user.exp -= expUsada
  user.monedas = (user.monedas || 0) + monedasGanadas
  user.expcambio.hoy += veces

  // 7. رسالة التأكيد
  m.reply(`〔 *🔄 إِكْمَالُ التَّبْدِيلِ* 〕
┃🧪 الخبرة المستخدمة: *${expUsada.toLocaleString()}*
┃🪙 العملات المكتسبة: *${monedasGanadas.toLocaleString()}*
┃📆 التبديلات المستخدمة اليوم: *${user.expcambio.hoy}/${LIMITE_DIARIO}*
╰━━━━━━━━━━━━━━━━━━⬣`)
}

handler.help = ['تبديل_الخبرة <كمية>']
handler.tags = ['rpg', 'econ']
handler.command = ['تبديل_الخبرة', 'خبرة']
handler.register = true
export default handler
const handler = async (m, { conn, args }) => {
  const db = global.db.data
  const user = db.users[m.sender]
  user.personajes = user.personajes || []

  // 1. التحقق من وجود شخصيات للمنافسة
  if (!user.personajes.length) {
    return m.reply('⚠️ تحتاج إلى امتلاك شخصيات للمنافسة في مجلس الحكم الملكي.')
  }

  // 2. تهيئة قاعدة بيانات مجلس الحكم
  if (!db.reinado) db.reinado = {}

  // 3. منطق التحقق من المالك (Owner)
  const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
  const isOwner = [...global.owner.map(([number]) => number)]
    .map(v => v.replace(/[^0-9]/g, '') + detectwhat)
    .includes(m.sender)

  // 4. أمر إعادة تعيين المجلس (Reset)
  if (args[0] === 'reset') {
    if (!isOwner) return m.reply('❌ لا تملك الإذن لإعادة تعيين مجلس الحكم الملكي.')
    db.reinado = {}
    return m.reply('✅ تم إعادة تعيين مجلس الحكم الملكي بنجاح.')
  }

  // 5. حساب القوة السحرية للمستخدم
  const personajesGlobal = [...(global.personajesTop || []), ...(global.personajesNormales || [])]

  const poder = user.personajes.reduce((acc, nombrePj) => {
    // العثور على قيمة الشخصية في قوائم الشخصيات العامة (غير موجودة في هذا الكود، لكنها مفترضة)
    const pj = personajesGlobal.find(p => p.nombre.toLowerCase() === nombrePj.toLowerCase())
    // إضافة سعر الشخصية (أو 100,000 كقيمة افتراضية)
    return acc + (pj?.precio || 100000)
  }, 0) + Math.floor(Math.random() * 50000) // إضافة قوة عشوائية للمنافسة

  // 6. تسجيل قوة المستخدم في مجلس الحكم
  db.reinado[m.sender] = poder

  // 7. إنشاء قائمة الترتيب (الـ Ranking)
  const ranking = Object.entries(db.reinado)
    .sort((a, b) => b[1] - a[1]) // فرز تنازلياً حسب القوة
    .slice(0, 10) // عرض أول 10 متسابقين فقط

  // 8. بناء رسالة الترتيب
  const textoRanking = await Promise.all(ranking.map(async ([jid, poder], i) => {
    const isJidOwner = [...global.owner.map(([number]) => number)]
      .map(v => v.replace(/[^0-9]/g, '') + (jid.includes('@lid') ? '@lid' : '@s.whatsapp.net'))
      .includes(jid)

    let nombre
    if (isJidOwner) {
      nombre = '👑 *الملك الساحر* (Owner)'
    } else {
      try {
        nombre = await conn.getName(jid)
      } catch {
        nombre = '@' + jid.split('@')[0]
      }
    }

    const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔹'
    return `${medalla} *${i + 1}.* ${nombre} — القوة: *${poder.toLocaleString()}*`
  }))

  // 9. الرسالة النهائية
  const posUsuario = ranking.findIndex(([jid]) => jid === m.sender)
  const texto = `
👑 *مجلس الحكم الملكي - أقوى 10 في السحر*

${textoRanking.join('\n')}

📌 مركزك الحالي: *${posUsuario + 1 || 'خارج الترتيب'}*
🔮 قوة سحرك الكلية: *${poder.toLocaleString()}*

💡 استخدم هذه القوة لتثبت تفوقك السحري.
`.trim()

  return conn.reply(m.chat, texto, m)
}

// دالة مكافأة المتصدرين (غير مفعلة هنا، تحتاج لبرنامج جدولة)
async function recompensarTopReinado() {
  const db = global.db.data
  if (!db.reinado) return

  // تصفية أعلى 3
  const ranking = Object.entries(db.reinado)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  for (let i = 0; i < ranking.length; i++) {
    const [jid] = ranking[i]
    // تجاهل المالك
    const isJidOwner = [...global.owner.map(([number]) => number)]
      .map(v => v.replace(/[^0-9]/g, '') + (jid.includes('@lid') ? '@lid' : '@s.whatsapp.net'))
      .includes(jid)
    if (isJidOwner) continue

    const user = db.users[jid]
    if (!user) continue

    // تحديد قيمة المكافأة
    let premio = 0
    switch (i) {
      case 0: premio = 50000; break
      case 1: premio = 30000; break
      case 2: premio = 15000; break
    }

    // منح المكافأة (money)
    user.money = (user.money || 0) + premio
  }
}

handler.help = ['مجلس_الحكم', 'مجلس reset']
handler.tags = ['rpg', 'ranking']
handler.command = ['مجلس', 'رانك']
handler.register = true

export default handler
export { recompensarTopReinado }
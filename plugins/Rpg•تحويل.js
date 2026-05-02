// File: rpg-transferir.js (أمر تحويل العملات لـ تنغن بوت)

const TARIFA = 0.20 // 20% عمولة/ضريبة على التحويل
// جلب قائمة المالكين
const owners = [...global.owner.map(([num]) => num + '@s.whatsapp.net')]

let handler = async (m, { conn, text }) => {
    if (typeof m.text !== "string") m.text = ""

    const senderJid = m.sender
    
    // تهيئة بيانات المرسل
    if (!global.db.data.users[senderJid]) global.db.data.users[senderJid] = {}
    const sender = global.db.data.users[senderJid]
    sender.monedas = sender.monedas || 0

    // 1. تحديد الهدف (المستقبل)
    let who = m.mentionedJid?.[0]
    if (!who) throw '🚨 *الرجاء ذكر المستخدم (تاغ)*\n📌 طريقة الاستخدام: *.تحويل @المستخدم المبلغ*'

    // تهيئة بيانات المستقبل
    if (!global.db.data.users[who]) global.db.data.users[who] = {}
    const receiver = global.db.data.users[who]
    receiver.monedas = receiver.monedas || 0

    // 2. استخراج المبلغ وتدقيقه
    let cantidadTexto = text.replace('@' + who.split('@')[0], '').trim()
    if (!cantidadTexto) throw '💰 *يجب تحديد المبلغ المراد تحويله*'
    if (isNaN(cantidadTexto)) throw '❌ *الأرقام فقط مسموح بها للمبلغ*'

    const monto = parseInt(cantidadTexto)
    if (monto <= 0) throw '⚠️ *يجب أن يكون المبلغ أكبر من 0*'

    // 3. حساب العمولة (الضريبة) والمبلغ الكلي
    const عمولة = Math.ceil(monto * TARIFA)
    const total = monto + عمولة

    // 4. التحقق من رصيد المرسل
    if (sender.monedas < total)
        throw `😵‍💫 *رصيدك غير كافٍ لإجراء التحويل*\n🪙 رصيدك الحالي: ${sender.monedas.toLocaleString('ar-EG')}\n💸 المبلغ المطلوب: ${total.toLocaleString('ar-EG')} (يشمل العمولة)`

    // 5. تنفيذ التحويل (الخصم والإضافة)
    sender.monedas -= total // خصم المبلغ + العمولة من المرسل
    receiver.monedas += monto // إضافة المبلغ الأصلي للمستقبل

    // 6. توزيع العمولة على المالكين
    const عمولة_لكل_مالك = Math.floor(عمولة / owners.length)
    owners.forEach(ownerJid => {
        if (!global.db.data.users[ownerJid]) global.db.data.users[ownerJid] = {}
        global.db.data.users[ownerJid].monedas = (global.db.data.users[ownerJid].monedas || 0) + عمولة_لكل_مالك
    })

    // 7. إرسال رسالة النجاح للمرسل
    await conn.reply(
        m.chat,
        `✅ *تم التحويل بنجاح*  
👤 أرسلت *${monto.toLocaleString('ar-EG')}* عملة إلى @${who.split('@')[0]}  
🧾 *العمولة (20%)*: *${عمولة.toLocaleString('ar-EG')}*  
📤 *الإجمالي المخصوم*: *${total.toLocaleString('ar-EG')}* عملة`,
        m,
        { mentions: [who] }
    )

    // 8. إرسال رسالة إشعار للمستقبل (رد وهمي)
    conn.fakeReply(
        m.chat,
        `📥 *لقد استلمت ${monto.toLocaleString('ar-EG')} عملة 🪙* من @${senderJid.split('@')[0]}!`,
        who,
        m.text
    )
}

handler.help = ['ارسال *@usuario cantidad*']
handler.tags = ['اقتصاد', 'rpg']
handler.command = ['تحويل', 'ارسال', 'تزويد', 'اعطاء', 'ايداع', 'سلف']
handler.register = true

export default handler
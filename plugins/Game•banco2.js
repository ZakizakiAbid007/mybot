// البنك.js
let handler = async (m, { conn, text, command, usedPrefix }) => {
    // التحقق من بيانات المستخدم الافتراضية
    let users = global.db.data.users[m.sender]

    // تعيين القيم الأولية إذا لم تكن موجودة
    if (!users.monedas) users.monedas = 0
    if (!users.deuda) users.deuda = { monto: 0, interes: 0.05, vencimiento: null } // 5% فائدة
    if (!users.bloqueado) users.bloqueado = false

    const args = text ? text.trim().split(" ") : []

    // رسالة المساعدة الرئيسية
    if (!args[0]) {
        return conn.reply(m.chat, `🚩 أوامر البنك:\n\n*${usedPrefix}بنك طلب <الكمية>* - لطلب قرض\n*${usedPrefix}بنك سداد <الكمية>* - لسداد الدين`, m)
    }

    const accion = args[0].toLowerCase()

    // --- 1. عملية طلب القرض (pedir) ---
    if (accion === 'طلب' || accion === 'pedir') {
        let monto = parseInt(args[1])
        
        if (isNaN(monto) || monto <= 0) return conn.reply(m.chat, "🚩 أدخل مبلغاً صحيحاً لطلبه كقرض.", m)
        if (monto > 1000000) return conn.reply(m.chat, "🚩 الحد الأقصى للقرض هو 1,000,000 عملة.", m)
        if (users.deuda.monto > 0) return conn.reply(m.chat, `🚩 لديك بالفعل قرض مستحق بقيمة ${users.deuda.monto} عملة.`, m)

        // تعيين الدين وإضافة المبلغ إلى العملات
        users.deuda.monto = monto
        users.deuda.vencimiento = Date.now() + 24 * 60 * 60 * 1000 // 1 يوم للسداد
        users.monedas += monto
        users.bloqueado = true // قفل الأوامر عند الاقتراض

        conn.reply(m.chat, `💰 لقد طلبت ${monto} عملة كقرض. يجب عليك السداد قبل: ${new Date(users.deuda.vencimiento).toLocaleString('ar-EG')} بفائدة 5%.`, m)
    }

    // --- 2. عملية سداد الدين (pagar) ---
    else if (accion === 'سداد' || accion === 'pagar') {
        if (users.deuda.monto <= 0) return conn.reply(m.chat, "🚩 ليس لديك أي دين مستحق.", m)
        
        let pago = parseInt(args[1])
        if (isNaN(pago) || pago <= 0) return conn.reply(m.chat, "🚩 أدخل مبلغاً صحيحاً للسداد.", m)
        if (pago > users.monedas) return conn.reply(m.chat, "🚩 ليس لديك ما يكفي من العملات لسداد هذا المبلغ.", m)

        // حساب إجمالي الدين مع الفائدة (تقريب لأعلى)
        let deudaTotal = Math.ceil(users.deuda.monto * (1 + users.deuda.interes))

        if (pago >= deudaTotal) {
            // سداد كامل الدين
            users.monedas -= deudaTotal
            users.deuda.monto = 0
            users.deuda.vencimiento = null
            users.bloqueado = false // فتح الأوامر
            conn.reply(m.chat, `✅ لقد سددت دينك بالكامل. تم إلغاء قفل جميع الأوامر.`, m)
        } else {
            // سداد جزئي
            users.monedas -= pago
            users.deuda.monto = deudaTotal - pago
            conn.reply(m.chat, `💸 لقد سددت ${pago} عملة. تبقى عليك دين بقيمة ${users.deuda.monto} عملة.`, m)
        }
    }

    // --- 3. أمر غير معروف ---
    else {
        conn.reply(m.chat, "🚩 أمر غير معروف. استخدم *طلب* أو *سداد*.", m)
    }
}

handler.command = ['بنوك', 'bank', 'banco', 'بنك2', 'bank2', 'banco2']
handler.tags = ['اقتصاد']
handler.register = true
handler.group = true
export default handler
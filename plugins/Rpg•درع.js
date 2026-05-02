// File: rpg-shield.js (أمر شراء الدرع لـ تنغن بوت)

const COSTO_POR_HORA = 10000; // 10,000 عملة للساعة الواحدة

// دالة مساعدة لتحويل الوقت بالمللي ثانية إلى تنسيق عربي مفهوم
function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} يوم(أيام) ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة ${minutes} دقيقة`;
    return `${minutes} دقيقة ${seconds} ثانية`;
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    const now = Date.now();

    // التأكد من تهيئة البيانات للمستخدم (نستخدم 'monedas' لتوحيد العملة)
    if (!user) {
        global.db.data.users[m.sender] = { monedas: 0, shieldUntil: 0 }; 
        user = global.db.data.users[m.sender];
    }

    // 1. التحقق إذا كان الدرع نشطاً بالفعل
    if (user.shieldUntil > now) {
        const tiempoRestante = msToTime(user.shieldUntil - now);
        return conn.reply(
            m.chat,
            `🛡️ *درعك السحري نشط بالفعل!*\\nالوقت المتبقي: *${tiempoRestante}*.\\nطالما الدرع نشط، لن يتمكن أحد من تقليل عملاتك.`,
            m
        );
    }

    // 2. عرض طريقة الاستخدام إذا لم يتم إدخال عدد الساعات
    if (!args[0]) {
        return conn.reply(
            m.chat,
            `🛡️ *شراء درع الحماية*\\n\\nطريقة الاستخدام:\\n*${usedPrefix + command} <عدد_الساعات>*\n\\n*ملاحظة:* كل ساعة تكلف *${COSTO_POR_HORA.toLocaleString()} عملة* 🪙.\\n*أمثلة:*\\n- *${usedPrefix + command} 1* ← ساعة واحدة\\n- *${usedPrefix + command} 24* ← يوم كامل (24 ساعة)`,
            m
        );
    }

    // 3. التحقق من صحة المدخلات
    const horas = parseInt(args[0]);
    if (isNaN(horas) || horas <= 0) {
        return conn.reply(m.chat, `❌ الرجاء إدخال عدد ساعات صحيح وموجب.`, m);
    }

    // 4. حساب التكلفة والتحقق من العملات
    const costo = horas * COSTO_POR_HORA;
    // نستخدم 'monedas' لتوحيد العملة
    if ((user.monedas || 0) < costo) { 
        return conn.reply(
            m.chat,
            `❌ لا تمتلك *عملات 🪙* كافية.\\nتحتاج إلى *${costo.toLocaleString()} عملة* لشراء ${horas} ساعة(ساعات) من الدرع.`,
            m
        );
    }

    // 5. تنفيذ عملية الشراء
    user.monedas -= costo; // الخصم
    user.shieldUntil = now + horas * 60 * 60 * 1000; // إضافة وقت الحماية

    const tiempoTotal = msToTime(user.shieldUntil - now);
    return conn.reply(
        m.chat,
        `✅ *تمت عملية الشراء بنجاح!*\\nلقد اشتريت درعاً لمدة *${horas}* ساعة(ساعات).\\nأنت محمي الآن لمدة: *${tiempoTotal}*. 🛡️`,
        m
    );
};

handler.help = ['escudo <horas>'];
handler.tags = ['rpg', 'اقتصاد'];
handler.command = ['درع', 'شراء-درع', 'escudo'];
export default handler;
// 👑 تم التعديل والتعريب بواسطة جيـميني ليتناسب مع تنغن ملك المهرجانات
// ⚠️ ملاحظة: هذا الكود يعالج مشكلة الحظر في الخاص (Anti-Private)

const TIEMPO_BLOQUEO_MS = 2 * 24 * 60 * 60 * 1000; // 2 أيام: مدة سريان مفعول ختم الحظر

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    try {
        if (m.isBaileys && m.fromMe) return true;
        if (!m.message || !m.text) return false;

        const text = m.text.toUpperCase();
        // 💫 الأوامر المستثناة التي لا تسبب حظراً (لعبة حجرة ورقة مقص، سيربوت/جديبوت)
        const exentos = ['PIEDRA', 'PAPEL', 'TIJERA', 'SERBOT', 'JADIBOT'];
        // 🔒 الأوامر التي يسمح بها حتى لو كان نظام الحظر مفعلاً (مثل أمر عرض الكود)
        const comandoPermitidoBloqueado = ['CODE'];

        const bot = global.db?.data?.settings?.[conn.user?.jid] || {};
        const user = global.db?.data?.users?.[m.sender] || {};
        // 🔗 رابط قناة تنغن ملك المهرجانات الرسمي
        const gp1 = 'https://chat.whatsapp.com/B7wwOfxnsaJGcOEcrGl1KQ?mode=hqrt1'; 

        // التحقق من الأوامر المستثناة والـ 'CODE'
        if (exentos.some(word => text.includes(word)) || comandoPermitidoBloqueado.some(cmd => text.startsWith(cmd))) {
            return true;
        }

        // 🔓 فك الختم: إذا كان محظوراً، يتم التحقق من مرور مدة الحظر
        if (user.bloqueado && user.tiempoBloqueo) {
            const ahora = Date.now();
            const tiempoPasado = ahora - user.tiempoBloqueo;

            if (tiempoPasado >= TIEMPO_BLOQUEO_MS) {
                // 🛠️ التصحيح: يجب فك حظر المستخدم نفسه وليس الدردشة
                await conn.updateBlockStatus(m.sender, 'unblock').catch(() => {}); 
                
                user.bloqueado = false;
                user.tiempoBloqueo = 0;
                user.warnPrivado = 0;

                await conn.sendMessage(m.chat, {
                    text: `🔓 *تِـمَّ كَـسْـرُ الْـخَـتْـمِ!* 🎆\n\n✨ @${m.sender.split('@')[0]}، لقد تلاشت قيودك.\n🎪 يمكنك الآن العودة إلى استخدام قواي في المهرجان!`,
                    mentions: [m.sender]
                });
            } else {
                // إذا كان محظوراً ولم تنقضِ المدة، يتم منع استخدامه
                return false; 
            }
        }

        // 🛡️ نظام الحماية من الخاص (Anti-Private)
        // يتم تطبيقه إذا لم يكن في مجموعة، ونظام الحماية فعال، والمستخدم ليس مالكاً
        if (!m.isGroup && bot.antiPrivate && !isOwner && !isROwner) {
            user.warnPrivado = (user.warnPrivado || 0) + 1;

            if (user.warnPrivado >= 3) {
                // 💀 بلوك وحظر عند بلوغ التحذير الثالث
                const msgBloqueo = `
💀 *حَـكْـمُ الْمَـلِـكِ فُـعِّـلَ!* 💀
━━━━━━━━━━━━━━━━━━━━━━
👁️ المستخدم: @${m.sender.split('@')[0]}
📛 لقد تجرأت على محاولة التواصل في الخاص ثلاث مرات دون إذن!

🔒 *تـمَّ تَـطْـبِـيـقُ خَـتْـمِ الـحَـظْـرِ لمُـدَّةِ 2 يـوم.*
🕰️ *مكان الاحتفال الرسمي هو هنا:*
🌐 ${gp1}
━━━━━━━━━━━━━━━━━━━━`.trim();

                await m.reply(msgBloqueo, false, { mentions: [m.sender] });
                
                // 🛠️ التصحيح: يجب حظر المستخدم نفسه وليس الدردشة
                await conn.updateBlockStatus(m.sender, 'block').catch(() => {});
                
                user.warnPrivado = 0;
                user.bloqueado = true;
                user.tiempoBloqueo = Date.now();
                return false;
            } else {
                // ⚠️ تحذير
                const msgAdvertencia = `
⚠️ *مَـمْـنُـوعُ الـدُّخُـولِ لِـلْـخَـاصِّ!* ⚠️
━━━━━━━━━━━━━━━━━━━
🧛‍♂️ @${m.sender.split('@')[0]}، مملكة المهرجان لا تستقبل الأوامر في الخاص.

🔁 التحذير الحالي: ${user.warnPrivado}/3
🕳️ عند التحذير الثالث، سيتم ختمك لمدة يومين (مجموعة وخاص).

📜 انضم إلى قنوات الاحتفال الرسمية:
🌐 ${gp1}
━━━━━━━━━━━━━━━━━━`.trim();

                await m.reply(msgAdvertencia, false, { mentions: [m.sender] });
                return false;
            }
        }

        return true;

    } catch (e) {
        console.error('[❌ خَـطَـأٌ فَـادِحٌ فِي نِـظَـامِ الْـحَـظْـرِ]', e);
        return true;
    }
}
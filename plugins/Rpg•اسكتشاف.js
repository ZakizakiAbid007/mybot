// File: rpg-explorar.js (أمر الاستكشاف والمغامرات لـ تنغن بوت)

const COOLDOWN = 2 * 60 * 60 * 1000 // ساعتان
const MAX_EXPLORACIONES = 8 // الحد الأقصى للاستكشافات لكل كولداون

const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender]
    // التأكد من تهيئة البيانات
    user.personajes = user.personajes || []
    user.lastExplorar = user.lastExplorar || 0
    user.exploracionesHoy = user.exploracionesHoy || 0
    user.monedas = user.monedas || 0
    user.fragmentos = user.fragmentos || 0

    const now = Date.now()

    // 1. التحقق من تجاوز الحد الأقصى اليومي/للدورة
    if (user.exploracionesHoy >= MAX_EXPLORACIONES) {
        const restanteMs = COOLDOWN - (now - user.lastExplorar)
        if (restanteMs > 0) {
            const restanteTime = msToTime(restanteMs)
            return conn.reply(m.chat, `🚫 لقد وصلت للحد الأقصى لـ *${MAX_EXPLORACIONES}* استكشافات.
استرح لـ *${restanteTime}* قبل أن تتمكن من العودة للاستكشاف.`, m)
        } else {
            // إعادة تعيين عدد الاستكشافات إذا انتهى الكولداون
            user.exploracionesHoy = 0
            user.lastExplorar = 0
        }
    }

    // 2. قوائم الأبعاد والأحداث (معربة ومخصصة)
    const dimensiones = [
        'بُعد الجليد', 'الغابة المحرمة', 'مملكة الظلال', 'فوهة الحمم البركانية',
        'كهف الوهم', 'المعبد المهجور', 'أطلال الزمن', 'الهاوية الكمومية',
        'المدينة الشبحية', 'متاهة الكريستال', 'المستنقع الغامض', 'جبال الصدى',
        'الصحراء القرمزية', 'وادي الهمسات', 'الجزيرة المفقودة', 'الملاذ السماوي',
        'القلعة الهاوية', 'السماء الأبدية', 'غابة النواح', 'بحيرة الخلود'
    ]

    const eventos = [
        'عدو', 'شخصية', 'عملات', 'لاشيء', 'فخ', 'عنصر',
        'لغز', 'كنز', 'حليف', 'بوابة', 'تعويذة', 'لعنة',
        'جواهر', 'خريطة', 'ضوضاء', 'صدى', 'مخلوق', 'سلاح', 'درع',
        'شظية', 'ختم', 'لغز', 'أثر', 'روح', 'وحش'
    ]

    const dimension = dimensiones[Math.floor(Math.random() * dimensiones.length)]
    const evento = eventos[Math.floor(Math.random() * eventos.length)]

    let respuesta = `🌌 *أبعاد ${dimension}*\n\n`

    // 3. معالجة الأحداث
    switch (evento) {
        case 'عدو':
            respuesta += `👁 لقد واجهت *عدو* خطير...\n`
            const suerte = Math.random()
            if (suerte < 0.5) {
                respuesta += '💀 لقد خسرت *15,000 عملة*!\n'
                user.monedas = Math.max(0, user.monedas - 15000)
            } else {
                respuesta += '🛡 تمكنت من الهرب دون ضرر.'
            }
            break

        case 'شخصية':
            // يجب أن يكون global.personajesNormales مُعرفاً في مكان آخر (ربما ملف المتجر)
            const posibles = [...(global.personajesNormales || [])]
            const nuevo = posibles[Math.floor(Math.random() * posibles.length)]
            if (nuevo) {
                respuesta += `🎁 لقد وجدت *شخصية* مخبأة! ← *${nuevo.nombre}*\n`
                // تحقق مما إذا كانت الشخصية موجودة بالفعل (باسمها الصغير)
                if (!user.personajes.includes(nuevo.nombre.toLowerCase())) {
                    user.personajes.push(nuevo.nombre.toLowerCase())
                    respuesta += '🧩 أضيفت إلى مجموعتك.'
                } else {
                    respuesta += '📦 لديك هذه الشخصية بالفعل، حصلت على *10,000 عملة*.'
                    user.monedas += 10000
                }
            } else {
                respuesta += '📛 لم يتم العثور على أي شخصية هذه المرة.'
            }
            break

        case 'عملات':
            const ganancia = Math.floor(Math.random() * 25000) + 5000
            user.monedas += ganancia
            respuesta += `💰 لقد وجدت *${ganancia.toLocaleString('ar-EG')} عملة* 🪙 مخبأة.`
            break

        case 'شظية': // عنصر
        case 'عنصر': // item
            user.fragmentos += 1
            respuesta += '🔮 لقد وجدت *شظية سحر محظورة* مخبأة بين الأنقاض.'
            break

        case 'فخ':
            respuesta += '☠️ وقعت في فخ سحري!\n'
            if (user.personajes.length > 0) {
                const quitado = user.personajes.splice(Math.floor(Math.random() * user.personajes.length), 1)[0]
                respuesta += `😢 لقد فقدت الشخصية *${quitado}* من مجموعتك.`
            } else {
                respuesta += '🌀 لكن لم يكن لديك شخصيات لتخسرها. (نجاة محظوظة)'
            }
            break

        case 'لاشيء':
        default:
            respuesta += '🌫 لم يحدث شيء... لكنك شعرت بوجود مظلم يراقبك.'
            break
    }

    // 4. تحديث سجل الاستكشاف
    user.lastExplorar = now
    user.exploracionesHoy += 1

    conn.reply(m.chat, respuesta, m)
}

handler.help = ['explorar']
handler.tags = ['rpg', 'مغامرات']
handler.command = ['استكشاف', 'مغامرة', 'explore']
handler.register = true

export default handler

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor(duration / (1000 * 60 * 60))
    
    let parts = []
    if (hours > 0) parts.push(`${hours} ساعة`)
    if (minutes > 0) parts.push(`${minutes} دقيقة`)
    if (seconds > 0) parts.push(`${seconds} ثانية`)
    
    return parts.length > 0 ? parts.join(' و ') : 'أقل من ثانية'
}
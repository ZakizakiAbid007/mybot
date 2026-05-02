// File: rpg-toppersonajes.js (ترتيب أفضل جامعي الشخصيات لـ تنغن بوت)

const handler = async (m, { conn }) => {
    const db = global.db.data.users
    const user = db[m.sender]

    // 1. قائمة الشخصيات النادرة (تم تعريبها وتخصيص بعض الأسماء)
    const personajesTop = [
        { nombre: 'ملك السحرة 👑', precio: 20000000 },
        { nombre: 'الملاك الأعلى 😇', precio: 9000000 },
        { nombre: 'تنغن الحكيم 🧠', precio: 8500000 }, // تم التخصيص
        { nombre: 'إله الزمن ⏳', precio: 9100000 },
        { nombre: 'التنين العتيق 🐉', precio: 8700000 },
        { nombre: 'ساموراي الظل ⚔️', precio: 8900000 },
        { nombre: 'الإله المحارب 🪖', precio: 9300000 },
        { nombre: 'الساحر الأعظم 🧙‍♂️', precio: 8800000 },
        { nombre: 'تيتان اللانهاية 👹', precio: 8600000 },
        { nombre: 'روح الفراغ 👻', precio: 9400000 }
    ]

    // 2. قائمة الشخصيات الشائعة (تم اختصارها والاحتفاظ بالاسم اللاتيني)
    const nombresComunes = [
        'Goku','Naruto','Luffy','Zoro','Levi','Eren','Itachi','Madara','Saitama',
        'Batman','Superman','Pikachu','Mewtwo','Gojo','Asta','Yami','Rem','Kirito','Jotaro'
    ]

    const personajesComunes = nombresComunes.map(nombre => ({
        nombre,
        precio: 50000 // سعر ثابت
    }))

    const todos = [...personajesTop, ...personajesComunes]
    const normalizar = str => str.toLowerCase().replace(/[^a-z0-9]/gi, '').trim()

    // 3. إنشاء الترتيب (Ranking)
    let ranking = Object.entries(db)
        .filter(([_, u]) => Array.isArray(u.personajes) && u.personajes.length > 0)
        .map(([jid, u]) => {
            let total = 0
            // عدادات الندرة
            const rarezas = { '👑 نـخـبـة': 0, '💎 مـمـتـاز': 0, '⚔️ مـتـوسـط': 0, '🌱 أسـاسـي': 0 }

            for (let nombreGuardado of u.personajes) {
                const personajeReal = todos.find(p => normalizar(p.nombre) === normalizar(nombreGuardado))
                const precio = personajeReal?.precio || 50000
                const rareza = personajesTop.includes(personajeReal)
                    ? '👑 نـخـبـة'
                    : precio >= 8000000 ? '💎 مـمـتـاز'
                    : precio >= 50000 ? '⚔️ مـتـوسـط'
                    : '🌱 أسـاسـي'

                rarezas[rareza]++
                total += precio
            }

            return {
                jid,
                cantidad: u.personajes.length,
                gastado: total,
                rarezas
            }
        })
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10)

    if (ranking.length === 0) {
        return m.reply('❌ لم يقم أحد بشراء/جمع شخصيات بعد.')
    }

    let texto = `╭═〔 👾 أفـضـل جـامـعـي الـشـخـصـيـات 〕═⬣\n│\n`
    let menciones = []

    for (let i = 0; i < ranking.length; i++) {
        const { jid, cantidad, gastado, rarezas } = ranking[i]
        let name = 'مستخدم'
        try {
            name = await conn.getName(jid)
        } catch {
            name = '@' + jid.split('@')[0]
        }

        const medalla = i === 0 ? '🥇'
            : i === 1 ? '🥈'
            : i === 2 ? '🥉'
            : '🔹'

        texto += `│ ${medalla} *${i + 1}.* ${name}\n`
        texto += `│    🧩 الشخصيات: *${cantidad}*\n`
        texto += `│    💰 الـقـيـمـة: *${gastado.toLocaleString('ar-EG')} عملة*\n`
        // عرض عدد الشخصيات حسب الندرة
        texto += `│    👑 نـخـبـة: ${rarezas['👑 نـخـبـة']}  💎 مـمـتـاز: ${rarezas['💎 مـمـتـاز']}  ⚔️ مـتـوسـط: ${rarezas['⚔️ مـتـوسـط']}  🌱 أسـاسـي: ${rarezas['🌱 أسـاسـي']}\n│\n`

        menciones.push(jid)
    }

    texto += '╰══════════════════════⬣\n'
    texto += '\n📈 *استمر في الشراء لتصعد في الترتيب.*\n🛒 استخدم *.شراء-شخصية <اسم>*'

    conn.reply(m.chat, texto.trim(), m, { mentions: menciones })
}

handler.help = ['toppersonajes']
handler.tags = ['rpg', 'ترتيب']
handler.command = ['توب-شخصيات', 'توب_فلوس', 'توب-فلوس']
handler.register = true

export default handler
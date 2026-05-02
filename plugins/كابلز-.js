import fetch from "node-fetch"

let handler = async (m, { conn }) => {
  try {
    // جلب البيانات
    let data = await (await fetch('https://raw.githubusercontent.com/KazukoGans/database/main/anime/ppcouple.json')).json()
    let cita = data[Math.floor(Math.random() * data.length)]

    // تحميل صورة الولد
    let cowo_res = await fetch(cita.cowo)
    if (!cowo_res.ok) throw new Error('Failed to fetch boy image')
    let cowo_buf = await cowo_res.arrayBuffer()
    let cowo_data = Buffer.from(cowo_buf)

    // إرسال صورة الولد
    await conn.sendMessage(m.chat, { image: cowo_data, caption: '❄️ ولــد 🌿' }, { quoted: m })

    // تحميل صورة البنت
    let cewe_res = await fetch(cita.cewe)
    if (!cewe_res.ok) throw new Error('Failed to fetch girl image')
    let cewe_buf = await cewe_res.arrayBuffer()
    let cewe_data = Buffer.from(cewe_buf)

    // إرسال صورة البنت
    await conn.sendMessage(m.chat, { image: cewe_data, caption: '💋 بـنــت👄' }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ حدث خطأ أثناء تحميل الصور، حاول مرة أخرى.')
  }
}

handler.help = ['ppcouple', 'ppcp']
handler.tags = ['internet']
handler.command = ['تشابه','كابلز']

export default handler
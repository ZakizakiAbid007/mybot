import fs from 'fs'
let handler = async (m, { text, usedPrefix, command }) => {

    if (!text) throw `*🚩 أدخل اسم الإضافة*`
    if (!m.quoted.text) throw `*🚩 قم بالرد على الرسالة*`
    let ruta = `plugins/${text}.js`
    await fs.writeFileSync(ruta, m.quoted.text)
    m.reply(`*✨️ تم الحفظ في ${ruta}*`)
}
handler.help = ['saveplugin'].map(v => v + ' nombre')
handler.tags = ['owner']
handler.command = ["save", "saveplugin", "حفظ", "حفظ_ملف"]
handler.owner = true
handler.owner = true

export default handler
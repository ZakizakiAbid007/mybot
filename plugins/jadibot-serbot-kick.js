// الكود للملك تنغن 👑
// لا تنسى الإشارة لمصدر الكود الأصلي
import fs from "fs"
import path from "path"

let handler = async (m, { conn }) => {
    // التحقق من الإذن الملكي (Owner only)
    if (!global.owner.some(([number]) => number == m.sender.split('@')[0])) {
        return conn.reply(m.chat, '*⚠️ هذا الأمر للقائد فقط، ابتعد!* 😡', m)
    }

    // تحديد مسار مجلد جلسات البوتات الفرعية
    // ملاحظة: يُفترض أن المسار هو '../núcleo•clover/blackJadiBot' نسبةً لموقع هذا الملف
    const baseDir = path.join(path.resolve(), 'núcleo•clover', 'blackJadiBot') 
    
    if (!fs.existsSync(baseDir)) {
        return conn.reply(m.chat, '📂 لم يتم العثور على مجلد *blackJadiBot*. تأكد من المسار.', m)
    }

    let deleted = []
    let skipped = []

    const folders = fs.readdirSync(baseDir)
    
    // عملية التطهير والحذف
    for (let folder of folders) {
        const fullPath = path.join(baseDir, folder)

        // التأكد أنه مجلد وليس ملف
        if (fs.statSync(fullPath).isDirectory()) {
            
            // التحقق مما إذا كان البوت الفرعي لا يزال نشطاً في قائمة الاتصالات (global.conns)
            let stillActive = global.conns.some(sock => {
                let jid = sock.authState?.creds?.me?.jid || ""
                return jid.includes(folder)
            })

            if (!stillActive) {
                // إذا لم يكن نشطاً، يتم حذفه بشكل قمعي
                fs.rmSync(fullPath, { recursive: true, force: true })
                deleted.push(folder)
            } else {
                // إذا كان نشطاً، يتم تجاوزه
                skipped.push(folder)
            }
        }
    }

    // رسالة التلخيص الملكية
    let msg = `🧹 *عملية تطهير التوابع (Sub-Bots)* ⚔️\n\n`
    msg += `✅ *تم حذف الجلسات التالية:* ${deleted.length ? deleted.join(', ') : 'لم يتم حذف أي شيء (كلهم مؤدبون).'}\n`
    msg += `⏳ *توابع نشطة (تم تجاوزها):* ${skipped.length ? skipped.join(', ') : 'لا يوجد.'}\n\n*الآن سيرفرنا أصبح أنظف وأقوى!* 💪`

    await conn.reply(m.chat, msg, m)
}

handler.help = ['تطهير_التوابع']
handler.tags = ['ملك']
handler.command = ['clearsubs', 'تطهير_التوابع', 'حذف_التنصيب']
handler.rowner = true // حصري للمالك
export default handler
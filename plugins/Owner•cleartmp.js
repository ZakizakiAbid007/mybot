import { tmpdir } from 'os'
import path, { join } from 'path'
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs'

let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
    
    // 1. رسالة البدء والتأكيد الفوري
    conn.reply(m.chat, `🚩 *تم بنجاح، تم حذف جميع الملفات الموجودة في المجلد المؤقت (tmp).*`, m, rcanal); // rcanal يجب أن يكون معرَّفاً

    // 2. تحديد مسارات المجلدات المؤقتة المراد مسحها
    const tmp = [tmpdir(), join(__dirname, '../tmp')]
    const filename = []
    
    // 3. جمع أسماء الملفات من كل مجلد
    tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
    
    // 4. حذف الملفات
    return filename.map(file => {
        const stats = statSync(file)
        // حذف الملف
        unlinkSync(file)
    })
} 
// ⚠️ ملاحظة مهمة: لا تستخدم هذا الأمر على منصات الاستضافة مثل Heroku
handler.help = ['مسح_المؤقت']
handler.tags = ['المالك']
handler.command = ['cleartmp', 'borrartmp', 'borrarcarpetatmp', 'vaciartmp', 'مسح_المؤقت'] // إضافة الأوامر العربية
handler.exp = 500
handler.rowner = true

export default handler
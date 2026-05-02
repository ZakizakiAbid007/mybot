import { tmpdir } from 'os'
import path, { join } from 'path'
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync
} from 'fs'

let handler = async (m, { conn, __dirname }) => {
  try {
    // تحديد مسارات مجلدات الملفات المؤقتة التي سيتم تنظيفها
    const tmpDirs = [tmpdir(), join(__dirname, '../tmp')]
    let deletedFiles = [] // قائمة لتخزين أسماء الملفات المحذوفة

    for (let dir of tmpDirs) {
      // التحقق مما إذا كان المجلد موجوداً
      if (!existsSync(dir)) continue

      let files = readdirSync(dir)
      for (let file of files) {
        let filePath = join(dir, file)
        try {
          let stats = statSync(filePath)
          // التأكد من أن المسار هو ملف وليس مجلد
          if (stats.isFile()) {
            unlinkSync(filePath) // حذف الملف
            deletedFiles.push(filePath)
          }
        } catch (err) {
          console.error(`// تعذر حذف الملف: ${filePath}`, err)
        }
      }
    }

    await conn.reply(
      m.chat,
      `✅ *تمت عملية التنظيف بنجاح.*\nعدد الملفات المحذوفة: ${deletedFiles.length}`,
      m
    )
  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة تنظيف مجلد tmp.', m)
  }
}

handler.help = ['تنظيف_tmp'] // تعليمات الاستخدام
handler.tags = ['المالك'] // وسم خاص بمالك البوت
handler.command = ['تنظيف', 'مسح_مؤقت', 'حذف_مؤقت', 'إفراغ'] // الأوامر البديلة لتشغيل الدالة
handler.exp = 500
handler.rowner = true

export default handler
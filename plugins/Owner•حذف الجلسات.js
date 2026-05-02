// File: حذف_الجلسات.js (ClearAllSessions)
// مخصص للمالك الرئيسي لتنظيف ملفات الجلسة (Session) لحل مشكلات الاتصال.

import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix, command }) => {
    
    // تعريف الرموز (Emojis)
    const rwait = '⏳' // انتظار
    const done = '✅' // تم
    const error = '❌' // خطأ
    const warning = '⚠️' // تحذير
    
    // 1. التحقق من أن الأمر يُستخدم في الحساب الرئيسي للبوت
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.reply(m.chat, `${warning} *الرجاء استخدام هذا الأمر مباشرةً في الدردشة الخاصة بالبوت (الرقم الرئيسي).*`, m)
    }
    
    await conn.reply(m.chat, `${warning} *جارٍ بدء عملية حذف جميع ملفات الجلسة (Session)، باستثناء ملف creds.json الأساسي...*`, m)
    m.react(rwait)

    // تحديد مسار مجلد الجلسات (نفترض أنه './sessions/' أو متغير 'sessions' عام)
    let sessionPath = `./${global.sessions || 'sessions'}/`

    try {
        
        // 2. التحقق من وجود المجلد
        if (!existsSync(sessionPath)) {
            return await conn.reply(m.chat, `${error} *عفواً يا تنغن، مجلد الجلسات غير موجود أو فارغ.*`, m)
        }
        
        // 3. قراءة وحذف الملفات
        let files = await fs.readdir(sessionPath)
        let filesDeleted = 0
        
        for (const file of files) {
            // تجاهل ملف الاعتماد الأساسي
            if (file !== 'creds.json') {
                await fs.unlink(path.join(sessionPath, file))
                filesDeleted++;
            }
        }
        
        // 4. إرسال نتيجة العملية
        if (filesDeleted === 0) {
            await conn.reply(m.chat, `${warning} *لم يتم العثور على ملفات جلسة إضافية لحذفها.*`, m)
        } else {
            m.react(done)
            await conn.reply(m.chat, `${done} *تم حذف ${filesDeleted} ملف جلسة بنجاح، باستثناء ملف creds.json.*`, m)
            // رسالة للتأكد من أن البوت لا يزال يعمل
            conn.reply(m.chat, `*👑 تنغن هنا! هل ما زلت تسمعني بوضوح؟*`, m)
        }
        
    } catch (err) {
        console.error('❌ خطأ في حذف ملفات الجلسة:', err);
        m.react(error)
        await conn.reply(m.chat, `${error} *حدث خطأ غير متوقع أثناء محاولة الحذف.*\n\nالخطأ: ${err.message}`, m)
    }
}

handler.help = ['حذف-جلسات']
handler.tags = ['المالك', 'صيانة']
handler.command = ['delai', 'حذف_الجلسات', 'dsowner', 'تنضيف_الجلسات', 'حذف-جلسات']
handler.rowner = true // مخصص للمالك الرئيسي

export default handler
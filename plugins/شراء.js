// يُفترض أن هذا الملف يرد على أمر التحويل (مثلاً: .تحويل exp 100 @user)
// الاسم المقترح للملف: q6•transfer.js
const items = ['diamond', 'exp']
let confirmation = {} // يُستخدم لتأكيد عملية التحويل

async function handler(m, { conn, args, usedPrefix, command }) {
    // التحقق من وجود عملية تحويل جارية
    if (confirmation[m.sender]) return m.reply('❌ أنت تجري بالفعل عملية تحويل، يرجى الرد عليها أولاً.')
    
    let user = global.db.data.users[m.sender]
    // تصفية العناصر المتاحة للتحويل في ملف المستخدم
    const item = items.filter(v => v in user && typeof user[v] == 'number')
    
    // رسالة الاستخدام الصحيح
    let usageMessage = `
*🌟 الاستخدام الصحيح لأمر التحويل 🌟*
*${usedPrefix + command}* [النوع] [الكمية] [@المستخدم]

📌 مثال:
*${usedPrefix + command}* exp 65 @${m.sender.split('@')[0]}

*💎 العناصر القابلة للتحويل:*
┌──────────────
▢ *diamond* = ألماس 💎
▢ *exp* = خبرة 🆙
└──────────────
`.trim()
    
    const type = (args[0] || '').toLowerCase()
    
    // التحقق من صلاحية نوع العنصر
    if (!item.includes(type)) return conn.reply(m.chat, usageMessage, m, { mentions: [m.sender] })
    
    // التحقق من الكمية (يجب أن تكون رقماً صحيحاً وموجباً)
    const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
    
    // تحديد المستخدم المُستقبل
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
    
    if (!who) return m.reply('✳️ يرجى **الإشارة (تاغ)** إلى المستخدم الذي تريد التحويل إليه.')
    if (!(who in global.db.data.users)) return m.reply(`✳️ المستخدم الذي أشرت إليه غير مسجل في قاعدة بيانات البوت.`)
    if (user[type] * 1 < count) return m.reply(`✳️ *${type}* غير كافٍ لديك. رصيدك الحالي هو: *${user[type]}*`)
    
    // رسالة التأكيد
    let confirm = `
*❓ هل أنت متأكد من عملية التحويل؟*

هل تريد تحويل *${count}* _*${type}*_ إلى *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* ؟ 

- لديك مهلة *60 ثانية* للرد.
_يرجى الرد بـ *نعم* أو *لا*_
`.trim()
    
    // إرسال رسالة التأكيد
    m.reply(confirm, null, { mentions: [who] })
    
    // حفظ بيانات التحويل في ذاكرة البوت للتأكيد اللاحق
    confirmation[m.sender] = {
        sender: m.sender,
        to: who,
        message: m,
        type,
        count,
        timeout: setTimeout(() => (m.reply('⏳ انتهى وقت التأكيد. تم إلغاء التحويل.'), delete confirmation[m.sender]), 60 * 1000)
    }
}

// دالة لمعالجة الردود (نعم/لا)
handler.before = async m => {
    if (m.isBaileys) return
    if (!(m.sender in confirmation)) return
    if (!m.text) return
    let { timeout, sender, message, to, type, count } = confirmation[m.sender]
    // التأكد من أن الرد ليس هو الرسالة الأصلية نفسها
    if (m.id === message.id) return
    
    let user = global.db.data.users[sender]
    let _user = global.db.data.users[to]
    
    // إذا أجاب بـ 'لا'
    if (/لا|no/g.test(m.text.toLowerCase())) {
        clearTimeout(timeout)
        delete confirmation[sender]
        return m.reply('✅ تم إلغاء عملية التحويل.')
    }
    
    // إذا أجاب بـ 'نعم'
    if (/نعم|si/g.test(m.text.toLowerCase())) {
        let previous = user[type] * 1 // الرصيد السابق للمرسل
        let _previous = _user[type] * 1 // الرصيد السابق للمستقبل
        
        // إجراء عملية التحويل
        user[type] -= count * 1
        _user[type] += count * 1
        
        // التحقق من نجاح عملية التحديث في قاعدة البيانات
        if (previous > user[type] * 1 && _previous < _user[type] * 1) {
            m.reply(`✅ *نجاح عملية التحويل*\n\nتم تحويل *${count}* *${type}* إلى @${(to || '').replace(/@s\.whatsapp\.net/g, '')}`, null, { mentions: [to] })
        } else {
            // استعادة الرصيد في حال حدوث خطأ غير متوقع
            user[type] = previous
            _user[type] = _previous
            m.reply(`❎ *خطأ في التحويل*\nفشل تحويل *${count}* ${type} إلى *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, { mentions: [to] })
        }
        
        clearTimeout(timeout)
        delete confirmation[sender]
    }
}

handler.help = ['تحويل'].map(v => v + ' [النوع] [الكمية] [@تاغ]')
handler.tags = ['اقتصاد']
// تم إضافة أوامر عربية لتشغيل الكود مباشرة
handler.command = ['transfer', 'تحويل', 'حوالة', 'شراء'] 

handler.disabled = false

export default handler

function isNumber(x) {
    return !isNaN(x)
}
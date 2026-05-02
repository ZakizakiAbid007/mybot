export async function all(m) {
    // تجاهل الدردشات غير المدعومة والرسائل المرسلة من البوت نفسه
    if (!m.chat.endsWith('.net') || m.fromMe || m.key.remoteJid.endsWith('status@broadcast')) return
    
    // التحقق إذا كانت الدردشة أو المستخدم محظور
    if (global.db.data.chats[m.chat].isBanned) return
    if (global.db.data.users[m.sender].banned) return
    
    // تجاهل رسائل البايلز
    if (m.isBaileys) return
    
    // الحصول على الرسائل المخزنة
    let msgs = global.db.data.msgs
    
    // التحقق إذا كان النص المدخل موجود في قاعدة البيانات
    if (!(m.text in msgs)) return
    
    // إنشاء نسخة من الرسالة المخزنة مع معالجة البيانات الثنائية
    let _m = this.serializeM(JSON.parse(JSON.stringify(msgs[m.text]), (_, v) => {
        if (
            v !== null &&
            typeof v === 'object' &&
            'type' in v &&
            v.type === 'Buffer' &&
            'data' in v &&
            Array.isArray(v.data)) {
            return Buffer.from(v.data)
        }
        return v
    }))
    
    // إعادة توجيه الرسالة إلى الدردشة
    await _m.copyNForward(m.chat, true)
}
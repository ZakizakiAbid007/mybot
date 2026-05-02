const userSpamData = {}
let handler = m => m

handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems}) {
    const chat = global.db.data.chats[m.chat]
    const bot = global.db.data.settings[conn.user.jid] || {}
    
    // إذا كان نظام الحماية من السبام غير مفعل
    if (!bot.antiSpam) return
    
    // إذا كانت المجموعة في وضع الإدارة فقط
    if (m.isGroup && chat.modoadmin) return  
    
    // استثناء للمشرفين والمطورين
    if (m.isGroup) {
        if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems) return
    }  
    
    let user = global.db.data.users[m.sender]
    const sender = m.sender
    const currentTime = new Date().getTime()
    const timeWindow = 5000 // النافذة الزمنية (5 ثواني)
    const messageLimit = 10 // الحد الأقصى للرسائل في النافذة الزمنية

    // فترات الحظر (بالمللي ثانية)
    let tiempo, tiempo2, tiempo3, mensaje, motivo
    tiempo = 30000 // 30 ثانية
    tiempo2 = 60000 // 1 دقيقة  
    tiempo3 = 120000 // 2 دقيقة

    // إذا كان المستخدم جديداً، إنشاء بياناته
    if (!(sender in userSpamData)) {
        userSpamData[sender] = {
            lastMessageTime: currentTime,
            messageCount: 1, 
            antiBan: 0, // مستوى العقوبة
            mensaje: 0, // مؤشر الرسالة للعقوبة 1
            mensaje2: 0, // مؤشر الرسالة للعقوبة 2
            mensaje3: 0, // مؤشر الرسالة للعقوبة 3
        }
    } else {
        const userData = userSpamData[sender]
        const timeDifference = currentTime - userData.lastMessageTime

        // معالجة المستخدمين تحت العقوبة
        if (userData.antiBan === 1) {
            if (userData.mensaje < 1) {
                userData.mensaje++  
                motivo = `᥀·࣭࣪̇˖⚔️◗ لا تقم بإرسال رسائل متكررة.`
                await conn.reply(m.chat, motivo, m, { mentions: [m.sender] })  
                user.messageSpam = motivo
            }
        } else if (userData.antiBan === 2) {
            if (userData.mensaje2 < 1) {
                userData.mensaje2++  
                motivo = `᥀·࣭࣪̇˖⚔️◗ لا تقم بإرسال رسائل متكررة...`
                await conn.reply(m.chat, motivo, m, { mentions: [m.sender] })  
                user.messageSpam = motivo
            }
        } else if (userData.antiBan === 3) {
            if (userData.mensaje3 < 1) {
                userData.mensaje3++  
                motivo = `᥀·࣭࣪̇˖👺◗ سيتم إزالتك من المجموعة بسبب إرسال رسائل متكررة.`
                await conn.reply(m.chat, motivo, m, { mentions: [m.sender] }) 
                user.messageSpam = motivo
                await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
            }
        }

        // التحقق من تجاوز الحد المسموح
        if (timeDifference <= timeWindow) {
            userData.messageCount += 1

            // إذا تجاوز المستخدم الحد المسموح
            if (userData.messageCount >= messageLimit) {
                const mention = `@${sender.split("@")[0]}`
                const warningMessage = `🚩 _*كثير من الرسائل المتكررة*_\n\nالمستخدم: ${mention}`
                
                if (userData.antiBan > 2) return
                
                await conn.reply(m.chat, warningMessage, m, { mentions: [m.sender] })  
                user.banned = true
                userData.antiBan++
                userData.messageCount = 1

                // العقوبة الأولى (30 ثانية)
                if (userData.antiBan === 1) {
                    setTimeout(() => {
                        if (userData.antiBan === 1) {
                            userData.antiBan = 0
                            userData.mensaje = 0
                            userData.mensaje2 = 0
                            userData.mensaje3 = 0
                            user.antispam = 0
                            motivo = 0
                            user.messageSpam = 0
                            user.banned = false
                        }
                    }, tiempo) 

                // العقوبة الثانية (1 دقيقة)
                } else if (userData.antiBan === 2) {
                    setTimeout(() => {
                        if (userData.antiBan === 2) {
                            userData.antiBan = 0
                            userData.mensaje = 0
                            userData.mensaje2 = 0
                            userData.mensaje3 = 0
                            user.antispam = 0
                            motivo = 0
                            user.messageSpam = 0
                            user.banned = false
                        }
                    }, tiempo2) 

                // العقوبة الثالثة (2 دقيقة + الطرد)
                } else if (userData.antiBan === 3) {
                    setTimeout(() => {
                        if (userData.antiBan === 3) {
                            userData.antiBan = 0
                            userData.mensaje = 0
                            userData.mensaje2 = 0
                            userData.mensaje3 = 0
                            user.antispam = 0
                            motivo = 0
                            user.messageSpam = 0
                            user.banned = false
                        }
                    }, tiempo3)
                }
            }
        } else {
            // إعادة تعيين العداد إذا مر وقت كافٍ بين الرسائل
            if (timeDifference >= 2000) {
                userData.messageCount = 1
            }
        }
        
        userData.lastMessageTime = currentTime
    }
}

export default handler
const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
    // -------------------- [ البيانات الثابتة لملك المهرجانات ] --------------------
    const fkontak = {
        key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
        message: {
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: '0@s.whatsapp.net'
    }

    const miniopcion = `
👑 **مُـخَـطَّـطُ مَـمْـلَـكَـةِ تِـنْـغَـنْ!** ⚔️
*لِـتَـشْـغِـيـلِ خِـيَـارٍ، اُكْـتُـبْ:* ${usedPrefix + command} on [الخيار]
*لِـإِيـقَـافِـهِ، اُكْـتُـبْ:* ${usedPrefix + command} off [الخيار]

---
🔥 **إِعْـدَادَاتُ الْـمُـجَـمَّـعَـاتِ (لِـلْـمُـشْـرِفِ):**
---
${usedPrefix + command} ترحيب
${usedPrefix + command} رد_تلقائي
${usedPrefix + command} قبول_تلقائي
${usedPrefix + command} تنبيهات
${usedPrefix + command} ضد_الحذف
${usedPrefix + command} ضد_الروابط
${usedPrefix + command} ضد_الروابط2
${usedPrefix + command} nsfw
${usedPrefix + command} رفع_مستوى_تلقائي
${usedPrefix + command} ملصق_تلقائي
${usedPrefix + command} تفاعلات
${usedPrefix + command} ضد_المتسممين
${usedPrefix + command} صوتيات
${usedPrefix + command} وضع_المشرفين
${usedPrefix + command} ضد_المزيفين
${usedPrefix + command} ضد_البوتات
${usedPrefix + command} رفض_تلقائي

---
👑 **إِعْـدَادَاتُ الـمَـلِـكِ (لِـلْـمُـطَـوِّرِ فـقـط):**
---
${usedPrefix + command} ضد_البوتات_الفرعية
${usedPrefix + command} عام
${usedPrefix + command} حالة_تلقائية
${usedPrefix + command} بوت_فرعي
${usedPrefix + command} تقييد
${usedPrefix + command} قراءة_تلقائية
${usedPrefix + command} ضد_السبام
${usedPrefix + command} ضد_السبام2
${usedPrefix + command} ضد_الخاص
${usedPrefix + command} ضد_الاتصال
${usedPrefix + command} خاص_فقط
${usedPrefix + command} مجموعات_فقط
${usedPrefix + command} حالة_واتساب_فقط
${usedPrefix + command} ضد_الرسائل_المتكررة
${usedPrefix + command} شات_بوت
${usedPrefix + command} عبارات_تلقائية
` // تم دمج الخيارات العربية في رسالة واحدة منظمة بأسلوب ملك المهرجانات

    const isEnable = /true|enable|(turn)?on|1|تفعيل|تشغيل/i.test(command) // تم دمج الكلمات العربية للتفعيل
    const chat = global.db.data.chats[m.chat]
    const user = global.db.data.users[m.sender]
    const bot = global.db.data.settings[conn.user.jid] || {}
    const type = (args[0] || '').toLowerCase()
    let isAll = false

    // ⚔️ دوال التحقق المخصصة
    const validateGroupAdmin = () => {
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin && !isOwner) {
        conn.reply(m.chat, `🚨 **صَـلاحِـيَّـةٌ نَـاقِـصَـةٌ!** 🚨\nهذا الإعداد يحتاج إلى **صلاحيات المشرف** أو أن تكون **مالك البوت** لتشغيله في المجموعات.`, m)
        throw false
      }
    }

    const validateOwner = () => {
      if (!isOwner) {
        conn.reply(m.chat, `👑 **فـقـط الـمـالـك!** 👑\nهذا الإعداد خاص بـ **ملك المهرجانات (المطور)** فقط!`, m)
        throw false
      }
    }

    const validateROwner = () => {
      if (!isROwner) {
        conn.reply(m.chat, `👑 **فـقـط الـمـالـك الـرئـيـسـي!** 👑\nهذا الإعداد خاص بـ **المالك الرئيسي للبوت** فقط!`, m)
        throw false
      }
    }

    // ⚙️ معالجة الأوامر باستخدام switch
    switch (type) {
      // -------------------- [ إعدادات المجموعة ] --------------------
      case 'welcome': case 'bienvenida': case 'ترحيب':
        validateGroupAdmin()
        chat.welcome = isEnable
        break
      case 'autoaceptar': case 'aceptarnuevos': case 'قبول_تلقائي':
        validateGroupAdmin()
        chat.autoAceptar = isEnable
        break
      case 'autorechazar': case 'rechazarnuevos': case 'رفض_تلقائي':
        validateGroupAdmin()
        chat.autoRechazar = isEnable
        break
      case 'detect': case 'avisos': case 'تنبيهات':
        validateGroupAdmin()
        chat.detect = isEnable
        break
      case 'antibot': case 'ضد_البوتات':
        validateGroupAdmin()
        chat.antiBot = isEnable
        break
      case 'antisubots': case 'antisub': case 'antisubot': case 'antibot2': case 'ضد_البوتات_الفرعية':
        validateGroupAdmin()
        chat.antiBot2 = isEnable
        break
      case 'antidelete': case 'antieliminar': case 'delete': case 'ضد_الحذف':
        validateGroupAdmin()
        chat.delete = isEnable
        break
      case 'antilink': case 'antienlace': case 'ضد_الروابط':
        validateGroupAdmin()
        chat.antiLink = isEnable
        break
      case 'antilink2': case 'antienlace2': case 'ضد_الروابط2':
        validateGroupAdmin()
        chat.antiLink2 = isEnable
        break
      case 'autoresponder': case 'autorespond': case 'رد_تلقائي':
        validateGroupAdmin()
        chat.autoresponder = isEnable
        break
      case 'nsfw': case 'nsfwhot': case 'nsfwhorny':
        validateGroupAdmin()
        chat.nsfw = isEnable
        break
      case 'autolevelup': case 'autonivel': case 'nivelautomatico': case 'رفع_مستوى_تلقائي':
        validateGroupAdmin()
        chat.autolevelup = isEnable
        break
      case 'autosticker': case 'ملصق_تلقائي':
        validateGroupAdmin()
        chat.autosticker = isEnable
        break
      case 'reaction': case 'reaccion': case 'emojis': case 'antiemojis': case 'reacciones': case 'reaciones': case 'تفاعلات':
        validateGroupAdmin()
        chat.reaction = isEnable
        break
      case 'antitoxic': case 'antitoxicos': case 'antimalos': case 'ضد_المتسممين':
        validateGroupAdmin()
        chat.antitoxic = isEnable
        break
      case 'audios': case 'صوتيات':
        validateGroupAdmin()
        chat.audios = isEnable
        break
      case 'modoadmin': case 'soloadmin': case 'modeadmin': case 'وضع_المشرفين':
        validateGroupAdmin()
        chat.modoadmin = isEnable
        break
      case 'antifake': case 'antifalsos': case 'antiextranjeros': case 'antiinternacional': case 'ضد_المزيفين':
        validateGroupAdmin()
        chat.antifake = isEnable
        break
      case 'antitrabas': case 'antitraba': case 'antilag': case 'ضد_الرسائل_المتكررة':
        validateGroupAdmin()
        chat.antiTraba = isEnable
        break
      case 'simi': case 'chatbot': case 'شات_بوت':
        validateGroupAdmin()
        chat.simi = isEnable
        break

      // -------------------- [ إعدادات المالك (Global/Bot) ] --------------------
      case 'public': case 'publico': case 'عام':
        isAll = true
        validateROwner()
        global.opts['self'] = !isEnable
        break
      case 'status': case 'autobiografia': case 'bio': case 'biografia': case 'حالة_تلقائية':
        isAll = true
        validateROwner()
        bot.autobio = isEnable
        break
      case 'frases': case 'autofrases': case 'عبارات_تلقائية':
        isAll = true
        validateROwner()
        bot.frases = isEnable
        break
      case 'serbot': case 'jadibot': case 'modoserbot': case 'بوت_فرعي':
        isAll = true
        validateROwner()
        bot.jadibotmd = isEnable
        break
      case 'restrict': case 'restringir': case 'تقييد':
        isAll = true
        validateOwner()
        bot.restrict = isEnable
        break
      case 'autoread': case 'autovisto': case 'قراءة_تلقائية':
        isAll = true
        validateROwner()
        bot.autoread2 = isEnable
        global.opts['autoread'] = isEnable
        break
      case 'antiprivado': case 'antiprivate': case 'privado': case 'ضد_الخاص':
        isAll = true
        validateROwner()
        bot.antiPrivate = isEnable
        break
      case 'anticall': case 'antillamar': case 'ضد_الاتصال':
        isAll = true
        validateROwner()
        bot.antiCall = isEnable
        break
      case 'antispam': case 'ضد_السبام':
        isAll = true
        validateOwner()
        bot.antiSpam = isEnable
        break
      case 'antispam2': case 'ضد_السبام2':
        isAll = true
        validateOwner()
        bot.antiSpam2 = isEnable
        break
      case 'pconly': case 'privateonly': case 'soloprivados': case 'خاص_فقط':
        isAll = true
        validateROwner()
        global.opts['pconly'] = isEnable
        break
      case 'gconly': case 'grouponly': case 'sologrupos': case 'مجموعات_فقط':
        isAll = true
        validateROwner()
        global.opts['gconly'] = isEnable
        break
      case 'swonly': case 'statusonly': case 'حالة_واتساب_فقط':
        isAll = true
        validateROwner()
        global.opts['swonly'] = isEnable
        break
        
      // -------------------- [ الرسالة الافتراضية ] --------------------
      default:
        if (!/[01]/.test(command)) {
          return conn.sendMessage(
            m.chat,
            {
              text: miniopcion,
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: false,
                  title: `⚔️ لَـوْحَـةُ تَـحَـكُّـمِ الـمَـهْـرَجَـانِ 👑`, // تخصيص العنوان
                  body: `✡︎ مُقدّم من • تِنْغَن مَلِكُ الْـمَـهْـرَجَـانَـاتِ`, // تخصيص اسمك
                  mediaType: 2,
                  sourceUrl: global.redes || 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V', // رابط قناتك
                  thumbnail: global.icons || null
                }
              }
            },
            { quoted: fkontak }
          )
        }
        throw false
    }

    // 🥳 رسالة التأكيد النهائية (بعد تنفيذ الإعداد)
    return conn.sendMessage(
      m.chat,
      {
        text: `
💥 **تَـحْـدِيـثٌ نَـاجِـحٌ لِـلْـمُـخَـطَّـطِ!** ⚔️
*تم ${isEnable ? 'تـفـعـيـل' : 'تـعـطـيـل'} وظيفة* «${type.toUpperCase()}» ${isAll ? '*فـي الـبـوت بالـكـامـل*' : '*لـهـذا الـمـجـمـع فـقـط*'} بـقـوة.
        `.trim(),
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: `⚙️ تـمَّ تَـحْـدِيـثُ إِعْـدَادَاتِ الـمَـلِـكِ`, // تعريب
            body: `✡︎ تم بواسطة تِنْغَن مَلِكُ الْـمَـهْـرَجَـانَـاتِ`, // تعريب وتخصيص
            mediaType: 2,
            sourceUrl: global.redes || 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V', // رابط قناتك
            thumbnail: global.icons || null
          }
        }
      },
      { quoted: fkontak }
    )
}

handler.help = ['تفعيل', 'تعطيل'].map(cmd => `${cmd} <الخيار>`)
handler.tags = ['المالك', 'المجموعة', 'إعدادات']
handler.command = ['enable', 'disable', 'on', 'off', 'تفعيل', 'تعطيل', 'تشغيل', 'ايقاف', 'اعدادات'] // إضافة أمر "اعدادات"

export default handler
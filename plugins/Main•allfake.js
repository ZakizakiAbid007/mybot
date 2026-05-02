import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

  global.getBuffer = async function getBuffer(url, options = {}) {
    try {
      var res = await axios({
        method: "get",
        url,
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.log(`❌ خطأ في getBuffer: ${e}`)
      return null
    }
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  global.fotoperfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
  
  // ✅ إصلاح: إضافة try/catch للطلب الخارجي
  try {
    let api = await axios.get(`https://api.nationalize.io/?name=${who.split('@')[0]}`)
    let userNationalityData = api.data
    global.pais = userNationalityData ? `البلد: ${userNationalityData.country?.[0]?.country_id || 'غير معروف'}` : 'مجهول'
  } catch (error) {
    console.log('❌ خطأ في جلب بيانات البلد، استخدام بيانات افتراضية')
    global.pais = 'البلد: غير معروف'
  }
  
  let user = global.db.data.users[who]
  let pushname = m.pushName || 'بدون اسم'

  // 👑 [إعدادات الملك تنغن] 👑
  // تثبيت الأرقام والقناة الخاصة بك فقط
  global.channelid = '120363305941657414@newsletter' // معرف القناة الافتراضي
  global.creador = 'Wa.me/212627416260' // رقمك الرسمي: 212627416260
  global.ofcbot = `${conn.user.jid.split('@')[0]}`
  global.asistencia = 'https://wa.me/message/O4QPPHZOFDOJI1'
  global.namechannel = '© جميع الحقوق محفوظة • كيرا بوت تنغن'
  
  // المتغير الذي يحمل اسم المطور الرئيسي (تم تعريفه هنا ليحل محل 'dev' في بعض الأوامر)
  global.dev = 'تنغن - ملك المهرجانات' 

  // ردود الأفعال للأوامر
  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'

  // إيموجيات
  global.emoji = '🚩'
  global.emoji2 = '🍟'
  global.emoji3 = '✨️'
  global.emoji4 = '🍭'
  global.emojis = [global.emoji, global.emoji2, global.emoji3, global.emoji4].sort(() => Math.random() - 0.5)[0]

  // رسائل الانتظار
  global.wait = '🚀 جاري التحميل...'
  global.waitt = global.wait
  global.waittt = global.wait
  global.waitttt = global.wait

  // الروابط - تثبيت قناتك ورقمك فقط
  var canal = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V' // قناتك الرسمية
  var git = 'https://github.com/Alba070503' // تم الإبقاء على رابط جيت هب الافتراضي
  var youtube = 'https://www.youtube.com/@alba0705o3' // تم الإبقاء على رابط يوتيوب الافتراضي
  var github = 'https://github.com/Alba070503/YotsubaBot-MD' // تم الإبقاء على رابط جيت هب للمشروع
  var correo = 'zakizaki604803894@gmail.com'

  // يتم اختيار رابط عشوائي من هذه المجموعة عند الحاجة
  global.redes = [canal, git, youtube, github, correo].sort(() => Math.random() - 0.5)[0]

  // ✅ إصلاح: استخدام صورة افتراضية بدلاً من رابط معطوب
  try {
    global.icons = await getBuffer('https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400')
  } catch (error) {
    console.log('❌ خطأ في تحميل الصورة، استخدام صورة افتراضية')
    // صورة افتراضية (يجب أن يتم تعيينها في مكان آخر أو استخدام رابط ثابت)
    global.icons = null
  }

  // الوقت
  var ase = new Date(); 
  var hour = ase.getHours(); 
  switch (hour) {
    case 0: case 1: case 2: hour = 'ليلة جميلة 🌃'; break;
    case 3: case 4: case 5: case 6: hour = 'صباح جميل 🌄'; break;
    case 7: hour = 'صباح جميل 🌅'; break;
    case 8: case 9: case 10: hour = 'نهار جميل 🌤'; break;
    case 11: case 12: case 13: hour = 'نهار جميل 🌤'; break;
    case 14: case 15: case 16: case 17: hour = 'مساء جميل 🌆'; break;
    default: hour = 'ليلة جميلة 🌃'; break;
  }
  global.saludo = hour

  // الوسوم
  global.nombre = conn.getName(m.sender)
  global.taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
  var more = String.fromCharCode(8206)
  global.readMore = more.repeat(850)

  // ✅ إصلاح: استخدام moment بشكل صحيح
  global.packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\nᰔᩚ المستخدم: ${global.nombre}\n❀ البوت: ${global.botname}\n✦ التاريخ: ${moment().format('DD/MM/YYYY')}\nⴵ الوقت: ${moment().format('HH:mm:ss')}`;
  
  global.packsticker2 = `\n°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\n${global.dev || 'مطور البوت'}`

  // الإعدادات الوهمية (fkontak)
  global.fkontak = { 
    key: { participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, 
    message: { 'contactMessage': { 
      'displayName': `${pushname}`, 
      'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:هاتف\nEND:VCARD`, 
      'jpegThumbnail': null, 
      thumbnail: null,
      sendEphemeral: true
    }}
  }

  // النمط العالمي المعدل (fake)
  global.fake = { 
    contextInfo: { 
      isForwarded: true, 
      forwardedNewsletterMessageInfo: { 
        newsletterJid: '120363198641161536@newsletter', 
        newsletterName: global.namechannel, 
        serverMessageId: -1 
      }
    }, 
    quoted: m 
  }

  // النمط العالمي المعدل (rpl)
  global.rpl = { 
    contextInfo: { 
      isForwarded: true, 
      forwardedNewsletterMessageInfo: { 
        newsletterJid: "120363198641161536@newsletter", 
        serverMessageId: 100, 
        newsletterName: global.namechannel, 
      }, 
      externalAdReply: { 
        mediaUrl: global.redes, 
        mediaType: 'VIDEO', 
        description: global.botname, 
        title: global.packname, 
        body: global.botname, 
        thumbnailUrl: global.icons, 
        sourceUrl: global.redes 
      }
    }
  }

  global.icono = [
    'https://qu.ax/Urumd.jpg',
    'https://qu.ax/Zkbep.jpg',
    'https://qu.ax/WTRnx.jpg'
  ].sort(() => Math.random() - 0.5)[0]

  // النمط العالمي المعدل للقناة (rcanal)
  global.rcanal = { 
    contextInfo: { 
      isForwarded: true, 
      forwardedNewsletterMessageInfo: { 
        newsletterJid: "120363198641161536@newsletter", 
        serverMessageId: 100, 
        newsletterName: global.namechannel, 
      }, 
      externalAdReply: { 
        showAdAttribution: true, 
        title: global.botname, 
        body: global.dev || 'مطور البوت', 
        mediaUrl: null, 
        description: null, 
        previewType: "PHOTO", 
        thumbnailUrl: global.icono, 
        sourceUrl: global.redes, 
        mediaType: 1, 
        renderLargerThumbnail: false 
      }
    }
  }

}
export default handler
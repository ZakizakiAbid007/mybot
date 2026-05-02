// الكود للملك تنغن 👑
// لا تنسى الإشارة لمصدر الكود الأصلي
import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'

// مسار حفظ ملفات قائمة الأوامر (Menu)
const menuDir = './media/menu'
if (!fs.existsSync(menuDir)) fs.mkdirSync(menuDir, { recursive: true })

// وظيفة للحصول على مسار ملف بيانات القائمة الخاص بالبوت
function getMenuMediaFile(botJid) {
    const botId = botJid.replace(/[:@.]/g, '_')
    return path.join(menuDir, `menuMedia_${botId}.json`)
}

// وظيفة تحميل بيانات القائمة
function loadMenuMedia(botJid) {
    const file = getMenuMediaFile(botJid)
    if (fs.existsSync(file)) {
        try { 
            return JSON.parse(fs.readFileSync(file)) 
        } catch (e) { 
            console.warn('⚠️ خطأ في قراءة ملف بيانات القائمة (menuMedia JSON):', e)
            return {} 
        }
    }
    return {}
}

// وظيفة حفظ بيانات القائمة
function saveMenuMedia(botJid, data) {
    fs.writeFileSync(getMenuMediaFile(botJid), JSON.stringify(data, null, 2))
}

const handler = async (m, { conn, command, usedPrefix, text }) => {
    // التحقق من أن المُرسل هو البوت الفرعي (SubBot) أو المالك
    const isSubBot = [conn.user.jid, ...global.owner.map(([number]) => `${number}@s.whatsapp.net`)].includes(m.sender)
    
    // الرسالة القمعية عند عدم وجود إذن
    if (!isSubBot) return m.reply(`*هذا الأمر لي أو لتابعي الخاص (SubBot)!* ابتعد أيها الوَرَع. 😡`)

    const botJid = conn.user.jid
    let menuMedia = loadMenuMedia(botJid)

    try {
        switch (command) {

            case 'setmenuimg': 
            case 'تعديل_صورة_القائمة': {
                const q = m.quoted || m
                const mime = (q.msg || q).mimetype || ''
                if (!/image\/(png|jpe?g)|video\/mp4/.test(mime))
                    return m.reply(`*أين الصورة أو الفيديو؟* الرد يجب أن يكون على صورة (jpg/png) أو فيديو (mp4) صالح. 🤦‍♂️`)

                const media = await q.download()
                if (!media) return m.reply(`لم أتمكن من الحصول على الملف. هل هو تالف؟ 💢`)

                const ext = mime.includes('video') ? '.mp4' : '.jpg'
                const filePath = path.join(menuDir, `${botJid.replace(/[:@.]/g, '_')}${ext}`)
                
                // حذف الملف القديم (صورة أو فيديو) قبل كتابة الجديد
                try {
                    if (menuMedia.video && fs.existsSync(menuMedia.video)) fs.unlinkSync(menuMedia.video)
                    if (menuMedia.thumbnail && fs.existsSync(menuMedia.thumbnail)) fs.unlinkSync(menuMedia.thumbnail)
                } catch (err) {
                    console.error('فشل في حذف ملف القائمة القديم:', err);
                }
                
                fs.writeFileSync(filePath, media)

                if (!menuMedia || typeof menuMedia !== 'object') menuMedia = {}
                
                // تحديث البيانات
                if (mime.includes('video')) {
                    menuMedia.video = filePath
                    delete menuMedia.thumbnail // حذف الصورة إذا تم وضع فيديو
                    await m.reply(`✅ تم تحديث *فيديو القائمة* بنجاح. الآن سيصبح مظهرها أقوى! 💪`)
                }
                else {
                    menuMedia.thumbnail = filePath
                    delete menuMedia.video // حذف الفيديو إذا تم وضع صورة
                    await m.reply(`✅ تم تحديث *صورة القائمة (Thumbnail)* بنجاح. الآن تبدو واضحة! 🖼️`)
                }
                
                saveMenuMedia(botJid, menuMedia)
                break
            }

            case 'setmenutitle':
            case 'تعديل_عنوان_القائمة': {
                if (!text) return m.reply('❎ *أين العنوان الجديد؟* لا يمكن ترك العنوان فارغاً يا ملك. 😠')
                if (!menuMedia || typeof menuMedia !== 'object') menuMedia = {}
                menuMedia.menuTitle = text
                saveMenuMedia(botJid, menuMedia)
                m.reply(`✅ تم تحديث *عنوان القائمة* إلى:\n*${text}*\n\nتأكد أنه عنوان قوي يليق بك! 👑`)
                break
            }

            case 'subpfp':
            case 'subimagen': 
            case 'تعديل_صورة_الملف': {
                const q = m.quoted || m
                const mime = (q.msg || q).mimetype || ''
                if (!/image\/(png|jpe?g)/.test(mime)) return m.reply(`*صورة الملف الشخصي؟* يجب الرد على صورة صالحة. لا تضع أي شيء! 😒`)

                const media = await q.download()
                const image = await Jimp.read(media)
                const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
                await conn.updateProfilePicture(conn.user.id, buffer)
                m.reply(`✅ تم تحديث *صورة الملف الشخصي للبوت الفرعي*. الآن يبدو أكثر تهديداً! 😈`)
                break
            }

            case 'substatus':
            case 'subbio':
            case 'تعديل_الحالة': {
                if (!text) return m.reply('❎ *أين البايو الجديد؟* اكتب شيئاً مثيراً للاهتمام أو اتركني وشأني. 🙄')
                await conn.updateProfileStatus(text)
                m.reply(`✅ تم تحديث *الحالة (البايو)* إلى:\n*${text}*\n\nأتمنى أن تكون رسالة قوية! 💯`)
                break
            }

            case 'subusername':
            case 'subuser':
            case 'تعديل_اسم_البوت': {
                if (!text) return m.reply('❎ *أين اسم البوت الجديد؟* لا يمكن العمل بدون اسم واضح! 📣')
                await conn.updateProfileName(text)
                m.reply(`✅ تم تحديث *اسم البوت الفرعي* إلى:\n*${text}*\n\nالاسم الجديد جاهز للمعركة! ⚔️`)
                break
            }

            case 'personalizar':
            case 'تخصيص_البوت': {
                const info = `✙ *أوامر تخصيص البوت (SubBot)* 👑

⚠️ *ملاحظة:* هذه الأوامر للمالك أو البوت الفرعي فقط. لا تجربها!

🖼️ *تخصيص القائمة (Menu)*:
▢ ${usedPrefix}تعديل_صورة_القائمة
   ↳ لتغيير *الصورة أو الفيديو* الذي يظهر في القائمة. (رد على صورة/فيديو)

▢ ${usedPrefix}تعديل_عنوان_القائمة <النص>
   ↳ لتغيير *عنوان القائمة* الرئيسي.

👤 *تخصيص الملف الشخصي (Profile)*:
▢ ${usedPrefix}تعديل_صورة_الملف
   ↳ لتغيير *صورة الملف الشخصي* للبوت الفرعي. (رد على صورة)

▢ ${usedPrefix}تعديل_الحالة <النص>
   ↳ لتغيير *الحالة (البايو)* للبوت.

▢ ${usedPrefix}تعديل_اسم_البوت <الاسم>
   ↳ لتغيير *اسم العرض* للبوت.

📢 *قناة الملك الرسمية:*
${global.db.data.chats['212627416260@s.whatsapp.net']?.channel || 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'}
`
                m.reply(info)
                break
            }

        }
    } catch (error) {
        console.error(error)
        m.reply(`⚠︎ حدث خطأ أثناء تنفيذ أمرك أيها الملك:\n${error.message}\n\n*الخطأ ليس مني! أعد التحقق من الأمر!* 😠`)
    }
}

handler.help = ['تخصيص_البوت','تعديل_صورة_القائمة','تعديل_عنوان_القائمة','تعديل_صورة_الملف','تعديل_الحالة','تعديل_اسم_البوت']
handler.tags = ['إعدادات_البوت']
handler.command = [
    'personalizar', 'setmenuimg', 'setmenutitle', 'subpfp', 'subimagen', 
    'substatus', 'subbio', 'subusername', 'subuser',
    'تخصيص_البوت', 'تعديل_صورة_القائمة', 'تعديل_عنوان_القائمة', 
    'تعديل_صورة_الملف', 'تعديل_الحالة', 'تعديل_اسم_البوت'
]

export default handler
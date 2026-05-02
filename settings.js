import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs' // تم الإبقاء على هذا لأنه يستخدم لـ global.catalogo = fs.readFileSync
// import cheerio from 'cheerio' // تم إزالته
// import fetch from 'node-fetch' // تم إزالته
// import axios from 'axios' // تم إزالته
// import moment from 'moment-timezone' // تم إزالته

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// 📝 الأرقام الخاصة بك (مأخوذة من معلوماتك المحفوظة)
const BOT_NUMBER = '';
const OWNER_NUMBER = '212727377701';

// الرقم الذي سيتم استخدامه للإقتران (رقم البوت)
global.botNumber = BOT_NUMBER;

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// [رقم المطور: 212627416260]
global.owner = [
// <-- الرقم @s.whatsapp.net -->
  [OWNER_NUMBER, '👑 كيرا تنغن (المطور) 👑', true],
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = [OWNER_NUMBER]
global.suittag = [OWNER_NUMBER]
global.prems = [OWNER_NUMBER]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.languaje = 'Español'
global.vs = '2.2.0'
global.nameqr = 'Kira-TNG-Bot-MD' // تم تعديل اسم ملف QR
global.namebot = '꒰ 👑 ꒱ؘ كيرا تنغن بوت ♪ ࿐ ࿔*:･ﾟ' // تم تعديل اسم البوت
global.Rubysessions = 'KiraSessions' // تم تعديل اسم الجلسة
global.jadi = 'KiraJadiBots' // تم تعديل اسم الجلسة الإضافية
global.RubyJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '⏤̛̣̣̣̣̣̣̣̣̣̣̣͟͟͞͞⏤͟͟͞͞💎 تنغن بوت ૮(˶ᵔᵕᵔ˶)ا' // تم تعديل حزمة الملصقات
global.botname = ' ࣪☀ ࣭كيرا تنغن بوت࣪ 𝟹𝟹 ✿' // تم تعديل اسم البوت
global.wm = '‧˚꒰👑꒱ ፝͜⁞Kɪʀᴀ-Tɴɢ-𝘉𝘰𝘵-𝑴𝑫✰⃔⃝🦋' // تم تعديل العلامة المائية
global.author = 'Made By 𐔌 كيرا تنغن ͡꒱ ۫' // تم تعديل المؤلف
global.dev = '⌬ Modified by: كيرا تنغن ⚙️💻 ' // تم تعديل المطور
global.textbot = '⏤͟͞ू⃪ 𝑲𝒊𝒓𝒂-T𝑵𝑮🌸⃝𖤐 • 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 TNG' // تم تعديل النص
global.etiqueta = 'ˑ 𓈒 𐔌 K͙i͙r͙a͙ T͙N͙G͙ ͡꒱ ۫' // تم تعديل العلامة

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'Zenis'
global.banner = 'https://i.postimg.cc/T1CG4GHh/c4bac4df1cf0be95920442ceae42fa8e.jpg' // 🌟 تم التحديث هنا
global.avatar = 'https://i.postimg.cc/T1CG4GHh/c4bac4df1cf0be95920442ceae42fa8e.jpg' // 🌟 تم التحديث هنا

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// 📢 رابط القناة الرسمي (مأخوذ من معلوماتك المحفوظة)
const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V';

global.gp1 = 'https://chat.whatsapp.com/Hgl5fQI7UhtEj6Cr6Rpo5w?mode=ac_t' // تم الإبقاء على رابط المجموعة كمثال
global.comunidad1 = 'https://chat.whatsapp.com/K2CPrOTksiA36SW6k41yuR' // تم الإبقاء على رابط المجموعة كمثال
global.channel = CHANNEL_URL;
global.channel2 = CHANNEL_URL;
global.md = 'https://github.com/Dioneibi-rip/Ruby-Hoshino-Bot' // تم الإبقاء على رابط المستودع كمثال
global.correo = 'dioneibipaselomendes@gmail.com' // تم الإبقاء على البريد كمثال
global.cn = CHANNEL_URL;

// 🛑 إضافة تعريف الرد المزيف (Fake Context) هنا لضمان استخدام الرابط الصحيح في كل الردود التلقائية
global.rcanal = {
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: '👑 تِـنْـغَـنْ مَـلِـكُ الْـمَـهْـرَجَـانَـاتِ 💥',
            body: 'القناة الرسمية للحصول على كل جديد',
            mediaType: 1, // 1 for image
            thumbnail: global.avatar, // استخدم الصورة المصغرة العامة المحددة في هذا الملف
            renderLargerThumbnail: true,
            sourceUrl: CHANNEL_URL // الرابط الملكي الجديد
        }
    }
};

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
// 💡 ID قناتك 0029VbBeu0o002T9NQnURQ2V يتم تمثيله بالـ ID التالي
ch1: '1203631615@newsletter', 
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// 🟢 السلسلة القياسية (Standard Connection String) لحل مشكلة DNS:
// 🛑 تم إضافة الكود (8GCg7Ki_rhvRK3f) كاسم مستخدم وكلمة مرور بناءً على طلبك.
global.MONGO_URI = 'mongodb://8GCg7Ki_rhvRK3f:8GCg7Ki_rhvRK3f@ac-qcslz5n-shard-00-00.r8xfxfn.mongodb.net:27017,ac-qcslz5n-shard-00-01.r8xfxfn.mongodb.net:27017,ac-qcslz5n-shard-00-02.r8xfxfn.mongodb.net:27017/?replicaSet=atlas-qcslz5n-shard-0&authSource=admin&retryWrites=true&w=majority'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
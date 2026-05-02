import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// إعدادات البوت - الاتصال التلقائي
global.botNumber = "212706595340" // رقم كيرا تنغن
global.forceCodeMethod = true // إجبار استخدام طريقة الرمز النصي

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// المطورون والمشرفون
global.owner = [
"212627416260", // كيرا تنغن (المطور الأول)
"212706595340", // 💡 تم إضافة الرقم المطلوب هنا (المطور الثاني)
]

global.suittag = [
"212627416260", // كيرا تنغن
"212706595340", // 💡 تم إضافة الرقم المطلوب هنا
] 

global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// إعدادات التقنية
global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2|الأحدث"
global.nameqr = "كيرا بوت تنغن"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.YotsubaJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// معلومات البوت
global.botname = "⚔️ كيرا بوت تنغن ⚔️"
global.textbot = "⚔️ كيرا بوت تنغن مدعوم بواسطة @KiraBotTengan ⚔️"
global.dev = "© مدعوم بواسطة ⚔️ كيرا تنغن ⚔️"
global.author = "© صنع بواسطة ⚔️ كيرا تنغن ⚔️"
global.etiqueta = "KiraBotTengan"
global.currency = "KiraCoins"
global.banner = "https://qu.ax/iBlgz.jpg"
global.icono = "https://qu.ax/zRNgk.jpg"

// إصلاح مشكلة الصورة - تحميل آمن
try {
    global.catalogo = fs.readFileSync('./lib/catalogo.jpg')
} catch (error) {
    console.log(chalk.yellow('⚠️  ملاحظة: صورة الكتالوج غير موجودة، جاري الاستمرار بدونها...'))
    global.catalogo = null
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// الروابط الاجتماعية - تم تحديثها برابط قناتك
global.group = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V"
global.community = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V"
global.channel = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V"
global.wagc = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V"
global.website = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V"
global.github = "https://github.com/Alba070503/YotsubaBot-MD"
global.gmail = "zakizaki604803894@gmail.com"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// القنوات - تم تحديثها برابط قناتك
global.ch = {
ch1: 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V',
ch2: "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V",
ch3: "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// واجهات البرمجة (APIs)
global.APIs = {
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// إضافة بريفكس عربي اختياري
global.arabicPrefix = ['اوامر', 'بوت', 'كيرا', 'كيرا']

// مراقبة التحديثات
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("تم تحديث 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})

console.log(chalk.green('✅ تم تحميل الإعدادات بنجاح'))
console.log(chalk.blue('📢 قناة البوت: https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'))
console.log(chalk.yellow('📱 المطور: كيرا تنغن - 212627416260'))
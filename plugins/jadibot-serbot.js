/*⚠ PROHIBIDO EDITAR ⚠
Este codigo fue modificado, adaptado و تم تحسينه ليناسب متطلبات الملك تنغن
- ReyEndymion >> https://github.com/ReyEndymion
... (بقية التعليقات كما هي)
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

// رسالة رمز QR (تم التعريب)
let rtx = "*\n\n✐ **اتصال البوت الفرعي عبر رمز الاستجابة السريعة (QR)**\n\n✰ استخدم جهازًا آخر أو كمبيوتر لمسح رمز QR هذا والتحول إلى *بوت فرعي (Sub-Bot)* مؤقت.\n\n\`1\` » انقر على النقاط الثلاث في الزاوية العلوية اليمنى.\n\n\`2\` » انقر على الأجهزة المرتبطة (Linked Devices).\n\n\`3\` » امسح رمز QR هذا لتسجيل الدخول كبوت.\n\n✧ **رمز QR هذا ينتهي صلاحيته خلال 45 ثانية!**"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const RubyJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
let time = global.db.data.users[m.sender].Subs + 120000
// الرسالة المعربة: يجب الانتظار
if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `${emoji} يجب أن تنتظر ${msToTime(time - new Date())} قبل محاولة ربط *بوت فرعي* مرة أخرى.`, m)

const limiteSubBots = global.subbotlimitt || 20; 
const subBots = [...new Set([...global.conns.filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
const subBotsCount = subBots.length

// الرسالة المعربة: تجاوز الحد الأقصى
if (subBotsCount >= limiteSubBots) {
return m.reply(`${emoji2} تم الوصول إلى الحد الأقصى للـ *بوتات الفرعية* النشطة أو تجاوزه (${subBotsCount}/${limiteSubBots}).\n\nلا يمكن إنشاء المزيد من الاتصالات حتى يتم قطع اتصال بوت فرعي.`)
}

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let pathRubyJadiBot = path.join(`./${jadi}/`, id)
if (!fs.existsSync(pathRubyJadiBot)){
fs.mkdirSync(pathRubyJadiBot, { recursive: true })
}
RubyJBOptions.pathRubyJadiBot = pathRubyJadiBot
RubyJBOptions.m = m
RubyJBOptions.conn = conn
RubyJBOptions.args = args
RubyJBOptions.usedPrefix = usedPrefix
RubyJBOptions.command = command
RubyJBOptions.fromCommand = true
RubyJadiBot(RubyJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
// ----------------------------------------------------
// تعيين الأوامر المطلوبة: تنصيب، code (للكود) و qr، مسحة (لل QR)
// ----------------------------------------------------
handler.help = ['تنصيب', 'code', 'qr', 'مسحة']
handler.tags = ['serbot']
handler.command = ['تنصيب', 'code', 'qr', 'مسحة']
export default handler 


export async function RubyJadiBot(options) {
let { pathRubyJadiBot, m, conn, args, usedPrefix, command } = options

// تحديد طريقة الاتصال المطلوبة بناءً على الأمر:
// إذا كان الأمر "تنصيب" أو "code"، نضبط mcode على true (طلب كود الاقتران)
// إذا كان الأمر "qr" أو "مسحة"، نضبط mcode على false (طلب QR)
const mcode = (command === 'تنصيب' || command === 'code') 

let txtCode, codeBot, txtQR
const argMcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false

if (argMcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
}

const pathCreds = path.join(pathRubyJadiBot, "creds.json")
if (!fs.existsSync(pathRubyJadiBot)){
fs.mkdirSync(pathRubyJadiBot, { recursive: true })}
try {
// الرسالة المعربة: خطأ في الاستخدام
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `${emoji} استخدم الأمر بشكل صحيح » ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathRubyJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
// تحديد نوع المتصفح بناءً على طلب كود الاقتران (mcode)
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Ruby Hoshino (Sub Bot)', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true
};

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
// ------------------------------------
// عرض رمز QR (يتم فقط إذا لم يكن mcode صحيحاً)
// ------------------------------------
if (qr && !mcode) {
if (m?.chat) {
// استخدام رسالة QR المعربة (rtx)
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 45000)
}
return
} 
// ------------------------------------
// عرض كود الاقتران (يتم فقط إذا كان mcode صحيحاً)
// ------------------------------------
if (qr && mcode) {
    const rawCode = await sock.requestPairingCode(m.sender.split`@`[0], "RUBYCHAN");

    const interactiveButtons = [{
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
            display_text: "نسخ الكود", // تم التعريب
            id: "copy-jadibot-code",
            copy_code: rawCode
        })
    }];

// رسالة رمز الاقتران (Pairing Code) المعربة
    const interactiveMessage = {
        image: { url: "https://i.postimg.cc/L8FvbfL5/bb5f15bce9d3efdb69edae96cd559cb9.jpg" },
// هنا نضمن تقسيم الكود إلى 4-4 ليصبح 8 أرقام مفصولة
        caption: `*✨ **رمز الاقتران الخاص بك جاهز!** ✨*\n\nاستخدم الكود التالي للاتصال كـ بوت فرعي:\n\n*الكود:* ${rawCode.match(/.{1,4}/g)?.join("-")}\n\n> انقر على الزر أدناه لنسخه بسهولة.`, // تم التعريب
        title: "رمز الاقتران", // تم التعريب
        footer: "هذا الكود سينتهي صلاحيته خلال 45 ثانية.", // تم التعريب
        interactiveButtons
    };

// تعريب Console Log
    const sentMsg = await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
    console.log(`[SUB-BOT] رمز الاقتران المرسل: ${rawCode}`); 

    if (sentMsg && sentMsg.key) {
        setTimeout(() => {
            conn.sendMessage(m.chat, { delete: sentMsg.key });
        }, 45000);
    }
    return;
}

if (txtCode && txtCode.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 45000)
}
if (codeBot && codeBot.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 45000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ تم إغلاق الاتصال (+${path.basename(pathRubyJadiBot)}) بشكل غير متوقع. محاولة إعادة الاتصال...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ تم فقدان أو انتهاء صلاحية الاتصال (+${path.basename(pathRubyJadiBot)}). السبب: ${reason}. محاولة إعادة الاتصال...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ تم استبدال الاتصال (+${path.basename(pathRubyJadiBot)}) بجلسة أخرى نشطة.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
// الرسالة المعربة للمستخدم:
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathRubyJadiBot)}@s.whatsapp.net`, {text : '*لقد اكتشفنا جلسة جديدة، قم بحذف الجلسة الجديدة للمتابعة*\n\n> *إذا كانت هناك مشكلة، أعد الاتصال*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`خطأ 440: تعذر إرسال رسالة إلى: +${path.basename(pathRubyJadiBot)}`)) // تعريب Console Log
}}
if (reason == 405 || reason == 401) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ تم إغلاق الجلسة (+${path.basename(pathRubyJadiBot)}). بيانات اعتماد غير صالحة أو تم قطع الاتصال يدويًا.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄Doç┄┄┄┄┄┄⟡`))
try {
// الرسالة المعربة للمستخدم:
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathRubyJadiBot)}@s.whatsapp.net`, {text : '*الجلسة معلقة*\n\n> *حاول أن تكون بوتًا فرعيًا مرة أخرى*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`خطأ 405: تعذر إرسال رسالة إلى: +${path.basename(pathRubyJadiBot)}`)) // تعريب Console Log
}
fs.rmdirSync(pathRubyJadiBot, { recursive: true })
}
if (reason === 500) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ فقدان الاتصال في الجلسة (+${path.basename(pathRubyJadiBot)}). جاري مسح البيانات...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
// الرسالة المعربة للمستخدم:
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathRubyJadiBot)}@s.whatsapp.net`, {text : '*فقدان الاتصال*\n\n> *حاول يدويًا أن تكون بوتًا فرعيًا مرة أخرى*' }, { quoted: m || null }) : ""
return creloadHandler(true).catch(console.error)
}
if (reason === 515) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ إعادة تشغيل تلقائية للجلسة (+${path.basename(pathRubyJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
// الرسالة المعربة:
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ تم إغلاق الجلسة أو الحساب قيد الدعم للجلسة (+${path.basename(pathRubyJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
fs.rmdirSync(pathRubyJadiBot, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'مجهول' // تعريب
userJid = sock.authState.creds.me.jid || `${path.basename(pathRubyJadiBot)}@s.whatsapp.net`
// رسالة الاتصال الناجح:
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• بوت فرعي •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathRubyJadiBot)}) تم الاتصال بنجاح.\n│\n❒⸺⸺⸺【• متصل •】⸺⸺⸺❒`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

// رسالة التأكيد للمستخدم:
m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, أنت متصل الآن، تتم قراءة الرسائل الواردة...` : `@${m.sender.split('@')[0]}, رائع! أنت الآن جزء من عائلة البوتات الفرعية لدينا.`, mentions: [m.sender]}, { quoted: m }) : ''

}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('⚠️ خطأ جديد: ', e) // تعريب
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
// تعريب وحدة الوقت
return minutes + ' د و ' + seconds + ' ث ' 
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}
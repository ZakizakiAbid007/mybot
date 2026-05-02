import './settings.js'
import './plugins/_allfake.js'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs' // 🟢 تم إضافة rmSync هنا
import yargs from 'yargs';
import { spawn, execSync } from 'child_process' 
import lodash from 'lodash'
import YotsubaJadiBot from './plugins/sockets-serbot.js'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import store from './lib/store.js'
import { format } from 'util' 
import os from 'os' 

const { proto } = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// 🟢 تم توحيد تعريف المتغيرات المطلوبة
const jadi = 'jadibot';
const sessions = 'sessions';
global.sessions = sessions; // 🟢 التأكد من تعريفها كمتغير عام للمكتبة

let { say } = cfonts
console.log(chalk.magentaBright('\n❀ جاري البدء...'))
say('YotsubaBot-MD', {
font: 'simple',
align: 'left',
gradient: ['green', 'white']
})
say('مطور البوت: @Alba070503', {
font: 'console',
align: 'center',
colors: ['cyan', 'magenta', 'yellow']
})
protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

global.timestamp = {start: new Date}
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#!./-]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'))
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!global.db.READ) {
clearInterval(this);
resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
}}, 1 * 1000));
}
if (global.db.data !== null) return;
global.db.READ = true;
await global.db.read().catch(console.error);
global.db.READ = null;
global.db.data = {
users: {},
chats: {},
settings: {},
...(global.db.data || {}),
};
global.db.chain = chain(global.db.data);
};
loadDatabase(); 

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap = new Map()
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const { version } = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumber
const methodCodeQR = false 
const methodCode = true 
const MethodMobile = process.argv.includes("mobile")
const colors = chalk.bold.white
const qrOption = chalk.blueBright
const textOption = chalk.cyan
let opcion = '2' 

// إغلاق readline لأنه لن نستخدمه
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.close()

console.log(chalk.green('🚀 جاري الاتصال التلقائي بطريقة الـ 8 أرقام...'))
console.log(chalk.blue(`📱 رقم البوت: ${global.botNumber}`))

console.info = () => { }

const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: false, 
mobile: MethodMobile, 
browser: ["MacOs", "Safari"],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: false, 
generateHighQualityLinkPreview: true, 
syncFullHistory: false,
getMessage: async (key) => {
try {
let jid = jidNormalizedUser(key.remoteJid);
let msg = await store.loadMessage(jid, key.id);
return msg?.message || "";
} catch (error) {
return "";
}},
msgRetryCounterCache: msgRetryCounterCache || new Map(),
userDevicesCache: userDevicesCache || new Map(),
defaultQueryTimeoutMs: 20000, // 🟢 تم التعديل: زيادة المهلة الافتراضية إلى 20 ثانية
cachedGroupMetadata: (jid) => globalThis.conn.chats[jid] ?? {},
version: version, 
keepAliveIntervalMs: 55000, 
maxIdleTimeMs: 60000, 
};

global.conn = makeWASocket(connectionOptions);
conn.ev.on("creds.update", saveCreds)

if (!fs.existsSync(`./${global.sessions}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
setTimeout(async () => {
try {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot.match(/.{1,4}/g)?.join("-") || codeBot
// 🟢 طباعة الرمز النصي والتعليمات
console.log(chalk.bold.white(chalk.bgMagenta(`[ ✿ ]  الرمز:`)), chalk.bold.white(chalk.white(codeBot)))
console.log(chalk.green('📱 أدخل هذا الرمز في الواتساب → ربط جهاز → ربط برقم الهاتف'))
} catch (error) {
console.log(chalk.red('❌ خطأ في توليد الرمز:', error))
}
}, 3000)
}}}}
conn.isInit = false;
conn.well = false;
conn.logger.info(`[ ✿ ]  تم بنجاح\n`)
if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) {
    // 🟢 تم تحديث دالة تنظيف الملفات المؤقتة باستخدام rmSync الآمن
    const tmpDir = [os.tmpdir(), 'tmp', `${jadi}`]
    tmpDir.forEach((dirPath) => {
        try {
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
                fs.mkdirSync(dirPath); // إعادة إنشاء المجلد الفارغ
            }
        } catch (e) {
            // تجاهل الأخطاء البسيطة في التنظيف
        }
    });
}
}, 30 * 1000);
}

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update;
global.stopped = connection;
if (isNewLogin) conn.isInit = true;
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error);
global.timestamp.connect = new Date;
}
if (global.db.data == null) loadDatabase()

if (connection === "open") {
const userJid = jidNormalizedUser(conn.user.id)
const userName = conn.user.name || conn.user.verifiedName || "مجهول"
await joinChannels(conn)
console.log(chalk.green.bold(`[ ✿ ]  متصل بـ: ${userName}`))
}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === "close") {
if ([401, 440, 428, 405, DisconnectReason.loggedOut].includes(reason)) {
    console.log(chalk.red(`→ (${code}) › تم إغلاق الجلسة الرئيسية بشكل دائم (تتطلب إعادة اقتران).`));
    // لا تقم بإعادة التحميل هنا لتجنب حلقة الإغلاق/إعادة التوصيل السريعة
    return; 
}
console.log(chalk.yellow("→ جاري إعادة توصيل البوت الرئيسي..."));
await global.reloadHandler(true).catch(console.error)
}};
process.on('uncaughtException', console.error);
let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e);
}
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}
conn.handler = handler.handler.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)
const currentDateTime = new Date()
const messageDateTime = new Date(conn.ev)
if (currentDateTime >= messageDateTime) {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
} else {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
}
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
};
process.on('unhandledRejection', (reason, promise) => {
console.error("تم اكتشاف رفض غير معالج:", reason);
// 🟢 لا ينبغي أن يحدث هذا إذا كانت الجلسة سليمة، لكنه يضمن عدم انهيار البوت بالكامل
});

// دالة معالجة البوتات الفرعية (تم الحفاظ عليها)
async function handleSubBot({ pathYotsubaJadiBot, m, conn, args, usedPrefix, command }) {
    try {
        console.log(`🔄 جاري معالجة البوت الفرعي في: ${pathYotsubaJadiBot}`);
        
        const subBot = new YotsubaJadiBot();
        await subBot.connect();
        
        // إضافة البوت إلى القائمة العالمية
        if (!global.conns) global.conns = new Map();
        global.conns.set(pathYotsubaJadiBot, subBot);
        
        console.log(`✅ تم توصيل البوت الفرعي بنجاح: ${pathYotsubaJadiBot}`);
        
    } catch (error) {
        console.error('❌ خطأ في معالجة البوت الفرعي:', error);
    }
}

global.rutaJadiBot = join(__dirname, `./${jadi}`)
if (global.YotsubaJadibts) {
if (!existsSync(global.rutaJadiBot)) {
mkdirSync(global.rutaJadiBot, { recursive: true }) 
console.log(chalk.bold.cyan(`ꕥ تم إنشاء المجلد: ${jadi} بنجاح.`))
} else {
console.log(chalk.bold.cyan(`ꕥ المجلد: ${jadi} موجود مسبقاً.`)) 
}
const readRutaJadiBot = readdirSync(global.rutaJadiBot)
if (readRutaJadiBot.length > 0) {
const creds = 'creds.json'
for (const gjbts of readRutaJadiBot) {
const botPath = join(global.rutaJadiBot, gjbts)
const readBotPath = readdirSync(botPath)
if (readBotPath.includes(creds)) {
handleSubBot({pathYotsubaJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot'})
}}}}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

// دالة إعادة تحميل الإضافات (تم الحفاظ عليها)
global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true);
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` تم تحديث الإضافة - '${filename}'`)
else {
conn.logger.warn(`تم حذف الإضافة - '${filename}'`)
return delete global.plugins[filename]
}} else conn.logger.info(`إضافة جديدة - '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`خطأ في الصيغة أثناء تحميل '${filename}'\n${format(err)}`)
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(`خطأ في تحميل الإضافة '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
async function _quickTest() {
const test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version']),
].map((p) => {
return Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127);
});
}),
new Promise((resolve) => {
p.on('error', (_) => resolve(false));
})]);
}));
const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
Object.freeze(global.support);
}

// مجلد المؤقت (تم التعديل)
setInterval(async () => {
const tmpDir = join(__dirname, 'tmp')
try {
if (existsSync(tmpDir)) {
    rmSync(tmpDir, { recursive: true, force: true });
    mkdirSync(tmpDir);
    console.log(chalk.gray(`→ تم حذف وإعادة إنشاء مجلد المؤقت بنجاح.`))
}
} catch {
console.log(chalk.gray(`→ لم يتمكن من حذف ملفات المجلد المؤقت`));
}}, 30 * 1000) 

_quickTest().catch(console.error)

async function isValidPhoneNumber(number) {
try {
number = number.replace(/\s+/g, '')
if (number.startsWith('+521')) {
number = number.replace('+521', '+52');
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52');
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)
} catch (error) {
return false
}}

async function joinChannels(sock) {
for (const value of Object.values(global.ch)) {
if (typeof value === 'string' && value.endsWith('@newsletter')) {
await sock.newsletterFollow(value).catch(() => {})
}}}

global.reloadHandler().catch(console.error) // 🟢 تم إضافة تشغيل الأوامر هنا للتأكد من التحميل
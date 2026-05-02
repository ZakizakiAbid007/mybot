// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
  fs.readdir(customTemp, (err, files) => {
    if (err) return;
    for (const file of files) {
      const filePath = path.join(customTemp, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
  console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const getUserData = require('./lib/userData/getUserData');
const updateUserData = require('./lib/userData/updateUserData');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');
const happyEmojis = ['😂', '❤️', '🔥', '✨', '🤩', '👍', '😊', '😍','😂', '🤣', '😅', '😊', '😍', '🤩', '🥳', '😎', '😜', '🤪',
    '😇', '🥰', '😘', '😗', '😙', '😚', '🙂', '😋', '🤗', '😏',
    '👍', '👌', '👏', '🙌', '🙏', '🤝', '💪', '🙏', '💯', '🔥',
    '✨', '💫', '🌟', '⭐', '☀️', '🎉', '🎊', '🎈', '🎁',
    '🎀', '💖', '💗', '💓', '💞', '💕', '💘', '❤️', '🧡', '💛',
    '💚', '💙', '💜', '🤎', '🖤', '🤍', '🧡', '💛', '💚', '💙',
    '👑', '💎', '💰', '💸', '🚀', '🛸', '💡', '✅', '✔️', '🤙',
    '🫡', '🤌', '🤘', '🎸', '🎺', '🎶', '🎤', '☕', '🍩', '🍔',
    '🍕', '🌮', '🍜', '🍣', '🍇', '🍉', '🍓', '🍒', '🍑', '🥝'];

// ==============================
// ⭐⭐⭐ البيانات والمتغيرات ⭐⭐⭐
// ==============================

// ⭐⭐⭐ أسئلة الصراحة العربية ⭐⭐⭐
const localArabicTruths = [
    "*ما هو أكثر شيء تندم على فعله في طفولتك؟ 😔*",
    "*إذا كان بإمكانك تغيير شيء واحد في مظهرك، فماذا سيكون؟ 💅*",
    "*ما هو أسوأ شيء فعلته في حق صديق لك دون أن يعرف؟ 🤫*",
    "*ما هي أكثر عادة غريبة تقوم بها عندما تكون بمفردك？ 🧘*",
    "*ما هو الحلم أو الطموح الذي تخفيه عن الجميع؟ ✨*",
    "*ما هي أغنية الكاريوكي التي تتقنها سرًا？ 🎤*",
    "*إذا ربحت مليون دولار الآن، فما هو أول ثلاثة أشياء ستشتريها؟ 💰*",
    "*ما هو أسخف سبب بكيت من أجله في أي وقت مضى؟ 😭*",
    "*ما هي أسوأ كذبة اضطررت لقولها؟ 🤥*",
    "*ما هو الشيء الذي تتظاهر بأنك تحبه، لكنك تكرهه في الواقع؟ 😒*",
    "*من هو الشخص الذي كنت تحبه بجنون لكنك تظاهرت بعدم الاهتمام به؟ ❤️‍🩹*",
    "*ما هو أكثر شيء جنوني قمت به في سبيل إثارة إعجاب شخص ما؟ 😜*",
    "*ما هي الرسالة النصية التي لا تريد لأحد رؤيتها أبداً؟ 📵*",
    "*إذا اضطررت لمواعدة شخص واحد من هذه المجموعة، فمن سيكون؟ 🤔*",
    "*ما هو الموقف الذي شعرت فيه بأكبر قدر من الإحراج في حياتك؟ 😳*",
    "*ما هي أسوأ هدية تلقيتها في حياتك؟ 🎁❌*",
    "*ما هو الشيء الذي تفعله وتعتقد أنه صحيح بينما يراه الجميع سخيفاً？ 🤷*",
    "*كم كان عمرك عندما وقعت في الحب لأول مرة؟ 💘*",
    "*ما هو الشيء الذي تفتخر به لكنك تخجل من الاعتراف به؟ 😬*",
    "*مين أكتر حد بتغير منه في الجروب ده؟ 👀 (مصري)*",
    "*ايه أكتر حاجة بتعملها أول ما بتصحى محدش يعرفها؟ 🙈 (مصري)*",
    "*لو طلعت سرقت حاجة، هتسرق إيه من بيتك دلوقتي？ 🤣 (مصري)*",
    "*شنو هو أغرب حلم حلمتيه وعاودتي ليه لشي حد؟ 🤯 (مغربي)*",
    "*شو الشغلة يلّي بتخليك تفقد أعصابك فوراً؟ 🤬 (شامي)*",
    "*ما هو أكثر تعليق سلبي سمعته عنك ولا يمكنك نسيانه؟ 💔*",
    "*من هو الشخص الذي تعتبره منافسك السري？ 🏆*",
    "*ما هي أسوأ عادة لديك والتي تحاول جاهداً التخلص منها？ 🚫*",
    "*لو كنت تستطيع العودة بالزمن، ما هو الموقف الذي ستتصرف فيه بطريقة مختلفة تماماً？ ⏳*",
    "*ما هو الشيء الذي اشتريته بأموالك وندمت عليه فوراً؟ 💸*",
    "*هل سبق لك أن كذبت على معلم أو رئيس في العمل؟ وكيف كانت الكذبة？ 🤫💼*",
    "*ما هو أغرب مكان نمت فيه？ 😴🏕️*",
    "*ما هو الشيء الذي تتمنى لو كان بإمكانك أن تخفيه إلى الأبد عن عائلتك؟ 🤐👨‍👩‍👧‍👦*",
    "*من هو آخر شخص بحثت عن اسمه في الإنترنت سراً؟ 🕵️‍♀️*",
    "*ما هي أسخف مشادة كلامية دخلت فيها مؤخراً？ 🤪*",
];

// ==============================
// ⭐⭐⭐ استيراد الأوامر ⭐⭐⭐
// ==============================

// 🔧 أوامر الإدارة
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const kickCommand = require('./commands/kick');
const isAdmin = require('./lib/isAdmin');
const unbanCommand = require('./commands/unban');
const staffCommand = require('./commands/staff');
const resetlinkCommand = require('./commands/resetlink');
const groupInfoCommand = require('./commands/groupinfo');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');

// 🎨 أوامر الوسائط
const stickerCommand = require('./commands/sticker');
const ttsCommand = require('./commands/tts');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const blurCommand = require('./commands/img-blur');
const stickerTelegramCommand = require('./commands/stickertelegram');
const stickercropCommand = require('./commands/stickercrop');
const textmakerCommand = require('./commands/textmaker');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const viewOnceCommand = require('./commands/viewonce');
const setProfilePicture = require('./commands/setpp');
const qualityCommand = require('./commands/quality');

// 🎵 أوامر التحميل والموسيقى
const playCommand = require('./commands/play');
const songCommand = require('./commands/song');
const videoCommand = require('./commands/video');
const tiktokCommand = require('./commands/tiktok');
const spotifyCommand = require('./commands/spotify');
const soundcloudCommand = require('./commands/soundcloud');
const apkCommand = require('./commands/apk');
const pinterestCommand = require('./commands/pinterest');
// 🎮 أوامر الألعاب
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const { emojiGameCommand, handleEmojiAnswer } = require('./commands/emojigame');
const { emojiGameCommand: ايموجيGameCommand, handleEmojiAnswer: handleايموجيAnswer } = require('./commands/ايموجي');
const { emojiGameCommand: ترتيبGameCommand, handleEmojiAnswer: handleترتيبAnswer } = require('./commands/ترتيب');
const { guessGameCommand: خمنGameCommand, handleGuessAnswer: handleخمنAnswer } = require('./commands/خمن');
const { رياضهCommand, handleرياضهAnswer } = require('./commands/رياضه');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { gameCommand } = require('./commands/rockpaperscissors');
const { islamicQuizCommand, checkIslamicAnswer } = require('./commands/islamicQuiz');
const { guessCommand } = require('./commands/guess');
const { eyeCommand, handleEyeAnswer } = require('./commands/eye');
const tagCrownCommand = require('./commands/tagcrown');
const { tebakbenderaCommand, handleTebakbenderaAnswer } = require('./commands/tebakbendera');
const { lwCommand } = require('./commands/lw');
const { eightBallCommand } = require('./commands/eightball');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const shipCommand = require('./commands/ship');
const { animeQuizCommand, handleAnimeQuizAnswer } = require('./commands/animequiz');

// 💰 أوامر البنك والاقتصاد
const { 
    bankCommand, 
    depositCommand, 
    withdrawCommand, 
    walletCommand, 
    levelCommand, 
    topMoneyCommand 
} = require('./commands/bank');

// 📱 أوامر التواصل
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const deleteCommand = require('./commands/delete');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const kickallCommand = require('./commands/kickall');
// 🔗 أوامر الحماية
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
// ... (في ملف البوت الرئيسي، حيث يتم استيراد الدوال)
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
// ...
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');

// 🤖 أوامر الذكاء الاصطناعي
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const aiCommand = require('./commands/ai');
const imagineCommand = require('./commands/imagine');
const soraCommand = require('./commands/sora');

// 🌐 أوامر الإنترنت
const handleRandomImageCommand = require('./commands/randomimage');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const githubCommand = require('./commands/github');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const urlCommand = require('./commands/url');
const { igsCommand } = require('./commands/igs');
const takeCommand = require('./commands/take');

// ⚙️ أوامر النظام
const ownerCommand = require('./commands/owner');
const clearCommand = require('./commands/clear');
const clearTmpCommand = require('./commands/cleartmp');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const settingsCommand = require('./commands/settings');
const updateCommand = require('./commands/update');
const sudoCommand = require('./commands/sudo');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');

// 🎭 أوامر الترفيه
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const { cardCommand } = require('./commands/card');
const { stupidCommand } = require('./commands/stupid');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const stupidityCommand = require('./commands/stupidity');
const { piesCommand, piesAlias } = require('./commands/pies');
const { editCommand } = require('./commands/edit');
const memeCommand = require('./commands/meme');
const onlineListCommand = require('./commands/المتصلين');
// ==============================
// ⭐⭐⭐ تهيئة المتغيرات العالمية ⭐⭐⭐
// ==============================

global.guessGame = global.guessGame || {};
global.eyeGame = global.eyeGame || {};
global.tictactoeGames = global.tictactoeGames || {};
global.hangmanGames = global.hangmanGames || {};
global.triviaGames = global.triviaGames || {};
global.emojiGame = global.emojiGame || {};
global.ايموجيGame = global.ايموجيGame || {};
global.ترتيبGame = global.ترتيبGame || {};
global.خمنGame = global.خمنGame || {};
global.رياضهGame = global.رياضهGame || {};

// الإعدادات العامة
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V";
global.ytch = "كيرا ناغي";

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '0029VbBeu0o002T9NQnURQ2V@newsletter',
            newsletterName: 'كيرا ناغي',
            serverMessageId: -1
        }
    }
};

// ==============================
// ⭐⭐⭐ تهيئة المتغيرات العالمية ⭐⭐⭐
// ==============================

global.autotyping = false;
global.autoread = false; 
global.antilink = {};
global.antitag = {};
global.antibadword = {};
global.antidelete = {};
global.mentionSettings = {};
global.welcomeSettings = {};
global.goodbyeSettings = {};
global.tebakbendera = {};
global.animeQuiz = {};
// في أعلى الملف أو في config
const sudoUsers = ['212706595340@s.whatsapp.net', '212627416260@s.whatsapp.net']; // أرقام المطورين
// ==============================
// ⭐⭐⭐ الدوال المساعدة ⭐⭐⭐
// ==============================
async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudo = message.key.fromMe || senderIsSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

          if (!isGroup && (userMessage === 'هاي' || userMessage === 'السلام عليكم' || userMessage === 'بوت' || userMessage === 'هلو' || userMessage === 'نعم' || userMessage === 'اخي')) {
              await sock.sendMessage(chatId, {
                  text: '*مرحبا يا ورع واااع مسخرة انت*.',
                  ...channelInfo
              });
              return;
          }
/**
 * 🎯 اختيار عنصر عشوائي من القائمة
 */
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

async function handleGuessAnswer(sock, chatId, senderId, userMessage, message) {
    try {
        if (global.guessGame && chatId in global.guessGame) {
            const gameData = global.guessGame[chatId];
            const userAnswer = userMessage.toLowerCase().trim();
            const correctAnswer = gameData.character.name.toLowerCase();
            
            if (userAnswer === 'استسلم') {
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت!*\n🎯 الإجابة الصحيحة: ${gameData.character.name}\n\n💡 اكتب *.احزر* للعب مرة أخرى`
                }, { quoted: message });
                if (gameData.timeout) clearTimeout(gameData.timeout);
                delete global.guessGame[chatId];
                return true;
            }
            
            if (userAnswer === correctAnswer) {
                const userData = getUserData(senderId);
                const winReward = 1000;
                userData.exp = (userData.exp || 0) + winReward;
                updateUserData(senderId, userData);
                
                await sock.sendMessage(chatId, { 
                    text: `🎉 *إجابة صحيحة!*\n✅ الشخصية: ${gameData.character.name}\n💰 ربحت: ${winReward} نقطة\n💵 رصيدك الجديد: ${userData.exp} نقطة\n\n🎮 اكتب *.احزر* للعب مرة أخرى`
                }, { quoted: message });
                if (gameData.timeout) clearTimeout(gameData.timeout);
                delete global.guessGame[chatId];
                return true;
            } else {
                try {
                    await sock.sendMessage(chatId, {
                        react: {
                            text: '❌',
                            key: message.key
                        }
                    });
                } catch (reactError) {
                    console.error('❌ فشل في إرسال الرياكت:', reactError);
                }
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('❌ خطأ في معالجة إجابة لعبة الاحزر:', error);
        return false;
    }
}

// ==============================
// ⭐⭐⭐ معالجة الألعاب التفاعلية ⭐⭐⭐
// ==============================

async function handleGames(sock, chatId, senderId, userMessage, message) {
    try {
        if (userMessage === 'استسلم' || userMessage === 'استسلام') {
            let gameEnded = false;
            
            if (global.guessGame && chatId in global.guessGame) {
                const gameData = global.guessGame[chatId];
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت في لعبة الاحزر!*\n🎯 الإجابة الصحيحة: ${gameData.character?.name || 'غير معروف'}\n\n💡 اكتب *.احزر* للعب مرة أخرى`
                }, { quoted: message });
                if (gameData.timeout) clearTimeout(gameData.timeout);
                delete global.guessGame[chatId];
                gameEnded = true;
            }
            
            if (global.emojiGame && chatId in global.emojiGame) {
                const gameData = global.emojiGame[chatId];
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت في لعبة التفكيك!*\n🧩 السؤال: ${gameData.question}\n✅ الإجابة الصحيحة: ${gameData.answer}\n\n💡 اكتب *.تفكيك* للعب مرة أخرى`
                }, { quoted: message });
                delete global.emojiGame[chatId];
                gameEnded = true;
            }
            
            if (global.ترتيبGame && chatId in global.ترتيبGame) {
                const gameData = global.ترتيبGame[chatId];
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت في لعبة الترتيب!*\n🧩 السؤال: ${gameData.question}\n✅ الإجابة الصحيحة: ${gameData.answer}\n\n💡 اكتب *.ترتيب* للعب مرة أخرى`
                }, { quoted: message });
                delete global.ترتيبGame[chatId];
                gameEnded = true;
            }
            const isAnswerCorrect = await checkIslamicAnswer(sock, chatId, message, userMessage);
if (isAnswerCorrect) {
    commandExecuted = true;
}
            if (global.ايموجيGame && chatId in global.ايموجيGame) {
                const gameData = global.ايموجيGame[chatId];
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت في لعبة الإيموجي!*\n🧩 السؤال: ${gameData.question}\n✅ الإجابة الصحيحة: ${gameData.answer}\n\n💡 اكتب *.ايموجي* للعب مرة أخرى`
                }, { quoted: message });
                delete global.ايموجيGame[chatId];
                gameEnded = true;
            }
            
            if (global.خمنGame && chatId in global.خمنGame) {
                const gameData = global.خمنGame[chatId];
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت في لعبة خمن!*\n🧩 الوصف: ${gameData.question}\n✅ الإجابة الصحيحة: ${gameData.answer}\n\n💡 اكتب *.خمن* للعب مرة أخرى`
                }, { quoted: message });
                delete global.خمنGame[chatId];
                gameEnded = true;
            }
            
            if (global.رياضهGame && chatId in global.رياضهGame) {
                const gameData = global.رياضهGame[chatId];
                await sock.sendMessage(chatId, { 
                    text: `🏳️ *استسلمت في لعبة الرياضة!*\n⚽ السؤال: ${gameData.question}\n✅ الإجابة الصحيحة: ${gameData.answer}\n\n💡 اكتب *.رياضه* للعب مرة أخرى`
                }, { quoted: message });
                delete global.رياضهGame[chatId];
                gameEnded = true;
            }
            
            if (gameEnded) return true;
        }
        
        if (await handleGuessAnswer(sock, chatId, senderId, userMessage, message)) {
            return true;
        }

        if (global.eyeGame && chatId in global.eyeGame && userMessage) {
            try {
                const answered = await handleEyeAnswer(sock, chatId, message, userMessage);
                if (answered) return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة العين:', error);
            }
        }
if (userMessage && await handleTebakbenderaAnswer(sock, chatId, senderId, userMessage, message)) {
    return true;
}
if (/^[1-9]$/.test(userMessage) || 
    userMessage.toLowerCase() === 'استسلم' || 
    userMessage.toLowerCase() === 'surrender' || 
    userMessage.toLowerCase() === 'استسلام') {
    try {
        await handleTicTacToeMove(sock, chatId, senderId, userMessage, message);
        return true;
    } catch (error) {
        console.error('❌ خطأ في معالجة لعبة X O:', error);
        // إرسال رسالة خطأ للمستخدم
        await sock.sendMessage(chatId, { 
            text: '❌ حدث خطأ في اللعبة. يرجى المحاولة مرة أخرى.' 
        }, { quoted: message });
    }
}
        if (global.hangmanGames && chatId in global.hangmanGames && userMessage) {
            try {
                if (userMessage.length === 1 && userMessage.match(/[أ-يء-ي]/)) {
                    await guessLetter(sock, chatId, senderId, userMessage, message);
                    return true;
                }
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة Hangman:', error);
            }
        }

        if (global.triviaGames && chatId in global.triviaGames && userMessage) {
            try {
                await answerTrivia(sock, chatId, senderId, userMessage);
                return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة Trivia:', error);
            }
        }

        if (global.emojiGame && chatId in global.emojiGame && userMessage) {
            try {
                console.log(`🎮 معالجة إجابة التفكيك: "${userMessage}"`);
                
                const gameData = global.emojiGame[chatId];
                const userAnswer = userMessage.toLowerCase().trim();
                const correctAnswer = gameData.answer.toLowerCase();
                
                if (userAnswer === 'استسلم' || userAnswer === 'استسلام') {
                    await sock.sendMessage(chatId, { 
                        text: `🏳️ *استسلمت في لعبة التفكيك!*\n🧩 السؤال: ${gameData.question}\n✅ الإجابة الصحيحة: ${gameData.answer}\n\n💡 اكتب *.تفكيك* للعب مرة أخرى`
                    }, { quoted: message });
                    delete global.emojiGame[chatId];
                    return true;
                }
                
                const answered = await handleEmojiAnswer(sock, chatId, senderId, userMessage, message);
                if (answered) return true;
                
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة التفكيك:', error);
                await sock.sendMessage(chatId, { 
                    text: '❌ حدث خطأ في اللعبة، جرب مرة أخرى!' 
                }, { quoted: message });
                delete global.emojiGame[chatId];
            }
        }

        if (global.ترتيبGame && chatId in global.ترتيبGame && userMessage) {
            try {
                const answered = await handleترتيبAnswer(sock, chatId, senderId, userMessage, message);
                if (answered) return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة الترتيب:', error);
                delete global.ترتيبGame[chatId];
            }
        }

        if (global.animeQuiz && chatId in global.animeQuiz && userMessage) {
            try {
                const answered = await handleAnimeQuizAnswer(sock, chatId, senderId, userMessage, message);
                if (answered) return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة الأنمي كويز:', error);
                delete global.animeQuiz[chatId];
            }
        }

        if (global.ايموجيGame && chatId in global.ايموجيGame && userMessage) {
            try {
                const answered = await handleايموجيAnswer(sock, chatId, senderId, userMessage, message);
                if (answered) return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة الإيموجي:', error);
                delete global.ايموجيGame[chatId];
            }
        }

        if (global.خمنGame && chatId in global.خمنGame && userMessage) {
            try {
                const answered = await handleخمنAnswer(sock, chatId, senderId, userMessage, message);
                if (answered) return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة خمن:', error);
                delete global.خمنGame[chatId];
            }
        }

        if (global.رياضهGame && chatId in global.رياضهGame && userMessage) {
            try {
                const answered = await handleرياضهAnswer(sock, chatId, senderId, userMessage, message);
                if (answered) return true;
            } catch (error) {
                console.error('❌ خطأ في معالجة لعبة الرياضة:', error);
                delete global.رياضهGame[chatId];
            }
        }

        return false;
    } catch (error) {
        console.error('❌ خطأ عام في معالجة الألعاب:', error);
        return false;
    }
}

// ==============================
// ⭐⭐⭐ الدالة الرئيسية لمعالجة الرسائل ⭐⭐⭐
// ==============================

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        await handleAutoread(sock, message);
        
        if (message.message) storeMessage(sock, message);

        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = isSudo(senderId);

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        try {
            let botData;
            try {
                const fileContent = fs.readFileSync('./data/messageCount.json', 'utf8');
                if (fileContent.trim() === '') {
                    botData = { isPublic: true };
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(botData, null, 2));
                } else {
                    botData = JSON.parse(fileContent);
                }
            } catch (e) {
                botData = { isPublic: true };
                fs.writeFileSync('./data/messageCount.json', JSON.stringify(botData, null, 2));
            }
            
            if (!botData.isPublic && !message.key.fromMe && !senderIsSudo) return;
        } catch (error) {
            console.error('خطأ في التحقق من وضع البوت:', error);
        }

        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot.',
                    ...channelInfo
                });
            }
            return;
        }

        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { 
                        if (sock.updateBlockStatus) {
                            await sock.updateBlockStatus(chatId, 'block'); 
                        }
                    } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
        if (isGroup && !message.key.fromMe) {
            try {
                const linkDetected = await handleLinkDetection(sock, chatId, message, senderId);
                if (linkDetected) return;
            } catch (error) {
                console.error('❌ خطأ في كشف الروابط:', error);
            }
        }

        if (!message.key.fromMe) {
            incrementMessageCount(chatId, senderId);
            
            const userMsgData = getUserData(senderId);
            const messageReward = Math.floor(Math.random() * 5) + 1;
            userMsgData.exp = (userMsgData.exp || 0) + messageReward;
            userMsgData.messages = (userMsgData.messages || 0) + 1;
            updateUserData(senderId, userMsgData);
        }

        if (await handleGames(sock, chatId, senderId, userMessage, message)) return;

        if (userMessage.startsWith('.')) {
            let commandExecuted = false;

            switch (true) {
                // 🔧 أوامر الحماية
                case userMessage.startsWith('.مضاد-لينك') || userMessage.startsWith('.antilink'):
                    await handleAntilinkCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.مضاد-تاغ') || userMessage.startsWith('.antitag'):
                    await handleAntitagCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.مضاد-سبام') || userMessage.startsWith('.antibadword'):
        await antibadwordCommand(sock, chatId, senderId, userMessage, message);
        commandExecuted = true;
        break;

                case userMessage.startsWith('.مضاد-حذف') || userMessage.startsWith('.antidelete'):
                    await handleAntideleteCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.مضاد-كول') || userMessage.startsWith('.anticall'):
    await anticallCommand(sock, chatId, senderId, userMessage, message);
    commandExecuted = true;
    break;
                case userMessage.startsWith('.منع-خاص') || userMessage.startsWith('.pmblocker'):
                    await pmblockerCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.مينشن') || userMessage.startsWith('.mention'):
    // تعريف isOwner - يمكنك إضافة رقمك في sudoUsers أو استخدام شرط إضافي
    const isOwner = sudoUsers.includes(senderId) || senderId === '212706595340@s.whatsapp.net';
    await mentionToggleCommand(sock, chatId, message, userMessage.split(' ')[1], isOwner);
    commandExecuted = true;
    break;

                // 💰 أوامر البنك والاقتصاد
                case userMessage === '.بنك':
                    await bankCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.إيداع'):
                    const depositAmount = userMessage.split(' ')[1];
                    await depositCommand(sock, chatId, senderId, depositAmount, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.سحب'):
                    const withdrawAmount = userMessage.split(' ')[1];
                    await withdrawCommand(sock, chatId, senderId, withdrawAmount, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.محفظة':
                    await walletCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.مستوى':
                    await levelCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.توب-فلوس' || userMessage === '.توب فلوس':
                    await topMoneyCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.3amal':
                    const userWorkData = getUserData(senderId);
                    const workEarnings = Math.floor(Math.random() * 500) + 100;
                    userWorkData.exp = (userWorkData.exp || 0) + workEarnings;
                    updateUserData(senderId, userWorkData);
                    
                    await sock.sendMessage(chatId, { 
                        text: `💼 *عملت وشقت!*\n\n💰 ربحت: ${workEarnings} دولار\n💵 رصيدك الجديد: ${userWorkData.exp} دولار`
                    }, { quoted: message });
                    commandExecuted = true;
                    break;

                case userMessage === '.يومي':
                    const userDailyData = getUserData(senderId);
                    const today = new Date().toDateString();
                    
                    if (userDailyData.lastDaily === today) {
                        await sock.sendMessage(chatId, { 
                            text: '❌ لقد أخذت مكافأتك اليومية بالفعل!\n⏰ تعود بعد 24 ساعة'
                        }, { quoted: message });
                    } else {
                        const dailyReward = 1000;
                        userDailyData.exp = (userDailyData.exp || 0) + dailyReward;
                        userDailyData.lastDaily = today;
                        updateUserData(senderId, userDailyData);
                        
                        await sock.sendMessage(chatId, { 
                            text: `🎁 *المكافأة اليومية!*\n\n💰 ربحت: ${dailyReward} دولار\n💵 رصيدك الجديد: ${userDailyData.exp} دولار\n⏰ عد بعد 24 ساعة!`
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage === '.hadiya':
                    const userGiftData = getUserData(senderId);
                    const giftAmount = Math.floor(Math.random() * 2000) + 500;
                    userGiftData.exp = (userGiftData.exp || 0) + giftAmount;
                    updateUserData(senderId, userGiftData);
                    
                    await sock.sendMessage(chatId, { 
                        text: `🎁 *هدية مجانية!*\n\n💰 ربحت: ${giftAmount} دولار\n💵 رصيدك الجديد: ${userGiftData.exp} دولار\n⏰ جرب مرة أخرى غداً!`
                    }, { quoted: message });
                    commandExecuted = true;
                    break;

                // 🎮 أوامر الألعاب
                case userMessage === '.اديت' || userMessage === '.ايديت' || userMessage === '.edit':
                    await editCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.خمن':
                    if (global.خمنGame[chatId]) {
                        await sock.sendMessage(chatId, { 
                            text: '❌ هناك لعبة خمن نشطة!' 
                        }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }
                    await خمنGameCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.تفكيك':
                    try {
                        if (global.emojiGame && chatId in global.emojiGame) {
                            await sock.sendMessage(chatId, { 
                                text: '❌ هناك لعبة تفكيك نشطة بالفعل!\n💡 اكتب "استسلم" للخروج من اللعبة الحالية' 
                            }, { quoted: message });
                            commandExecuted = true;
                            break;
                        }
                        
                        console.log('🎮 بدء لعبة تفكيك جديدة...');
                        await emojiGameCommand(sock, chatId, message);
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('❌ خطأ في بدء لعبة التفكيك:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ فشل في بدء اللعبة! حاول مرة أخرى.' 
                        }, { quoted: message });
                        commandExecuted = true;
                    }
                    break;
                case userMessage === '.ترتيب':
                    if (global.ترتيبGame[chatId]) {
                        await sock.sendMessage(chatId, { 
                            text: '❌ هناك لعبة ترتيب نشطة!' 
                        }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }
                    await ترتيبGameCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.ايموجي':
                    if (global.ايموجيGame[chatId]) {
                        await sock.sendMessage(chatId, { 
                            text: '❌ هناك لعبة ايموجي نشطة!' 
                        }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }
                    await ايموجيGameCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.رياضه':
                    try {
                        if (global.رياضهGame && chatId in global.رياضهGame) {
                            await sock.sendMessage(chatId, { 
                                text: '❌ هناك لعبة رياضة نشطة بالفعل!' 
                            }, { quoted: message });
                            commandExecuted = true;
                            break;
                        }
                        await رياضهCommand(sock, chatId, message);
                        commandExecuted = true;
                    } catch (error) {
                        console.error('خطأ في لعبة الرياضة:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ حدث خطأ في بدء اللعبة' 
                        }, { quoted: message });
                        commandExecuted = true;
                    }
                    break;
                case userMessage.startsWith('.اسئلني ') || userMessage.startsWith('.سؤال') || userMessage.startsWith('.سؤال انمي'):
                    try {
                        await animeQuizCommand(sock, chatId, message);
                        commandExecuted = true;
                    } catch (error) {
                        console.error('Error in anime quiz command:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ حدث خطأ في بدء اختبار الأنمي!' 
                        }, { quoted: message });
                        commandExecuted = true;
                    }
                    break;

                case userMessage.startsWith('.لعبة') || userMessage.startsWith('.العب'):
                    await gameCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.احزر':
                    await guessCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.عين':
                    await eyeCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.تاج':
                    await tagCrownCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                    case userMessage.startsWith('.المتصلين'):
                    await onlineListCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.علم':
                    await tebakbenderaCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.اكس او') || userMessage.startsWith('.xo'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.ttt'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'الرجاء تحديد رقم الموضع الصحيح للعب (1-9).', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                    case userMessage === '.استسلم':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'استسلم');
                break;
                case userMessage === '.لو':
                    await lwCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.شنق':
                    await startHangman(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.ثقافة':
                    await startTrivia(sock, chatId, message);
                    commandExecuted = true;
                    break;

                // 🎭 أوامر الترفيه
                case userMessage.startsWith('.شخصية') || userMessage.startsWith('.اوصف') || userMessage.startsWith('.هو') || userMessage.startsWith('.وصف') || userMessage.startsWith('.شبه'):
                    try {
                        let text = userMessage.replace('.شخصية', '')
                                             .replace('.اوصف', '')
                                             .replace('.هو', '')
                                             .replace('.وصف', '')
                                             .replace('.شبه', '')
                                             .trim();
                        
                        if (!text) {
                            await sock.sendMessage(chatId, { 
                                text: `👤 *أمر تحليل الشخصية*\n\n*الاستخدام:*\n.شخصية [الاسم أو المنشن]\n.اوصف [الاسم]\n.هو [الاسم]\n.وصف [الاسم]\n\n*مثال:*\n.شخصية أحمد\n.شخصية @منشن` 
                            }, { quoted: message });
                            commandExecuted = true;
                            break;
                        }

                        let targetUser = text;
                        let targetJid = null;
                        let profilePictureUrl = null;

                        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
                        if (mentionedJid && mentionedJid.length > 0) {
                            targetJid = mentionedJid[0];
                            targetUser = `@${targetJid.split('@')[0]}`;
                        } else {
                            targetJid = message.key.participant || message.key.remoteJid;
                        }

                        try {
                            if (targetJid) {
                                console.log(`🔄 جلب صورة البروفايل لـ: ${targetJid}`);
                                const ppUrl = await sock.profilePictureUrl(targetJid, 'image');
                                if (ppUrl) {
                                    profilePictureUrl = ppUrl;
                                    console.log('✅ تم جلب صورة البروفايل بنجاح');
                                } else {
                                    throw new Error('لا توجد صورة بروفايل');
                                }
                            }
                        } catch (ppError) {
                            console.log('⚠️ لا توجد صورة بروفايل، استخدام صورة افتراضية');
                            profilePictureUrl = './media/person.jpg';
                            
                            try {
                                if (!fs.existsSync('./media/person.jpg')) {
                                    console.log('⚠️ الصورة الافتراضية غير موجودة، سيتم إرسال النص فقط');
                                    profilePictureUrl = null;
                                }
                            } catch (fsError) {
                                console.log('⚠️ خطأ في التحقق من الصورة الافتراضية');
                                profilePictureUrl = null;
                            }
                        }

                        let analysis = `
👤 *تحليل الشخصية - ${targetUser}*

*📊 الإحصائيات:*
• الأخلاق الحميدة: ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98%','99%'])}
• الأخلاق السيئة: ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98%','99%'])}
• الذكاء: ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98%','99%'])}
• الشجاعة: ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98%','99%'])}
• الحظ: ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98%','99%'])}

*🎭 الشخصية:*
• النوع: ${pickRandom(['طيب القلب','متكبر','بخيل','كريم','متواضع','خجول','جبان','فضولي','محبوب','ذكي','وفي','مخادع','صادق'])}
• الطبيعة: ${pickRandom(['هادئ','نشيط','اجتماعي','انطوائي','مرح','جاد','غامض','مزعج','ممل','مضحك'])}
• الصفات: ${pickRandom(['ذكي','صبور','كريم','شجاع','مبدع','وفيّ','غبي','بخيل','جبان','كسول'])}

*🎯 الأنشطة:*
• دائماً: ${pickRandom(['متوتر','مشتت','مزعج','نمام','بيقرا كتب','خروجات','بيتفرج انمي','فاتح واتس','بيكدب','بيحب الشغل','كسول'])}
• الهوايات: ${pickRandom(['القراءة','السفر','الرياضة','الكتابة','البرمجة','الرسم','النوم','الأكل','التسوق','السباحة'])}
• الطموح: ${pickRandom(['النجاح','السعادة','التعلم','التميز','الاستقرار','التأثير','الثراء','الشهرة','الزواج','السفر'])}

*⭐ التقييم:*
${pickRandom(['شخص رائع 🎯','مميز جداً 💎','طيب القلب ❤️','مبدع 🎨','ذكي 🧠','محبوب 🌟','شخص عادي 👤','ممل بعض الشيء 😴','مزعج أحياناً 🤪','غريب الأطوار 🎭'])}

*📝 الخلاصة:*
${pickRandom(['الحمد لله على كل حال 🙏','سبحان الله وبحمده 🌟','لا حول ولا قوة إلا بالله 💫','الله أكبر 🕌','استغفر الله واتوب اليه 📿'])}
`;

                        let mentions = [];
                        if (targetJid) {
                            mentions = [targetJid];
                        }

                        if (profilePictureUrl) {
                            try {
                                await sock.sendMessage(chatId, { 
                                    image: profilePictureUrl.startsWith('http') ? { url: profilePictureUrl } : fs.readFileSync(profilePictureUrl),
                                    caption: analysis,
                                    mentions: mentions
                                }, { quoted: message });
                                console.log('✅ تم إرسال التحليل مع الصورة');
                            } catch (imageError) {
                                console.log('⚠️ خطأ في إرسال الصورة، إرسال نص فقط');
                                await sock.sendMessage(chatId, { 
                                    text: analysis,
                                    mentions: mentions
                                }, { quoted: message });
                            }
                        } else {
                            await sock.sendMessage(chatId, { 
                                text: analysis,
                                mentions: mentions
                            }, { quoted: message });
                            console.log('✅ تم إرسال التحليل كنص فقط');
                        }
                        
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('❌ خطأ في أمر الشخصية:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ تعذر تحليل الشخصية حالياً' 
                        }, { quoted: message });
                        commandExecuted = true;
                    }
                    break;
                  
              // ... (داخل دالة handleMessages، ضمن switch(true))

case userMessage.startsWith('.غباء'): // ⬅️ استخدام startsWith يسمح بـ '.غباء @user'
    console.log('🔍 [السويتش] محاولة تنفيذ أمر الغباء');
    // ⬅️ تم تمرير senderId و userMessage ليتم استخدامهم في الكوماند
    await stupidityCommand(sock, chatId, message, senderId, userMessage); 
    commandExecuted = true;
    break;

// ...

                case userMessage.startsWith('.توب'):
                    try {
                        let groupMetadata = await sock.groupMetadata(chatId);
                        
                        if (!groupMetadata) {
                            await sock.sendMessage(chatId, { 
                                text: '❌ هذا الأمر يعمل في المجموعات فقط' 
                            }, { quoted: message });
                            commandExecuted = true;
                            break;
                        }

                        let text = userMessage.replace('.توب', '').trim();
                        if (!text) {
                            await sock.sendMessage(chatId, { 
                                text: '*مـثـال : .توب متفاعلين*' 
                            }, { quoted: message });
                            commandExecuted = true;
                            break;
                        }

                        let ps = groupMetadata.participants.map(v => v.id);
                        let selected = [];
                        let usedIndices = new Set();
                        
                        while (selected.length < 10 && selected.length < ps.length) {
                            let randomIndex = Math.floor(Math.random() * ps.length);
                            if (!usedIndices.has(randomIndex)) {
                                selected.push(ps[randomIndex]);
                                usedIndices.add(randomIndex);
                            }
                        }

                        let x = pickRandom(['✨','🤍','🔥','💫','😎','🤨']);
                        let top = `*${x} توب 10 ${text} ${x}*\n\n`;
                        
                        selected.forEach((user, index) => {
                            let username = user.split('@')[0];
                            top += `*${index + 1}.* @${username}\n`;
                        });

                        await sock.sendMessage(chatId, { 
                            text: top,
                            mentions: selected
                        }, { quoted: message });
                        
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('خطأ في أمر التوب:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ حدث خطأ في إنشاء التوب' 
                        }, { quoted: message });
                        commandExecuted = true;
                    }
                    break;
                    
                case userMessage === '.صراحة' || userMessage === '.truth':
                    try {
                        const randomIndex = Math.floor(Math.random() * localArabicTruths.length);
                        const truthMessage = localArabicTruths[randomIndex];
                        
                        await sock.sendMessage(chatId, { 
                            text: `*💬 صراحة | Truth*\n\n${truthMessage}\n\n*استخدم .صراحة مرة أخرى لسؤال جديد!*` 
                        }, { quoted: message });
                    } catch (error) {
                        console.error('❌ خطأ في أمر الصراحة:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ فشل في جلب سؤال الصراحة. الرجاء المحاولة مرة أخرى لاحقًا!' 
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage === '.شعر' || userMessage === '.قصيدة':
                    console.log('🎭 تم استدعاء أمر الشعر من switch case');
                    await shayariCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.بطاقة' || userMessage === '.كارت':
                    console.log('🎴 بدء أمر البطاقة');
                    try {
                        await cardCommand(sock, chatId, message);
                        console.log('✅ تم تنفيذ أمر البطاقة بنجاح');
                    } catch (error) {
                        console.error('❌ خطأ في أمر البطاقة:', error);
                        await sock.sendMessage(chatId, {
                            text: '❌ حدث خطأ في إنشاء البطاقة. حاول مرة أخرى!'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage === '.خلفيات' || userMessage === '.صور' || userMessage === '.صورة':
                    console.log('🖼️ تم استدعاء أمر الصورة العشوائية');
                    await handleRandomImageCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.تحدي' || userMessage === '.dare':
                    await dareCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.الالعاب' || userMessage === '.games':
                    try {
                        let activeGames = "🎮 *الألعاب النشطة:*\n\n";
                        
                        if (global.guessGame && chatId in global.guessGame) {
                            activeGames += "🔹 لعبة الاحزر - نشطة\n";
                        }
                        if (global.eyeGame && chatId in global.eyeGame) {
                            activeGames += "🔹 لعبة العين - نشطة\n";
                        }
                        if (global.tictactoeGames && chatId in global.tictactoeGames) {
                            activeGames += "🔹 لعبة X O - نشطة\n";
                        }
                        if (global.hangmanGames && chatId in global.hangmanGames) {
                            activeGames += "🔹 لعبة شنق - نشطة\n";
                        }
                        if (global.triviaGames && chatId in global.triviaGames) {
                            activeGames += "🔹 لعبة الثقافة - نشطة\n";
                        }
                        if (global.emojiGame && chatId in global.emojiGame) {
                            const gameData = global.emojiGame[chatId];
                            activeGames += `🔹 لعبة التفكيك - نشطة\n🧩 السؤال: ${gameData.question}\n`;
                        }
                        if (global.رياضهGame && chatId in global.رياضهGame) {
                            const gameData = global.رياضهGame[chatId];
                            activeGames += `🔹 لعبة الرياضة - نشطة\n⚽ السؤال: ${gameData.question}\n`;
                        }
                        
                        if (activeGames === "🎮 *الألعاب النشطة:*\n\n") {
                            activeGames += "❌ لا توجد ألعاب نشطة\n💡 ابدأ لعبة بـ: .احزر أو .تفكيك أو .عين إلخ...";
                        } else {
                            activeGames += "\n💡 اكتب 'استسلم' للخروج من أي لعبة";
                        }
                        
                        await sock.sendMessage(chatId, { text: activeGames }, { quoted: message });
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('❌ خطأ في عرض الألعاب:', error);
                    }
                    break;

                case userMessage === '.اصلاح-العاب' || userMessage === '.fix-games':
                    try {
                        let fixedGames = "🔧 *إصلاح الألعاب:*\n\n";
                        let fixedCount = 0;
                        
                        if (global.emojiGame && chatId in global.emojiGame) {
                            const gameData = global.emojiGame[chatId];
                            fixedGames += `✅ لعبة التفكيك: ${gameData.question}\n`;
                            fixedCount++;
                        }
                        
                        if (global.رياضهGame && chatId in global.رياضهGame) {
                            const gameData = global.رياضهGame[chatId];
                            fixedGames += `✅ لعبة الرياضة: ${gameData.question}\n`;
                            fixedCount++;
                        }
                        
                        const gamesToClean = ['guessGame', 'eyeGame', 'tictactoeGames', 'hangmanGames', 'triviaGames', 'emojiGame', 'رياضهGame'];
                        gamesToClean.forEach(game => {
                            if (global[game] && chatId in global[game]) {
                                const gameData = global[game][chatId];
                                if (gameData.timestamp && (Date.now() - gameData.timestamp > 30 * 60 * 1000)) {
                                    delete global[game][chatId];
                                    fixedGames += `🧹 نظفت ${game} (قديمة)\n`;
                                    fixedCount++;
                                }
                            }
                        });
                        
                        if (fixedCount === 0) {
                            fixedGames += "✅ جميع الألعاب تعمل بشكل طبيعي";
                        }
                        
                        await sock.sendMessage(chatId, { text: fixedGames }, { quoted: message });
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('❌ خطأ في إصلاح الألعاب:', error);
                    }
                    break;
                    
                // 📱 أوامر المعلومات
                case userMessage === '.help' || userMessage === '.مساعدة' || userMessage === '.اوامر' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.قائمة':
                    await helpCommand(sock, chatId, message, global.channelLink);
                    commandExecuted = true;
                    break;
                case userMessage === '.المطور':
                    await ownerCommand(sock, chatId);
                    commandExecuted = true;
                    break;
                case userMessage === '.سرعه':
                    await pingCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.حول':
                    await aliveCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.بين') || userMessage.startsWith('.pin'):
    const pinArgs = userMessage.split(' ').slice(1);
    await pinterestCommand(sock, chatId, message, pinArgs);
    commandExecuted = true;
    break;
                // 🎨 أوامر الوسائط
                case userMessage === '.جودة':
                    await qualityCommand(sock, chatId, message, []);
                    commandExecuted = true;
                    break;
                case userMessage === '.لملصق' || userMessage === '.s':
                    await stickerCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.ملصق'):
                    await attpCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.لصورة': {
                    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                    if (quotedMessage?.stickerMessage) {
                        await simageCommand(sock, quotedMessage, chatId);
                    } else {
                        await sock.sendMessage(chatId, { text: 'من فضلك حدد الملصق.', ...channelInfo }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;
                }

                // 🌐 أوامر الإنترنت
                case userMessage === '.نكتة':
                    await jokeCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.حكمة':
                    await quoteCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
               // في السويتش - التصحيح الصحيح
case '.اسلامي':
case '.ديني':
case '.دين':
case '.الاسلام':
case '.مسلم':
    await islamicQuizCommand(sock, chatId, message);
    commandExecuted = true;
    break;
                case userMessage === '.معلومة':
                    await factCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.صور انمي':
                    await memeCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.مدح'):
                    await complimentCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.قمع'):
                    await insultCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.مغازلة':
                    await flirtCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.زواج':
                    await shipCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.طلاق') || userMessage.startsWith('.الطلاق'):
                    try {
                        const groupMetadata = await sock.groupMetadata(chatId)
                        let ps = groupMetadata.participants.map(v => v.id)
                        let a = ps[Math.floor(Math.random() * ps.length)]
                        let b
                        do b = ps[Math.floor(Math.random() * ps.length)]
                        while (b === a)
                        
                        let toM = a => '@' + a.split('@')[0]
                        
                        const funnyPhrases = [
                            "الله يعينكم 😂",
                            "ما في أمل 🙈", 
                            "طلاق نهائي 🏆",
                            "مبروك الطلاق 🎉",
                            "انتهى الحب 💔",
                            "ما تصلحوا لبعض 👰‍♀️🤵‍♂️",
                            "خلصت القصة 📜",
                            "الله يوفقكم 😅"
                        ]
                        
                        const randomPhrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)]
                        
                        await sock.sendMessage(chatId, { 
                            text: `*محكمة الطلاق*\n\n${toM(a)} 💔 ${toM(b)}\n\n📢 الحكم: "انتو ما تليقو لبعض!"\n\n${randomPhrase}`,
                            mentions: [a, b]
                        }, { quoted: message })
                        
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('Error in divorce command:', error)
                        await sock.sendMessage(chatId, { 
                            text: '❌ حدث خطأ في الطلاق!'
                        }, { quoted: message })
                        commandExecuted = true;
                    }
                    break;

                case userMessage.startsWith('.حكم') || userMessage.startsWith('.هل') || userMessage.startsWith('.eightball'):
                    try {
                        let question = userMessage.replace('.حكم', '')
                                                 .replace('.هل', '')
                                                 .replace('.eightball', '')
                                                 .trim();
                        
                        if (!question) {
                            await sock.sendMessage(chatId, { 
                                text: `🎱 *أمر الكرة الثمانية*\n\n*الاستخدام:*\n.حكم [سؤالك]\n.سؤال [سؤالك]\n.8ball [سؤالك]\n\n*مثال:*\n.حكم هل سأنجح في الامتحان؟` 
                            }, { quoted: message });
                            commandExecuted = true;
                            break;
                        }

                        await eightBallCommand(sock, chatId, question);
                        commandExecuted = true;
                        
                    } catch (error) {
                        console.error('Error in eightball command:', error);
                        await sock.sendMessage(chatId, { 
                            text: '❌ حدث خطأ في الحكم على سؤالك!' 
                        }, { quoted: message });
                        commandExecuted = true;
                    }
                    break;

                // 🎌 أوامر الأنمي
                case userMessage.startsWith('.انمي'):
                    {
                        const parts = userMessage.trim().split(/\s+/);
                        const args = parts.slice(1);
                        await animeCommand(sock, chatId, message, args);
                        commandExecuted = true;
                    }
                    break;

                case userMessage.startsWith('.اكل'):
                case userMessage.startsWith('.وخز'):
                case userMessage.startsWith('.بكاء'):
                case userMessage.startsWith('.قبلة'):
                case userMessage.startsWith('.تربيت'):
                case userMessage.startsWith('.عناق'):
                case userMessage.startsWith('.غمزة'):
                case userMessage.startsWith('.صفع'):
                case userMessage.startsWith('.صفع-جبين'):
                case userMessage.startsWith('.اقتباس'):
                case userMessage.startsWith('.لولي'):
                    {
                        const parts = userMessage.trim().split(/\s+/);
                        let sub = parts[0].slice(1);
                        if (sub === 'اكل') sub = 'nom';
                        if (sub === 'وخز') sub = 'poke';
                        if (sub === 'بكاء') sub = 'cry';
                        if (sub === 'قبلة') sub = 'kiss';
                        if (sub === 'تربيت') sub = 'pat';
                        if (sub === 'عناق') sub = 'hug';
                        if (sub === 'غمزة') sub = 'wink';
                        if (sub === 'صفع' || sub === 'صفع-جبين') sub = 'face-palm';
                        if (sub === 'اقتباس') sub = 'quote';
                        if (sub === 'لولي') sub = 'loli';
                        await animeCommand(sock, chatId, message, [sub]);
                        commandExecuted = true;
                    }
                    break;

                case userMessage.startsWith('.تخيل'):
                    const imagineText = userMessage.replace('.تخيل', '').trim();
                    if (imagineText) {
                        await sock.sendMessage(chatId, { 
                            text: `🎨 جاري توليد صورة للوصف: "${imagineText}"\n⏳ قد يستغرق دقيقة...`
                        }, { quoted: message });
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '❌ يرجى كتابة وصف للصورة\nمثال: `.تخيل قطة لطيفة`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage === '.راس طفل':
                    await sock.sendMessage(chatId, { 
                        text: '👶 جاري إرسال صورة رأس طفل أنمي...'
                    }, { quoted: message });
                    commandExecuted = true;
                    break;

                case userMessage === '.كوتي':
                    await sock.sendMessage(chatId, { 
                        text: '🐱 جاري إرسال صورة كوتي أنمي...'
                    }, { quoted: message });
                    commandExecuted = true;
                    break;

                case userMessage === '.لولي':
                    await sock.sendMessage(chatId, { 
                        text: '🍬 جاري إرسال صورة لولي أنمي...'
                    }, { quoted: message });
                    commandExecuted = true;
                    break;

                // ⚙️ أوامر النظام
                case userMessage === '.مسح' && senderIsSudo:
                    await clearCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;
// ... (داخل دالة handleMessages، ضمن switch(true))
// ... (داخل دالة handleMessages، ضمن switch(true))

    // ⬇️ أمر الازرف ⬇️
    case userMessage === '.ازرف' || userMessage === '.kickall':
    await kickallCommand(sock, chatId, senderId, message);
    commandExecuted = true;
    break;
        
// ...
                
            // ... (باقي الأوامر)
                // 👥 أوامر الإدارة
                case userMessage.startsWith('.طرد'):
                    const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.قفل'):
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    await muteCommand(sock, chatId, senderId, message, muteDuration);
                    commandExecuted = true;
                    break;
                case userMessage === '.فتح':
                    await unmuteCommand(sock, chatId, senderId);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.طلعه'):
                    const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.نزل'):
                    const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.ترحيب'):
                    const welcomeArgs = userMessage.split(' ').slice(1).join(' ');
                    await welcomeCommand(sock, chatId, message, welcomeArgs);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.توديع'):
                    const goodbyeArgs = userMessage.split(' ').slice(1).join(' ');
                    await goodbyeCommand(sock, chatId, message, goodbyeArgs);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.حظر'):
                    const mentionedJidListBan = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await banCommand(sock, chatId, senderId, mentionedJidListBan, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.الغاء-حظر'):
                    const mentionedJidListUnban = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await unbanCommand(sock, chatId, senderId, mentionedJidListUnban, message);
                    commandExecuted = true;
                    break;
                case userMessage.startsWith('.انذار'):
                    const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.انذارات':
                    await warningsCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;
               // نستخدم startsWith للسماح بكتابة .حذف متبوعة برقم (مثل .حذف 5)
case userMessage.startsWith('.حذف'):
    // يجب تمرير المُحددات الأربعة للدالة: sock, chatId, message, senderId
    await deleteCommand(sock, chatId, message, senderId);
    commandExecuted = true;
    break;
                    
                case userMessage.startsWith('.مخفي'):
                    const messageText = rawText.slice(5).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                    commandExecuted = true;
                    break;
                case userMessage === '.منشن':
                    await tagAllCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                // 🔊 أوامر الوسائط
                case userMessage.startsWith('.قل'):
                    const text = userMessage.slice(4).trim();
                    await ttsCommand(sock, chatId, text, message);
                    commandExecuted = true;
                    break;

                // 🎵 أوامر التحميل
                case userMessage.startsWith('.فيديو'):
                    const videoName = userMessage.replace('.فيديو', '').trim();
                    if (videoName) {
                        try {
                            await videoCommand(sock, chatId, message);
                        } catch (error) {
                            console.error('❌ خطأ في تحميل أمر الفيديو:', error);
                            await sock.sendMessage(chatId, { 
                                text: '❌ حدث خطأ في نظام التحميل'
                            }, { quoted: message });
                        }
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🎥 اكتب اسم الفيديو أو الرابط\nمثال:\n• `.فيديو مقاطع مضحكة`\n• `.فيديو https://youtube.com/...`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.شغل'):
                case userMessage.startsWith('.اغنية'):
                case userMessage.startsWith('.song'):
                    const songName = userMessage.replace('.شغل', '').replace('.اغنية', '').replace('.song', '').trim();
                    if (songName) {
                        try {
                            const userId = message.key.participant || message.key.remoteJid;
                            await songCommand(sock, chatId, message, userId, songName);
                        } catch (error) {
                            console.error('❌ خطأ في تحميل أمر الصوت:', error);
                            await sock.sendMessage(chatId, { 
                                text: '❌ حدث خطأ في نظام التحميل: ' + error.message
                            }, { quoted: message });
                        }
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🎵 اكتب اسم الأغنية\nمثال:\n• `.شغل فالونتينو`\n• `.اغنية ناصر القطامي`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.سبوتيفاي'):
                case userMessage.startsWith('.spotify'):
                    const spotifyQuery = userMessage.replace('.سبوتيفاي', '').replace('.spotify', '').trim();
                    if (spotifyQuery) {
                        try {
                            const userId = message.key.participant || message.key.remoteJid;
                            await spotifyCommand(sock, chatId, message, userId, spotifyQuery);
                        } catch (error) {
                            await sock.sendMessage(chatId, { 
                                text: '❌ حدث خطأ في بحث Spotify'
                            }, { quoted: message });
                        }
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.ساوند'):
                case userMessage.startsWith('.soundcloud'):
                    const soundQuery = userMessage.replace('.ساوند', '').replace('.soundcloud', '').trim();
                    if (soundQuery) {
                        try {
                            const userId = message.key.participant || message.key.remoteJid;
                            await soundcloudCommand(sock, chatId, message, userId, soundQuery);
                        } catch (error) {
                            await sock.sendMessage(chatId, { 
                                text: '❌ حدث خطأ في بحث SoundCloud'
                            }, { quoted: message });
                        }
                    }
                    commandExecuted = true;
                    break;
                    
                case userMessage.startsWith('.يوتيوب'):
                    const ytSearch = userMessage.replace('.يوتيوب', '').trim();
                    if (ytSearch) {
                        await sock.sendMessage(chatId, { 
                            text: `🔍 يوتيوب: "${ytSearch}"`
                        }, { quoted: message });
                        
                        try {
                            const yts = require('yt-search');
                            const searchResults = await yts(ytSearch);
                            
                            if (searchResults.videos.length > 0) {
                                let resultsText = `📺 نتائج يوتيوب لـ: "${ytSearch}"\n\n`;
                                
                                searchResults.videos.slice(0, 5).forEach((video, index) => {
                                    resultsText += `${index + 1}. ${video.title}\n⏰ ${video.timestamp} | 🔗 ${video.url}\n\n`;
                                });
                                
                                resultsText += `💡 للتحميل استخدم: *.فيديو* مع الرابط`;
                                
                                await sock.sendMessage(chatId, { 
                                    text: resultsText
                                }, { quoted: message });
                                
                            } else {
                                await sock.sendMessage(chatId, { 
                                    text: '❌ مافي نتائج'
                                }, { quoted: message });
                            }
                        } catch (error) {
                            await sock.sendMessage(chatId, { 
                                text: '❌ خطأ في البحث'
                            }, { quoted: message });
                        }
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '❌ اكتب اللي تبي تبحث عنه\nمثال: `.يوتيوب ألعاب`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;
case userMessage.startsWith('.تطبيق') || userMessage.startsWith('.apk') || userMessage.startsWith('.بحث_تطبيق'):
    await apkCommand(sock, chatId, senderId, userMessage, message);
    commandExecuted = true;
    break;
                // 🤖 أوامر الذكاء الاصطناعي
                case userMessage.startsWith('.ai') || userMessage.startsWith('.ذكاء'):
                    const aiQuery = userMessage.replace('.ai', '').replace('.ذكاء', '').trim();
                    if (aiQuery) {
                        await aiCommand(sock, chatId, message, aiQuery);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🤖 اكتب سؤالك بعد الأمر\nمثال: `.ai ما هو الذكاء الاصطناعي؟`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.شات') || userMessage.startsWith('.chat'):
                    const chatQuery = userMessage.replace('.شات', '').replace('.chat', '').trim();
                    if (chatQuery) {
                        await handleChatbotCommand(sock, chatId, message, chatQuery);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '💬 اكتب رسالتك بعد الأمر\nمثال: `.شات مرحبا كيف حالك؟`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                // 🌐 أوامر الترجمة
                case userMessage.startsWith('.ترجم') || userMessage.startsWith('.translate'):
                    const translateText = userMessage.replace('.ترجم', '').replace('.translate', '').trim();
                    if (translateText) {
                        await handleTranslateCommand(sock, chatId, message, translateText);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🌐 اكتب النص للترجمة\nمثال: `.ترجم hello world`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                // ⚡ أوامر الرياكشن
                case userMessage.startsWith('.رياكشن') || userMessage.startsWith('.areact'):
                    await handleAreactCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                // ⌨️ أوامر التايبينغ
                case userMessage.startsWith('.تايب') || userMessage.startsWith('.autotyping'):
                    await autotypingCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                // 👁️ أوامر القراءة التلقائية
                case userMessage.startsWith('.قراءة') || userMessage.startsWith('.autoread'):
                    await autoreadCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                // 📊 أوامر الستاتس
                case userMessage.startsWith('.ستاتس') || userMessage.startsWith('.autostatus'):
                    await autoStatusCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                // 👑 أوامر السودو
                case userMessage.startsWith('.مطور') || userMessage.startsWith('.sudo'):
                    await sudoCommand(sock, chatId, senderId, userMessage, message);
                    commandExecuted = true;
                    break;

                // 🔄 أوامر التحديث
                case userMessage === '.تحديث' || userMessage === '.update':
                    await updateCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                // ⚙️ أوامر الإعدادات
                case userMessage === '.اعدادات' || userMessage === '.settings':
                    await settingsCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                // ==============================
                // ⭐⭐⭐ السويتشات المضافة ⭐⭐⭐
                // ==============================

                // 📋 أوامر المجموعة
                case userMessage === '.المجموعة' || userMessage === '.groupinfo':
                    await groupInfoCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.الادمين' || userMessage === '.staff':
                    await staffCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.تغيير-اللينك' || userMessage === '.resetlink':
                    await resetlinkCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.تغيير-الاسم'):
                    const newName = userMessage.replace('.تغيير-الاسم', '').trim();
                    await setGroupName(sock, chatId, senderId, newName, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.تغيير-الوصف'):
                    const newDesc = userMessage.replace('.تغيير-الوصف', '').trim();
                    await setGroupDescription(sock, chatId, senderId, newDesc, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.تغيير-الصورة':
                    await setGroupPhoto(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                // 🎨 أوامر الوسائط المتقدمة
                case userMessage === '.ستيكر-تيليجرام' || userMessage === '.stickertelegram':
                    await stickerTelegramCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.قص-ستيكر' || userMessage === '.stickercrop':
                    await stickercropCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.نص-ملون') || userMessage.startsWith('.textmaker'):
                    const textMakerText = userMessage.replace('.نص-ملون', '').replace('.textmaker', '').trim();
                    if (textMakerText) {
                        await textmakerCommand(sock, chatId, message, textMakerText);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🎨 اكتب النص المراد تلوينه\nمثال: `.نص-ملون مرحبا`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage === '.ازالة-خلفية' || userMessage === '.removebg':
                    await removebgCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.تحسين' || userMessage === '.remini':
                    await reminiCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.عرض-مرة' || userMessage === '.viewonce':
                    await viewOnceCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.تغيير-pp' || userMessage === '.setpp':
                    await setProfilePicture(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.ضبابي' || userMessage === '.blur':
                    await blurCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                // 🌐 أوامر الإنترنت المتقدمة
                case userMessage.startsWith('.الطقس'):
                    const weatherLocation = userMessage.replace('.الطقس', '').trim();
                    if (weatherLocation) {
                        await weatherCommand(sock, chatId, message, weatherLocation);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🌤️ اكتب اسم المدينة\nمثال: `.الطقس القاهرة`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage === '.الاخبار' || userMessage === '.news':
                    await newsCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.كلمات'):
                    const songNameLyrics = userMessage.replace('.كلمات', '').trim();
                    if (songNameLyrics) {
                        await lyricsCommand(sock, chatId, message, songNameLyrics);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🎵 اكتب اسم الأغنية\nمثال: `.كلمات أحبك`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.جيثب'):
                    const githubUsername = userMessage.replace('.جيثب', '').trim();
                    if (githubUsername) {
                        await githubCommand(sock, chatId, message, githubUsername);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '💻 اكتب اسم مستخدم GitHub\nمثال: `.جيثب facebook`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.انستا'):
                    const instagramUrl = userMessage.replace('.انستجرام', '').trim();
                    if (instagramUrl) {
                        await instagramCommand(sock, chatId, message, instagramUrl);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '📷 اكتب رابط انستجرام\nمثال: `.انستجرام https://instagram.com/...`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.فيسبوك'):
                    const facebookUrl = userMessage.replace('.فيسبوك', '').trim();
                    if (facebookUrl) {
                        await facebookCommand(sock, chatId, message, facebookUrl);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '📘 اكتب رابط فيسبوك\nمثال: `.فيسبوك https://facebook.com/...`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.سكرين شوت'):
                    const ssUrl = userMessage.replace('.سكرين شوت', '').trim();
                    if (ssUrl) {
                        await handleSsCommand(sock, chatId, message, ssUrl);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '📸 اكتب الرابط\nمثال: `.سكرين شوت https://google.com`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.تيك '):
                    const tiktokUrl = userMessage.replace('.تيك توك', '').trim();
                    if (tiktokUrl) {
                        await tiktokCommand(sock, chatId, message, tiktokUrl);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🎵 اكتب رابط تيك توك\nمثال: `.تيك توك https://tiktok.com/...`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.تخفيض-رابط'):
                    const urlToShorten = userMessage.replace('.تخفيض-رابط', '').trim();
                    if (urlToShorten) {
                        await urlCommand(sock, chatId, message, urlToShorten);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🔗 اكتب الرابط\nمثال: `.تخفيض-رابط https://example.com`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.ig'):
                    const instagramStory = userMessage.replace('.انستا-ستوري', '').trim();
                    if (instagramStory) {
                        await igsCommand(sock, chatId, message, instagramStory);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '📱 اكتب اسم المستخدم\nمثال: `.انستا-ستوري username`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                case userMessage.startsWith('.تيك توك'):
                    const tiktokNoWatermark = userMessage.replace('.تيك توك-بدون', '').trim();
                    if (tiktokNoWatermark) {
                        await takeCommand(sock, chatId, message, tiktokNoWatermark);
                    } else {
                        await sock.sendMessage(chatId, { 
                            text: '🎬 اكتب رابط تيك توك\nمثال: `.تيك توك-بدون https://tiktok.com/...`'
                        }, { quoted: message });
                    }
                    commandExecuted = true;
                    break;

                // 🎭 أوامر ترفيهية إضافية
                case userMessage === '.غبي' || userMessage === '.stupid':
                    await stupidCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.تصبح-عخير' || userMessage === '.goodnight':
                    await goodnightCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.ورد' || userMessage === '.roseday':
                    await rosedayCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.مات' || userMessage === '.wasted':
                    await wastedCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.بلدان' || userMessage === '.pies':
                    await piesCommand(sock, chatId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.حب' || userMessage === '.heart':
                    await handleHeart(sock, chatId, message);
                    commandExecuted = true;
                    break;

                // 🧹 أوامر التنظيف
                case userMessage === '.مسح-مؤقت' || userMessage === '.cleartmp':
                    await clearTmpCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                case userMessage === '.مسح-سيشن' || userMessage === '.clearsession':
                    await clearSessionCommand(sock, chatId, senderId, message);
                    commandExecuted = true;
                    break;

                default:
                    const command = userMessage.split(' ')[0];
                    
                    if (command.length > 1) {
                        const randomEmoji = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
                        
                        await sock.sendMessage(chatId, {
                            react: {
                                text: randomEmoji,
                                key: message.key
                            }
                        });
                    }
                    break;
            }

            if (commandExecuted && handleAutotypingForCommand) {
                await handleAutotypingForCommand(sock, chatId, userMessage);
            }
            return;
        }

        if (handleAutotypingForMessage) {
            await handleAutotypingForMessage(sock, chatId, userMessage);
        }

    } catch (error) {
        console.error('❌ خطأ في معالجة الرسالة:', error);
    }
}

// ==============================
// ⭐⭐⭐ معالجة تحديثات المجموعة ⭐⭐⭐
// ==============================

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        if (!id.endsWith('@g.us')) return;

        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }
        
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
        
        console.log(`👥 حدث مجموعة: ${action} في ${id}`);
        
    } catch (error) {
        console.error('❌ خطأ في معالجة تحديث المجموعة:', error);
    }
}

// ==============================
// ⭐⭐⭐ تنظيف الألعاب النشطة ⭐⭐⭐
// ==============================

setInterval(() => {
    const now = Date.now();
    Object.keys(global).forEach(key => {
        if (key.endsWith('Game') && typeof global[key] === 'object') {
            Object.keys(global[key]).forEach(chatId => {
                const game = global[key][chatId];
                if (game?.timestamp && now - game.timestamp > 10 * 60 * 1000) {
                    delete global[key][chatId];
                    console.log(`🧹 تنظيف ${key} في ${chatId}`);
                }
            });
        }
    });
}, 10 * 60 * 1000);

// ==============================
// ⭐⭐⭐ التصديرات ⭐⭐⭐
// ==============================

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatusUpdate
};
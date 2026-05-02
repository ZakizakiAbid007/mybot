import axios from 'axios';
const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    generateWAMessageContent,
    getDevice
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text, usedPrefix, command }) => {
    // -------------------- 👑 [ متغيرات مخصصة لملك المهرجانات ] --------------------
    const avatar = 'https://qu.ax/XKFEL.jpg'; // صورة مصغرة
    const dev = 'تنغن ملك المهرجانات'; // اسم المطور/البوت المخصص
    const redes = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'; // رابط قناتك الرسمية
    // -------------------------------------------------------------------

    // ⛔ رسالة تنبيه عند عدم إدخال نص
    if (!text) {
        return conn.reply(message.chat, `🔥 **أَيْـنَ الْـوَصْـفُ يَا بَطَل؟** 🔥
👑 *الرجاء إدخال نص للبحث عن انفجارات تيك توك.*
*مثال:* ${usedPrefix + command} انفجارات حماسية
        `, message);
    }

    // 🎥 وظيفة لتوليد رسالة الفيديو
    async function createVideoMessage(url) {
        // ⚠️ تحقق صارم من أن الرابط موجود وصحيح قبل محاولة التحميل
        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            throw new Error("رابط الفيديو غير صالح أو مفقود.");
        }
        const { videoMessage } = await generateWAMessageContent({
            video: { url }
        }, {
            upload: conn.waUploadToServer
        });
        return videoMessage;
    }

    // 🔀 وظيفة لخلط النتائج (لزيادة الإثارة)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    try {
        // ⏳ رسالة انتظار متهورة ومزخرفة
        conn.reply(message.chat, '⌛ *جاري إطلاق قـنـابـل الـبـحـث في تيك توك! جهّز نفسك للانفجار البصري...*', message, {
            contextInfo: { 
                externalAdReply: { 
                    mediaUrl: null, 
                    mediaType: 1, 
                    showAdAttribution: true,
                    title: '💥👑 تَـنْـزِيـلَاتُ الـمَـهْـرَجَـانِ 👑💥', 
                    body: dev,
                    previewType: 0, 
                    thumbnail: avatar,
                    sourceUrl: redes 
                }
            }
        });

        let results = [];
        let { data } = await axios.get("https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=" + text);
        let searchResults = data.data;
        
        if (!searchResults || searchResults.length === 0) {
            return conn.reply(message.chat, '❌ *لا توجد نتائج!* 💥 لم نجد انفجارات تطابق وصفك.', message);
        }
        
        // 🔀 خلط النتائج قبل اختيار الأفضل
        shuffleArray(searchResults);
        let topResults = searchResults.splice(0, 7);
        let validCards = [];

        // 🖼️ تجهيز كل شريحة (Card) في الكاروسيل
        for (let result of topResults) {
            try {
                // ⚠️ تحقق من الرابط قبل محاولة إنشاء الرسالة
                if (!result.nowm) continue; 
                
                validCards.push({
                    body: proto.Message.InteractiveMessage.Body.fromObject({ text: `*لـلـبـحـث عـنـوان:* ${result.title}` }), 
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `🎶 بـوت تـنـغـن لـلـمـهـرجـانـات 👑` }), 
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: '🔥 ' + result.title.substring(0, 20) + '...', 
                        hasMediaAttachment: true,
                        videoMessage: await createVideoMessage(result.nowm) // إرسال الفيديو بدون علامة مائية
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
                });
            } catch (cardError) {
                // تجاهل أي فيديو يسبب خطأ والمتابعة للفيديو التالي
                console.error(`⚠️ خطأ في معالجة بطاقة فيديو: ${cardError.message}`);
                continue;
            }
        }
        
        // ⚠️ التحقق النهائي: إذا كانت جميع البطاقات غير صالحة
        if (validCards.length === 0) {
            return conn.reply(message.chat, '❌ *لا توجد فيديوهات صالحة!* 💥 لم نتمكن من جلب أي روابط سليمة.', message);
        }

        // 📧 إرسال رسالة الكاروسيل
        const messageContent = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `💥 **انفجار النتائج يا بطل!** 💥\n\n*الـبـحـث عـن:* «${text}»\n\nاسحب لليمين لرؤية فيديوهات المهرجان. (النتائج الصالحة: ${validCards.length})` 
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: `👑 ${dev} | الـمـلـك يـقـدم الإثـارة!`
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...validCards] // إرسال البطاقات الصالحة فقط
                        })
                    })
                }
            }
        }, {
            quoted: message
        });

        await conn.relayMessage(message.chat, messageContent.message, {
            messageId: messageContent.key.id
        });
    } catch (error) {
        console.error(error);
        // 🚨 رسالة الخطأ الآن ستعكس مشكلة التحقق من الرابط في حال الفشل المبكر
        conn.reply(message.chat, `🚨 *خَـطَـأٌ مُـدَمِّـرٌ!* 💥 فشلت محاولة إطلاق نتائج تيك توك. \n\n*السبب:* ${error.message}`, message); 
    }
};

handler.help = ["tiktoksearch <نص>"]; 
handler.register = true;
handler.group = true;
handler.tags = ["بحث", "فيديو", "مهرجان"]; 
handler.command = ["tiktoksearch", "توك", "تيك", "بحث_تيك_توك", "تيك_توك_بحث", "تيكتوك"]; 

export default handler;
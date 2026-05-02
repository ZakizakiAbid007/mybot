import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';

// 👑 بيانات الملك تنغن 👑
const DEVELOPER_CONTACT_JID = '212706595340@s.whatsapp.net'; // الرقم المستخدم لاستقبال رسائل التقييم
const TENGEN_NUMBER = '212627416260'; // الرقم الآخر المسجل للملك تنغن

const handler = async (message, { conn, text, usedPrefix }) => { 
    const deviceType = await getDevice(message.key.id);

    if (deviceType !== "desktop" && deviceType !== "web") {
        const mediaMessage = await prepareWAMessageMedia({
            image: { url: "https://i.postimg.cc/cLd4h99Q/1ec6d4d9d187860bebecd5655c2130a7.jpg" }
        }, { upload: conn.waUploadToServer });

        const interactiveContent = {
            body: { text: '' },
            footer: { text: "يمكنك إستخدامه عبر الاختيار من الاسفل\n*─[TENGEN вσт]*🌟✨" },
            header: {
                title: "مرحبا يا ملك 👋 أتمنى أنك بخير ♥️\nالان يمكنك تقييم البوت لكي يتحسن اكثر",
                subtitle: "خـلــيك صـــادق فــي تــقــيــمـك يا اسطورة ❤️🥹\n\n\n\n.",
                hasMediaAttachment: true,
                imageMessage: mediaMessage.imageMessage
            },
            nativeFlowMessage: {
                buttons: [
                    { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"⭐\",\"id\":\".قيم 1\"}" },
                    { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"⭐⭐\",\"id\":\".قيم 2\"}" },
                    { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"⭐⭐⭐\",\"id\":\".قيم 3\"}" },
                    { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"⭐⭐⭐⭐\",\"id\":\".قيم 4\"}" },
                    { name: "quick_reply", buttonParamsJson: "{\"display_text\":\"⭐⭐⭐⭐⭐\",\"id\":\".قيم 5\"}" }
                ],
                messageParamsJson: ''
            }
        };

        let waMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: { message: { interactiveMessage: interactiveContent } }
        }, {
            userJid: conn.user.jid,
            quoted: message
        });

        conn.relayMessage(message.chat, waMessage.message, { messageId: waMessage.key.id });
    } else {
        conn.sendFile(message.chat, "JoAnimi•Error.jpg", message);
    }
};

// دالة إرسال الرد بعد التقييم
const sendFeedbackResponse = async (stars, m, conn) => {
    let feedbackMessage = '';
    // استخدام المتغير المعرف في الأعلى
    let developerContact = DEVELOPER_CONTACT_JID; 

    switch (stars) {
        case 1:
            feedbackMessage = '*👑 تقييم بنجمة واحدة 👑*\n\n*⚠️ يا لهول المفاجأة! هذا التقييم يحفزنا على الاجتهاد الفوري! سنراجع أخطاء العرش ونحسنها لتليق بمقامك يا ملكنا. ⚔️*';
            break;
        case 2:
            feedbackMessage = '*👑 تقييم بنجمتين 👑*\n\n*🔥 هذا التقييم يحفزنا على زيادة الإنتاج! سنبذل جهدًا مضاعفًا لنحقق الرضا الكامل لملك المهرجانات. 🛡️*';
            break;
        case 3:
            feedbackMessage = '*👑 تقييم بثلاث نجوم 👑*\n\n*✨ تقييمك الجيد يحفزنا على المزيد من الإبداع! نشكرك على دعمك، والكمال هو هدفنا القادم! 🌟*';
            break;
        case 4:
            feedbackMessage = '*👑 تقييم بأربع نجوم 👑*\n\n*🎉 تقييمك الماسي يحفزنا على التميز الدائم! أنت بالفعل أسطورة في مملكة تنغن، وشكراً على الثقة! 💪*';
            break;
        case 5:
            feedbackMessage = '*👑 تقييم بخمس نجوم 👑*\n\n*🚀 تقييمك الأسطوري هو وقودنا! هذا الدعم يحفزنا على الاجتهاد لندرة مثيل له! أنت الأفضل على الإطلاق! ❤️*';
            break;
        default:
            feedbackMessage = '*❌ خطأ في التقييم الملكي ❌*\n\n*👑 سيدي الملك، من فضلك اختر عدد النجوم بدقة من 1 حتى 5! 😅*';
            break;
    }

    let developerMessage = `*❒═[تم استلام تقييم للبوت]═❒*\n\n*❒ التقييم: [ ${stars} نجوم ]*\n*❒ بواسطة: [ +${m.sender.split`@`[0]} ]*\n\n*❒ نأمل أن نكون عند حسن ظنك.*`;

    try {
        await conn.sendMessage(developerContact, { text: developerMessage }, { quoted: m });
    } catch (error) {
        console.error("❌ فشل إرسال التقييم للمطور:", error);
    }

    m.reply(feedbackMessage + `\n\n*للتواصل مع المطور (رقم ${developerContact.split('@')[0]}):* wa.me/${developerContact.split('@')[0]}\n*للتواصل مع الملك تنغن (رقم ${TENGEN_NUMBER}):* wa.me/${TENGEN_NUMBER}`);
};

handler.customPrefix = /.تقيم/i; 
handler.command = new RegExp();

export default handler;
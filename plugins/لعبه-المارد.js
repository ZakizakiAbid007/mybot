import axios from "axios";
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

const api_obito = "https://mr-obito-api.vercel.app/api";

let handler = async function (m, { text, conn }) {
    // 👑 لا حاجة لتعليمات كثيرة، فقط التنفيذ
    if (!conn.aki) conn.aki = {};
    const sessionKey = `${m.chat}-${m.sender}`;
    const session = conn.aki[sessionKey];

    // القائمة الأولى (بدون نص زائد)
    if (!text) {
        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({ display_text: "📘 المساعدة", id: ".مارد المساعدة" }),
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({ display_text: "🎮 بدء اللـعبة", id: ".مارد ابدا" }),
            },
        ];

        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: "👑 مرحباً بك يا ملك! هل أنت مستعد لتحدي المارد؟",
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: "اختر خيارك لتنطلق ⇊",
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                hasMediaAttachment: false,
                                // تم تثبيت العنوان ليتوافق مع لعبة تنغن/المارد
                                title: "لعبة المارد الأزرق | تنغن 👑",
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons,
                            }),
                        }),
                    },
                },
            },
            {}
        );

        return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    // شرح المساعدة (مبسط)
    if (text === "المساعدة") {
        return m.reply(`*👑 أوامر لعبة المارد 🧞*:\n\n*-.مارد ابدا* → بدء اللعبة\n*-.مارد حذف* → حذف الجلسة\n*-.مارد رجوع* → خطوة للخلف\n*الإجابات:* نعم، لا، ربما، ربما لا، لا أعرف`);
    }

    // بدء اللعبة
    if (text === "ابدا") {
        try {
            const { data } = await axios.post(`${api_obito}/akinator_start`);
            if (!data.session || !data.signature) return m.reply("❌ فشل بدء الجلسة.");

            conn.aki[sessionKey] = {
                session: data.session,
                signature: data.signature,
                step: 0,
                progression: 0,
            };

            return sendQuestion(m.chat, data.question, data.akitude_url || null, m);
        } catch (err) {
            console.error(err);
            return m.reply("❌ حدث خطأ أثناء بدء اللعبة");
        }
    }

    // حذف الجلسة
    if (text === "حذف") {
        if (!session) return m.reply("❌ لا توجد جلسة نشطة.");
        delete conn.aki[sessionKey];
        return m.reply("✅ تم حذف الجلسة بنجاح.");
    }

    // الرجوع
    if (text === "رجوع") {
        if (!session) return m.reply("❌ لا توجد جلسة نشطة.");
        try {
            const { data } = await axios.post(`${api_obito}/akinator_back`, {
                session: session.session,
                signature: session.signature,
                step: session.step,
                progression: session.progression,
                cm: "false",
            });

            conn.aki[sessionKey].step = data.step;
            conn.aki[sessionKey].progression = data.progression;

            return sendQuestion(m.chat, data.question, data.akitude_url || null, m);
        } catch (err) {
            console.error(err);
            return m.reply("❌ لا يمكن الرجوع حالياً.");
        }
    }

    // الإجابات
    const answers = { "نعم": 0, "لا": 1, "لا أعرف": 2, "ربما": 3, "ربما لا": 4 };
    if (answers.hasOwnProperty(text)) {
        if (!session) return m.reply("❌ لا توجد جلسة نشطة. ابدأ بـ *.مارد ابدا*");

        try {
            const { data } = await axios.post(`${api_obito}/akinator_answer`, {
                session: session.session,
                signature: session.signature,
                step: session.step,
                progression: session.progression,
                answer: answers[text],
                cm: "false",
                sid: "NaN",
                question_filter: "string",
            });

            if (data.name_proposition) {
                delete conn.aki[sessionKey];
                // رسالة النتيجة النهائية
                return conn.sendMessage(
                    m.chat,
                    {
                        image: { url: data.photo },
                        caption: `*🧞 تخميني هو:*\n*${data.name_proposition}*\n${data.description_proposition || ""}`,
                    },
                    { quoted: m }
                );
            }

            conn.aki[sessionKey].step = data.step;
            conn.aki[sessionKey].progression = data.progression;

            return sendQuestion(m.chat, data.question, data.akitude_url || null, m);
        } catch (err) {
            console.error(err);
            return m.reply("❌ حدث خطأ أثناء الإجابة");
        }
    }

    // الدالة الخاصة بإرسال السؤال مع الأزرار (تم تبسيط الأزرار والنصوص)
    async function sendQuestion(jid, question, imgUrl, quoted) {
        try {
            const buttons = [
                // 💡 أزرار مبسطة وأنيقة
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "نـعـم ✅", id: ".مارد نعم" }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "لا ❌", id: ".مارد لا" }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "لا أعرف 🤔", id: ".مارد لا أعرف" }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "ربـمـا 🤷‍♂️", id: ".مارد ربما" }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "ربـمـا لا 👎", id: ".مارد ربما لا" }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "رجَـوع ↩️", id: ".مارد رجوع" }) },
                { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "إنهاء 🛑", id: ".مارد حذف" }) },
            ];

            const media = imgUrl
                ? await prepareWAMessageMedia({ image: { url: imgUrl } }, { upload: conn.waUploadToServer })
                : null;
            
            // 👑 العنوان الجديد الذي يشتمل على اسمك الملكي
            const headerTitle = "لـعـبـة المـارد | KING TENGAN 👑";

            const msg = generateWAMessageFromContent(
                jid,
                {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    // تبسيط النص
                                    text: `*🧞 السؤال ${session.step + 1}*:\n${question}`,
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: "جـاري الـتـخـمـين... اختر الإجابة ⇊",
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    ...(media ? { hasMediaAttachment: true, ...media } : { hasMediaAttachment: false }),
                                    title: headerTitle, 
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons,
                                }),
                            }),
                        },
                    },
                },
                {}
            );

            return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
        } catch (e) {
            console.error(e);
            return conn.sendMessage(jid, { text: question }, { quoted });
        }
    }
};

handler.command = /^مارد$/i;
export default handler;
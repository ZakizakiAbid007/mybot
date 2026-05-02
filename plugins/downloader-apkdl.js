import fs from 'fs';
import fetch from 'node-fetch';

let apkSession = new Map();

// تعريف الأوامر التي سيستخدمها المستخدم
let handler = async (m, { conn, text, usedPrefix, command }) => {
    // تبسيط الأوامر للاستخدام السهل
    switch (command) {
        case 'تطبيق':
        case 'apk':
            await handleSearch(m, { conn, text, usedPrefix, command });
            break;

        case 'تنزيل_apk': // يُستخدم هذا الأمر داخليًا عند النقر على الزر
            await handleDownload(m, { conn, usedPrefix });
            break;

        default:
            // في حالة عدم تطابق أي أمر، لن نفعل شيئًا (عادة ما يتم معالجتها خارج هذا الملف)
            break;
    }
};

// **1. دالة معالجة البحث (الأمر: تطبيق / apk)**
const handleSearch = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(
            m.chat,
            {
                text: `❗ أدخل اسم التطبيق للبحث.\n\n💚 مثال:\n${usedPrefix}${command} واتساب`
            },
            { quoted: m }
        );
    }

    try {
        await m.react('🔍');

        // البحث في API
        const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
        const data = await response.json();
        if (!data.status || !data.data) throw new Error("لم يتم العثور على التطبيق.");

        const app = data.data;
        // حفظ بيانات التطبيق في الجلسة لاستخدامها عند التنزيل
        apkSession.set(m.chat, { app });

        // بناء وصف التطبيق باللغة العربية
        let description = `✅ *تم العثور على التطبيق:*

🍧 *الاسم:* ${app.name}
🌱 *المطور:* ${app.developer}
📦 *الحزمة (ID):* ${app.id}
⚙️ *الحجم:* ${app.size}
⭐ *التقييم:* ${app.stats?.rating?.average || "N/A"} (${app.stats?.rating?.total || 0} تصويت)
⚽ *عمليات التنزيل:* ${app.stats?.downloads?.toLocaleString() || "N/A"}
🏪 *المتجر:* ${app.store?.name || "غير معروف"}`;

        const buttons = [
            {
                // تغيير الـ buttonId إلى الأمر الجديد بالعربية (تنزيل_apk)
                buttonId: `${usedPrefix}تنزيل_apk`,
                buttonText: { displayText: "⬇️ اضغط للتنزيل" },
                type: 1
            }
        ];

        await m.react('✅');
        await conn.sendMessage(
            m.chat,
            {
                image: { url: app.image },
                caption: description.trim(),
                buttons,
                footer: "ملاحظة: اضغط على الزر أعلاه لبدء التنزيل.",
                viewOnce: true
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("Error:", error);
        await m.react('❌');

        await conn.sendMessage(
            m.chat,
            { text: `❌ حدث خطأ: ${error.message || "خطأ غير معروف"}` },
            { quoted: m }
        );
    }
};

// **2. دالة معالجة التنزيل (الأمر: تنزيل_apk)**
const handleDownload = async (m, { conn, usedPrefix }) => {
    let session = apkSession.get(m.chat);
    if (!session) {
        return conn.sendMessage(
            m.chat,
            { text: `❗ لا توجد جلسة نشطة. استخدم ${usedPrefix}تطبيق <اسم التطبيق> أولاً.` },
            { quoted: m }
        );
    }

    let { app } = session;
    const downloadUrl = app.download;

    try {
        await m.react('⌛');

        // إرسال الملف كمستند (APK)
        await conn.sendMessage(
            m.chat,
            {
                document: { url: downloadUrl },
                fileName: `${app.name}.apk`,
                mimetype: 'application/vnd.android.package-archive', // نوع MIME لملفات APK
                caption: `✅ تم تجهيز ملف ${app.name}.apk.`,
                contextInfo: {
                    externalAdReply: {
                        title: "🎉 ملف APK جاهز للتنزيل",
                        body: "انقر على المستند أعلاه لبدء التثبيت.",
                        sourceUrl: app.store?.avatar || null,
                        thumbnailUrl: app.image,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: m }
        );

        await m.react('☑️');

        // مسح الجلسة بعد التنزيل
        apkSession.delete(m.chat);

    } catch (err) {
        console.error("Error en descarga:", err);
        await m.react('❌');

        await conn.sendMessage(
            m.chat,
            { text: `❌ لم نتمكن من تنزيل الملف حاليًا.` },
            { quoted: m }
        );
    }
};

// تعريف الأوامر الرسمية
handler.tags = ['تنزيلات'];
handler.help = ['تطبيق', 'apk'];
handler.command = ['تطبيق', 'apk', 'تنزيل_apk']; // تنزيل_apk للاستخدام الداخلي عبر الزر

export default handler;
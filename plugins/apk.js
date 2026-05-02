// File: ./commands/apk.js
const fetch = require('node-fetch');

/**
 * 📲 أمر البحث عن تطبيقات APK وتحميلها وإرسالها مباشرة.
 */
async function apkCommand(sock, chatId, senderId, userMessage, message) {

    const commandRegex = /^(\.تطبيق|\.apk|\.بحث_تطبيق)\s*/;
    const appName = userMessage.replace(commandRegex, '').trim();

    if (!appName) {
        let usage = `*يرجى كتابة اسم التطبيق الذي تريد البحث عنه!*\n\n*مثال:*\n➤ .تطبيق Free Fire\n➤ .تطبيق WhatsApp`;
        return sock.sendMessage(chatId, { text: usage }, { quoted: message });
    }

    let statusMsg = await sock.sendMessage(chatId, { text: '⏳ جاري البحث عن التطبيق...' }, { quoted: message });

    try {
        // 1. البحث عن التطبيق وجلب الرابط
        const searchApiUrl = `https://api-streamline.vercel.app/dlapk?search=${encodeURIComponent(appName)}`;
        const searchResponse = await fetch(searchApiUrl);
        
        if (!searchResponse.ok) throw new Error(`HTTP error! status: ${searchResponse.status}`);
        
        const data = await searchResponse.json();
        
        if (!data || !data.id) {
            await sock.sendMessage(chatId, { text: '❌ لم يتم العثور على التطبيق 😔' }, { quoted: message });
            return sock.chatModify({ delete: statusMsg.key }, chatId, []);
        }

        let { name, file, icon, version, developer } = data;
        const downloadUrl = file.path;
        const fileSizeText = file.size || "غير متوفر";
        
        // 2. تحديث الرسالة للإشارة إلى بدء التحميل
        await sock.sendMessage(chatId, { 
            text: `✅ تم العثور على التطبيق: *${name}*\n\n⏳ جارٍ تحميل الملف (${fileSizeText})... قد تستغرق هذه العملية بعض الوقت.` 
        }, { edit: statusMsg.key });

        // 3. جلب ملف APK كـ Buffer
        const apkResponse = await fetch(downloadUrl);
        if (!apkResponse.ok) throw new Error(`فشل جلب ملف APK: ${apkResponse.statusText}`);

        // تحذير: إذا كان حجم الملف كبيرًا جداً، قد يتسبب في استهلاك الذاكرة أو فشل الرفع في واتساب.
        const MAX_SIZE_MB = 100; // حد حجم الملف (قابل للتعديل)
        const contentLength = apkResponse.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_SIZE_MB * 1024 * 1024) {
             return sock.sendMessage(chatId, { text: `❌ حجم التطبيق أكبر من الحد المسموح به (${MAX_SIZE_MB}MB). إليك الرابط المباشر بدلاً من ذلك:\n${downloadUrl}` }, { quoted: message });
        }
        
        const apkBuffer = await apkResponse.buffer();

        // 4. إرسال الملف كـ Document
        const fileName = `${name}_v${version || 'latest'}_MikoBot.apk`;
        const captionText = `
*✅ تم التحميل بنجاح!*
*📱 التطبيق:* ${name}
*⚙️ الإصدار:* ${version || "غير محدد"}
*💾 الحجم:* ${fileSizeText}
*🔗 رابط الموثوق (للتأكد):* ${downloadUrl}
        `;

        await sock.sendMessage(chatId, {
            document: apkBuffer,
            fileName: fileName,
            mimetype: 'application/vnd.android.package-archive',
            caption: captionText
        }, { quoted: message });
        
        // حذف رسالة الحالة
        await sock.chatModify({ delete: statusMsg.key }, chatId, []);


    } catch (error) {
        console.error("⚠️ حدث خطأ أثناء البحث أو التحميل:", error);
        await sock.sendMessage(chatId, { text: "🚨 عذرًا، حدث خطأ أثناء تنفيذ الطلب. قد تكون المشكلة بسبب حجم الملف الكبير جدًا أو مشكلة في الرابط." }, { quoted: message });
        // محاولة حذف رسالة الحالة إذا كانت لا تزال موجودة
        try {
            await sock.chatModify({ delete: statusMsg.key }, chatId, []);
        } catch {}
    }
}

module.exports = apkCommand;
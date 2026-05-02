// الكود للملك تنغن 👑 - أمر البث للمجموعات فقط (BCGC)

const handler = async (m, {conn, isROwner, text}) => {
    // دالة التأخير
    const delay = (time) => new Promise((res) => setTimeout(res, time));
    
    // جلب جميع المجموعات التي يشارك فيها البوت
    const getGroups = await conn.groupFetchAllParticipating();
    const groups = Object.entries(getGroups).slice(0).map((entry) => entry[1]);
    const anu = groups.map((v) => v.id);
    
    // تحديد نص الرسالة (من الاقتباس أو النص المباشر)
    const pesan = m.quoted && m.quoted.text ? m.quoted.text : text;
    
    // التحقق من وجود النص
    if (!pesan) throw '🚩 *أمر ملكي!* يجب أن تحدد النص الذي تود بثه للمجموعات.';
    
    // رسالة البداية (تم حذفها من الكود الأصلي لكنها مفيدة)
    // m.reply(`🍟 *𝖬𝖾𝗇𝗌𝖺𝗃𝖾 𝖤𝗇𝗏𝗂𝖺𝖽𝗈 𝖠:* ${anu.length} *Grupo/S*`)
    
    // حلقة البث
    for (const i of anu) {
        await delay(500); // تأخير 500 مللي ثانية بين كل مجموعة
        
        // إرسال الرسالة باستخدام تنسيق الموقع الحي (Live Location Message)
        conn.relayMessage(i,
            {liveLocationMessage: {
                // إحداثيات موقع مزيفة
                degreesLatitude: 35.685506276233525, 
                degreesLongitude: 139.75270667105852,
                accuracyInMeters: 0,
                degreesClockwiseFromMagneticNorth: 2,
                
                // النص الملكي
                caption: `⭐️ *مَـرْسُومٌ مَـلَكِـي* 👑
                
                ${pesan}\n\n*الـقَـائـد:* ${global.packname || 'البوت'}`,
                
                sequenceNumber: 2,
                timeOffset: 3,
                contextInfo: m,
            }}, {}).catch((_) => _); // يتجاهل الأخطاء للمجموعات غير المتاحة
    }
    
    // رسالة التلخيص
    m.reply(`👑 *تم إطلاق البث الملكي بنجاح!*
🍟 *الرسالة أُرسلت إلى:* ${anu.length} *مجموعة*`);
};

handler.help = ['بث_المجموعات'];
handler.tags = ['ملك'];
handler.command = ['bcgc', 'broadcastgroup', 'بث_المجموعات'];
handler.owner = true;

export default handler;
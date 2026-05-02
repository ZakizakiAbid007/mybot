const handler = async (m, {conn, text, participants, isAdmin, isOwner, usedPrefix, command}) => {
    // 🚩 ملاحظة: يجب تعريف المتغير 'imagen1' في ملف الإعدادات العامة (config) ليعمل الرد بـ productMessage
    // const imagen1 = global.imagen1 // يجب أن يكون هكذا
    
    // جلب قائمة معرفات المستخدمين (في حال الرغبة في منشنتهم)
    const users = participants.map((u) => u.id).filter((v) => v !== conn.user.jid);
    
    // جلب قائمة المجموعات النشطة التي لا تحتوي على قيود (مثل القراءة فقط)
    const groups = Object.entries(conn.chats)
        .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce)
        .map((v) => v[0]);
    
    // إنشاء رسالة المنتج الوهمية (Fake Product Message)
    const fproducto = {
        key: {
            fromMe: false, 
            participant: `0@s.whatsapp.net`, 
            ...(false ? {remoteJid: '17608914335@s.whatsapp.net'} : {})
        }, 
        message: {
            'productMessage': {
                'product': {
                    'productImage': {
                        'mimetype': 'image/jpeg', 
                        'jpegThumbnail': imagen1 // يجب تعريف هذا المتغير
                    }, 
                    'title': `📢 إعــــلان عــــام`, // عنوان المنتج
                    'description': 'Yotsuba-Nakano-MD', // وصف المنتج
                    'currencyCode': 'USD', 
                    'priceAmount1000': '1000000000', 
                    'retailerId': 'Ghost', 
                    'productImageCount': 1
                }, 
                'businessOwnerJid': `0@s.whatsapp.net`
            }
        }
    };
    
    // 🚩 التحقق من الرد على رسالة
    if (!m.quoted) throw `*الرجاء الرد على رسالة ما* باستخدام الأمر *${usedPrefix + command}* لإرسال الإشعار.`;
    
    // 🚀 إرسال الرسالة لكل مجموعة
    for (const id of groups) {
        // إرسال الرسالة المقتبسة كرسالة مُعاد توجيهها، مع منشنة أعضاء المجموعة
        await conn.sendMessage(id, 
            {
                forward: m.quoted.fakeObj, 
                mentions: (await conn.groupMetadata(`${id}`)).participants.map((v) => v.id)
            }, 
            {quoted: fproducto}); // استخدام رسالة المنتج الوهمية كإقتباس
    }
    
    // رسالة التأكيد النهائية
    m.reply(`*🛑 تم إرسال الإعلان إلى ${groups.length} مجموعة/مجموعات*\n\n*ملاحظة: قد يكون هناك بعض الأخطاء في هذا الأمر ولا يتم الإرسال إلى جميع المجموعات. نعتذر عن أي إزعاج.*`);
};

handler.help = ['بث_مجموعات_2'];
handler.tags = ['المالك'];
handler.command = ['bcgc2', 'اعلان', 'اعلان_مجموعات_2']; // إضافة الأوامر العربية
handler.owner = true; // حصرياً لمالك البوت

export default handler;
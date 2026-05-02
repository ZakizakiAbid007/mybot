import { getUserData, updateUserData, saveUserName } from './بنك.js';

let handler = async (m, { conn, usedPrefix, text }) => {
    try {
        const senderId = m.sender;
        const userName = await conn.getName(senderId);
        
        // حفظ اسم المستخدم
        saveUserName(senderId, userName);
        
        const userData = getUserData(senderId);
        
        if (!text) {
            return await conn.sendMessage(m.chat, { 
                text: `❌ يرجى إدخال مبلغ للإيداع!\n\n💡 *الأمثلة:*
${usedPrefix}إيداع 1000
${usedPrefix}إيداع كلشي - لإيداع كل ما تملك
${usedPrefix}إيداع نصف - لإيداع النصف

💵 *رصيدك الحالي:* ${(userData.exp || 0).toLocaleString()} دولار`
            }, { quoted: m });
        }

        let depositAmount;
        
        if (text.toLowerCase() === 'كلشي' || text === 'الكل') {
            depositAmount = userData.exp || 0;
        } else if (text.toLowerCase() === 'نصف') {
            depositAmount = Math.floor((userData.exp || 0) / 2);
        } else {
            depositAmount = parseInt(text);
        }
        
        if (isNaN(depositAmount) || depositAmount <= 0) {
            return await m.reply('❌ يرجى إدخال مبلغ صحيح للإيداع!');
        }

        if (depositAmount > (userData.exp || 0)) {
            return await conn.sendMessage(m.chat, { 
                text: `❌ لا تملك نقود كافية للإيداع!\n\n💵 نقودك الحالية: ${(userData.exp || 0).toLocaleString()} دولار\n💰 المبلغ المطلوب: ${depositAmount.toLocaleString()} دولار`
            }, { quoted: m });
        }

        userData.exp = (userData.exp || 0) - depositAmount;
        userData.bank = (userData.bank || 0) + depositAmount;
        updateUserData(senderId, userData);

        await conn.sendMessage(m.chat, { 
            text: `✅ *تم الإيداع بنجاح!*\n\n💰 المبلغ المودع: ${depositAmount.toLocaleString()} دولار\n💳 الرصيد الجديد في البنك: ${userData.bank.toLocaleString()} دولار\n💵 النقود المتبقية: ${userData.exp.toLocaleString()} دولار`
        }, { quoted: m });

    } catch (error) {
        console.error('❌ خطأ في أمر الإيداع:', error);
        await m.reply('❌ حدث خطأ في عملية الإيداع. حاول مرة أخرى.');
    }
}

handler.help = ['إيداع [المبلغ]']
handler.tags = ['economy']
handler.command = /^(إيداع|ايداع|deposit)$/i
export default handler
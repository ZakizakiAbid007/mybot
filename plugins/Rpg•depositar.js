import db from '../lib/database.js'

let handler = async (m, { args }) => {
    let user = global.db.data.users[m.sender]
    
    // 1. التحقق من إدخال الكمية
    if (!args[0]) return m.reply('🚩 *الرجاء إدخال عدد 🍪 الكوكيز الذي تريد إيداعه.*');
    
    // 2. التحقق من أن الكمية أكبر من صفر
    if ((args[0]) < 1) return m.reply('🚩 *الرجاء إدخال كمية 🍪 كوكيز صالحة (أكبر من صفر).*');
    
    // 3. حالة إيداع الكل ('all')
    if (args[0] == 'all') {
        let count = parseInt(user.cookies)
        
        // التحقق من أن المستخدم لديه كوكيز أصلاً
        if (!user.cookies || count < 1) return m.reply('❌ *لا تملك أي 🍪 كوكيز في محفظتك لإيداعها.*');

        user.cookies -= count * 1 // خصم من المحفظة
        user.bank += count * 1   // إضافة إلى البنك
        
        await m.reply(`✅ *تم إيداع ${count} 🍪 كوكيز بنجاح في البنك.*`)
        return !0
    }
    
    // 4. التحقق من أن المدخل رقم
    if (!Number(args[0])) return m.reply('🚩 *يجب أن تكون الكمية التي أدخلتها رقماً.*')
    
    let count = parseInt(args[0])
    
    // 5. التحقق من وجود كوكيز في المحفظة
    if (!user.cookies || user.cookies < 1) return m.reply('❌ *لا تملك أي 🍪 كوكيز في محفظتك لإيداعها.*')
    
    // 6. التحقق من كفاية الرصيد
    if (user.cookies < count) return m.reply(`❌ *ليس لديك سوى ${user.cookies} 🍪 كوكيز في محفظتك. لا يمكنك إيداع هذا العدد.*`)
    
    // 7. تنفيذ الإيداع
    user.cookies -= count * 1 // خصم من المحفظة
    user.bank += count * 1   // إضافة إلى البنك
    
    await m.reply(`✅ *تم إيداع ${count} 🍪 كوكيز بنجاح في البنك.*`)}

handler.help = ['إيداع']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'dep', 'aguardar', 'إيداع', 'ايداع']
handler.register = true 
export default handler
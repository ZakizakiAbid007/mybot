// الكود للملك تنغن 👑
// لا تنسى الإشارة لمصدر الكود الأصلي
const handler = async (m, { conn }) => {
    // رابط المستودع الأصلي
    const repoLink = 'https://www.mediafire.com/file/dvlqqo4174xrmoy/bot_tengen.rar/file'

    // رابط قناتك الرسمية (بدلاً من مجموعة الدعم)
    const channelLink = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'

    const texto = `
*⚔️ أصول سلالة تنغن الملكية 👑*

\`\`\`مستودع الكود الرسمي:\`\`\`
${repoLink}

*إنتبه:* هذا هو المصدر، لا تتردد في السرقة أو التعديل، لكن أقر بالجميل! 😈
الخطوات:

فك ضغط الملف الخارجي.

ستجد بداخله مجلداً مضغوطاً آخر (أو ملف لا يحتوي على امتداد).

أعد تسميته وأضف .zip أو .rar في النهاية.

قم بفك ضغطه لتظهر لك ملفات البوت الرئيسية.
🔗 *القناة الرسمية للملك تنغن:*
${channelLink}
`.trim()

    await conn.reply(m.chat, texto, m)
}

handler.help = ['المصدر']
handler.tags = ['معلومات']
handler.command = ['script', 'المصدر', 'الكود_الأساسي']

export default handler
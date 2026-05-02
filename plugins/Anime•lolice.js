var handler = async (m, { conn, usedPrefix }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    
    conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/lolice', {
        avatar: await conn.profilePictureUrl(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    }), '', '🚨 *شرطة الأنمي* 🚨\n\n🎌 تم إنشاء صورة الشرطة بنجاح', m)
}

handler.help = ['lolice', 'شرطة', 'انميشرطة']
handler.tags = ['anime', 'أنمي']
handler.command = ['lolice', 'شرطة', 'انميشرطة']
export default handler
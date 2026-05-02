//código creado x The Carlos 👑
//no quiten créditos
let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.chat || !m.chat.endsWith('@g.us')) return false;

    let chat = global.db.data.chats[m.chat];
    if (!chat || !chat.autoAceptar) return false;

    if (isAdmin) return false;
    if (!isBotAdmin) return true;

    try {
        const pending = await conn.groupRequestParticipantsList(m.chat).catch(() => []);
        if (!Array.isArray(pending) || pending.length === 0) return false;

        // قائمة ببادئات أرقام الهواتف للدول العربية (رموز النداء الدولية)
        // تشمل: السعودية، مصر، الإمارات، الكويت، قطر، البحرين، عُمان، لبنان، الأردن، سوريا، العراق، فلسطين، اليمن، المغرب، الجزائر، تونس، ليبيا، السودان، الصومال، جيبوتي، موريتانيا، جزر القمر
        const arabPrefixes = [
            '966', '20', '971', '965', '974', '973', '968', '961', '962', '963', '964', '970', '967', 
            '212', '213', '216', '218', '249', '252', '253', '222', '269'
        ];

        const filtered = pending.filter(p =>
            p && typeof p.jid === 'string' &&
            p.jid.endsWith('@s.whatsapp.net') &&
            // التحقق مما إذا كان الرقم يبدأ بأي من البادئات العربية
            arabPrefixes.some(prefix => p.jid.split('@')[0].startsWith(prefix))
        );

        for (const user of filtered) {
            await conn.groupRequestParticipantsUpdate(m.chat, [user.jid], 'approve');
            console.log(`Solicitud aprobada: ${user.jid}`);
        }

        if (m.messageStubType === 172 && Array.isArray(m.messageStubParameters)) {
            for (const jid of m.messageStubParameters) {
                if (typeof jid === 'string' && jid.endsWith('@s.whatsapp.net') &&
                    // التحقق مما إذا كان الرقم يبدأ بأي من البادئات العربية
                    arabPrefixes.some(prefix => jid.split('@')[0].startsWith(prefix))) {
                    await conn.groupRequestParticipantsUpdate(m.chat, [jid], 'approve');
                    console.log(`Solicitud aprobada por evento: ${jid}`);
                }
            }
        }
    } catch (err) {
        console.error('Error aprobando solicitudes:', err);
    }

    return false;
};

export default handler;
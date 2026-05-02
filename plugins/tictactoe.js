// اكس_او_بدء.js
let handler = async (m, { conn, text, command, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {};
    if (Object.values(conn.game).some(v => v.id == m.chat)) {
        throw '❌ *لا يمكنك بدء لعبة جديدة!* هناك لعبة قيد التشغيل بالفعل في هذه الدردشة. يمكنك إنهاؤها باستخدام الأمر: *.إنهاء_اللعبة*';
    }

    let opponent = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    
    if (!opponent) {
        throw `*⚠️ من فضلك أشر/تاغ لشخص آخر* لبدء لعبة إكس أو معه. مثال:\n${usedPrefix}${command} @منشن`;
    }

    if (opponent === m.sender) {
        throw '*🤦 لا يمكنك اللعب ضد نفسك!* أشر/تاغ لشخص آخر.';
    }

    let _opponent = conn.getName(opponent);
    let _player = conn.getName(m.sender);

    let rows = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let grid = rows.map(v => {
        return '⬜'.repeat(3) + '\n'
    }).join('');

    let text_start = `
*❌⭕ بـدء لـعـبـة إكـس أو ⭕❌*

اللاعبان:
👤 **${_player}** (X)
🆚 **${_opponent}** (O)

*دور اللاعب (X):* **${_player}**

${grid}

*💡 طريقة اللعب:*
أرسل رقم الخانة التي تريد اللعب فيها (1 إلى 9).
الخانات مرقمة من اليسار إلى اليمين، ومن الأعلى للأسفل:
1 2 3
4 5 6
7 8 9
`;
    // يجب استدعاء ملف المنطق TicTacToe Class هنا
    // تأكد من أن المسار صحيح لملف المنطق ../lib/tictactoe.js
    const { default: TicTacToe } = await import('../lib/tictactoe.js').catch(() => ({ default: null }));
    
    if (!TicTacToe) {
        throw '⚠️ *خطأ*: تعذر العثور على ملف منطق اللعبة (lib/tictactoe.js). تأكد من وضعه في المكان الصحيح.';
    }
    
    let game = conn.game[m.chat] = {
        id: m.chat,
        players: [m.sender, opponent],
        turn: m.sender, // X يبدأ
        game: new TicTacToe(m.sender, opponent), // استخدام ملف المنطق
        state: 'running',
        playerSymbols: { [m.sender]: '❌', [opponent]: '⭕' },
        timeout: setTimeout(() => {
            conn.reply(m.chat, '*🚩 انتهى وقت اللعبة!* لم يتم تسجيل أي حركة في الوقت المحدد.', game.message);
            delete conn.game[m.chat];
        }, 120000) // مهلة دقيقتين
    };

    game.message = await conn.reply(m.chat, text_start, m, { mentions: [m.sender, opponent] });
};

handler.help = ['اكس_او @منشن'];
handler.tags = ['ألعاب'];
handler.command = ['اكس_او', 'x_o', 'اكس او', 'xo'];
handler.group = true;

export default handler;
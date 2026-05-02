import { kiraTengenConfig, addExpFromGame } from './theme.js';

let timeout = 300000; // 5 دقائق للعبة XO
let poin = 1000;

if (!global.tictactoeGames) {
    global.tictactoeGames = {};
}

// 🎮 كلاس TicTacToe مبسط
class TicTacToe {
    constructor(playerX, playerO) {
        this.playerX = playerX;
        this.playerO = playerO;
        this.currentTurn = playerX;
        this.board = Array(9).fill(null);
        this.turns = 0;
    }

    turn(index, player) {
        if (this.board[index] !== null || this.currentTurn !== player) return false;
        this.board[index] = this.currentTurn === this.playerX ? 'X' : 'O';
        this.currentTurn = this.currentTurn === this.playerX ? this.playerO : this.playerX;
        this.turns++;
        return true;
    }

    render() {
        return this.board.map((cell, i) => cell || (i + 1).toString());
    }

    get winner() {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
            [0, 4, 8], [2, 4, 6] // أقطار
        ];

        for (const [a, b, c] of wins) {
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a] === 'X' ? this.playerX : this.playerO;
            }
        }
        return null;
    }

    get isGameOver() {
        return this.winner || this.turns === 9;
    }
}

let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        const senderId = m.sender;
        
        // التحقق إذا كان اللاعب في لعبة حالية
        if (global.tictactoeGames && global.tictactoeGames[chatId]) {
            const existingGame = global.tictactoeGames[chatId];
            if ([existingGame.playerX, existingGame.playerO].includes(senderId)) {
                await conn.reply(m.chat, `🍁 لا يزال هناك لعبة XO نشطة!\n🍁 اكتب رقم (1-9) للعب أو *استسلم*`, m);
                return;
            }
        }

        // البحث عن غرفة انتظار في نفس المجموعة
        let room = global.tictactoeGames[chatId];
        
        if (room && room.state === 'WAITING') {
            // ⭐ الانضمام إلى غرفة موجودة (اللاعب O)
            room.playerO = senderId;
            room.game.playerO = senderId;
            room.state = 'PLAYING';
            room.startTime = Date.now();

            const arr = room.game.render().map(v => ({
                'X': '❎', 'O': '⭕', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
                '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
            })[v]);

            const str = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
🎮 لـعـبـة اكـس او 🎯
⏰ الـوقـت: ${(timeout / 60000)} دقائق  
💰 الـنـقـاط: ${poin}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

❎ الـلاعـب 1: @${room.game.playerX.split('@')[0]}
⭕ الـلاعـب 2: @${room.game.playerO.split('@')[0]}
🎲 الـدور: @${room.game.currentTurn.split('@')[0]}

📝 اكتب رقم (1-9) للعب
💥 اكتب *استسلم* للخروج

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

            await conn.sendMessage(chatId, { 
                text: str,
                mentions: [room.game.playerX, room.game.playerO, room.game.currentTurn]
            }, { quoted: m });

            // بدء المؤقت
            room.timeout = setTimeout(async () => {
                if (global.tictactoeGames && global.tictactoeGames[chatId]) {
                    await conn.reply(m.chat, 
                        `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n⏰ انـتـهـى الـوقـت!\n🎮 اللعبة انتهت بالتعادل\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                        m
                    );
                    delete global.tictactoeGames[chatId];
                }
            }, timeout);

        } else {
            // ⭐ إنشاء غرفة جديدة (اللاعب X ينتظر)
            room = {
                id: 'tictactoe-' + chatId,
                chatId: chatId,
                playerX: senderId,
                playerO: null,
                game: new TicTacToe(senderId, 'o'),
                state: 'WAITING',
                startTime: Date.now()
            };

            let waitMessage = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
⏳ في انـتـظـار الـخـصـم
👤 الـلاعـب: @${senderId.split('@')[0]}
🎲 عـلامـتـك: ❎

💰 الـجـائـزة: ${poin} نقطة
📝 لـلانـضـمـام: اكتب *${usedPrefix}اكس او*

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

            await conn.sendMessage(chatId, { 
                text: waitMessage,
                mentions: [senderId]
            }, { quoted: m });

            global.tictactoeGames[chatId] = room;
        }

        console.log(`🍁 بدأت لعبة XO في ${chatId} - اللاعب: ${senderId}`);

    } catch (error) {
        console.error('🍁 خطأ في لعبة اكس او:', error);
        await conn.reply(m.chat, '🍁 حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// 🕹️ معالج الحركات
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text || !global.tictactoeGames) return;

        const chatId = m.chat;
        const senderId = m.sender;
        const text = m.text.trim();

        const room = global.tictactoeGames[chatId];
        if (!room || room.state !== 'PLAYING') return false;

        const isSurrender = /^(استسلم|سلم|stop|انسحب)$/i.test(text);
        const isMove = /^[1-9]$/.test(text);

        if (!isSurrender && !isMove) return false;

        // ✋🏻 التحقق من الدور
        if (senderId !== room.game.currentTurn && !isSurrender) {
            await conn.reply(chatId, '❌ ليس دورك! انتظر دورك.', m);
            return true;
        }

        let ok;
        if (isSurrender) {
            ok = true;
        } else {
            ok = room.game.turn(parseInt(text) - 1, senderId);
        }

        if (!ok && !isSurrender) {
            await conn.reply(chatId, '❌ حركة غير صالحة! هذا الموضع محجوز.', m);
            return true;
        }

        let winner = room.game.winner;
        let isTie = room.game.turns === 9 && !winner;

        // 🏳️ معالجة الاستسلام
        if (isSurrender) {
            clearTimeout(room.timeout);
            winner = senderId === room.game.playerX ? room.game.playerO : room.game.playerX;
            
            await conn.sendMessage(chatId, { 
                text: `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🏳️ @${senderId.split('@')[0]} اسـتـسـلم!\n🎉 @${winner.split('@')[0]} فـاز بـالـلـعـبـة!\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`,
                mentions: [senderId, winner]
            });
            
            // إضافة النقاط للفائز
            try {
                if (typeof addExpFromGame === 'function') {
                    await addExpFromGame(winner, poin, 'فوز بالاستسلام في XO');
                    await conn.reply(chatId, `💰 تم إضافة *${poin}* نقطة إلى رصيد الفائز`, m);
                }
            } catch (e) {
                console.log('🍁 لم يتم إضافة النقاط:', e);
            }

            delete global.tictactoeGames[chatId];
            return true;
        }

        // 🎲 عرض لوحة اللعب
        const arr = room.game.render().map(v => ({
            'X': '❎', 'O': '⭕', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
            '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
        })[v]);

        let gameStatus;
        if (winner) {
            gameStatus = `🎉 الـفـائـز: @${winner.split('@')[0]}`;
        } else if (isTie) {
            gameStatus = `🤝 انـتـهـت الـلـعـبـة بـالتـعـادل`;
        } else {
            gameStatus = `🎲 الـدور: @${room.game.currentTurn.split('@')[0]}`;
        }

        const str = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
🎮 لـعـبـة اكـس او
${gameStatus}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

❎: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}

${!winner && !isTie ? '📝 اكتب رقم (1-9) للعب\n💥 اكتب *استسلم* للخروج' : '🎊 الـلـعـبـة انـتـهـت!'}

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

        const mentions = [
            room.game.playerX, 
            room.game.playerO,
            ...(winner ? [winner] : [room.game.currentTurn])
        ];

        await conn.sendMessage(chatId, { 
            text: str,
            mentions: mentions
        });

        // 🎁 معالجة نهاية اللعبة
        if (winner || isTie) {
            clearTimeout(room.timeout);
            
            if (winner) {
                try {
                    if (typeof addExpFromGame === 'function') {
                        await addExpFromGame(winner, poin, 'فوز في XO');
                        await conn.reply(chatId, `💰 تم إضافة *${poin}* نقطة إلى رصيد الفائز`, m);
                    }
                } catch (e) {
                    console.log('🍁 لم يتم إضافة النقاط:', e);
                }
            }
            delete global.tictactoeGames[chatId];
        }
        
        return true;

    } catch (error) {
        console.error('🍁 خطأ في حركة XO:', error);
        return false;
    }
}

handler.help = ['اكس او']
handler.tags = ['game']
handler.command = /^(ttt|اكس او|xo)$/i
handler.group = true
handler.game = true

export default handler
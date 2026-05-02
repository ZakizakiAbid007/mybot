let timeout = 300000; // 5 دقائق للعبة XO
let poin = 1000;

// التأكد من وجود مساحة تخزين اللعبة في قاعدة البيانات
if (!global.db.data.tictactoeGames) {
    global.db.data.tictactoeGames = {};
}

// 🎮 كلاس TicTacToe مبسط ومُوحَّد
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
        const games = global.db.data.tictactoeGames;
        
        // التحقق إذا كان هناك لعبة في المجموعة بالفعل
        if (games && games[chatId]) {
            const existingGame = games[chatId];
            
            // إذا كان اللاعب هو أحد اللاعبين، أخبره بالحركة
            if ([existingGame.playerX, existingGame.playerO].includes(senderId)) {
                await conn.reply(m.chat, `🍁 لا تزال اللعبة نشطة!\n👈🏻 الدور على @${existingGame.game.currentTurn.split('@')[0]}\n📝 اكتب رقم (1-9) للعب أو *استسلم*`, m, { mentions: [existingGame.game.currentTurn] });
                return;
            } else {
                // إذا حاول شخص ثالث بدء لعبة جديدة
                await conn.reply(m.chat, `⚠️ توجد لعبة XO نشطة في المجموعة بين لاعبين آخرين!\nفضلاً انتظر حتى تنتهي اللعبة.`, m);
                return;
            }
        }

        // البحث عن غرفة انتظار في نفس المجموعة (يفترض أنها غير موجودة بعد التحقق أعلاه)
        let room = games[chatId];
        
        if (room && room.state === 'WAITING') {
            // ⭐ الانضمام إلى غرفة موجودة (اللاعب O)
            
            // إلغاء المؤقت القديم إذا وجد (مؤقت الانتظار)
            if (room.timeoutId) clearTimeout(room.timeoutId);
            
            room.playerO = senderId;
            room.game.playerO = senderId;
            room.state = 'PLAYING';
            room.startTime = Date.now();

            // 👑 الإيموجي الجديدة
            const EMOJIS = {
                'X': '❌', 'O': '⭕', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
                '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
            };
            const arr = room.game.render().map(v => EMOJIS[v]);

            const str = `
👑 مـلـك الـمـهـرجـانـات 👑
    
🎮 لـعـبـة اكـس او 🎯
⏰ الـوقـت: ${(timeout / 60000)} دقائق
💰 الـنـقـاط: ${poin}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

❌ الـلاعـب الأول: @${room.game.playerX.split('@')[0]}
⭕ الـلاعـب الـثـانـي: @${room.game.playerO.split('@')[0]}
🎲 الـدور: @${room.game.currentTurn.split('@')[0]}

📝 اكتب رقم (1-9) للعب
💥 اكتب *استسلم* للخروج

⭐ ━━━━━━━━━━━━━━━ ⭐
`.trim();

            await conn.sendMessage(chatId, { 
                text: str,
                mentions: [room.game.playerX, room.game.playerO, room.game.currentTurn]
            }, { quoted: m });

            // بدء المؤقت الجديد
            room.timeoutId = setTimeout(async () => {
                if (games && games[chatId]) {
                    await conn.reply(m.chat, 
                        `👑 ━━━━━━━━━━━━━━━ 👑\n\n⏰ انـتـهـى الـوقـت!\n🤝 اللعبة انتهت بالتعادل\n\n⭐ ━━━━━━━━━━━━━━━ ⭐`, 
                        m
                    );
                    delete games[chatId];
                }
            }, timeout);

        } else {
            // ⭐ إنشاء غرفة جديدة (اللاعب X ينتظر)
            room = {
                id: 'tictactoe-' + chatId,
                chatId: chatId,
                playerX: senderId,
                playerO: null,
                game: new TicTacToe(senderId, 'o'), // 'o' هي قيمة مؤقتة
                state: 'WAITING',
                startTime: Date.now()
            };

            let waitMessage = `
👑 مـلـك الـمـهـرجـانـات 👑
    
⏳ انـتـظـار الـخـصـم ⏳
👤 الـلاعـب الأول: @${senderId.split('@')[0]}
🎲 عـلامـتـك: ❌

💰 الـجـائـزة: ${poin} نقطة
📝 لـلانـضـمـام: اكتب *${usedPrefix}اكس او*

⭐ ━━━━━━━━━━━━━━━ ⭐
`.trim();

            await conn.sendMessage(chatId, { 
                text: waitMessage,
                mentions: [senderId]
            }, { quoted: m });

            games[chatId] = room;
            
            // مؤقت غرفة الانتظار
            room.timeoutId = setTimeout(async () => {
                if (games && games[chatId] && games[chatId].state === 'WAITING') {
                     await conn.reply(m.chat, 
                        `👑 ━━━━━━━━━━━━━━━ 👑\n\n⏰ انـتـهـى وقـت انـتـظـار الـخـصـم!\n\n⭐ ━━━━━━━━━━━━━━━ ⭐`, 
                        m
                    );
                    delete games[chatId];
                }
            }, timeout); // 5 دقائق انتظار
        }

        // console.log(`🍁 بدأت لعبة XO في ${chatId} - اللاعب: ${senderId}`); // تم إزالة هذا لتجنب "التعليمات"

    } catch (error) {
        console.error('🍁 خطأ في لعبة اكس او:', error);
        await conn.reply(m.chat, '❌ حدث خطأ غير متوقع في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// 🕹️ معالج الحركات (Handler.before)
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text || !global.db.data.tictactoeGames) return;

        const chatId = m.chat;
        const senderId = m.sender;
        const text = m.text.trim();
        const games = global.db.data.tictactoeGames;

        const room = games[chatId];
        // 1. التحقق من وجود لعبة سارية
        if (!room || room.state !== 'PLAYING') return false;

        const isSurrender = /^(استسلم|سلم|stop|انسحب)$/i.test(text);
        const isMove = /^[1-9]$/.test(text);

        // 2. إذا لم تكن الحركة استسلاماً أو رقماً، تجاهل الحركة (هذا يمنع التداخل مع أوامر أخرى أو كلام عادي)
        if (!isSurrender && !isMove) return false;
        
        // 3. التحقق إذا كان اللاعب هو أحد اللاعبين في اللعبة
        if (![room.playerX, room.playerO].includes(senderId)) {
            // تجاهل أي حركة من شخص ثالث
            return false;
        }

        // ✋🏻 التحقق من الدور (يتم تجاهل التحقق من الدور إذا كانت الحركة استسلاماً)
        if (senderId !== room.game.currentTurn && !isSurrender) {
            await conn.reply(chatId, '❌ ليس دورك! انتظر دورك.', m);
            return true;
        }

        let ok;
        if (isSurrender) {
            ok = true;
        } else {
            // تنفيذ الحركة
            ok = room.game.turn(parseInt(text) - 1, senderId);
        }

        if (!ok && !isSurrender) {
            await conn.reply(chatId, '❌ حركة غير صالحة! هذا الموضع محجوز أو أنك حاولت اللعب خارج دورك.', m);
            return true;
        }

        let winner = room.game.winner;
        let isTie = room.game.turns === 9 && !winner;

        // 🏳️ معالجة الاستسلام
        if (isSurrender) {
            if (room.timeoutId) clearTimeout(room.timeoutId);
            // الفائز هو الخصم
            winner = senderId === room.game.playerX ? room.game.playerO : room.game.playerX;
            
            await conn.sendMessage(chatId, { 
                text: `👑 ━━━━━━━━━━━━━━━ 👑\n\n🏳️ @${senderId.split('@')[0]} اسـتـسـلم وتـخـلـى عـن الـمـعـركـة!\n🎉 @${winner.split('@')[0]} فـاز بـالـلـعـبـة!\n\n💰 لم يتم إضافة نقاط (EXP) لعدم وجود نظام المكافآت.\n\n⭐ ━━━━━━━━━━━━━━━ ⭐`,
                mentions: [senderId, winner]
            });
            
            delete games[chatId];
            return true;
        }

        // 🎲 عرض لوحة اللعب
        const EMOJIS = {
            'X': '❌', 'O': '⭕', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
            '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
        };
        const arr = room.game.render().map(v => EMOJIS[v]);

        let gameStatus;
        if (winner) {
            gameStatus = `🏆 الـفـائـز الـجـديـد: @${winner.split('@')[0]}`;
        } else if (isTie) {
            gameStatus = `🤝 انـتـهـت الـلـعـبـة بـالتـعـادل`;
        } else {
            gameStatus = `🎲 الـدور: @${room.game.currentTurn.split('@')[0]}`;
        }

        const str = `
👑 مـلـك الـمـهـرجـانـات 👑
    
🎮 لـعـبـة اكـس او
${gameStatus}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}

${!winner && !isTie ? '📝 اكتب رقم (1-9) للعب\n💥 اكتب *استسلم* للخروج' : '🎊 الـلـعـبـة انـتـهـت!'}

⭐ ━━━━━━━━━━━━━━━ ⭐
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
            if (room.timeoutId) clearTimeout(room.timeoutId);
            
            if (winner) {
                // 🚫 إشعار عدم إضافة النقاط
                 await conn.reply(chatId, `💰 لم يتم إضافة نقاط (EXP) لعدم وجود نظام المكافآت.`, m);
            }
            delete games[chatId];
        }
        
        return true;

    } catch (error) {
        console.error('🍁 خطأ في حركة XO:', error);
        // لا ترد على الأخطاء داخل before إلا إذا كان خطأ فادحاً
        return false;
    }
}

handler.help = ['اكس او']
handler.tags = ['game']
handler.command = /^(ttt|اكس|xo)$/i
handler.group = true
handler.game = true

export default handler
// theme.js - الكود الكامل مع التعديل
import { addExpFromGame as bankAddExp } from './بنك.js';

export const kiraTengenConfig = {
    theme: {
        border: {
            start: "╔═══════════════════════╗",
            end: "╚═══════════════════════╝",
            middle: "╠═══════════════════════╣"
        },
        emojis: {
            main: "⚡",
            win: "🎉",
            bank: "🏦",
            money: "💰",
            wallet: "💳",
            level: "⭐",
            trophy: "🏆",
            hint: "💡",
            correct: "✅",
            channel: "📢",
            phone: "📱",
            game: "🎮"
        },
        footer: "✨ تفضل وجرب حظك!"
    },
    channel: "@kira_tengen",
    phone: "+123456789"
};

// ⭐ دالة إضافة النقاط من الألعاب - معدلة للمزامنة ⭐
export async function addExpFromGame(userId, amount, gameName) {
    try {
        console.log(`🎮 محاولة إضافة ${amount} نقطة لـ ${userId} من لعبة ${gameName}`);
        
        // 1. أضف النقاط لـ userData.json (النظام الجديد)
        const fileResult = await bankAddExp(userId, amount, gameName);
        
        // 2. أضف النقاط لـ global.db.data (النظام القديم)
        if (!global.db.data) {
            console.log('❌ global.db.data غير موجود');
            return fileResult;
        }
        
        if (!global.db.data.users) {
            global.db.data.users = {};
        }
        
        if (!global.db.data.users[userId]) {
            global.db.data.users[userId] = {
                exp: 0,
                level: 1,
                coin: 0,
                bank: 0,
                gamesPlayed: 0,
                gamesWon: 0
            };
        }
        
        const user = global.db.data.users[userId];
        const oldExp = user.exp || 0;
        
        user.exp = oldExp + amount;
        user.gamesPlayed = (user.gamesPlayed || 0) + 1;
        user.gamesWon = (user.gamesWon || 0) + 1;
        user.level = Math.floor(user.exp / 1000) + 1;
        
        console.log(`✅ ${userId} ربح ${amount} نقطة في كلا النظامين`);
        console.log(`📊 الرصيد الجديد في global.db.data: ${user.exp} نقطة`);
        
        return {
            success: true,
            oldExp: oldExp,
            newExp: user.exp,
            level: user.level,
            addedAmount: amount,
            game: gameName,
            synced: true // تأكيد المزامنة
        };
        
    } catch (error) {
        console.error('❌ خطأ في إضافة النقاط:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// ⭐ دالة مزامنة البيانات للبنك ⭐
export function syncBankData(userId) {
    try {
        if (!global.db.data || !global.db.data.users || !global.db.data.users[userId]) {
            return { exp: 0, level: 1, gamesPlayed: 0, gamesWon: 0 };
        }
        
        const user = global.db.data.users[userId];
        return {
            exp: user.exp || 0,
            level: user.level || 1,
            gamesPlayed: user.gamesPlayed || 0,
            gamesWon: user.gamesWon || 0
        };
    } catch (error) {
        console.error('❌ خطأ في مزامنة بيانات البنك:', error);
        return { exp: 0, level: 1, gamesPlayed: 0, gamesWon: 0 };
    }
}
// بنك.js - الكود الكامل مصحح
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// مسار ملفات البيانات - تصحيح المسار
const userDataFile = path.join(__dirname, 'userData.json');
const groupDataFile = path.join(__dirname, 'userGroupData.json');

// تهيئة الملفات إذا لم تكن موجودة
function initFiles() {
    try {
        if (!fs.existsSync(userDataFile)) {
            fs.writeFileSync(userDataFile, JSON.stringify({}));
            console.log('✅ تم إنشاء userData.json');
        }
        if (!fs.existsSync(groupDataFile)) {
            fs.writeFileSync(groupDataFile, JSON.stringify({}));
            console.log('✅ تم إنشاء userGroupData.json');
        }
    } catch (error) {
        console.error('❌ خطأ في تهيئة الملفات:', error);
    }
}

// ⭐ دالة جلب بيانات المستخدم ⭐
export function getUserData(userId) {
    initFiles();
    try {
        const data = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
        return data[userId] || { 
            exp: 0, 
            level: 1,
            gamesPlayed: 0,
            gamesWon: 0,
            registeredAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ خطأ في قراءة بيانات المستخدم:', error);
        return { exp: 0, level: 1, gamesPlayed: 0, gamesWon: 0 };
    }
}

// ⭐ دالة تحديث بيانات المستخدم ⭐
export function updateUserData(userId, newData) {
    initFiles();
    try {
        const data = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
        data[userId] = { ...getUserData(userId), ...newData };
        fs.writeFileSync(userDataFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('❌ خطأ في تحديث بيانات المستخدم:', error);
        return false;
    }
}

// ⭐ دالة إضافة النقاط من الألعاب ⭐
export function addExpFromGame(userId, amount, gameName) {
    try {
        const userData = getUserData(userId);
        const oldExp = userData.exp || 0;
        
        userData.exp = oldExp + amount;
        userData.gamesPlayed = (userData.gamesPlayed || 0) + 1;
        userData.gamesWon = (userData.gamesWon || 0) + 1;
        
        // تحديث المستوى
        userData.level = Math.floor(userData.exp / 1000) + 1;
        
        updateUserData(userId, userData);
        
        console.log(`✅ ${userId} ربح ${amount} نقطة من ${gameName}`);
        
        return {
            success: true,
            oldExp: oldExp,
            newExp: userData.exp,
            level: userData.level,
            game: gameName
        };
    } catch (error) {
        console.error('❌ خطأ في إضافة النقاط:', error);
        return { success: false, error: error.message };
    }
}

// ⭐ الدوال المساعدة للأوامر ⭐
export function getTopUsers(limit = 10) {
    try {
        const data = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
        const users = Object.entries(data)
            .filter(([_, userData]) => userData.exp > 0)
            .sort(([_, a], [__, b]) => (b.exp || 0) - (a.exp || 0))
            .slice(0, limit);
        
        return users;
    } catch (error) {
        console.error('❌ خطأ في جلب قائمة الأغنياء:', error);
        return [];
    }
}

export function getUserBalance(userId) {
    const userData = getUserData(userId);
    return userData.exp || 0;
}

export function getUserLevel(userId) {
    const userData = getUserData(userId);
    return userData.level || 1;
}

// ⭐ دالة حفظ اسم المستخدم ⭐
export function saveUserName(userId, userName) {
    try {
        const userData = getUserData(userId);
        userData.name = userName;
        userData.lastSeen = new Date().toISOString();
        updateUserData(userId, userData);
        return true;
    } catch (error) {
        console.error('❌ خطأ في حفظ اسم المستخدم:', error);
        return false;
    }
}

// ⭐ إعدادات البنك ⭐
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

// ⭐ الدوال الأساسية للأوامر ⭐
export async function bankCommand(sock, chatId, senderId, message) {
    try {
        const userData = getUserData(senderId);
        const totalUsers = Object.keys(JSON.parse(fs.readFileSync(userDataFile, 'utf8'))).length;
        
        const response = `${kiraTengenConfig.theme.border.start}
${kiraTengenConfig.theme.emojis.bank} *بنك كيرا تنغن* ${kiraTengenConfig.theme.emojis.bank}
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.money} *إجمالي العملاء:* ${totalUsers}
${kiraTengenConfig.theme.emojis.wallet} *رصيدك:* ${userData.exp} نقطة
${kiraTengenConfig.theme.emojis.level} *مستواك:* ${userData.level}
${kiraTengenConfig.theme.emojis.trophy} *الألعاب الملعوبة:* ${userData.gamesPlayed}
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.channel} *القناة:* ${kiraTengenConfig.channel}
${kiraTengenConfig.theme.footer}
${kiraTengenConfig.theme.border.end}`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });
    } catch (error) {
        console.error('❌ خطأ في أمر البنك:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عرض معلومات البنك\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function walletCommand(sock, chatId, senderId, message) {
    try {
        const userData = getUserData(senderId);
        const nextLevelExp = (userData.level * 1000) - userData.exp;
        
        const response = `${kiraTengenConfig.theme.border.start}
${kiraTengenConfig.theme.emojis.wallet} *محفظتك الشخصية* ${kiraTengenConfig.theme.emojis.wallet}
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.money} *الرصيد الحالي:* ${userData.exp} نقطة
${kiraTengenConfig.theme.emojis.level} *المستوى الحالي:* ${userData.level}
${kiraTengenConfig.theme.emojis.trophy} *للتقدم للمستوى ${userData.level + 1}:* ${nextLevelExp} نقطة
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.game} *إحصائياتك:*
🎮 الألعاب الملعوبة: ${userData.gamesPlayed}
🏆 الألعاب المربوحة: ${userData.gamesWon}
${kiraTengenConfig.theme.border.end}`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });
    } catch (error) {
        console.error('❌ خطأ في أمر المحفظة:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عرض المحفظة\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function depositCommand(sock, chatId, senderId, amountArg, message) {
    try {
        if (!amountArg) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ يرجى تحديد المبلغ!\n\n${kiraTengenConfig.theme.emojis.hint} *مثال:*\n*.إيداع 1000*\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        const userData = getUserData(senderId);
        let amount = 0;

        if (amountArg.toLowerCase() === 'الكل') {
            amount = userData.exp || 0;
        } else {
            amount = parseInt(amountArg);
            if (isNaN(amount) || amount <= 0) {
                await sock.sendMessage(chatId, { 
                    text: `${kiraTengenConfig.theme.border.start}\n❌ يرجى إدخال مبلغ صحيح!\n${kiraTengenConfig.theme.border.end}`
                }, { quoted: message });
                return;
            }
        }

        if (amount > (userData.exp || 0)) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ لا تملك نقود كافية للإيداع!\n\n${kiraTengenConfig.theme.emojis.money} *نقودك:* ${userData.exp || 0} نقطة\n${kiraTengenConfig.theme.emojis.money} *المطلوب:* ${amount} نقطة\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n${kiraTengenConfig.theme.emojis.correct} *تم الإيداع بنجاح!*\n\n${kiraTengenConfig.theme.emojis.money} *المبلغ:* ${amount} نقطة\n${kiraTengenConfig.theme.emojis.money} *رصيدك الحالي:* ${userData.exp} نقطة\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });

    } catch (error) {
        console.error('❌ خطأ في أمر الإيداع:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عملية الإيداع\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function withdrawCommand(sock, chatId, senderId, amountArg, message) {
    try {
        if (!amountArg) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ يرجى تحديد المبلغ!\n\n${kiraTengenConfig.theme.emojis.hint} *مثال:*\n*.سحب 500*\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        const userData = getUserData(senderId);
        let amount = 0;

        if (amountArg.toLowerCase() === 'الكل') {
            amount = userData.exp || 0;
        } else {
            amount = parseInt(amountArg);
            if (isNaN(amount) || amount <= 0) {
                await sock.sendMessage(chatId, { 
                    text: `${kiraTengenConfig.theme.border.start}\n❌ يرجى إدخال مبلغ صحيح!\n${kiraTengenConfig.theme.border.end}`
                }, { quoted: message });
                return;
            }
        }

        if (amount > (userData.exp || 0)) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ لا تملك نقود كافية للسحب!\n\n${kiraTengenConfig.theme.emojis.money} *نقودك:* ${userData.exp || 0} نقطة\n${kiraTengenConfig.theme.emojis.money} *المطلوب:* ${amount} نقطة\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n${kiraTengenConfig.theme.emojis.correct} *تم السحب بنجاح!*\n\n${kiraTengenConfig.theme.emojis.money} *المبلغ:* ${amount} نقطة\n${kiraTengenConfig.theme.emojis.money} *رصيدك الحالي:* ${userData.exp} نقطة\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });

    } catch (error) {
        console.error('❌ خطأ في أمر السحب:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عملية السحب\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function levelCommand(sock, chatId, senderId, message) {
    try {
        const userData = getUserData(senderId);
        const currentLevel = userData.level || 1;
        const currentExp = userData.exp || 0;
        const expForNextLevel = (currentLevel * 1000) - currentExp;
        const progress = Math.min(100, Math.floor((currentExp % 1000) / 10));
        
        const progressBar = '█'.repeat(progress / 5) + '░'.repeat(20 - (progress / 5));
        
        const response = `${kiraTengenConfig.theme.border.start}
${kiraTengenConfig.theme.emojis.level} *مستواك وتقدمك* ${kiraTengenConfig.theme.emojis.level}
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.level} *المستوى الحالي:* ${currentLevel}
${kiraTengenConfig.theme.emojis.money} *النقاط:* ${currentExp}
${kiraTengenConfig.theme.emojis.trophy} *للمستوى ${currentLevel + 1}:* ${expForNextLevel} نقطة

${progressBar} ${progress}%

${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.game} *مكافآت المستويات:*
⭐ مستوى 1: بداية اللعبة
⭐ مستوى 5: مزايا خاصة
⭐ مستوى 10: رتبة VIP
${kiraTengenConfig.theme.border.end}`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });
    } catch (error) {
        console.error('❌ خطأ في أمر المستوى:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عرض المستوى\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function topMoneyCommand(sock, chatId, senderId, message) {
    try {
        const topUsers = getTopUsers(10);
        
        let topList = '';
        topUsers.forEach(([userId, userData], index) => {
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔸';
            const userName = userData.name || userId.split('@')[0];
            topList += `${rankEmoji} *${index + 1}.* ${userName} - ${userData.exp} نقطة\n`;
        });

        if (topList === '') {
            topList = '🚫 لا يوجد لاعبين بعد!';
        }

        const response = `${kiraTengenConfig.theme.border.start}
${kiraTengenConfig.theme.emojis.trophy} *قائمة الأغنياء* ${kiraTengenConfig.theme.emojis.trophy}
${kiraTengenConfig.theme.border.middle}
${topList}
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.channel} *القناة:* ${kiraTengenConfig.channel}
${kiraTengenConfig.theme.footer}
${kiraTengenConfig.theme.border.end}`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });
    } catch (error) {
        console.error('❌ خطأ في أمر التوب:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عرض قائمة الأغنياء\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function bankHelpCommand(sock, chatId, senderId, message) {
    try {
        const response = `${kiraTengenConfig.theme.border.start}
${kiraTengenConfig.theme.emojis.hint} *أوامر النظام البنكي* ${kiraTengenConfig.theme.emojis.hint}
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.bank} *.بنك* - عرض معلومات البنك
${kiraTengenConfig.theme.emojis.money} *.إيداع [المبلغ]* - إيداع النقود
${kiraTengenConfig.theme.emojis.wallet} *.سحب [المبلغ]* - سحب النقود
${kiraTengenConfig.theme.emojis.wallet} *.محفظة* - عرض رصيدك الكامل
${kiraTengenConfig.theme.emojis.level} *.مستوى* - عرض مستواك وتقدمك
${kiraTengenConfig.theme.emojis.trophy} *.توب* - قائمة أغنى اللاعبين
${kiraTengenConfig.theme.emojis.money} *.تحويل @المستخدم المبلغ* - تحويل النقود
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.game} *أمثلة على الاستخدام:*
${kiraTengenConfig.theme.emojis.money} *.إيداع 1000* - إيداع 1000 نقطة
${kiraTengenConfig.theme.emojis.money} *.إيداع الكل* - إيداع كل النقود
${kiraTengenConfig.theme.emojis.money} *.سحب 500* - سحب 500 نقطة
${kiraTengenConfig.theme.emojis.money} *.سحب الكل* - سحب كل النقود
${kiraTengenConfig.theme.emojis.money} *.تحويل @أحمد 1000* - تحويل 1000 نقطة
${kiraTengenConfig.theme.border.middle}
${kiraTengenConfig.theme.emojis.channel} *القناة:* ${kiraTengenConfig.channel}
${kiraTengenConfig.theme.footer}
${kiraTengenConfig.theme.border.end}`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });
    } catch (error) {
        console.error('❌ خطأ في أمر المساعدة:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عرض المساعدة\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

export async function transferCommand(sock, chatId, senderId, args, message) {
    try {
        if (!args || args.length < 2) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ صيغة الأمر غير صحيحة!\n\n${kiraTengenConfig.theme.emojis.hint} *الاستخدام:*\n*.تحويل @المستخدم المبلغ*\n\n${kiraTengenConfig.theme.emojis.hint} *مثال:*\n*.تحويل @أحمد 1000*\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        const mentionedJid = message.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedJid) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ يجب ذكر المستخدم!\n\n${kiraTengenConfig.theme.emojis.hint} *مثال:*\n*.تحويل @أحمد 1000*\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ يرجى إدخال مبلغ صحيح!\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        const senderData = getUserData(senderId);
        if (amount > (senderData.exp || 0)) {
            await sock.sendMessage(chatId, { 
                text: `${kiraTengenConfig.theme.border.start}\n❌ لا تملك نقود كافية للتحويل!\n\n${kiraTengenConfig.theme.emojis.money} *نقودك:* ${senderData.exp || 0} نقطة\n${kiraTengenConfig.theme.emojis.money} *المطلوب:* ${amount} نقطة\n${kiraTengenConfig.theme.border.end}`
            }, { quoted: message });
            return;
        }

        // خصم المبلغ من المرسل
        senderData.exp = (senderData.exp || 0) - amount;
        updateUserData(senderId, senderData);

        // إضافة المبلغ للمستلم
        const receiverData = getUserData(mentionedJid);
        receiverData.exp = (receiverData.exp || 0) + amount;
        updateUserData(mentionedJid, receiverData);

        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n${kiraTengenConfig.theme.emojis.correct} *تم التحويل بنجاح!*\n\n${kiraTengenConfig.theme.emojis.money} *المبلغ:* ${amount} نقطة\n${kiraTengenConfig.theme.emojis.main} *المستلم:* ${mentionedJid.split('@')[0]}\n${kiraTengenConfig.theme.emojis.money} *رصيدك الجديد:* ${senderData.exp} نقطة\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });

    } catch (error) {
        console.error('❌ خطأ في أمر التحويل:', error);
        await sock.sendMessage(chatId, { 
            text: `${kiraTengenConfig.theme.border.start}\n❌ حدث خطأ في عملية التحويل\n${kiraTengenConfig.theme.border.end}`
        }, { quoted: message });
    }
}

// ⭐⭐⭐ دالة معالجة الأوامر الرئيسية ⭐⭐⭐
export async function handleBankCommands(sock, message) {
    try {
        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const userMessage = message.message.conversation || message.message.extendedTextMessage?.text || '';
        
        if (!userMessage.startsWith('.')) return false;
        
        const command = userMessage.toLowerCase().trim();
        const args = userMessage.split(' ').slice(1);
        
        console.log(`🎯 معالجة أمر: ${command} من ${senderId}`);
        
        // حفظ اسم المستخدم أولاً
        if (message.pushName) {
            saveUserName(senderId, message.pushName);
        }
        
        // معالجة الأوامر
        switch(true) {
            case command.startsWith('.بنك'):
            case command.startsWith('.bank'):
                await bankCommand(sock, chatId, senderId, message);
                return true;
                
            case command.startsWith('.إيداع'):
            case command.startsWith('.ايداع'):
            case command.startsWith('.deposit'):
                await depositCommand(sock, chatId, senderId, args[0], message);
                return true;
                
            case command.startsWith('.سحب'):
            case command.startsWith('.withdraw'):
                await withdrawCommand(sock, chatId, senderId, args[0], message);
                return true;
                
            case command.startsWith('.محفظة'):
            case command.startsWith('.فلوس'):
            case command.startsWith('.wallet'):
            case command.startsWith('.money'):
                await walletCommand(sock, chatId, senderId, message);
                return true;
                
            case command.startsWith('.مستوى'):
            case command.startsWith('.level'):
            case command.startsWith('.lvl'):
                await levelCommand(sock, chatId, senderId, message);
                return true;
                
            case command.startsWith('.اساطير'):
            case command.startsWith('.توب فلوس'):
            case command.startsWith('.اغنياء'):
            case command.startsWith('.عاقا'):
            case command.startsWith('.rich'):
                await topMoneyCommand(sock, chatId, senderId, message);
                return true;
                
            case command.startsWith('.تحويل'):
            case command.startsWith('.transfer'):
                await transferCommand(sock, chatId, senderId, args, message);
                return true;
                
            case command.startsWith('.مساعدة'):
            case command.startsWith('.مساعدة بنك'):
            case command.startsWith('.help bank'):
            case command.startsWith('.bank help'):
                await bankHelpCommand(sock, chatId, senderId, message);
                return true;
                
            default:
                return false;
        }
    } catch (error) {
        console.error('❌ خطأ في معالجة الأوامر:', error);
        return false;
    }
}

// ⭐⭐⭐ دالة البدء (للاستخدام في الملف الرئيسي) ⭐⭐⭐
export function initBankSystem() {
    console.log('🏦 نظام البنك كيرا تنغن جاهز للعمل!');
    console.log(`📢 القناة: ${kiraTengenConfig.channel}`);
    console.log(`📞 الرقم: ${kiraTengenConfig.phone}`);
}
// الكود للملك تنغن 👑 - أمر البث المركزي المتقدم للمجموعات (Multi-Bot BC)

const handler = async (m, { conn, text }) => {
    // 🔐 التحقق من الصلاحية: الملك الغراب فقط (rowner/owner)
    // ملاحظة: بما أن handler.owner = true، فإن الشرط الأولي هنا زائد ويمكن حذفه،
    // لكن تم إبقاؤه ليعكس أسلوب الكود الأصلي
    const isCreator = global.owner.find(([num]) => m.sender.includes(num));
    if (!isCreator) {
        return m.reply(`🚫 *وصول ممنوع:*\nهذا الأمر حكر على *المالك* وحده (الغراب الوحيد).`);
    }

    if (!text) {
        return m.reply('⚠️ *أدخل المرسوم الملكي:* يجب أن تكتب الرسالة التي تود بثها لجميع المجموعات.');
    }

    const fakeContact = {
        key: {
            fromMe: false,
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            id: 'broadcast'
        },
        message: {
            contactMessage: {
                displayName: '👑 النظام الملكي المركزي',
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${global.packname || 'النظام الملكي'}\nTEL;type=CELL:${conn.user.jid.split('@')[0]}\nEND:VCARD`
            }
        }
    };

    // 🎨 تنسيق الرسالة الملكية القوية
    const message = `
┏━━━《🦉 *مَرْسُومُ الغُرَابِ المَلَكِي* 👑》━━━┓
┃ ⚙️ *وحدة البث المركزي مفعلة...*
┃
┃ 📜 *نصُّ المرسوم:*
┃ ➥ ${text}
┃
┃ 🛰️ *أمرٌ صادرٌ من المالك (الغراب تنغن)*
┗━━━━━━━━━━━━━━━━━━━━━━┛`.trim();

    // جمع البوتات النشطة (البوت الرئيسي + البوتات الفرعية)
    const conns = [conn, ...(global.conns || []).filter(c => c.user && c.ws.readyState === 1)]; // تصفية لضمان النشاط
    let totalGrupos = 0;

    // البث عبر جميع البوتات
    for (const bot of conns) {
        try {
            // جلب المجموعات التي يشارك فيها هذا البوت
            const grupos = await bot.groupFetchAllParticipating();
            const ids = Object.keys(grupos);

            for (const gid of ids) {
                // تجاهل المجموعات المقفلة للإعلانات
                if (grupos[gid].announce) continue; 
                await bot.sendMessage(gid, { text: message }, { quoted: fakeContact });
                totalGrupos++;
            }
        } catch (err) {
            console.error(`❗ خطأ في بث البوت ${bot.user.jid.split('@')[0]}:`, err);
        }
    }

    return m.reply(`✅ *تم إطلاق المرسوم الملكي بنجاح:*\n📡 *إجمالي المجموعات التي وصلت إليها الرسالة:* ${totalGrupos}\n🧠 *القائد:* الغراب تنغن`);
};

handler.help = ['بث_مركزي'];
handler.tags = ['ملك'];
handler.command = ['bcgc2', 'bcg', 'بث_مركزي', 'بث_البوتات'];
handler.owner = true;

export default handler;
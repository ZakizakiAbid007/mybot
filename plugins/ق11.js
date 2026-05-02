// الملف: menu_q11_guild.js (ق11: قسم الألقاب والنقابة)
// 💡 تمت إضافة الاستيراد اللازم للصور
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg 

const handler = async (m, { conn }) => {
    // 👑 معلومات الملك
    const BOT_NAME = 'تِـنْـغَـنْ';
    const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
    // 🖼️ رابط الصورة الجديدة
    const GUILD_IMAGE_URL = 'https://i.postimg.cc/0jZSLQVg/9fe6315eaa424b8bf3815e9af3b0fe0a.jpg';

    // 📸 إعداد الصورة 📸
    const messa = await prepareWAMessageMedia({ image: { url: GUILD_IMAGE_URL } }, { upload: conn.waUploadToServer })

    // 📜 رسالة القسم
    const menuText = `
*╭┄┄┄┄┄┄┄ ⚔️ ┄┄┄┄┄┄┄╮*
*│ 🛡️ قِـسْـمُ الأَلْـقَـابِ والـنَّـقَـابَـة 🛡️*
*╰┄┄┄┄┄┄┄ ⚔️ ┄┄┄┄┄┄┄╯*
*أيُّـهَـا الـمَـلِـكُ! اخْـتَـرْ أَمْـرَ لَـقَـبِـكَ:*

*༺═──⚔️──═༻*

*لِتَـغْـيِـيـرِ الـلَّـقَـبِ أو الـتَّـسْـجِـيـلِ*
*اضْـغَـطْ عَـلَـى الأَزْرَارِ الـتَّـالِـيَـةِ:*
`;

    // 📜 أزرار الأوامر الـ 5 المطلوبة
    const commandListRows = [
        { title: '🛡️ لـقـبـه » مـنـح لـقـب لـشـخـص', id: '.لقبه' }, 
        { title: '🛡️ لـقـبـنـي » اخـتـيـار لـقـبـك', id: '.لقبني' },
        { title: '🛡️ الالقاب » عـرض ألـقـاب الـجـمـيـع', id: '.الالقاب' },
        { title: '🛡️ تـسـجـيـل » لـتـسـجـيـل لـقـب جـديـد', id: '.تسجيل الالقاب' },
        { title: '🛡️ حـذف_لـقـب » لإزالـة لـقـب', id: '.حذف_لقب' },
        { title: '🛡️ لـقـبـي » عـرض لـقـبـك', id: '.لقبي' }
    ];

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `『⚔️┇ أَوَامِـرُ الأَلْـقَـابِ ┇⚔️』`,
                sections: [
                    {
                        title: '🔥 ⇦ الأوامر المتاحة ⇦ 🔥',
                        rows: commandListRows
                    }
                ]
            })
        },
        // زر العودة للقائمة الرئيسية
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "『🔙┇ الـعـودة لـلـقـائـمـة الـرئـيـسـيـة ┇🔙』",
                id: ".menu"
            })
        }
    ];

    await conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: menuText },
                    footer: { text: YOUR_NAME_TITLE },
                    header: {
                        title: '',
                        // 💡 تم تفعيل إظهار الصورة هنا
                        hasMediaAttachment: true,
                        imageMessage: messa.imageMessage 
                    },
                    nativeFlowMessage: { buttons }
                }
            }
        }
    }, {});
};

handler.help = ['q11'];
handler.tags = ['main', 'guild'];
handler.command = ['ق11']; // الأمر الذي سيستدعي هذا الملف

export default handler;
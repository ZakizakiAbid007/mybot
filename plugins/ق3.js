// الملف: ق3.js - أزرار أوامر الإدارة والحماية المباشرة
import pkg from '@whiskeysockets/baileys'
const { prepareWAMessageMedia } = pkg

// 👑 معلومات الملك تنغن
const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg';

const handler = async (m, { conn }) => {
    let name = conn.getName(m.sender) || 'مستخدم'
    await conn.sendMessage(m.chat, { react: { text: '👥', key: m.key } })

    const messa = await prepareWAMessageMedia({ image: { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer })

    const menuText = `*╭─────────•『👑』•─────────╮*\n*│ 🛡️  قِـسْـمُ الْإِدَارَةِ المجموعة ادمين والمطور الْـحِـمَـايَـةِ*\n*╰─────────•『👑』•─────────╯*\n\n*أَوَامِـرُ الْـحِـمَـايَـةِ وَ الْـإِدَارَةِ جَـاهِـزَةٌ:* 👇`

    const commandList = [
        // حماية وأمان
        { title: 'تفعيل مضاد اللينك 🚫', id: '.تفعيل ضد_الروابط' },
        { title: 'تفعيل مضاد الارقام الوهمية 📵', id: '.تفعيل ضد_المزيفين' },
        { title: 'مضاد-سبام ⚠️', id: '.تفعيل ضد_السبام' },
        { title: 'تفعيل مضاد الحذف 🗑️', id: '.تفعيل ضد_الحذف' },
        { title: 'تفعيل مضاد الاتصال 📞', id: '.تفعيل ضد_الاتصال' },
        { title: 'منع خاص 🔒', id: '.تفعيل ضد_الخاص' },
        { title: '👻 قائمة الأشباح 👻', id: '.الاشباح' },
        { title: 'سيتم طرد أي مشرف يسحب إشراف شخص آخر', id: '.مضاد_الإشراف' },
        { title: '✨┊ المتصلين النشطين', id: '.المتصلين' },
        // إدارة المجموعة
        { title: 'طرد عضو 🚶', id: '.طرد' },
        { title: 'قفل المجموعة 🔐', id: '.قفل' },
        { title: 'فتح المجموعة 🔓', id: '.فتح' },
        { title: 'ترقية عضو ⬆️', id: '.ترقية' },
        { title: 'نزل عضو ⬇️', id: '.نزل' },
        { title: 'تفعيل ترحيب 🎉', id: '.تفعيل ترحيب' },
        { title: 'تعطيل ترحيب 👋', id: '.تعطيل ترحيب' },
        { title: 'حظر عضو ⛔', id: '.حظر' },
        { title: 'إلغاء حظر ✅', id: '.الغاء-حظر' },
        { title: 'إرسال إنذار ⚠️', id: '.انذار' },
        { title: 'قائمة الإنذارات 📋', id: '.انذارات' },
        { title: 'حذف رسالة 🗑️', id: '.حذف' },
        { title: 'إرسال مخفي 🎭', id: '.مخفي' },
        { title: 'منشن للكل 📢', id: '.منشن' },
        { title: 'معلومات المجموعة 👥', id: '.مجموعة' },
        { title: 'قائمة الآدمن 🛡️', id: '.المشرفين' },
        { title: 'تغيير اللينك 🔗', id: '.تغيير_الرابط' },
        { title: 'تغيير الاسم 📝', id: '.تغيير_الاسم' },
        { title: 'تغيير الوصف 📄', id: '.تغيير_الوصف' },
        { title: 'تغيير الصورة 🖼️', id: '.تغيير_الصورة' }
    ]

    const buttons = [
        {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title: `📜 أوَامِـرُ الْـإِدَارَةِ وَ الْـحِـمَـايَـةِ`,
                sections: [{
                    title: 'اخـتـر الأمـر',
                    rows: commandList.map(cmd => ({ title: cmd.title, id: cmd.id }))
                }]
            })
        }
    ]

    await conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: menuText },
                    footer: { text: YOUR_NAME_TITLE },
                    header: { hasMediaAttachment: true, imageMessage: messa.imageMessage },
                    nativeFlowMessage: { buttons }
                }
            }
        }
    }, {})
}

handler.command = /^(ق3)$/i;
export default handler;
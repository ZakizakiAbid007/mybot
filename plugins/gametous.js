// File: developer_exec.js - (أوامر المطور المزخرفة والقابلة للتنفيذ)
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia } = pkg;

const YOUR_NAME_TITLE = 'تِنْـغَـنْ مَـلِـكُ الـمَـهْـرَجَـانَـاتِ ✨👑';
const CUSTOM_IMAGE_URL = 'https://i.postimg.cc/DZcTw8Dq/lllybyb.jpg'; 
const DECO_LINE = '༺═────── ✦ ──────═༻';

let handler = async (m, { conn, usedPrefix, command }) => {
    
    const sections = [{
        title: '⚙️ أَوَامِـرُ الـنِّـظَـامِ وَ الْـإِعْـدَادَاتِ 🔧',
        rows: [
            { title: '👑 [.مطور] مَـعْـلُـومَـاتُ الْـمُـطَـوِّرِ', description: 'عَـرْضُ مَـعْـلُـومَـاتِ الْـمُـطَـوِّرِ', id: '.مطور'},
            { title: '🔄 [.تحديث] تَـحْـدِيـثُ الْـبُـوتِ', description: 'تَـحْـدِيـثُ كُـودِ الْـبُـوتِ', id: '.تحديث'},
            { title: '⚡ [.رياكشن] إِعْـدَادَاتُ الـرِّيَـاكْـشِـنْ', description: 'تَـفْـعِـيـلُ/تَـعْـطِـيـلُ رِيَـاكْـشِـنِ الْـبُـوتِ', id: '.تفعيل ملصق_تلقائي'},
            { title: '⌨️ [.تنبيهات] تنبيهات تفعيل ', description: 'تَـفْـعِـيـلُ/تَـعْـطِـيـلُ "تنبيهات"', id: '.تفعيل تنبيهات'},
            { title: '📊 [.احصائيات] حَـالَـةُ الْـبُـوتِ', description: 'عَـرْضُ حَـالَـةِ الْـبُـوتِ', id: '.احصائيات'},
            { title: '🗑️ [.مسح] مَـسْـحُ تنضيف_الجلسات', description: 'مَـسْـحُ تنضيف_الجلسات', id: '.تنضيف_الجلسات'},
            { title: '⏰ [.مسح_مؤقت] مَـسْـحُ الـمُـؤَقَّـتَـاتِ', description: 'مَـسْـحُ الْـمِـلْـفَـاتِ الْـمُـؤَقَّـتَـةِ', id: '.مسح_مؤقت'},
        ]
    }];
    
    const imageMedia = await prepareWAMessageMedia({ image : { url: CUSTOM_IMAGE_URL } }, { upload: conn.waUploadToServer }, {quoted: m});

    const message = {
        title: `👑 أَوَامِـرُ الـمُـطَـوِّرِ - ${YOUR_NAME_TITLE}`,
        text: `*يَـا ${YOUR_NAME_TITLE}*\n${DECO_LINE}\nاِخْـتَـرِ الْأَمْـرَ الْـوَاضِـحَ بَـيْـنَ الْأَقْـوَاسِ لِـلْـتَّـحَـكُّـمِ فِـي نِـظَـامِ الْـبُـوتِ 🚀.`,
        buttonText: "اِخْـتَـرْ أَمْـرَ الـمُـطَـوِّرِ 👇",
        sections
    };

    conn.relayMessage(m.chat, { 
        viewOnceMessage: { 
            message: { 
                interactiveMessage: { 
                    header: { title: message.title }, 
                    body: { text: message.text, subtitle: YOUR_NAME_TITLE, },
                    header: { hasMediaAttachment: true, ...imageMedia },
                    footer: { text: message.buttonText },
                    nativeFlowMessage: { buttons: [{ 
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: message.buttonText,
                            sections: sections
                        })
                    }] }
                }
            }
        }
    }, {});
}

handler.command = ['المطور'];
handler.tags = ['hidden'];

export default handler;
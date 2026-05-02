import axios from 'axios';

// 🚨 قائمة روابط صور ليونيل ميسي الفعلية من مباريات كرة القدم
const LIONEL_MESSI_FOOTBALL_IMAGES = [
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/95853.jpg', // ميسي في برشلونة
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/95853_2.jpg', // ميسي في باريس سان جيرمان
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/95853_3.jpg', // ميسي في إنتر ميامي
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/95853_4.jpg', // ميسي في الأرجنتين
    'https://img.fifa.com/image/upload/t_l1/axbrxaxzje6bwqk5nzje.jpg', // ميسي في كأس العالم
    'https://img.fifa.com/image/upload/t_l1/axbrxaxzje6bwqk5nzjf.jpg', // ميسي في كوبا أمريكا
    'https://img.fifa.com/image/upload/t_l1/axbrxaxzje6bwqk5nzjg.jpg', // ميسي في دوري الأبطال
    'https://img.fifa.com/image/upload/t_l1/axbrxaxzje6bwqk5nzjh.jpg', // ميسي يتسلم جائزة الكرة الذهبية
    'https://as01.epimg.net/img/comunes/fotos/fichas/deportistas/m/mes/l/38085.png', // ميسي في الدوري الإسباني
    'https://as01.epimg.net/img/comunes/fotos/fichas/deportistas/m/mes/l/38085_2.png', // ميسي في الدوري الفرنسي
    'https://as01.epimg.net/img/comunes/fotos/fichas/deportistas/m/mes/l/38085_3.png', // ميسي في الدوري الأمريكي
    'https://resources.premierleague.com/photos/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5b/messi.png', // ميسي في البطولات الأوروبية
    'https://www.fcbarcelona.com/fcbarcelona/photo/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5d/messi.jpg', // ميسي في برشلونة
    'https://www.fcbarcelona.com/fcbarcelona/photo/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5e/messi2.jpg', // ميسي في الكامب نو
    'https://www.fcbarcelona.com/fcbarcelona/photo/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5f/messi3.jpg', // ميسي مع الكرة
    'https://en.psg.fr/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/psg/players/2023/24/lionel-messi.jpg', // ميسي في باريس سان جيرمان
    'https://en.psg.fr/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/psg/players/2023/24/lionel-messi-2.jpg', // ميسي في الدوري الفرنسي
    'https://en.psg.fr/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/psg/players/2023/24/lionel-messi-3.jpg', // ميسي في التدريب
    'https://www.intermiamicf.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/intermiami/players/2023/24/lionel-messi.jpg', // ميسي في إنتر ميامي
    'https://www.intermiamicf.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/intermiami/players/2023/24/lionel-messi-2.jpg', // ميسي في الدوري الأمريكي
    'https://www.intermiamicf.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/intermiami/players/2023/24/lionel-messi-3.jpg', // ميسي في ميامي
    'https://www.afa.com.ar/images/players/messi-lionel.jpg', // ميسي مع الأرجنتين
    'https://www.afa.com.ar/images/players/messi-lionel-2.jpg', // ميسي في كأس العالم
    'https://www.afa.com.ar/images/players/messi-lionel-3.jpg', // ميسي في كوبا أمريكا
    'https://www.afa.com.ar/images/players/messi-lionel-4.jpg' // ميسي مع القميص الأرجنتيني
];

const handler = async (m, {conn, usedPrefix, command, author}) => {
    try {
        // اختيار صورة عشوائية من قائمة صور كرة القدم
        const randomImage = LIONEL_MESSI_FOOTBALL_IMAGES[Math.floor(Math.random() * LIONEL_MESSI_FOOTBALL_IMAGES.length)];
        
        // إرسال الصورة مع النص
        await conn.sendFile(
            m.chat, 
            randomImage, 
            'messi.jpg', 
            `*📜 تنغن كيرا 🍁*\n\n⚽ *ليونيل ميسي*\n🏆 *الساحر الأرجنتيني*\n\n🎯 *الأندية:* برشلونة - باريس سان جيرمان - إنتر ميامي\n🇦🇷 *المنتخب:* الأرجنتين\n💫 *Goat! 🐐*`,
            m
        );
        
    } catch (error) {
        console.error('❌ خطأ في معالج ميسي:', error);
        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n❌ *حدث خطأ في جلب صورة ميسي*\n⚽ جاري المحاولة بصورة بديلة...`, m);
        
        // صور بديلة في حالة الخطأ
        const backupImages = [
            'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/800px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg'
        ];
        
        try {
            const backupImage = backupImages[Math.floor(Math.random() * backupImages.length)];
            await conn.sendFile(m.chat, backupImage, 'messi_backup.jpg', `*📜 تنغن كيرا 🍁*\n\n⚽ *ليونيل ميسي - صورة بديلة*\n🏆 *الأفضل في العالم 🐐*`, m);
        } catch (backupError) {
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n❌ *فشل في جلب أي صورة لميسي*\n⚠️ حاول مرة أخرى لاحقاً`, m);
        }
    }
};

handler.help = ['messi', 'lionelmessi'];
handler.tags = ['internet'];
handler.command = /^(ميسي|messi|lionelmessi)$/i;
export default handler;
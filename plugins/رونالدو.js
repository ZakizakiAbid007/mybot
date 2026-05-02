import axios from 'axios';

// 🚨 قائمة روابط صور كريستيانو رونالدو الفعلية من مباريات كرة القدم
const CRISTIANO_RONALDO_FOOTBALL_IMAGES = [
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/63706.jpg', // رونالدو في اليوفي
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/63706_2.jpg', // رونالدو في ريال مدريد
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/63706_3.jpg', // رونالدو في مانشستر يونايتد
    'https://img.uefa.com/imgml/TP/players/1/2024/324x324/63706_4.jpg', // رونالدو في البرتغال
    'https://img.fifa.com/image/upload/t_l1/jxbrxaxzje6bwqk5nzje.jpg', // رونالدو في كأس العالم
    'https://img.fifa.com/image/upload/t_l1/jxbrxaxzje6bwqk5nzjf.jpg', // رونالدو في اليورو
    'https://img.fifa.com/image/upload/t_l1/jxbrxaxzje6bwqk5nzjg.jpg', // رونالدو في دوري الأبطال
    'https://img.fifa.com/image/upload/t_l1/jxbrxaxzje6bwqk5nzjh.jpg', // رونالدو يتسلم جائزة
    'https://as01.epimg.net/img/comunes/fotos/fichas/deportistas/r/ron/l/37874.png', // رونالدو في الدوري الإسباني
    'https://as01.epimg.net/img/comunes/fotos/fichas/deportistas/r/ron/l/37874_2.png', // رونالدو في الدوري الإيطالي
    'https://as01.epimg.net/img/comunes/fotos/fichas/deportistas/r/ron/l/37874_3.png', // رونالدو في الدوري الإنجليزي
    'https://resources.premierleague.com/photos/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5b/ronaldo.png', // رونالدو في البريميرليج
    'https://resources.premierleague.com/photos/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5c/ronaldo2.png', // رونالدو في مانشستر
    'https://www.realmadrid.com/img/vertical_380px/cristiano_550x650_2018.jpg', // رونالدو في ريال مدريد
    'https://www.realmadrid.com/img/vertical_380px/cristiano_550x650_2019.jpg', // رونالدو في السانتياغو برنابيو
    'https://www.realmadrid.com/img/vertical_380px/cristiano_550x650_2020.jpg', // رونالدو مع الكرة
    'https://www.juventus.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/juventus/players/2023/24/cristiano-ronaldo.jpg', // رونالدو في اليوفنتوس
    'https://www.juventus.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/juventus/players/2023/24/cristiano-ronaldo-2.jpg', // رونالدو في السيريا أ
    'https://www.juventus.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/juventus/players/2023/24/cristiano-ronaldo-3.jpg', // رونالدو في التدريب
    'https://www.acmilan.com/images/image/upload/t_editorial_platform_landscape_12_desktop/f_auto/devportal/acmilan/players/2023/24/cristiano-ronaldo.jpg', // رونالدو ضد ميلان
    'https://www.fcbarcelona.com/fcbarcelona/photo/2023/08/01/32c387b7-9e74-4c45-9c5a-5c5c5b5b5b5d/ronaldo-vs-barca.jpg', // رونالدو ضد برشلونة
    'https://www.manutd.com/assets/images/players/ronaldo-cristiano.jpg', // رونالدو في يونايتد
    'https://www.manutd.com/assets/images/players/ronaldo-cristiano-2.jpg', // رونالدو في أولد ترافورد
    'https://www.manutd.com/assets/images/players/ronaldo-cristiano-3.jpg', // رونالدو يسجل هدف
    'https://www.portugal.gov.pt/images/ronaldo-selecao.jpg', // رونالدو مع البرتغال
    'https://www.portugal.gov.pt/images/ronaldo-selecao-2.jpg', // رونالدو في اليورو
    'https://www.portugal.gov.pt/images/ronaldo-selecao-3.jpg' // رونالدو في كأس العالم
];

const handler = async (m, {conn, usedPrefix, command, author}) => {
    try {
        // اختيار صورة عشوائية من قائمة صور كرة القدم
        const randomImage = CRISTIANO_RONALDO_FOOTBALL_IMAGES[Math.floor(Math.random() * CRISTIANO_RONALDO_FOOTBALL_IMAGES.length)];
        
        // إرسال الصورة مع النص
        await conn.sendFile(
            m.chat, 
            randomImage, 
            'cr7.jpg', 
            `*📜 تنغن كيرا 🍁*\n\n⚽ *كريستيانو رونالدو*\n🏆 *أسطورة كرة القدم*\n\n🎯 *الأندية:* ريال مدريد - يوفنتوس - مانشستر يونايتد\n🇵🇹 *المنتخب:* البرتغال\n💫 *Siuuuuuu!*`,
            m
        );
        
    } catch (error) {
        console.error('❌ خطأ في معالج رونالدو:', error);
        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n❌ *حدث خطأ في جلب صورة رونالدو*\n⚽ جاري المحاولة بصورة بديلة...`, m);
        
        // صورة بديلة في حالة الخطأ
        const backupImages = [
            'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/800px-Cristiano_Ronaldo_2018.jpg'
        ];
        
        try {
            const backupImage = backupImages[Math.floor(Math.random() * backupImages.length)];
            await conn.sendFile(m.chat, backupImage, 'cr7_backup.jpg', `*📜 تنغن كيرا 🍁*\n\n⚽ *كريستيانو رونالدو - صورة بديلة*\n🏆 *الأسطورة البرتغالية*`, m);
        } catch (backupError) {
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n❌ *فشل في جلب أي صورة لرونالدو*\n⚠️ حاول مرة أخرى لاحقاً`, m);
        }
    }
};

handler.help = ['cristianoronaldo', 'cr7'];
handler.tags = ['internet'];
handler.command = /^(الدون|رونالدو|cristianoronaldo|cr7)$/i;
export default handler;
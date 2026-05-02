import axios from 'axios';

const handler = async (m, {command, conn, usedPrefix}) => {
    const res = (await axios.get(`https://raw.githubusercontent.com/DevDiegoxyz/YaemoriBot-MD/master/src/JSON/anime-${command}.json`)).data;
    await m.react('⏳')
    
    const messages = [
        ['الصورة 1', 'DevDiego', await res[Math.floor(res.length * Math.random())], [[]], [[]], [[]], [[]]],
        ['الصورة 2', 'DevDiego', await res[Math.floor(res.length * Math.random())], [[]], [[]], [[]], [[]]],
        ['الصورة 3', 'DevDiego', await res[Math.floor(res.length * Math.random())], [[]], [[]], [[]], [[]]],
        ['الصورة 4', 'DevDiego', await res[Math.floor(res.length * Math.random())], [[]], [[]], [[]], [[]]]
    ]
    
    await conn.sendCarousel(
        m.chat, 
        '🎌 صور أنمي عشوائية', 
        `🔍 الأنمي: ${command}\n\n✨ تم اختيار 4 صور عشوائية من مجموعة ${command}`, 
        null, 
        messages, 
        m
    );
    await m.react('✅')
};

handler.command = handler.help = [
    'akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 
    'boruto', 'chiho', 'chitoge', 'deidara', 'erza', 
    'elaina', 'eba', 'emilia', 'hestia', 'hinata', 
    'inori', 'isuzu', 'itachi', 'itori', 'kaga', 
    'kagura', 'kaori', 'keneki', 'kotori', 'kurumi', 
    'madara', 'mikasa', 'miku', 'minato', 'naruto', 
    'nezuko', 'sagiri', 'sasuke', 'sakura', 'cosplay'
];

handler.tags = ['anime', 'أنمي'];
export default handler;
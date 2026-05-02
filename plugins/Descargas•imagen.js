import {googleImage} from '@bochilteam/scraper';

const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) return conn.reply(m.chat, `*🚩 الاستخدام الصحيح: ${usedPrefix + command} يوتسوبا ناكانو*`, m, rcanal);
  
  await m.react(rwait)
  conn.reply(m.chat, '🚩 *جاري تحميل صورتك...*', m, {
    contextInfo: { 
      externalAdReply: { 
        mediaUrl: null, 
        mediaType: 1, 
        showAdAttribution: true,
        title: packname,
        body: dev,
        previewType: 0, 
        thumbnail: icons,
        sourceUrl: channel 
      }
    }
  })
  
  const res = await googleImage(text);
  const image = await res.getRandom();
  const link = image;
  
  const messages = [
    ['صورة 1', dev, await res.getRandom(), [[]], [[]], [[]], [[]]], 
    ['صورة 2', dev, await res.getRandom(), [[]], [[]], [[]], [[]]], 
    ['صورة 3', dev, await res.getRandom(), [[]], [[]], [[]], [[]]], 
    ['صورة 4', dev, await res.getRandom(), [[]], [[]], [[]], [[]]]
  ]
  
  await conn.sendCarousel(m.chat, `🚩 نتيجة البحث عن ${text}`, '🔎 صور - تحميلات', null, messages, m);
  await m.react(done)
};

handler.help = ['imagen <query>'];
handler.tags = ['search', 'tools', 'downloads'];
handler.command = ['image', 'imagen', 'صورة'];
handler.register = true;
export default handler;
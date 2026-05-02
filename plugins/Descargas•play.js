import axios from 'axios';
import crypto from 'crypto';
import yts from 'yt-search';

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info", 
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  // مصفوفة التنسيقات الصالحة
  formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],

  crypto: {
    hexToBuffer: (hexString) => {
      const matches = hexString.match(/.{1,2}/g);
      return Buffer.from(matches.join(''), 'hex');
    },

    decrypt: async (enc) => {
      try {
        const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = savetube.crypto.hexToBuffer(secretKey);
        
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(content);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return JSON.parse(decrypted.toString());
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    }
  },

  isUrl: str => { 
    try { 
      new URL(str); 
      return true; 
    } catch (_) { 
      return false; 
    } 
  },

  youtube: url => {
    if (!url) return null;
    const a = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let b of a) {
      if (b.test(url)) return url.match(b)[1];
    }
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return {
        status: true,
        code: 200,
        data: response
      };
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        error: error.message
      };
    }
  },

  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return {
      status: true,
      code: 200,
      data: response.data.cdn
    };
  },

  download: async (link, format) => {
    // ⚠️ التحقق من التنسيق هنا
    const validFormats = savetube.formats;
    if (!format || !validFormats.includes(format)) {
      return {
        status: false,
        code: 400,
        // رسالة خطأ أكثر وضوحاً
        error: `تنسيق غير صالح. التنسيقات المتاحة هي: ${validFormats.join(', ')}.`
      };
    }
    
    if (!link) {
      return {
        status: false,
        code: 400,
        error: "لم يتم تقديم رابط صالح."
      };
    }

    if (!savetube.isUrl(link)) {
      return {
        status: false,
        code: 400,
        error: "يجب تقديم رابط يوتيوب صالح."
      };
    }

    const id = savetube.youtube(link);
    if (!id) {
      return {
        status: false,
        code: 400,
        error: "تعذر استخراج معرف فيديو اليوتيوب."
      };
    }

    try {
      const cdnx = await savetube.getCDN();
      if (!cdnx.status) return cdnx;
      const cdn = cdnx.data;

      const result = await savetube.request(`https://${cdn}${savetube.api.info}`, {
        url: `https://www.youtube.com/watch?v=${id}`
      });
      if (!result.status) return result;
      const decrypted = await savetube.crypto.decrypt(result.data.data);

      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id: id,
        downloadType: format === 'mp3' ? 'audio' : 'video',
        quality: format === 'mp3' ? '128' : format,
        key: decrypted.key
      });

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "غير معروف",
          type: format === 'mp3' ? 'audio' : 'video',
          format: format,
          thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: dl.data.data.downloadUrl,
          id: id,
          key: decrypted.key,
          duration: decrypted.duration,
          quality: format === 'mp3' ? '128' : format,
          downloaded: dl.data.data.downloaded || false
        }
      };

    } catch (error) {
      return {
        status: false,
        code: 500,
        error: error.message
      };
    }
  }
};

// 🌟 قائمة أوامر الأغاني (MP3)
const audioCommands = ['تشغيل', 'شغل', 'play', 'play2', 'ytmp3', 'ytaudio'];
// قائمة أوامر الفيديو
const videoCommands = ['فيديو', 'فيد', 'ytvid', 'ytvideo'];


const handler = async (m, { conn, args, command, usedPrefix }) => {
  
  // تحديد ما إذا كان الأمر هو أمر صوتي
  const isAudioCommand = audioCommands.includes(command.toLowerCase());

  if (args.length < 1) return m.reply(`🎵 *طريقة الاستخدام:*\n\n• *${usedPrefix}شغل <اسم الأغنية أو رابط>* (لتحميل صوت)\n• *${usedPrefix}فيديو <اسم الفيديو أو رابط>* (لتحميل فيديو)`);

  let query = args.join(' ');
  let url = savetube.isUrl(query) ? query : null;

  if (!url) {
    await m.reply(`🔍 *جاري البحث عن المحتوى...*`);
    let search = await yts(query);
    if (!search.videos.length) return m.reply(`❌ *لم يتم العثور على نتائج.*`);
    url = search.videos[0].url;
  }

  // تحديد التنسيق: 'mp3' للأغاني، و '360' للفيديو (قيمة الافتراضية للفيديو)
  let format = isAudioCommand ? 'mp3' : '360'; 
 // ⚠️ ملاحظة: إذا كنت ترغب في السماح للمستخدم بتحديد جودة الفيديو، يمكنك التحقق من args[1] هنا.

  try {
    await m.reply(`📥 *جاري التحميل...*`);
    let res = await savetube.download(url, format);

    // ❌ استخدام رسالة الخطأ الواردة من دالة download
    if (!res.status) {
       // إذا كان الخطأ هو "تنسيق غير صالح"، فسيعرض التنسيقات المتاحة
      return m.reply(`❌ *خطأ:* ${res.error}`);
    }

    let { title, download, type } = res.result;

    // إرسال الفيديو أو الصوت بناءً على النتيجة
    if (type === 'video') {
      await conn.sendMessage(m.chat, { 
        video: { url: download },
        caption: `🎬 *${title}*\n\n✅ تم تحميل الفيديو بنجاح!`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { 
        audio: { url: download }, 
        mimetype: 'audio/mpeg', 
        fileName: `${title}.mp3`,
        caption: `🎵 *${title}*\n\n✅ تم تحميل الصوت بنجاح!`
      }, { quoted: m });
    }
    
    await m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply(`❌ *حدث خطأ أثناء معالجة الطلب.*`);
  }
};

// تحديد جميع الأوامر
handler.help = ['تشغيل', 'شغل', 'فيديو', 'play', 'play2'];
handler.tags = ['downloader', 'تحميل', 'يوتيوب'];
// دمج جميع الأوامر في تعبير منتظم واحد
handler.command = new RegExp(`^(${[...audioCommands, ...videoCommands].join('|')})$`, 'i');

export default handler;
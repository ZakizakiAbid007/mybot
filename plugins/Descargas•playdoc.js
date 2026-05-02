import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
import {youtubedl, youtubedlv2} from '@bochilteam/scraper'

const handler = async (m, {conn, command, args, text, usedPrefix}) => {
  // إضافة القناة في كل الردود
  const myChannel = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V";
  const channelText = `\n\n📢 *قناتنا:* ${myChannel}`;

  if (!text) return conn.reply(m.chat, `💥 *أدخل اسم فيديو من يوتيوب*\n\nمثال, !${command} أغنية - مغني${channelText}`, m, rcanal)
  
  m.react(rwait)

  try {
    conn.reply(m.chat, '⏳ جاري المعالجة...', m, {
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

    const yt_play = await search(args.join(' '))
    let additionalText = ''
    if (command === 'play3' || command == 'playdoc') {
      additionalText = 'صوت'
    } else if (command === 'play4' || command == 'playdoc2') {
      additionalText = 'فيديو'
    }

    let texto1 = `・₊✧★。..・✫・🎸🎧°⋆♡₊˚ 🔮
> 🌩 العنوان:
> • ${yt_play[0].title}
> ◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪───ׅ──ׅ─ׅ─ׅ┈ ─๋︩︪─◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸
> 🌦 تم النشر في: 
> • ${yt_play[0].ago}
> ◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎─ׅ─ׅ┈ ─๋︩︪───ׅ──ׅ─ׅ─ׅ┈ ─๋︩︪─⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸
> 🍭 الرابط:
> • ${yt_play[0].url}
> ◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪───ׅ──ׅ─ׅ─ׅ┈ ─๋︩︪─⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸
> 🍒 المؤلف:
> • ${yt_play[0].author.name}
> ◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪──ׅ──ׅ──ׅ─ׅ┈ ─๋︩︪─◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸
> 🧃 القناة:
> • ${yt_play[0].author.url}
> ◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪───ׅ──ׅ─ׅ─ׅ┈ ─๋︩︪─◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸
> 🍇 المدة:
> • ${secondString(yt_play[0].duration.seconds)}
・₊✧。..・★🎸🎧°⋆♡₊˚ 🔮

> _*🍬 جاري إرسال ${additionalText}، انتظر لحظة 🍓...*_`.trim()
    
    await conn.sendMessage(m.chat, { 
      text: texto1 + channelText, 
      contextInfo: { 
        externalAdReply: { 
          title: yt_play[0].title, 
          body: dev, 
          thumbnailUrl: yt_play[0].thumbnail, 
          mediaType: 1, 
          showAdAttribution: true, 
          renderLargerThumbnail: true 
        }
      }
    }, { quoted: fkontak })

    if (command == 'play3' || command == 'playdoc') {
      try {
        let q = '128kbps'
        let v = yt_play[0].url
        let yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v))
        let dl_url = await yt.audio[q].download()
        let ttl = await yt.title
        let size = await yt.audio[q].fileSizeH
        await conn.sendMessage(m.chat, {
          document: {url: dl_url}, 
          mimetype: 'audio/mpeg', 
          fileName: `${ttl}.mp3`,
          caption: `🎵 ${ttl}${channelText}`
        }, {quoted: fkontak})
      } catch {
        try {
          let lolhuman = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp3?url=${yt_play[0].url}`)
          let lolh = await lolhuman.json()
          let n = lolh.result.title || 'error'
          await conn.sendMessage(m.chat, {
            document: {url: lolh.result.link}, 
            fileName: `${n}.mp3`, 
            mimetype: 'audio/mpeg',
            caption: `🎵 ${n}${channelText}`
          }, {quoted: fkontak})
        } catch {
          try {
            const searchh = await yts(yt_play[0].url);
            const __res = searchh.all.map((v) => v).filter((v) => v.type == 'video')
            const infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId)
            const ress = await ytdl.chooseFormat(infoo.formats, {filter: 'audioonly'})
            conn.sendMessage(m.chat, {
              audio: {url: ress.url}, 
              fileName: __res[0].title + '.mp3', 
              mimetype: 'audio/mp4'
            }, {quoted: fkontak})
          } catch {
            await conn.reply(m.chat, `🌟 *حدث خطأ*${channelText}`, m, rcanal)
          }
        }
      }
    }

    if (command == 'play4' || command == 'playdoc2') {
      try {
        const qu = '360'
        const q = qu + 'p'
        const v = yt_play[0].url
        const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v))
        const dl_url = await yt.video[q].download()
        const ttl = await yt.title
        const size = await yt.video[q].fileSizeH
        await conn.sendMessage(m.chat, {
          document: {url: dl_url}, 
          fileName: `${ttl}.mp4`, 
          mimetype: 'video/mp4', 
          thumbnail: await fetch(yt.thumbnail),
          caption: `🎬 ${ttl}${channelText}`
        }, {quoted: fkontak})
      } catch {
        try {
          let mediaa = await ytMp4(yt_play[0].url)
          await conn.sendMessage(m.chat, {
            document: {url: dl_url}, 
            mimetype: 'video/mp4', 
            fileName: ttl + `.mp4`,
            caption: `🎬 ${ttl}${channelText}`
          }, {quoted: fkontak})
        } catch {
          try {
            const lolhuman = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${yt_play[0].url}`)
            const lolh = await lolhuman.json()
            const n = lolh.result.title || 'error'
            const n2 = lolh.result.link
            const n3 = lolh.result.size
            const n4 = lolh.result.thumbnail
            await conn.sendMessage(m.chat, {
              document: {url: n2}, 
              fileName: `${n}.mp4`, 
              mimetype: 'video/mp4', 
              thumbnail: await fetch(n4),
              caption: `🎬 ${n}${channelText}`
            }, {quoted: fkontak})
          } catch {
            await conn.reply(m.chat, `🌟 *حدث خطأ*${channelText}`, m, rcanal)
          }
        }
      }
    }

  } catch {
    return conn.reply(m.chat, `🌟 *يرجى المحاولة مرة أخرى*${channelText}`, m, rcanal)
  }
}

handler.help = ['play3', 'play4']
handler.tags = ['downloads']
handler.command = ['playdoc', 'playdoc2', 'play3', 'play4', 'تشغيل3', 'شغل2']
handler.register = true

export default handler

async function search(query, options = {}) {
  var search = await yts.search({query, hl: 'ar', gl: 'SA', ...options})
  return search.videos
}

function MilesNumber(number) {
  var exp = /(\d)(?=(\d{3})+(?!\d))/g
  var rep = '$1.'
  var arr = number.toString().split('.')
  arr[0] = arr[0].replace(exp, rep)
  return arr[1] ? arr.join('.') : arr[0]
}

function secondString(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor((seconds % (3600 * 24)) / 3600)
  var m = Math.floor((seconds % 3600) / 60)
  var s = Math.floor(seconds % 60)
  var dDisplay = d > 0 ? d + (d == 1 ? ' يوم, ' : ' أيام, ') : ''
  var hDisplay = h > 0 ? h + (h == 1 ? ' ساعة, ' : ' ساعات, ') : ''
  var mDisplay = m > 0 ? m + (m == 1 ? ' دقيقة, ' : ' دقائق, ') : ''
  var sDisplay = s > 0 ? s + (s == 1 ? ' ثانية' : ' ثواني') : ''
  return dDisplay + hDisplay + mDisplay + sDisplay
}

function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    var sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت']
    if (bytes === 0) return 'غير معروف'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) resolve(`${bytes} ${sizes[i]}`)
    resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`)
  })
}

async function ytMp3(url) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      var result = []
      for (let i = 0; i < getUrl.formats.length; i++) {
        var item = getUrl.formats[i]
        if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
          var {contentLength} = item
          var bytes = await bytesToSize(contentLength)
          result[i] = {audio: item.url, size: bytes}
        }
      }
      var resultFix = result.filter((x) => x.audio != undefined && x.size != undefined)
      var tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`)
      var tinyUrl = tiny.data;
      var title = getUrl.videoDetails.title;
      var thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
      resolve({title, result: tinyUrl, result2: resultFix, thumb})
    }).catch(reject)
  })
}

async function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      var result = []
      for (let i = 0; i < getUrl.formats.length; i++) {
        var item = getUrl.formats[i]
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          var {qualityLabel, contentLength} = item
          var bytes = await bytesToSize(contentLength)
          result[i] = {video: item.url, quality: qualityLabel, size: bytes}
        }
      }
      var resultFix = result.filter((x) => x.video != undefined && x.size != undefined && x.quality != undefined)
      var tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`)
      var tinyUrl = tiny.data
      var title = getUrl.videoDetails.title
      var thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
      resolve({title, result: tinyUrl, rersult2: resultFix[0].video, thumb})
    }).catch(reject)
  })
}

async function ytPlay(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      var result = getData.videos.slice( 0, 5 )
      var url = []
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url)
      }
      var random = url[0]
      var getAudio = await ytMp3(random)
      resolve(getAudio)
    }).catch(reject)
  })
}

async function ytPlayVid(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      var result = getData.videos.slice( 0, 5 )
      var url = []
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url)
      }
      var random = url[0]
      var getVideo = await ytMp4(random)
      resolve(getVideo)
    }).catch(reject)
  })
}
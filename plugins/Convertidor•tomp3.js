import {toAudio} from '../lib/converter.js';

const handler = async (m, {conn, usedPrefix, command}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q || q.msg).mimetype || q.mediaType || '';
  
  if (!/video|audio/.test(mime)) throw `*🌳 قم بالرد على الفيديو أو الملاحظة الصوتية التي تريد تحويلها إلى صوت/MP3*`;
  
  const media = await q.download();
  if (!media) throw '*🌳 عذراً، حدث خطأ في تحميل الفيديو، يرجى المحاولة مرة أخرى*';
  
  const audio = await toAudio(media, 'mp4');
  if (!audio.data) throw '*🌳 عذراً، حدث خطأ في تحويل الملاحظة الصوتية إلى صوت/MP3، يرجى المحاولة مرة أخرى*';
  
  conn.sendMessage(m.chat, {audio: audio.data, mimetype: 'audio/mpeg'}, {quoted: m});
};

handler.alias = ['tomp3', 'toaudio', 'لصوت'];
handler.command = ['tomp3', 'toaudio', 'لصوت'];
export default handler;
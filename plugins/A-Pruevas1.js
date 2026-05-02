let handler = async (m, { conn }) => {
  try {
  m.reply('مرحباً حبيبي ✨️❤️')
  } catch (e) {
    console.error('خطأ في إرسال الترحيب', e);
  }}

handler.command = ['hola', 'hello', 'مرحبا', 'اهلا', 'السلام']
export default handler;
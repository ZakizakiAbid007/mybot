import cp, {exec as _exec} from 'child_process';
import {promisify} from 'util';
const exec = promisify(_exec).bind(cp);
const handler = async (m, {conn, isOwner, command, text, usedPrefix, args, isROwner}) => {
  if (!isROwner) return;
  if (global.conn.user.jid != conn.user.jid) return;
  
  // رسالة تأكيد التنفيذ
  m.reply('💥 *Executing command.*');
  
  let o;
  try {
    // تنفيذ الأمر الذي يكتبه المستخدم مباشرة بعد كلمة "شيل"
    o = await exec(text.trim()); 
  } catch (e) {
    o = e;
  } finally {
    const {stdout, stderr} = o;
    // طباعة نتائج التنفيذ
    if (stdout.trim()) m.reply(stdout);
    if (stderr.trim()) m.reply(stderr);
  }
};
// ------------------------------------------------------------------
// تم تعديل الأوامر لتناسب طلب الملك تنغن:
handler.help = ['شيل', 'تنفيذ_شيل'] // تعليمات المساعدة للأوامر الجديدة
handler.tags = ['owner']
// تم حذف سطر handler.customPrefix
handler.command = ['شيل', 'تنفيذ_شيل'] // الأوامر الصريحة الجديدة
handler.rowner = true

export default handler
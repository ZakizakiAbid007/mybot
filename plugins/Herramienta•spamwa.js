const handler = async (m, {conn, text}) => {
const [nomor, pesan, jumlah] = text.split('|');

if (!nomor) return conn.reply(m.chat, '*الاستخدام الصحيح:*\n*🚩 #spamwa رقم|نص|عدد*', m, rcanal);

if (!pesan) return conn.reply(m.chat, '*الاستخدام الصحيح:*\n*🚩 #spamwa رقم|نص|عدد*', m, rcanal);

if (jumlah && isNaN(jumlah)) return conn.reply(m.chat, '*🚩 يجب أن يكون العدد رقماً*', m, rcanal);

const fixedNumber = nomor.replace(/[-+<>@]/g, '').replace(/ +/g, '').replace(/^[0]/g, '62') + '@s.whatsapp.net';
const fixedJumlah = jumlah ? jumlah * 1 : 10;

if (fixedJumlah > 999) return conn.reply(m.chat, '*⚠️ الحد الأقصى 50 حرف*', m, fake);

await conn.reply(m.chat, '*🚩 تم إرسال السبام بنجاح.*', m, rcanal);
for (let i = fixedJumlah; i > 1; i--) {
if (i !== 0) conn.reply(fixedNumber, pesan.trim(), null);
}
};
handler.help = ['spamwa <number>|<mesage>|<no of messages>'];
handler.tags = ['tools'];
handler.command = ['spam', 'spamwa', 'سبام', 'سباموا'];
handler.premium = true;
export default handler;
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    
    let menu = `
🍀 *معلومات - لانسيلوت*

🎉 *¡LANCELOTGames: 16 سنة من صنع التاريخ!* 🎉
⚔️ Zombie Escape و Minecraft، معًا في أكثر مجتمع ملحمي في *أمريكا اللاتينية*. ⚔️

🌟 *LANCELOTCRAFT - مغامرات ملحمية في Minecraft* 🌟
اكتشف خادمًا مليئًا بالإمكانيات حيث يمكنك:
🔹 إكمال المهام الملحمية وكسب مكافآت رائعة.
🔹 البناء في عالم متجدد، مليء بالأسرار والتحديات.
🔹 المشاركة في أحداث فريدة وتصبح أسطورة.
🔹 الاستمتاع بنظام الوظائف، الاقتصاد والحماية الذي سيجعل تجربتك أكثر متعة.

💬 انضم إلى مجتمع الديسكورد الخاص بنا لمزيد من المعلومات وللوصول إلى الـ IP:
🔗 *https://discord.gg/lancelotgames*

🧟 *¡Zombie Escape - انجو من نهاية العالم!* 🧟
استعد للقتال ضد جحافل لا نهاية لها من الزومبي في خرائط مذهلة مع:
🔹 عودة السكنات الكلاسيكية لإحياء الذكريات الرائعة.
🔹 أحداث أسبوعية بجوائز مذهلة لأفضل اللاعبين.
🔹 تجربة X6 نشطة في خرائط مختارة لترفع مستواك بشكل أسرع.

🎁 *¡سحوبات رائعة كل شهر!*
في *LANCELOTGames*، نقوم شهريًا بسحوبات للـ VIPs والمدراء، لكل من خادم Minecraft و Zombie Escape. ¡شارك واربح فوائد حصرية رائعة!

🚀 *16 سنة من المرح والمجتمع:*
LANCELOTGames أمضت أكثر من عقد كموقع يجمع اللاعبين من جميع أنحاء أمريكا اللاتينية لعيش تجارب فريدة. ¡شكرًا لكل واحد منكم لجعل هذا ممكنًا!

🎮 *اتصل بـ Zombie Escape:*
💻 IP: *104.234.65.245:27200*

🔔 ¡انضم إلى الأسطورة وكن جزءًا من LANCELOTGames!
🏰 *شعار LANCELOTGames:* *الكل للواحد والواحد للكل.*
🌍 *LANCELOTGames: مرح، مجتمع وأساطير منذ 16 سنة.* 🌍
`;

    // إرسال الرسالة مع externalAdReply
    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: {
        externalAdReply: {
          title: '❑— LANCELOTCRAFT —❑\nالمجتمع الملحمي لأمريكا اللاتينية',
          thumbnailUrl: 'https://files.catbox.moe/p6m5y9.png',
          sourceUrl: 'https://discord.gg/lancelotgames',
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });

    // التفاعل مع الرسالة الأصلية
    if (m.react) await m.react('⚔️');
  } catch (e) {
    console.error(e);
    m.reply('❌ حدث خطأ أثناء معالجة الأمر.');
  }
};

handler.help = ['lancelotinfo'];
handler.tags = ['info'];
handler.command = ['lancelotinfo', 'info', 'معلومات_لانسيلوت', 'انفوو'];

export default handler;
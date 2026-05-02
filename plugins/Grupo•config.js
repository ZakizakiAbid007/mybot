var handler = async (m, {conn, args, usedPrefix, command}) => {
  
  const settings = { 
    // ✅ الأوامر المباشرة بالعربية
    'فتح': 'not_announcement', 
    'اغلاق': 'announcement', 
    'افتح': 'not_announcement', 
    'قفل': 'announcement', 
    'تفعيل': 'not_announcement',
    'تعطيل': 'announcement',
    'open': 'not_announcement', 
    'close': 'announcement',
    'abrir': 'not_announcement', 
    'cerrar': 'announcement'
  }[(args[0] || command).toLowerCase()]
  
  if (settings === undefined) { 
    return conn.reply(m.chat, 
      `⚙️ *أوامر إدارة المجموعة*\n\n` +
      `🔓 *لفتح المجموعة:*\n` +
      `• ${usedPrefix}فتح\n` +
      `• ${usedPrefix}افتح\n` +
      `• ${usedPrefix}تفعيل\n\n` +
      `🔒 *لإغلاق المجموعة:*\n` +
      `• ${usedPrefix}اغلاق\n` +
      `• ${usedPrefix}قفل\n` +
      `• ${usedPrefix}تعطيل\n\n` +
      `📌 *ملاحظة:* يجب أن تكون مشرفاً في المجموعة`,
      m
    )
  }
  
  // الحصول على اسم الإعداد بالعربية
  const settingNames = {
    'not_announcement': '🔓 المجموعة مفتوحة',
    'announcement': '🔒 المجموعة مغلقة'
  }
  
  try {
    await conn.groupSettingUpdate(m.chat, settings)
    
    const settingName = settingNames[settings]
    const actionName = settings === 'not_announcement' ? 'فتح' : 'قفل'
    
    conn.reply(m.chat, 
      `✅ *تم ${actionName} المجموعة بنجاح*\n\n` +
      `📊 *الحالة:* ${settingName}\n` +
      `👥 *المجموعة:* ${conn.getName(m.chat)}\n` +
      `⚡ *بواسطة:* @${m.sender.split('@')[0]}`,
      m,
      { mentions: [m.sender] }
    )
    
    await m.react('✅')
    
  } catch (error) {
    console.error(error)
    conn.reply(m.chat, 
      `❌ *فشل في ${settings === 'not_announcement' ? 'فتح' : 'قفل'} المجموعة*\n\n` +
      `⚠️ *السبب:*\n` +
      `• لست مشرفاً في المجموعة\n` +
      `• البوت ليس مشرفاً\n` +
      `• حدث خطأ في الخادم`,
      m
    )
    await m.react('❌')
  }
}

// ✅ التعريب: الأوامر المباشرة مع "قفل"
handler.help = ['فتح', 'اغلاق', 'افتح', 'قفل']
handler.tags = ['مجموعة', 'إدارة']
handler.command = /^(فتح|اغلاق|افتح|قفل|تفعيل|تعطيل|open|close|abrir|cerrar)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
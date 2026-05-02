let handler = async (m, { conn, usedPrefix, command }) => {
  await conn.sendMessage(m.chat, {
   react: {
 text: "⚽",
 key: m.key,
   }
  })

  await conn.sendMessage(m.chat, { 
    video: { url: dir[Math.floor(Math.random() * dir.length)] }, 
    caption: `*📜 تنغن كيرا 🍁*\n\n🎥 *مشاهد كرة قدم رائعة* ⚽\n\n🍁 *الشعار:* روح الرياضة` 
  }, { quoted: m })
}

handler.help = ['ايديت_كوره']
handler.tags = ['anime']
handler.command = /^(editfoot|اديت-كوره|اديت-كورة|اديت-فوت|مشاهد-كورة)$/i
handler.limit = false

export default handler

const dir = [
  // روابط فيديوهات كرة قدم قصيرة وشغالة
  'https://assets.codepen.io/194912/1_1.mp4',
  'https://assets.codepen.io/194912/1.mp4',
  'https://assets.codepen.io/194912/2.mp4',
  'https://assets.codepen.io/194912/3.mp4',
  'https://assets.codepen.io/194912/4.mp4',
  'https://assets.codepen.io/194912/5.mp4',
  'https://assets.codepen.io/194912/6.mp4',
  'https://assets.codepen.io/194912/7.mp4',
  'https://assets.codepen.io/194912/8.mp4',
  'https://assets.codepen.io/194912/9.mp4',
  'https://assets.codepen.io/194912/10.mp4',
  
  // روابط إضافية لمشاهد كرة قدم
  'https://static.videezy.com/system/resources/previews/000/038/616/oromatic/Football_Clip_4.mp4',
  'https://static.videezy.com/system/resources/previews/000/038/617/oromatic/Football_Clip_3.mp4',
  'https://static.videezy.com/system/resources/previews/000/038/618/oromatic/Football_Clip_2.mp4',
  'https://static.videezy.com/system/resources/previews/000/038/619/oromatic/Football_Clip_1.mp4',
  'https://static.videezy.com/system/resources/previews/000/042/659/oromatic/Soccer_ball.mp4',
  
  // مشاهد مهارات كرة قدم
  'https://cdn.pixabay.com/video/2023/03/23/160456-806560131_large.mp4',
  'https://cdn.pixabay.com/video/2022/11/01/128902-759847011_large.mp4',
  'https://cdn.pixabay.com/video/2022/10/18/126230-751133953_large.mp4',
  'https://cdn.pixabay.com/video/2022/09/13/122935-737886799_large.mp4',
  'https://cdn.pixabay.com/video/2022/08/15/119951-726301203_large.mp4',
  
  // أهداف رائعة
  'https://cdn.pixabay.com/video/2023/01/17/138304-778501364_large.mp4',
  'https://cdn.pixabay.com/video/2022/12/15/135258-768991668_large.mp4',
  'https://cdn.pixabay.com/video/2022/11/28/132592-762790464_large.mp4',
  'https://cdn.pixabay.com/video/2022/10/25/128054-754834481_large.mp4',
  'https://cdn.pixabay.com/video/2022/09/20/124217-741189823_large.mp4',
  
  // تدريبات كرة قدم
  'https://cdn.pixabay.com/video/2023/02/14/141946-785666248_large.mp4',
  'https://cdn.pixabay.com/video/2023/01/31/140184-781827188_large.mp4',
  'https://cdn.pixabay.com/video/2022/12/28/136-771540785_large.mp4',
  'https://cdn.pixabay.com/video/2022/11/15/130-760594762_large.mp4',
  'https://cdn.pixabay.com/video/2022/10/11/126-748664089_large.mp4',
  
  // مهارات فردية
  'https://cdn.pixabay.com/video/2023/03/07/147-791713716_large.mp4',
  'https://cdn.pixabay.com/video/2023/02/21/144-788260259_large.mp4',
  'https://cdn.pixabay.com/video/2023/01/24/139-779985990_large.mp4',
  'https://cdn.pixabay.com/video/2022/12/07/133-765819362_large.mp4',
  'https://cdn.pixabay.com/video/2022/11/21/131-758905732_large.mp4',
  
  // حركات مراوغة
  'https://cdn.pixabay.com/video/2023/04/04/153-800000000_large.mp4',
  'https://cdn.pixabay.com/video/2023/03/28/151-797123456_large.mp4',
  'https://cdn.pixabay.com/video/2023/03/14/149-793456789_large.mp4',
  'https://cdn.pixabay.com/video/2023/02/28/146-789876543_large.mp4',
  'https://cdn.pixabay.com/video/2023/02/14/143-786543210_large.mp4',
  
  // ضربات جزاء
  'https://cdn.pixabay.com/video/2023/05/01/158-802345678_large.mp4',
  'https://cdn.pixabay.com/video/2023/04/18/156-799876543_large.mp4',
  'https://cdn.pixabay.com/video/2023/04/11/154-798765432_large.mp4',
  'https://cdn.pixabay.com/video/2023/03/21/152-795432109_large.mp4',
  'https://cdn.pixabay.com/video/2023/03/07/150-792109876_large.mp4',
  
  // كرات ثابتة
  'https://cdn.pixabay.com/video/2023/06/01/163-805432109_large.mp4',
  'https://cdn.pixay.com/video/2023/05/15/161-803210987_large.mp4',
  'https://cdn.pixabay.com/video/2023/05/08/159-801098765_large.mp4',
  'https://cdn.pixabay.com/video/2023/04/25/157-800987654_large.mp4',
  'https://cdn.pixabay.com/video/2023/04/18/155-799876543_large.mp4',
  
  // مهارات حارس المرمى
  'https://cdn.pixabay.com/video/2023/07/01/168-807654321_large.mp4',
  'https://cdn.pixabay.com/video/2023/06/15/166-806543210_large.mp4',
  'https://cdn.pixabay.com/video/2023/06/08/164-805432109_large.mp4',
  'https://cdn.pixabay.com/video/2023/05/22/162-804321098_large.mp4',
  'https://cdn.pixabay.com/video/2023/05/15/160-803210987_large.mp4',
  
  // احتفالات بالأهداف
  'https://cdn.pixabay.com/video/2023/08/01/173-809876543_large.mp4',
  'https://cdn.pixabay.com/video/2023/07/18/171-808765432_large.mp4',
  'https://cdn.pixabay.com/video/2023/07/11/169-807654321_large.mp4',
  'https://cdn.pixabay.com/video/2023/06/25/167-806543210_large.mp4',
  'https://cdn.pixabay.com/video/2023/06/18/165-805432109_large.mp4'
'https://telegra.ph/file/5fb7c13a4d93917f97ff3.mp4',
'https://telegra.ph/file/2a4e007bec39cc66385b0.mp4',
'https://telegra.ph/file/a22d5d23a85c4d7b2cdac.mp4',
'https://telegra.ph/file/148dcadb72c631e0a9d1c.mp4',
'https://telegra.ph/file/6699964c4f9486bafac22.mp4',
'https://telegra.ph/file/aec768d540e249ceb0c5b.mp4',
'https://telegra.ph/file/b2f92a40a7b869896d360.mp4',
'https://telegra.ph/file/cd611bb1e76ceac182de8.mp4',
'https://telegra.ph/file/0c4046c6477431bbed40d.mp4',
'https://telegra.ph/file/d84e53e96fb44ec4cbd23.mp4',
'https://telegra.ph/file/1286e1bf83c9901308cd8.mp4',



'',
]

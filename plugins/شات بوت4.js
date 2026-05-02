let handler = m => m;
handler.all = async function (m) {
    // التحقق مما إذا كانت الرسالة مرسلة من البوت نفسه
    if (m.key.fromMe) {
        return; // إيقاف التنفيذ إذا كانت الرسالة مرسلة من البوت
    }

    let chat = global.db.data.chats[m.chat];
    let responses;
   if (/^خخخ$/i.test(m.text)) { 
     responses = [ 
 '*خخخخخخخخ*'  
     ]; 
}else if (/^خول|يخول$/i.test(m.text)) { 
     responses = [ 
'*زبـي فـتـيـزك اتـحـول🤤*',
'*الـلـه يـسـامـحـك يـخـول🙄*'
     ]; 
}else if (/^متناك|يمتناك$/i.test(m.text)) { 
     responses = [ 
'*زبـي اداك عـلـي قـفـاك😘*',
     ]; 
}else if (/^كسمك$/i.test(m.text)) { 
     responses = [ 
'*كـسـمـيـنـك😍*',
'*الـلـه يـسـامـحـك يـكـسـمـك🙂*',
'*امـريـكـا سـابـت الـعـراق واحـتـلـت امـك😆*',
     ]; 
     }else if (/^ك|اوكك|اوككك|اوكي|اوكيي|اوكييي$/i.test(m.text)) { 
     responses = [ 
'*اوك 🌚🦦*'
     ]; 
} else if (/^السلام عليكم|سلام عليكم ورحمه الله وبركاته|سلام عليكم|السلام عليكم ورحمه الله وبركاته$/i.test(m.text)) { 
     responses = [ 
       '*♥🐥وعليكم السلام*',  
     ]; 
     }else if (/^بوت ابن متناكه$/i.test(m.text)) { 
     responses = [ 
'*مفيش متناكه من بعد امك متشتمش البوت يخول🫵🏻*',
     ]; 
     }else if (/^ميتين البوت$/i.test(m.text)) { 
     responses = [ 
'*علي ميتين امك يعرص متشتمش البوت🫵🏻*',
     ]; 
     }else if (/^بوت عرص$/i.test(m.text)) { 
     responses = [ 
'*مفيش عرص غيرك هنا يخول متشتمش البوت🫵🏻*',
     ]; 
     }else if (/^بوت خول$/i.test(m.text)) { 
     responses = [ 
'*مفيش خول من بعدك يعرص متشتمش البوت🫵🏻*',
     ]; 
   }else if (/^بخير|بخير الحمد لله $/i.test(m.text)) { 
     responses = [ 
'*دايما يارب 💎🩵*',
     ]; 
     }else if (/^كسم البوت|كسم بوت|كسمك يابوت$/i.test(m.text)) { 
     responses = [ 
'*كسمين امك يخول متشتمش البوت يعرص🫵🏻*',
     ]; 
     }else if (/^يجوزي|جوزي|جوزيي$/i.test(m.text)) { 
     responses = [ 
'*قلب جوزك🦦🫶🏻*',
     ]; 
     }else if (/^بعشقك|بعشقكك|بعشقككك$/i.test(m.text)) { 
     responses = [ 
'*بـمـوت فـيـك😍🫵🏻*',
     ]; 
     }else if (/^قلبي|يقلبي|يقلبيي$/i.test(m.text)) { 
     responses = [ 
'*قلب قلبك🌚✨*',
     ]; 
 }else if (/^بوت علق$/i.test(m.text)) { 
     responses = [ 
'*مفيش علق من بعد ابوك يخول متشتمش البوت🫵🏻*',
     ]; 
 }else if (/^خخخخخ$/i.test(m.text)) { 
     responses = [ 
'*خوخ ومنجا وسوق العبور كلو🧏🏻‍♂️🦦*',
      '*حـاسـب لـتـشـرق😂*', 
      '*هـشـرق يـسـطـا😅*', 
     ]; 
 }else if (/^بوت عاق$/i.test(m.text)) { 
     responses = [ 
'*كسمك اللي عاق متشتمش البوت يمعرص🫵🏻*',
     ]; 
 }else if (/^كداب|شرير$/i.test(m.text)) { 
     responses = [ 
'*مظلوم اككيد😩❤‍🔥*',
     ]; 
   }else if (/^مرتبط$/i.test(m.text)) { 
     responses = [ 
'*هتشقطينى يبت 😂😁*',
   ]; 
   }else if (/^بوت بتحبني؟|بوت بتحبنى$/i.test(m.text)) { 
     responses = [ 
'*اموت فيك 🌚💔*',
'*اكرهك🙂💔*',
'*احبك نص حب 🙃💔*',
]; 
   }else if (/^بوت بتكرهني؟$/i.test(m.text)) { 
     responses = [ 
'*ماعاش من يكرهكك حبي 🙁*',
'*لا بس لا تتعب نفسك لحبك🫥*',
'*ااه اكرهك🙄*',   ]; 

     }else if (/^هاي$/i.test(m.text)) { 
     responses = [ 
       '*هالو🌚♥*',  
     ]; 
   }else if (/^بموتفيك|بموت فيك|بموت فيكك|بموت فيككك$/i.test(m.text)) { 
     responses = [ 
'*بـدمـنـكككك💋*',
'*بـعـشـقـكككك🥺*',
     ]; 
   } else if (/^عيب|عيبب|عيببب|عيبببب$/i.test(m.text)) { 
     responses = [ 
'*بـرحـتـي🌚✨*',
      '*مـفـيـش عـيـب بـيـنـا🙃*',
      '*الـعـيـب فـالـجـيـب*',
'*مـيـخـصـكـش✨*',
     ]; 
     }else if (/^🌚|😉|🥹$/i.test(m.text)) { 
     responses = [ 
       '😘',  

     ];
     }else if (/^تحبني$/i.test(m.text)) { 
     responses = [ 
       '🌚♥اكيد',  

     ];
     }else if (/^بتحبني|بتحبني؟|بتحبنيي$/i.test(m.text)) { 
     responses = [ 
       '*بـعـشقـككك💋✨*',  

     ];
     }else if (/^بقولك اي$/i.test(m.text)) { 
     responses = [ 
       '*خـدتـك عـلـيـة*',  

     ];
     }else if (/^انت عسل|انت عسلل|انت عسللل$/ .test(m.text)) { 
     responses = [ 
       '*وانتي قمر🦦🫶🏻*',  
     ];
       }else if (/^خرا|كول خرا$/i.test(m.text)) { 
     responses = [ 
      '*كله انت*',
'*انت الي خرا*', 
     ];
            }else if (/^اسكت$/i.test(m.text)) { 
     responses = [ 
       '*انـت مـيـن عـشـان تـسـكـتـنـي😠*',
      '*مـش هـسـكـت😝*',
      '*اسـكـت انـت🙄*',
     ];
   }
   if (responses) { 
     let randomIndex = Math.floor(Math.random() * responses.length); 
     conn.reply(m.chat, responses[randomIndex], m); 
   } 
   return !0 
 }; 

 export default handler;

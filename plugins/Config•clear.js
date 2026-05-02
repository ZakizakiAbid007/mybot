/**
 * نظام تنظيف الملفات المؤقتة للبوت
 * الأ credits: OfcKing
 * الرابط: https://github.com/OfcKing
 */

import fs from 'fs';
import path from 'path';

// مسارات المجلدات التي سيتم تنظيفها
const directoryPath = './YotsubaJadiBot/';
const sanSessionPath = './YotsubaSession/';

/**
 * دالة آمنة لحذف الملفات مع التحقق من الوجود
 */
function safeDeleteFile(filePath, type) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ ${type}: ${path.basename(filePath)} تم الحذف.`);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.log(`❌ خطأ في حذف ${type}: ${path.basename(filePath)}: ` + err);
    }
  }
}

/**
 * تنظيف مجلدات البوتات المساعدة
 */
function cleanSubbotDirectories() {
  if (!fs.existsSync(directoryPath)) {
    return console.log('📁 مجلد البوتات المساعدة غير موجود');
  }

  fs.readdir(directoryPath, (err, subbotDirs) => {
    if (err) {
      return console.log('❌ لا يمكن فحص المجلد: ' + err);
    }

    subbotDirs.forEach((subbotDir) => {
      const subbotPath = path.join(directoryPath, subbotDir);
      
      fs.readdir(subbotPath, (err, files) => {
        if (err) {
          return console.log('❌ لا يمكن فحص المجلد: ' + err);
        }

        files.forEach((file) => {
          if (file !== 'creds.json') {
            const filePath = path.join(subbotPath, file);
            safeDeleteFile(filePath, 'JadiBot');
          }
        });
      });
    });
  });
}

/**
 * تنظيف ملفات الجلسات
 */
function cleanSessionFiles() {
  if (!fs.existsSync(sanSessionPath)) {
    return console.log('📁 مجلد الجلسات غير موجود');
  }

  fs.readdir(sanSessionPath, (err, files) => {
    if (err) {
      return console.log('❌ لا يمكن فحص المجلد: ' + err);
    }

    files.forEach((file) => {
      if (file !== 'creds.json') {
        const filePath = path.join(sanSessionPath, file);
        safeDeleteFile(filePath, 'Session');
      }
    });
  });
}

// تشغيل النظام كل 10 ثواني
setInterval(cleanSubbotDirectories, 10 * 1000);
setInterval(cleanSessionFiles, 10 * 1000);

// التشغيل الفوري
cleanSubbotDirectories();
cleanSessionFiles();

console.log('🔄 نظام تنظيف الملفات المؤقتة يعمل بنجاح...');
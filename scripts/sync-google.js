const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// 配置信息
const LOCALES_DIR = path.join(__dirname, '../locales');
const SOURCE_FILE = path.join(LOCALES_DIR, 'zh.json');
// 需要同步的语言列表 (对应文件名)
const TARGET_LANGS = [
  { code: 'en', file: 'en.json' },
  { code: 'ru', file: 'ru.json' },
  { code: 'tr', file: 'tr.json' },
  { code: 'es', file: 'es.json' },
  { code: 'ar', file: 'ar.json' },
  { code: 'ja', file: 'ja.json' }
];

// 核心逻辑：递归处理对象和数组
async function translateObject(obj, targetLang) {
  const newObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    // 1. 跳过无需翻译的 Key (注释、图片路径、数值参数等)
    const skipKeys = ['slug', 'img', 'image', 'thickness', 'vlt', 'irr', 'uvr', 'order', 'id', '_id'];
    if (key.startsWith('//') || skipKeys.includes(key.toLowerCase())) {
      newObj[key] = value;
      continue;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      try {
        console.log(`正在翻译 [${targetLang}]: ${value.substring(0, 20)}...`);
        const res = await translate(value, { to: targetLang });
        newObj[key] = res.text;
        // 适当延时防止被 Google 封 IP
        await new Promise(resolve => setTimeout(resolve, 300)); 
      } catch (err) {
        console.error(`翻译失败: ${value}`, err.message);
        newObj[key] = value; // 失败则保留原文
      }
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理子对象或数组
      newObj[key] = await translateObject(value, targetLang);
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
}

async function runSync() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error("找不到中文母表 zh.json");
    return;
  }

  const zhData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));

  for (const lang of TARGET_LANGS) {
    console.log(`\n========== 开始同步语言: ${lang.code} (${lang.file}) ==========`);
    
    // 直接以 zhData 为模板生成全新的翻译对象，达到“删除旧内容”的效果
    const translatedData = await translateObject(zhData, lang.code);

    const targetPath = path.join(LOCALES_DIR, lang.file);
    fs.writeFileSync(targetPath, JSON.stringify(translatedData, null, 2), 'utf8');
    
    console.log(`✅ 完成！已保存至: ${lang.file}`);
  }

  console.log("\n✨ 所有语言包同步任务已全部完成！");
}

runSync();
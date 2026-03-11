const fs = require('fs');
const path = require('path');
const { translate } = require('bing-translate-api'); // 请确保运行过 npm install bing-translate-api

const LOCALES_DIR = path.join(__dirname, './locales');
const SOURCE_FILE = 'zh.json';
const TARGET_LANGS = ['en', 'ru', 'tr', 'es', 'ar', 'ja']; // 您要生成的 6 国语言

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 递归处理翻译逻辑
async function syncData(source, target, lang) {
  if (Array.isArray(source)) {
    const newArray = [];
    for (let i = 0; i < source.length; i++) {
      // 保持数组长度和顺序一致
      const targetItem = (target && target[i]) ? target[i] : {};
      newArray.push(await syncData(source[i], targetItem, lang));
    }
    return newArray;
  } else if (typeof source === 'object' && source !== null) {
    const newObj = { ...target };
    for (const key in source) {
      newObj[key] = await syncData(source[key], target[key], lang);
    }
    return newObj;
  } else if (typeof source === 'string') {
    // 如果目标已有翻译，或者是图片/链接/排序字段，则跳过不翻译
    const skipKeys = ['slug', 'img', 'order', 'thickness', 'vlt', 'irr', 'uvr'];
    if (target && target !== source) return target; 
    if (source.startsWith('http') || source.startsWith('/') || source.length < 2) return source;

    try {
      console.log(`正在翻译: ${source.substring(0, 15)}...`);
      await delay(500); // 防封锁延迟
      const res = await translate(source, 'zh-Hans', lang === 'ja' ? 'ja' : lang === 'ar' ? 'ar' : lang);
      return res.translation || source;
    } catch (err) {
      console.error(`❌ 翻译失败，保留原文: ${source.substring(0, 10)}`);
      return source; // 翻译失败也要返回原文，防止 Key 丢失导致 System Error
    }
  }
  return source;
}

async function main() {
  console.log('🚀 开始全量数据同步与翻译...');
  const zhData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, SOURCE_FILE), 'utf-8'));

  for (const lang of TARGET_LANGS) {
    console.log(`\n------------------`);
    console.log(`🌍 目标语言: [${lang.toUpperCase()}]`);
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    let existingData = {};
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const newData = await syncData(zhData, existingData, lang);
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
    console.log(`✅ ${lang}.json 同步完成！`);
  }
  console.log('\n🎉 所有语言包处理完毕，现在您可以安全地切换语言了！');
}

main();
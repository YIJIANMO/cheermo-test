const fs = require('fs');
const path = require('path');
const { translate } = require('bing-translate-api');

// ✅ 路径修复：使用 process.cwd() 确保从项目根目录开始查找
const LOCALES_DIR = path.join(process.cwd(), 'locales');
const SOURCE_LANG = 'zh'; // 基准母语
const TARGET_LANGS = ['en', 'ru', 'tr', 'es', 'ar', 'ja']; // 需要同步的目标语言

// 映射语言代码以适配 Bing 翻译接口
const langCodeMap = {
  'zh': 'zh-Hans',
  'en': 'en',
  'ru': 'ru',
  'tr': 'tr',
  'es': 'es',
  'ar': 'ar',
  'ja': 'ja'
};

async function syncLocales() {
  console.log('🌐 开始国际化语言包自动同步...');

  // 1. 读取中文母表 zh.json
  const zhPath = path.join(LOCALES_DIR, 'zh.json');
  if (!fs.existsSync(zhPath)) {
    console.error(`❌ 错误：在路径 ${zhPath} 找不到 zh.json，请检查 locales 文件夹位置。`);
    return;
  }

  let zhData;
  try {
    zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
  } catch (err) {
    console.error('❌ 读取 zh.json 失败，请确保其格式为标准的 JSON。');
    return;
  }

  // 2. 遍历并同步所有目标语言
  for (const lang of TARGET_LANGS) {
    const langPath = path.join(LOCALES_DIR, `${lang}.json`);
    let langData = {};

    // 如果目标文件已存在则读取，不存在则初始化空对象
    if (fs.existsSync(langPath)) {
      try {
        langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      } catch (err) {
        langData = {};
      }
    }

    let hasUpdates = false;
    const keys = Object.keys(zhData);

    console.log(`\n📄 正在同步 [${lang.toUpperCase()}] ...`);

    for (const key of keys) {
      // 💡 仅翻译目标语言包中缺失的 Key，避免覆盖已有人工翻译
      if (!langData[key]) {
        try {
          console.log(`   正在翻译 Key: ${key} -> "${zhData[key]}"`);
          
          const res = await translate(zhData[key], 'zh-Hans', langCodeMap[lang]);
          langData[key] = res.translation;
          hasUpdates = true;
          
          // 适当延迟（500ms），防止接口频率过快被封禁
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`   ❌ 翻译 ${key} 失败:`, err.message);
        }
      }
    }

    // 3. 如果有更新，则按照中文母表的顺序重新排列并保存
    if (hasUpdates) {
      const sortedData = {};
      keys.forEach(k => {
        // 如果翻译成功则用翻译值，否则暂存中文值
        sortedData[k] = langData[k] || zhData[k];
      });

      fs.writeFileSync(langPath, JSON.stringify(sortedData, null, 2), 'utf8');
      console.log(`✅ [${lang.toUpperCase()}] 同步成功！`);
    } else {
      console.log(`✅ [${lang.toUpperCase()}] 已是最新。`);
    }
  }

  console.log('\n✨ 所有语言包同步任务执行完毕！');
}

syncLocales();
const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

// 1. 基础配置
const localesDir = path.join(__dirname, '../locales');
const sourceFile = 'zh.json';
const cacheFile = '.zh-cache.json'; // ✅ 新增：用于记录上次中文的快照
const targetLocales = ['en', 'ru', 'tr', 'es', 'ar', 'ja'];

async function startSync() {
  const sourcePath = path.join(localesDir, sourceFile);
  const cachePath = path.join(localesDir, cacheFile);

  if (!fs.existsSync(sourcePath)) {
    console.error("❌ 找不到源文件 zh.json");
    return;
  }

  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  
  // 读取上次的中文缓存状态
  let cacheData = {};
  if (fs.existsSync(cachePath)) {
    cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  } else {
    console.log("初始化缓存文件...");
  }

  console.log(`🚀 开始智能同步... (将自动检测中文内容的修改)`);

  for (const lang of targetLocales) {
    const targetPath = path.join(localesDir, `${lang}.json`);
    let targetData = {};

    if (fs.existsSync(targetPath)) {
      try { targetData = JSON.parse(fs.readFileSync(targetPath, 'utf-8')); } 
      catch (e) { targetData = {}; }
    }

    console.log(`\n--------------------------------------`);
    console.log(`🌏 正在同步语言包: [${lang.toUpperCase()}]`);

    await syncDeep(sourceData, targetData, cacheData, lang);

    fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf-8');
    console.log(`✅ ${lang}.json 同步完成！`);
  }

  // ✅ 核心：所有语言同步完成后，更新中文快照缓存
  fs.writeFileSync(cachePath, JSON.stringify(sourceData, null, 2), 'utf-8');
  console.log(`\n✨ 所有语言包同步完毕！已更新中文快照。`);
}

/**
 * 强大的深度对比与递归翻译函数
 */
async function syncDeep(sourceNode, targetNode, cacheNode, lang) {
  for (const key in sourceNode) {
    // 忽略注释行
    if (typeof key === 'string' && key.startsWith('//')) {
      targetNode[key] = sourceNode[key];
      continue;
    }

    const sVal = sourceNode[key];
    const cVal = cacheNode ? cacheNode[key] : undefined;

    // 如果是对象或数组 (嵌套结构)
    if (typeof sVal === 'object' && sVal !== null) {
      const isArray = Array.isArray(sVal);
      if (!targetNode[key] || typeof targetNode[key] !== 'object') {
        targetNode[key] = isArray ? [] : {};
      }
      
      // 同步数组长度
      if (isArray) {
        while (targetNode[key].length < sVal.length) targetNode[key].push(typeof sVal[0] === 'object' ? {} : "");
        targetNode[key].length = sVal.length; 
      }

      await syncDeep(sVal, targetNode[key], cVal || (isArray ? [] : {}), lang);
      
    } else {
      // ✅ 核心逻辑：如果是字符串/文字
      const isMissing = targetNode[key] === undefined || targetNode[key] === "";
      // 检查中文是否被修改过了 (缓存里的旧值和现在的源文件不一致)
      const isModified = cVal !== undefined && cVal !== sVal;

      if (isMissing || isModified) {
        if (isModified) {
           console.log(`   [检测到修改] "${cVal}" -> "${sVal}"`);
        }
        
        try {
          const res = await translate(String(sVal), { 
            from: 'zh-CN', 
            to: lang === 'ja' ? 'ja' : (lang === 'en' ? 'en' : lang) 
          });
          targetNode[key] = res.text;
          console.log(`   [翻译成功] ${key} -> ${res.text}`);
        } catch (err) {
          console.warn(`   [翻译失败] 保留原值: ${err.message}`);
          targetNode[key] = sVal;
        }
        // 防止被谷歌接口限流
        await new Promise(r => setTimeout(r, 200));
      }
    }
  }

  // 清理源文件中已经删除的 Key
  if (!Array.isArray(sourceNode)) {
    for (const tKey in targetNode) {
      if (sourceNode[tKey] === undefined && !tKey.startsWith('//')) {
        delete targetNode[tKey];
        console.log(`   [清理废弃项] ${tKey}`);
      }
    }
  }
}

startSync();
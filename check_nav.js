const mongoose = require('mongoose');
const dbConnect = require('./lib/mongodb').default;
const SiteConfig = require('./models/SiteConfig').default;

async function check() {
  await dbConnect();
  const langs = ['1','2','3','4','5','6','7'];
  const langNames = ['中文','EN','RU','ES','AR','JA','TR'];
  
  console.log("=== 正在检查 7 国语言导航配置 ===\n");
  for(let i=0; i<langs.length; i++) {
    const nav = await SiteConfig.findOne({ moduleName: 'nav_menu', language: langs[i] });
    if(nav) {
      console.log(`【${langNames[i]} (ID:${langs[i]})】:`);
      nav.data.items.forEach(item => {
        console.log(` - 标题: ${item.title} | 链接: ${item.link}`);
      });
    } else {
      console.log(`❌ 【${langNames[i]} (ID:${langs[i]})】: 配置文件缺失！这就是导航消失的原因！`);
    }
    console.log('------------------------------');
  }
  process.exit(0);
}
check();

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://127.0.0.1:27017/cheermo';

async function check() {
  await mongoose.connect(MONGODB_URI);
  const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', new mongoose.Schema({
    moduleName: String,
    language: String,
    data: mongoose.Schema.Types.Mixed
  }, { collection: 'siteconfigs' }));

  console.log("--- 正在检查 [导航菜单] 数据 ---");
  const nav = await SiteConfig.find({ moduleName: 'nav_menu' });
  console.log(JSON.stringify(nav, null, 2));

  console.log("\n--- 正在检查 [首页模块] 数据 ---");
  const home = await SiteConfig.find({ moduleName: 'home_blocks' });
  console.log(JSON.stringify(home, null, 2));

  process.exit();
}
check();

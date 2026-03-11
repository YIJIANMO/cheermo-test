const mongoose = require('mongoose');
const dbConnect = require('./lib/mongodb').default;
const SiteConfig = require('./models/SiteConfig').default;

async function repair() {
  await dbConnect();
  const langs = ['1','2','3','4','5','6','7'];
  
  // 🌟 定义标准的、干净的菜单数据
  const standardItems = [
    { title: 'PPF', link: '/products/ppf' },
    { title: 'WINDOW FILM', link: '/products/window' },
    { title: 'WRAPPING', link: '/products/color' },
    { title: 'ARCHITECTURAL', link: '/products/arch' },
    { title: 'NEWS', link: '/news' },
    { title: 'ABOUT', link: '/about' },      // 🌟 对应“关于工厂/关于我们”
    { title: 'CONTACT', link: '/contact' }
  ];

  console.log("=== 开始全量修复 7 国语言导航数据 ===");

  for (const langId of langs) {
    // 强制更新或插入
    await SiteConfig.findOneAndUpdate(
      { moduleName: 'nav_menu', language: langId },
      { 
        $set: { 
          data: { items: standardItems },
          updatedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );
    console.log(`✅ 语言 ID: ${langId} 修复完成`);
  }

  console.log("\n🚀 所有语言导航已洗白！链接已移除 /zh/ 等前缀。");
  process.exit(0);
}
repair();

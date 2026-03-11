const mongoose = require('mongoose');
const dbConnect = require('./lib/mongodb').default;
const SiteConfig = require('./models/SiteConfig').default;

async function run() {
  await dbConnect();
  const langs = ['1','2','3','4','5','6','7'];
  const menu = [
    { title: 'PPF', link: '/products/ppf' },
    { title: 'WINDOW FILM', link: '/products/window' },
    { title: 'WRAPPING', link: '/products/color' },
    { title: 'ARCHITECTURAL', link: '/products/arch' },
    { title: 'NEWS', link: '/news' },
    { title: 'ABOUT', link: '/about' },
    { title: 'CONTACT', link: '/contact' }
  ];

  for (const lId of langs) {
    await SiteConfig.findOneAndUpdate(
      { moduleName: 'nav_menu', language: lId },
      { $set: { data: { items: menu } } },
      { upsert: true }
    );
  }
  console.log("✅ 数据库 7 国导航已强制对齐，链接已净化。");
  process.exit(0);
}
run();

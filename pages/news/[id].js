import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import dbConnect from '../../lib/mongodb'
import News from '../../models/News'
import SiteConfig from '../../models/SiteConfig'

// 🌟 补全所有语言包
import zh from '../../locales/zh.json'
import en from '../../locales/en.json'
import ru from '../../locales/ru.json'
import tr from '../../locales/tr.json'
import es from '../../locales/es.json'
import ar from '../../locales/ar.json'
import ja from '../../locales/ja.json'

const translations = { zh, en, ru, tr, es, ar, ja };

// 🌟 1. 接收 cmsSettings 参数
export default function NewsDetail({ news, cmsNav, cmsSettings, currentLocale }) {
  const t = translations[currentLocale] || zh;
  const isRTL = currentLocale === 'ar';

  if (!news) return <div className="py-40 text-center">News not found</div>;

  return (
    <div className="bg-white text-zinc-900 min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 🌟 2. 网页标题自动读取后台配置 */}
      <Head><title>{`${news.title} | ${cmsSettings?.siteName || 'Cheermo News'}`}</title></Head>
      
      {/* 🌟 3. 给 Navbar 喂数据 */}
      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />
      
      <main className="flex-1 max-w-[1000px] mx-auto px-6 py-32 w-full text-start">
        <h1 className="text-3xl md:text-5xl font-black mb-8 uppercase leading-tight">{news.title}</h1>
        <div className="flex gap-4 mb-12 text-zinc-400 text-sm font-bold uppercase tracking-widest">
           <span>{news.category}</span>
           <span>|</span>
           <span>{new Date(news.date).toLocaleDateString()}</span>
        </div>
        <div className="aspect-video mb-12 rounded-3xl overflow-hidden">
           <img src={news.image} className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-zinc max-w-none text-lg leading-relaxed text-zinc-600" dangerouslySetInnerHTML={{ __html: news.content }} />
      </main>

      {/* 🌟 4. 给 Footer 喂数据 */}
      <Footer t={t} cmsNav={cmsNav} cmsSettings={cmsSettings} />
    </div>
  );
}

export async function getServerSideProps({ params, locale }) {
  const currentLocale = locale || 'zh';
  const langMap = { 'zh': '1', 'en': '2', 'ru': '3', 'es': '4', 'ar': '5', 'ja': '6', 'tr': '7' };
  const targetLang = langMap[currentLocale] || '1';
  
  try {
    await dbConnect();
    // 🌟 5. 并发请求：文章内容 + 导航菜单 + 全局配置
    const [newsData, navConfig, settingsDoc] = await Promise.all([
      News.findOne({ slug: params.id, language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean()
    ]);

    if (!newsData) return { notFound: true };

    // 🌟 6. 解析 settings_smart 数据
    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const rawData = settingsDoc.data.data ? settingsDoc.data.data : settingsDoc.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }

    return {
      props: {
        news: JSON.parse(JSON.stringify(newsData)),
        cmsNav: JSON.parse(JSON.stringify(navConfig?.data || { items: [] })),
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        currentLocale
      }
    };
  } catch (error) {
    return { notFound: true };
  }
}

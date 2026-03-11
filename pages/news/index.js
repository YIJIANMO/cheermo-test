import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChevronRight, FaRegCalendarAlt, FaRegFolder } from 'react-icons/fa'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import dbConnect from '../../lib/mongodb'
import SiteConfig from '../../models/SiteConfig'
import News from '../../models/News'

// 导入所有语言包
import zh from '../../locales/zh.json'
import en from '../../locales/en.json'
import ru from '../../locales/ru.json'
import tr from '../../locales/tr.json'
import es from '../../locales/es.json'
import ar from '../../locales/ar.json'
import ja from '../../locales/ja.json'

const translations = { zh, en, ru, tr, es, ar, ja };

// 🌟 1. 接收 cmsSettings
export default function NewsIndex({ newsList, cmsNav, cmsSettings, currentLocale }) {
  const [mounted, setMounted] = useState(false);
  const t = translations[currentLocale] || zh;

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div dir={currentLocale === 'ar' ? 'rtl' : 'ltr'} className="bg-white text-zinc-900 font-sans selection:bg-blue-600 selection:text-white">
      <Head>
        {/* 🌟 2. 网页标题联动后台品牌名 */}
        <title>{t.nav_news || 'Insights'} | {cmsSettings?.siteName || 'Cheermo Performance'}</title>
      </Head>
      
      {/* 🌟 3. 这里的 Navbar 必须传入 cmsSettings 才会显示后台电话 */}
      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />

      <main className="pt-32 pb-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="mb-20 text-start">
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">Insights</h1>
             <p className="text-zinc-400 text-lg font-medium max-w-xl">Technological breakthroughs, brand updates, and industry insights from the forefront of performance film manufacturing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {newsList.map((n, i) => (
              <Link href={`/news/${n.slug}`} key={i} className="group flex flex-col h-full bg-zinc-50/50 rounded-[2.5rem] overflow-hidden border border-zinc-100 hover:shadow-2xl transition-all duration-700">
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200">
                  <img src={n.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70"} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={n.title} />
                </div>
                <div className="p-10 flex flex-col flex-1 text-start">
                   <div className="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span className="flex items-center gap-1.5 text-blue-600"><FaRegFolder /> {n.category || "General"}</span>
                      <span className="flex items-center gap-1.5"><FaRegCalendarAlt /> {n.date}</span>
                   </div>
                   <h3 className="text-2xl font-black leading-tight mb-6 line-clamp-2 group-hover:text-blue-600 transition-colors uppercase">{n.title}</h3>
                   <p className="text-zinc-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">{n.excerpt}</p>
                   <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">Read Article <FaChevronRight size={8} /></span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
          
          {newsList.length === 0 && (
            <div className="py-40 text-center font-bold text-zinc-300 uppercase tracking-widest">No articles found in this language.</div>
          )}
        </div>
      </main>
      
      {/* 🌟 4. 把 cmsSettings 传给 Footer 组件 */}
      <Footer t={t} cmsNav={cmsNav} cmsSettings={cmsSettings} />
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const currentLocale = locale || 'zh';
  const langMap = { 'zh': '1', 'en': '2', 'ru': '3', 'es': '4', 'tr': '7', 'ar': '5', 'ja': '6' };
  const targetLang = langMap[currentLocale] || '1';

  try {
    await dbConnect();
    
    // 🌟 5. 并发请求：新闻列表 + 导航 + 全局设置
    const [newsData, navConfig, settingsDoc] = await Promise.all([
      News.find({ language: targetLang }).sort({ date: -1 }).lean(),
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean()
    ]);
    
    const activeNav = navConfig || await SiteConfig.findOne({ moduleName: 'nav_menu', language: '1' }).lean();

    // 🌟 6. 解析全局设置数据（穿透嵌套层级）
    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const rawData = settingsDoc.data.data ? settingsDoc.data.data : settingsDoc.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }

    const serializedNews = JSON.parse(JSON.stringify(newsData || [])).map(n => ({
      slug: n.slug || "",
      title: n.title || "Untitled",
      excerpt: n.excerpt || "",
      image: n.image || null,
      category: n.category || "Insight",
      date: n.date ? new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ""
    }));

    return {
      props: {
        newsList: serializedNews,
        cmsNav: JSON.parse(JSON.stringify(activeNav?.data || null)),
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)), // 🌟 返回给页面组件
        currentLocale
      },
      revalidate: 1
    };
  } catch (e) {
    console.error("News Page Error:", e);
    return { props: { newsList: [], currentLocale, cmsNav: null, cmsSettings: null }, revalidate: 1 };
  }
}

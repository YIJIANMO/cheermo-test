import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'
import { FaChevronRight, FaPlay, FaRegNewspaper, FaChartLine } from 'react-icons/fa'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import dbConnect from '../lib/mongodb'
import SiteConfig from '../models/SiteConfig'
import News from '../models/News'

import 'swiper/css'; import 'swiper/css/effect-fade'; import 'swiper/css/pagination'; import 'swiper/css/navigation';

import zh from '../locales/zh.json'; 
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import tr from '../locales/tr.json';
import es from '../locales/es.json';
import ar from '../locales/ar.json';
import ja from '../locales/ja.json';

const translations = { zh, en, ru, tr, es, ar, ja };

const AppleHaloText = ({ children, className = "" }) => (
  <motion.h1 className={`relative overflow-hidden ${className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-white bg-[length:200%_auto] animate-shimmer" style={{ WebkitBackgroundClip: 'text' }}>{children}</span>
    <style jsx>{` @keyframes shimmer { 0% { background-position: 150% center; } 100% { background-position: -150% center; } } .animate-shimmer { animation: shimmer 5s infinite linear; } `}</style>
  </motion.h1>
);

const RollingNumber = ({ value = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const strValue = String(value || "0");
  const numericValue = parseFloat(strValue.replace(/[^0-9.]/g, '')) || 0;
  const suffix = strValue.replace(/[0-9.]/g, '');
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => { if (isInView) animate(count, numericValue, { duration: 2, ease: [0.33, 1, 0.68, 1] }); }, [isInView, numericValue]);
  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
};

const FadeInSection = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className={className}>{children}</motion.div>
);

// 🌟 1. 接收 cmsSettings 参数
export default function Home({ cmsHero, cmsStats, cmsCategories, cmsPerformance, cmsNews, cmsNav, cmsSettings, currentLocale }) {
  const [mounted, setMounted] = useState(false);
  const t = translations[currentLocale] || zh;
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div dir={currentLocale === 'ar' ? 'rtl' : 'ltr'} className="bg-white text-zinc-900 font-sans selection:bg-blue-600 selection:text-white w-full overflow-x-hidden text-start">
      {/* 🌟 2. Meta 标题优先读取后台配置的 SEO Title */}
      <Head>
        <title>{cmsSettings?.seoTitle || t.meta_title || "Cheermo Performance"}</title>
        {cmsSettings?.seoDesc && <meta name="description" content={cmsSettings.seoDesc} />}
      </Head>
      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />
      
      <main className="w-full">
        <section className="h-[90vh] md:h-screen relative bg-black overflow-hidden group">
          <Swiper modules={[Autoplay, EffectFade, Pagination, Navigation]} effect="fade" speed={1200} loop autoplay={{ delay: 6000 }} pagination={{ clickable: true }} className="h-full w-full">
            {cmsHero.map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  {slide.video ? (
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"><source src={slide.video} type="video/mp4" /></video>
                  ) : (
                    <img src={slide.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  )}
                  <div className="relative z-20 text-center text-white px-6 max-w-6xl">
                    <AppleHaloText className="text-4xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-tight">{slide.title}</AppleHaloText>
                    <Link href={slide.link || "/products"} locale={currentLocale} className="px-12 py-4 bg-white text-black rounded-full text-[10px] font-black hover:scale-105 transition-all inline-block uppercase tracking-widest shadow-2xl">Explore More</Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="bg-zinc-950 py-10 md:py-14 border-b border-white/5 text-center">
          <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cmsStats.map((s, i) => (
              <div key={i} className="group flex flex-col items-center">
                <p className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 leading-none">
                  <RollingNumber value={s.value} />
                </p>
                <p className="text-xs md:text-sm font-bold text-zinc-400 uppercase tracking-[0.1em]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 md:py-32 bg-white text-start">
           <FadeInSection className="max-w-[1600px] mx-auto px-8">
              <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-100 pb-12 text-start">
                 <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 uppercase mb-4 leading-none">Category Showcase</h2>
                    <p className="text-zinc-400 text-lg font-medium">Global manufacturing excellence in functional films.</p>
                 </div>
                 <Link href="/products" locale={currentLocale} className="group text-xs font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2 pb-2 border-b-2 border-zinc-900 transition-all">Explore All <FaChevronRight size={10} /></Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {cmsCategories.map((cat, i) => (
                    <Link href={cat.link || "/"} locale={currentLocale} key={i} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-700">
                       <img src={cat.image} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                       <div className="absolute bottom-10 left-10 right-10 text-white">
                          <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-tight mb-2">{cat.title}</h3>
                          <p className="text-white/60 text-xs font-medium mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all">{cat.subtitle}</p>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">View Series <FaChevronRight size={8} /></span>
                       </div>
                    </Link>
                 ))}
              </div>
           </FadeInSection>
        </section>

        <section className="py-12 pb-32 bg-white text-start">
           <FadeInSection className="max-w-[1600px] mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {cmsPerformance.map((item, i) => (
                    <div key={i} className="group relative aspect-video overflow-hidden rounded-[3rem] bg-zinc-900 shadow-sm transition-all duration-1000">
                       <video poster={item.image} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all">
                          {item.video && <source src={item.video} type="video/mp4" />}
                       </video>
                       <div className="absolute inset-0 p-12 flex flex-col justify-end text-start text-white bg-gradient-to-t from-black/60 to-transparent">
                          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                             <FaPlay size={14} className="ml-1" />
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 uppercase leading-none">{item.title}</h3>
                          <div className="h-1 w-12 bg-blue-600 group-hover:w-24 transition-all" />
                       </div>
                    </div>
                 ))}
              </div>
           </FadeInSection>
        </section>

        <section className="py-24 bg-zinc-50/50 text-start border-t border-zinc-100">
          <FadeInSection className="max-w-[1600px] mx-auto px-8">
             <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 text-start">
                <div>
                   <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 uppercase mb-4 leading-none">Insights</h2>
                   <p className="text-zinc-400 text-lg font-medium">Technological breakthroughs and brand updates.</p>
                </div>
                <Link href="/news" locale={currentLocale} className="group text-xs font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2 pb-2 border-b-2 border-zinc-900">
                   All News
                </Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {cmsNews.map((n, i) => (
                  <Link href={`/news/${n.slug}`} locale={currentLocale} key={i} className="group block bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 h-full flex flex-col border border-zinc-100">
                     <div className="relative aspect-[16/10] overflow-hidden"><img src={n.cover} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" /></div>
                     <div className="p-10 text-start flex-1 flex flex-col">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">{n.category}</span>
                        <h3 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight line-clamp-2 uppercase group-hover:text-blue-600 transition-colors">{n.title}</h3>
                     </div>
                  </Link>
                ))}
             </div>
          </FadeInSection>
        </section>
      </main>
      {/* 🌟 3. 将 cmsSettings 传给 Footer */}
      <Footer t={t} cmsNav={cmsNav} cmsSettings={cmsSettings} />
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  const currentLocale = locale || 'zh';
  const langMap = { 'zh': '1', 'en': '2', 'ru': '3', 'es': '4', 'ar': '5', 'ja': '6', 'tr': '7' };
  const targetLang = langMap[currentLocale] || '1';

  try {
    await dbConnect();
    const [homeConf, navConf, newsRes, settingsConf] = await Promise.all([
      SiteConfig.findOne({ moduleName: 'home_blocks', language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      News.find({ language: targetLang }).sort({ date: -1 }).limit(3).lean(),
      // 🌟 4. 新增：捞取系统全局配置和多语言页脚数据
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean()
    ]);

    const activeHome = homeConf || await SiteConfig.findOne({ moduleName: 'home_blocks', language: '1' }).lean();
    const hD = activeHome?.data || {};
    const dStats = [{v:'180000m²',l:'BASE'}, {v:'61+',l:'REGIONS'}, {v:'30y',l:'HISTORY'}, {v:'100+',l:'PATENTS'}];
    const dCts = [{t:'PPF',s:'Paint Protection'},{t:'WINDOW',s:'Solar Control'},{t:'ARCH',s:'Architectural'},{t:'COLOR',s:'Vinyl Wrap'}];
    const dImg = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200";
    const clean = (val) => (val === undefined || val === null) ? "" : val;

    // 🌟 5. 解析并合并配置数据
    let cmsSettings = null;
    if (settingsConf && settingsConf.data) {
      // 兼容数据库可能存在的多层 data 嵌套
      const rawData = settingsConf.data.data ? settingsConf.data.data : settingsConf.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }

    return {
      props: {
        cmsHero: (hD.banners?.length ? hD.banners : [{}]).map(b => ({ image: clean(b.image) || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000", video: clean(b.video) || null, title: clean(b.title) || "CHERRMO PERFORMANCE", link: clean(b.link) || "/products" })),
        cmsStats: (hD.stats?.length ? hD.stats : [{},{},{},{} ]).map((s, i) => ({ value: clean(s.val) || dStats[i].v, label: clean(s.label) || dStats[i].l })),
        cmsCategories: (hD.showcase?.length ? hD.showcase : [{},{},{},{}]).map((sc, i) => ({ image: clean(sc.image) || dImg, title: clean(sc.title) || dCts[i].t, subtitle: clean(sc.subtitle) || dCts[i].s, link: clean(sc.link) || "/products" })),
        cmsPerformance: (hD.videos?.length ? hD.videos : [{},{}]).map(v => ({ image: clean(v.thumbnail) || dImg, video: clean(v.url) || null, title: clean(v.title) || "TECH INNOVATION" })),
        cmsNews: JSON.parse(JSON.stringify(newsRes)).map(n => ({ slug: n.slug || "", title: n.title || "Insight Update", category: n.category || "General", cover: n.image || dImg })),
        cmsNav: JSON.parse(JSON.stringify(navConf?.data || { items: [] })),
        // 🌟 6. 传给前端组件
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        currentLocale
      }
    };
  } catch (error) {
    return { props: { currentLocale, cmsHero: [], cmsStats: [], cmsCategories: [], cmsPerformance: [], cmsNews: [], cmsNav: { items: [] }, cmsSettings: null } };
  }
}

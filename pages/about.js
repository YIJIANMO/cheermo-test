import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import dbConnect from '../lib/mongodb'
import SiteConfig from '../models/SiteConfig'

import zh from '../locales/zh.json'
import en from '../locales/en.json'
import ru from '../locales/ru.json'
import tr from '../locales/tr.json'
import es from '../locales/es.json'
import ar from '../locales/ar.json'
import ja from '../locales/ja.json'

const translations = { zh, en, ru, tr, es, ar, ja };

export default function About({ cmsNav, cmsSettings, cmsAbout }) {
  const router = useRouter();
  const { locale } = router;
  const t = translations[locale] || zh;
  const isRTL = locale === 'ar';

  const aboutData = cmsAbout || {};
  const factory = aboutData.factory || {};
  const contact = aboutData.contact || {};

  const validGallery = (factory.gallery || []).filter(url => url && url.trim() !== '');

  // 提取卡片数据
  const features = [
    { title: t.about_p1_t, desc: t.about_p1_d },
    { title: t.about_p2_t, desc: t.about_p2_d },
    { title: t.about_p3_t, desc: t.about_p3_d },
    { title: t.about_p4_t, desc: t.about_p4_d }
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-black text-white selection:bg-white selection:text-black font-sans min-h-screen">
      <Head><title>{factory.title || t.nav_about} | {cmsSettings?.siteName || t.meta_title}</title></Head>
      
      <div className="absolute top-0 left-0 w-full z-50">
         <Navbar t={t} locale={locale} cmsNav={cmsNav} cmsSettings={cmsSettings} />
      </div>

      {/* ==========================================
          1. 极致留白首屏 (Minimalist Hero)
      ========================================== */}
      <section className="relative pt-[25vh] pb-[10vh] px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
          {factory.title || t.about_hero_title}
        </h1>
        <p className="text-lg md:text-2xl text-zinc-400 font-light max-w-3xl leading-relaxed mb-16">
          {t.about_vision_desc}
        </p>
        
        {/* 头图化作一块巨大的“发布会屏幕” */}
        <div className="w-full h-[50vh] md:h-[70vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/10 group">
           <img 
             src={factory.banner || "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2500"} 
             className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out" 
             alt="Cheermo Vision" 
           />
           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>
        </div>
      </section>

      {/* ==========================================
          2. 全球数据 (Metrics) - 极简分割线排版
      ========================================== */}
      <section className="py-20 border-y border-white/5 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[1, 2, 3].map(num => (
              <div key={num} className="pt-8 md:pt-0 md:px-12 flex flex-col justify-center text-center md:text-left">
                <div className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-2">
                  {t[`about_stat_${num}_val`]}
                </div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-[0.2em]">
                  {t[`about_stat_${num}_label`]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. 核心优势 (Bento Box 网格布局) - 解决“卡片太乱”的问题
      ========================================== */}
      <section className="py-32 bg-black">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="mb-16 md:mb-24 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">{t.about_core_title}</h2>
            <p className="text-zinc-500 text-xl font-light max-w-2xl">{t.about_core_subtitle}</p>
          </div>
          
          {/* 大厂风 Bento 网格：不对称美学 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* 卡片 1：占 2列 2行 (巨大画幅) */}
            <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-zinc-900 relative overflow-hidden group border border-white/5 p-10 flex flex-col justify-end">
               <img src="https://images.unsplash.com/photo-1611082578508-3ab9a9cfb826?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" alt="Core feature 1" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
               <div className="relative z-10">
                 <h3 className="text-3xl md:text-5xl font-bold mb-4">{features[0].title}</h3>
                 <p className="text-zinc-300 text-lg md:text-xl font-light max-w-md">{features[0].desc}</p>
               </div>
            </div>

            {/* 卡片 2：占 1列 1行 (小巧精致) */}
            <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-zinc-900 border border-white/5 p-10 flex flex-col justify-between hover:bg-zinc-800 transition-colors group">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform">02</div>
               <div>
                 <h3 className="text-2xl font-bold mb-3">{features[1].title}</h3>
                 <p className="text-zinc-400 font-light">{features[1].desc}</p>
               </div>
            </div>

            {/* 卡片 3：占 1列 1行 (小巧精致) */}
            <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between hover:bg-zinc-900 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
               <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">03</div>
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-3">{features[2].title}</h3>
                 <p className="text-zinc-400 font-light">{features[2].desc}</p>
               </div>
            </div>

            {/* 卡片 4：占满 3列 1行 (超宽横幅) */}
            <div className="md:col-span-3 md:row-span-1 rounded-[2rem] bg-zinc-900 relative overflow-hidden group border border-white/5 p-10 flex flex-col justify-center">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-black opacity-50"></div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                 <div className="max-w-xl">
                   <h3 className="text-3xl font-bold mb-4">{features[3].title}</h3>
                   <p className="text-zinc-400 text-lg font-light">{features[3].desc}</p>
                 </div>
                 <div className="hidden md:flex w-16 h-16 rounded-full border border-white/20 items-center justify-center text-2xl group-hover:bg-white group-hover:text-black transition-all">→</div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          4. 沉浸式图文宣讲 (Philosophy)
      ========================================== */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
           <p className="text-blue-500 font-bold tracking-[0.2em] text-sm uppercase mb-8">Our Philosophy</p>
           {/* 富文本安全注入，做了大字体和居中处理，非常有苹果发布会的感觉 */}
           <div className="prose prose-invert prose-xl md:prose-2xl mx-auto font-light text-zinc-300 leading-snug tracking-tight">
              {factory.content ? (
                <div dangerouslySetInnerHTML={{ __html: factory.content }} />
              ) : (
                <p>We are dedicated to redefining surface protection through advanced material science and uncompromising quality standards.</p>
              )}
           </div>
        </div>
      </section>

      {/* ==========================================
          5. 画廊级工厂展示 (The Gallery) - 承载你的7张图
      ========================================== */}
      <section className="py-24 md:py-32 bg-black">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{t.about_factory_title || 'Facilities'}</h2>
            <p className="text-zinc-500 max-w-lg text-lg font-light pb-2">{t.about_factory_desc}</p>
          </div>

          {validGallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[400px]">
              {validGallery.map((imgUrl, idx) => {
                // 智能网格计算：让 7 张图排得像艺术画廊
                let spanClasses = "col-span-1 row-span-1"; 
                if (idx === 0) spanClasses = "col-span-2 row-span-1 md:col-span-2 md:row-span-1"; // 第1张：宽图
                else if (idx === 1 || idx === 2) spanClasses = "col-span-1 row-span-1"; // 第2,3张：方图
                else if (idx === 3) spanClasses = "col-span-2 row-span-1 md:col-span-2 md:row-span-1"; // 第4张：宽图
                else if (idx === 6) spanClasses = "col-span-2 md:col-span-4 row-span-1 h-[300px]"; // 最后1张：压轴超宽底图
                
                return (
                  <div key={idx} className={`relative rounded-[2rem] overflow-hidden group bg-zinc-900 border border-white/5 ${spanClasses}`}>
                    <img 
                      src={imgUrl} 
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out" 
                      alt={`Facility ${idx + 1}`} 
                    />
                  </div>
                )
              })}
            </div>
          ) : (
             <div className="w-full h-[60vh] rounded-[2rem] overflow-hidden relative border border-white/10">
               <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000" className="w-full h-full object-cover opacity-30" alt="Placeholder" />
             </div>
          )}
        </div>
      </section>

      {/* ==========================================
          6. 全球联络 (Global Contact) - 无边框暗黑地图
      ========================================== */}
      <section className="relative pt-32 pb-0 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">{contact.title || 'Contact'}</h2>
             <p className="text-xl text-zinc-400 font-light mb-12">{contact.desc || 'Reach out to our global headquarters.'}</p>
           </div>
           <div className="flex items-end justify-start md:justify-end pb-4">
              <p className="text-xl md:text-2xl text-zinc-500 font-light italic max-w-md">
                 "{t.about_footer_quote || 'Quality is not an act, it is a habit.'}"
              </p>
           </div>
        </div>
        
        {/* 地图直接作为页面底部的无边框切面展示 */}
        <div className="w-full h-[50vh] md:h-[60vh] relative border-t border-white/5">
          {contact.mapIframe ? (
             <div className="absolute inset-0 w-full h-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" dangerouslySetInnerHTML={{ __html: contact.mapIframe }} />
          ) : (
             <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-600 font-mono text-sm">Map Offline</div>
          )}
          {/* 地图顶部的渐变遮罩，使其融入背景 */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none"></div>
        </div>
      </section>

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
    const [navConfig, settingsDoc, aboutDoc] = await Promise.all([
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean(),
      SiteConfig.findOne({ moduleName: 'brand_pages', language: targetLang }).lean() 
    ]);

    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const rawData = settingsDoc.data.data ? settingsDoc.data.data : settingsDoc.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }

    let cmsAbout = null;
    if (aboutDoc && aboutDoc.data) {
       const rawAbout = aboutDoc.data.data ? aboutDoc.data.data : aboutDoc.data;
       const gData = rawAbout.globalData || {};
       const lData = rawAbout.langData?.[targetLang] || rawAbout; 
       cmsAbout = {
          factory: { ...(gData.factory || {}), ...(lData.factory || {}) },
          contact: { ...(gData.contact || {}), ...(lData.contact || {}) }
       };
    }
    
    return {
      props: {
        cmsNav: JSON.parse(JSON.stringify(navConfig?.data || { items: [] })),
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        cmsAbout: JSON.parse(JSON.stringify(cmsAbout || null))
      }
    };
  } catch (error) {
    return { props: { cmsNav: { items: [] }, cmsSettings: null, cmsAbout: null } };
  }
}

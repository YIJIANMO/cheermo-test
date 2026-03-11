import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaArrowRight, FaLayerGroup } from 'react-icons/fa'

import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import dbConnect from '../../../lib/mongodb'
import Product from '../../../models/Product'
import SiteConfig from '../../../models/SiteConfig'

import zh from '../../../locales/zh.json'
import en from '../../../locales/en.json'
import ru from '../../../locales/ru.json'
import tr from '../../../locales/tr.json'
import es from '../../../locales/es.json'
import ar from '../../../locales/ar.json'
import ja from '../../../locales/ja.json'

const translations = { zh, en, ru, tr, es, ar, ja };

const bannerImages = {
  ppf: "https://images.unsplash.com/photo-1635434930153-77f3fb8336f8?q=80&w=2000",
  window: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000",
  arch: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000",
  color: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000",
  default: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000"
};

const ProductSection = ({ seriesName, products, category, t, isRTL }) => {
  // 🌟 核心修改 1：首屏默认显示 8 个商品（刚好 2 行满格）
  const [displayCount, setDisplayCount] = useState(8);
  const visibleItems = products.slice(0, displayCount);
  const remainingCount = products.length - displayCount;

  // 🌟 核心修改 2：点击后每次追加加载 8 个，而不是全部
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  return (
    <section className="mb-24 text-start">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-zinc-900 pb-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900">
             {seriesName === 'Other' ? (t.products_other || "Other Series") : seriesName}
          </h2>
          <div className="text-sm font-bold text-zinc-500 mt-4 md:mt-0 uppercase tracking-widest">
             {products.length} {t.products_count_unit || "Models"}
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {visibleItems.map((item) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={item.id}>
                <Link href={`/products/${category}/${item.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-[2rem] mb-5 transition-all duration-700 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] shadow-sm">
                    <div className="absolute inset-0 border border-black/5 rounded-[2rem] z-10 pointer-events-none"></div>
                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                    
                    <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-2 z-20`}>
                       {item.thickness && <span className="bg-white/95 backdrop-blur-md text-zinc-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">{item.thickness}</span>}
                       {item.vlt && <span className="bg-zinc-900/95 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">VLT {item.vlt}</span>}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4 px-1">
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors uppercase truncate">{item.name}</h3>
                    <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:scale-110">
                       <FaArrowRight className={`${isRTL ? 'rotate-[135deg]' : '-rotate-45'} text-xs`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
      </div>
      
      {/* 🌟 核心修改 3：绑定新的分批加载逻辑 */}
      {remainingCount > 0 && (
        <div className="mt-12 flex justify-center">
           <button onClick={handleLoadMore} className="inline-flex items-center gap-2 border border-zinc-200 px-8 py-3 text-sm font-bold hover:bg-zinc-950 hover:text-white transition-all rounded-full hover:shadow-xl hover:-translate-y-1">
              <FaPlus /> 加载更多 ({remainingCount})
           </button>
        </div>
      )}
    </section>
  );
};

export default function ProductCategory({ category, products, seriesList, cmsNav, cmsSettings, currentLocale }) {
  const t = translations[currentLocale] || zh;
  const isRTL = currentLocale === 'ar';
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const groupedProducts = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sortedProducts.reduce((acc, p) => {
      const s = p.series || "Other";
      if (!acc[s]) acc[s] = [];
      acc[s].push(p);
      return acc;
    }, {});
  }, [products]);

  const sortedSeriesNames = useMemo(() => {
    return Object.keys(groupedProducts).sort((a, b) => {
      const sA = (seriesList || []).find(s => s.name === a)?.order ?? 999;
      const sB = (seriesList || []).find(s => s.name === b)?.order ?? 999;
      return sA - sB;
    });
  }, [groupedProducts, seriesList]);

  if (!mounted) return null;

  return (
    <div className="bg-white text-zinc-900 min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Head><title>{`${t[`nav_${category}`] || category.toUpperCase()} | ${cmsSettings?.siteName || 'Cheermo'}`}</title></Head>
      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} /> 
      <section className="relative h-[40vh] bg-zinc-950 flex items-center justify-center text-center overflow-hidden">
         <div className="absolute inset-0">
            <img src={bannerImages[category] || bannerImages.default} className="w-full h-full object-cover opacity-40 mix-blend-luminosity"/>
         </div>
         <div className="relative z-20 px-6 mt-16">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">{t[`nav_${category}`] || category}</h1>
         </div>
      </section>
      <main className="flex-1 max-w-[1400px] mx-auto px-6 py-20 w-full">
        {products.length === 0 ? (
           <div className="py-40 text-center border-2 border-dashed border-zinc-100 rounded-[2rem]">
              <FaLayerGroup size={40} className="mx-auto text-zinc-200 mb-6" />
              <p className="text-zinc-400 font-bold uppercase tracking-widest">{t.no_products || "Coming Soon"}</p>
           </div>
        ) : (
          sortedSeriesNames.map(name => (
            <ProductSection key={name} seriesName={name} products={groupedProducts[name]} category={category} t={t} isRTL={isRTL} />
          ))
        )}
      </main>
      <Footer t={t} cmsNav={cmsNav} cmsSettings={cmsSettings} />
    </div>
  )
}

export async function getServerSideProps({ params, locale }) { 
  const currentLocale = locale || 'zh';
  const category = params.category;
  const langMap = { 'zh': '1', 'en': '2', 'ru': '3', 'es': '4', 'ar': '5', 'ja': '6', 'tr': '7' };
  const targetLang = langMap[currentLocale] || '1';
  const catMap = { 'ppf': '1', 'window': '2', 'arch': '3', 'color': '4' };

  try {
    await dbConnect();
    
    const [productsRaw, navConfig, settingsDoc, seriesDoc] = await Promise.all([
      Product.find({ 
        language: targetLang, 
        category: catMap[category] || '1' 
      }).sort({ order: 1 }).lean(),
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean(),
      SiteConfig.findOne({ moduleName: 'product_series' }).lean()
    ]);

    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const rawData = settingsDoc.data.data ? settingsDoc.data.data : settingsDoc.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }

    let seriesList = [];
    if (seriesDoc && seriesDoc.data) {
       seriesList = seriesDoc.data.list || seriesDoc.data.globalData?.list || [];
    }

    const products = productsRaw.map(item => {
      const specs = item.specs || [];
      const getSpec = (n) => specs.find(s => s.name.toLowerCase() === n.toLowerCase() || s.name === n)?.value || null;
      return {
        id: String(item._id),
        name: item.name || item.title || item.slug || "未知型号",
        slug: item.slug || String(item._id),
        series: item.series || "Other",
        img: item.image || bannerImages.default,
        thickness: getSpec('Thickness') || getSpec('厚度'),
        vlt: getSpec('VLT') || getSpec('透光率'),
        order: item.order || 0
      };
    });

    return { 
      props: { 
        category, 
        products: JSON.parse(JSON.stringify(products)),
        seriesList: JSON.parse(JSON.stringify(seriesList)), 
        cmsNav: navConfig?.data ? JSON.parse(JSON.stringify(navConfig.data)) : null,
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        currentLocale 
      } 
    }; 
  } catch (error) {
    return { props: { category, products: [], seriesList: [], cmsNav: null, cmsSettings: null, currentLocale } };
  }
}

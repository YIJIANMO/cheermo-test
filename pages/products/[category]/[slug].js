import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaShieldAlt, FaImages, FaThLarge } from 'react-icons/fa'

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

// 🌟 1. 接收 cmsSettings 参数
export default function ProductDetail({ product, relatedProducts, cmsNav, cmsSettings, currentLocale }) {
  const t = translations[currentLocale] || zh;
  const isRTL = currentLocale === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !product) return null;

  return (
    <div className="bg-white text-zinc-900 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <Head>
        {/* 🌟 2. 网页标题后缀接管后台动态设定的 Site Name */}
        <title>{`${product.name} | ${cmsSettings?.siteName || 'Cheermo Performance'}`}</title>
        <meta name="description" content={product.desc} />
      </Head>

      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />

      <main className="pt-32 pb-40">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* 返回按钮 */}
          <Link href={`/products/${product.categoryName}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mb-12 transition-colors">
            <FaChevronLeft size={10} className={isRTL ? 'rotate-180' : ''} /> {t.btn_back_to_list || "Back"}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
            {/* 左侧：主图展示 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-[4/5] bg-zinc-50 rounded-[3rem] overflow-hidden border border-zinc-100 shadow-sm">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
              <div className="absolute top-10 left-10">
                <span className="bg-zinc-900 text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] rounded-full">{product.series}</span>
              </div>
            </motion.div>

            {/* 右侧：文案与核心参数 */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-start">
              <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter mb-6 leading-none">{product.name}</h1>
              <p className="text-zinc-500 text-lg font-medium mb-12 leading-relaxed">{product.desc}</p>

              {/* 动态参数列表 */}
              <div className="space-y-4 mb-16">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                   <FaShieldAlt /> Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specs && product.specs.map((spec, i) => (
                    <div key={i} className="flex flex-col p-6 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-blue-600 transition-colors mb-1">{spec.name}</span>
                      <span className="text-sm font-black text-zinc-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/contact" className="w-full md:w-auto inline-flex justify-center items-center px-12 py-5 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-2xl">
                Get Quotation
              </Link>
            </motion.div>
          </div>

          {/* 详情页图集 (Gallery) */}
          {product.gallery && product.gallery.length > 0 && (
            <section className="mb-40">
              <div className="flex items-center justify-between mb-12 border-b border-zinc-100 pb-8">
                 <div className="text-start">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900">Installation cases</h2>
                    <p className="text-zinc-400 text-sm font-medium mt-2 uppercase tracking-widest">Real world performance & aesthetics</p>
                 </div>
                 <div className="hidden md:flex items-center gap-2 text-zinc-300">
                    <FaImages size={24} />
                    <span className="text-[10px] font-black uppercase">{product.gallery.length} High-Res Assets</span>
                 </div>
              </div>
              
              {/* 图片网格展示 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {product.gallery.map((imgUrl, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className={`relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-zinc-50 ${idx % 3 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}
                   >
                     <img src={imgUrl} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt={`${product.name} detail ${idx + 1}`} loading="lazy" />
                   </motion.div>
                 ))}
              </div>
            </section>
          )}

          {/* 相关推荐 */}
          {relatedProducts.length > 0 && (
            <section className="mt-40 border-t border-zinc-100 pt-24 text-start">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-12">Related Models</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {relatedProducts.map((rp, i) => (
                  <Link href={`/products/${product.categoryName}/${rp.slug}`} key={i} className="group block">
                    <div className="aspect-[3/4] bg-zinc-50 rounded-3xl overflow-hidden mb-6 border border-zinc-100 group-hover:shadow-2xl transition-all">
                      <img src={rp.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                    </div>
                    <h4 className="font-bold uppercase text-zinc-900 group-hover:text-blue-600 transition-colors truncate">{rp.name}</h4>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* 🌟 3. 将 cmsSettings 传给 Footer 组件 */}
      <Footer t={t} cmsNav={cmsNav} cmsSettings={cmsSettings} />
    </div>
  )
}

export async function getServerSideProps({ params, locale }) {
  const currentLocale = locale || 'zh';
  const { category, slug } = params;
  const langMap = { 'zh': '1', 'en': '2', 'ru': '3', 'es': '4', 'ar': '5', 'ja': '6', 'tr': '7' };
  const targetLang = langMap[currentLocale] || '1';

  try {
    await dbConnect();
    const productData = await Product.findOne({ slug, language: targetLang }).lean();
    if (!productData) return { notFound: true };

    // 🌟 4. 并发请求：除了导航和相关产品，顺带捞取 settings_smart
    const [navConfig, relatedRaw, settingsDoc] = await Promise.all([
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      Product.find({ 
        series: productData.series, 
        language: targetLang, 
        _id: { $ne: productData._id } 
      }).limit(4).lean(),
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean()
    ]);

    // 🌟 5. 解析全局设置数据 (穿透可能存在的额外 .data 层级)
    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const rawData = settingsDoc.data.data ? settingsDoc.data.data : settingsDoc.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }

    const serialize = (data) => JSON.parse(JSON.stringify(data));

    return {
      props: {
        product: {
          ...serialize(productData),
          categoryName: category,
          image: productData.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000",
          gallery: productData.gallery || [] // 确保 gallery 字段被传递
        },
        relatedProducts: serialize(relatedRaw).map(rp => ({
          name: rp.name,
          slug: rp.slug,
          image: rp.image || ""
        })),
        cmsNav: navConfig?.data ? serialize(navConfig.data) : null,
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)), // 🌟 6. 传递给前台
        currentLocale
      }
    };
  } catch (error) {
    return { notFound: true };
  }
}

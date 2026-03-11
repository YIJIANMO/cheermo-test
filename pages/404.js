import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FaExclamationTriangle, FaArrowRight } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// 为了保持 Navbar 和 Footer 的正常显示，我们需要引入语言包
import zh from '../locales/zh.json'
import en from '../locales/en.json'
import ru from '../locales/ru.json'
import tr from '../locales/tr.json'
import es from '../locales/es.json'
import ar from '../locales/ar.json'
import ja from '../locales/ja.json'

const translations = { zh, en, ru, tr, es, ar, ja };

export default function Custom404() {
  const router = useRouter();
  const { locale } = router;
  // 获取当前语言配置，如果获取失败默认用英文，保证 Footer 不报错
  const t = translations[locale] || en;
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-zinc-50 text-zinc-900 selection:bg-blue-600/20 flex flex-col min-h-screen">
      <Head>
        <title>404 - Page Not Found | Cheermo</title>
      </Head>
      
      {/* 依然显示导航栏，方便用户跳转 */}
      <Navbar t={t} locale={locale} cmsNav={cmsNav} cmsSettings={cmsSettings} />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-32">
         {/* 背景装饰：巨大的半透明 404 字样 */}
         <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden">
            <span className="text-[40vw] font-black italic leading-none text-zinc-900 select-none">404</span>
         </div>

         <div className="relative z-10 max-w-2xl px-6 text-center">
            {/* 工业风图标 */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 text-white rounded-sm mb-8 shadow-2xl">
               <FaExclamationTriangle size={32} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6">
              System Error
            </h1>
            
            {/* 蓝色装饰线 */}
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-8"></div>
            
            <p className="text-zinc-500 text-lg md:text-xl font-medium mb-12 leading-relaxed uppercase tracking-widest max-w-lg mx-auto">
              The requested production line or resource could not be found.
            </p>

            {/* 操作按钮组 */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
               <Link 
                 href="/" 
                 className="px-8 py-4 bg-zinc-900 text-white text-xs font-black italic uppercase tracking-[0.2em] hover:bg-blue-600 transition-all rounded-sm flex items-center justify-center gap-3 shadow-lg group"
               >
                 Return Home <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link 
                 href="/products/ppf" 
                 className="px-8 py-4 border border-zinc-200 text-zinc-600 text-xs font-black italic uppercase tracking-[0.2em] hover:bg-white hover:border-zinc-300 hover:text-zinc-900 transition-all rounded-sm flex items-center justify-center gap-3 bg-white/50 backdrop-blur-sm"
               >
                 View Products
               </Link>
            </div>
         </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
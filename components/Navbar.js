import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { FaLinkedinIn, FaInstagram, FaYoutube, FaChevronDown, FaEnvelope, FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  { code: 'zh', name: 'CN' }, { code: 'en', name: 'EN' }, { code: 'ru', name: 'RU' },
  { code: 'tr', name: 'TR' }, { code: 'es', name: 'ES' }, { code: 'ar', name: 'AR' }, { code: 'ja', name: 'JP' }
];

const getCleanLink = (url) => {
  if (!url) return '/';
  return url.replace(/^https?:\/\/[^\/]+/, '');
};

// 🌟 接收 cmsSettings 参数
export default function Navbar({ t, locale, cmsNav, cmsSettings, cmsItems = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isRTL = locale === 'ar';
  const isHomePage = router.pathname === '/';

  // 🌟 动态接管数据：优先用 settings，没有就用 nav，再没有就兜底
  const contact = {
    email: cmsSettings?.email || cmsNav?.email || "INFO@CHEERMO.COM",
    phone: cmsSettings?.phone || cmsNav?.phone || "+86 18665730730",
    linkedin: cmsSettings?.linkedin || cmsNav?.linkedin || "#",
    instagram: cmsSettings?.instagram || cmsNav?.instagram || "#",
    youtube: cmsSettings?.youtube || cmsNav?.youtube || "#",
    logoUrl: cmsSettings?.logoUrl || "/logo.svg"
  };

  const defaultMenuItems = [
    { key: 'ppf', path: '/products/ppf' },
    { key: 'window', path: '/products/window' },
    { key: 'color', path: '/products/color' },
    { key: 'arch', path: '/products/arch' },
    { key: 'configurator', path: '/configurator' },
    { key: 'news', path: '/news' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' }
  ];

  const activeMenuItems = (cmsNav?.items?.length > 0)
    ? cmsNav.items.map((item, index) => ({
        key: `cms_${index}`,
        path: getCleanLink(item.link),
        label: item.title
      }))
    : defaultMenuItems.map(item => ({
        key: item.key,
        path: item.path,
        label: t[`nav_${item.key}`] || item.key
      }));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const switchLang = (code) => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
    setTimeout(() => {
      router.push(router.pathname, router.asPath, { locale: code });
    }, 100);
  };

  let navBgClass, navTextColor, burgerColor;
  if (mobileMenuOpen) {
    navBgClass = 'bg-transparent'; 
    navTextColor = 'text-white';
    burgerColor = 'text-white';
  } else if (!isHomePage || isScrolled) {
    navBgClass = 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-100';
    navTextColor = 'text-zinc-900';
    burgerColor = 'text-zinc-900';
  } else {
    navBgClass = 'bg-gradient-to-b from-black/60 to-transparent';
    navTextColor = 'text-white';
    burgerColor = 'text-white';
  }

  return (
    <header className="fixed top-0 w-full z-[999]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 顶部信息栏 */}
      <div className={`hidden md:flex w-full bg-zinc-950 text-white/70 text-[10px] uppercase font-bold tracking-widest py-2 px-8 justify-between items-center transition-all duration-300 ${(!isHomePage || isScrolled) ? 'h-0 overflow-hidden py-0' : 'h-auto'}`}>
        <div className="flex gap-6">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <FaEnvelope size={10} /> {contact.email}
          </a>
          <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <FaPhoneAlt size={10} /> {contact.phone}
          </a>
        </div>
        {/* 🌟 图标原样保留，只替换 href，不隐藏！ */}
        <div className="flex gap-4 text-sm">
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn className="hover:text-blue-500 cursor-pointer transition-colors" /></a>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors" /></a>
          <a href={contact.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube className="hover:text-red-600 cursor-pointer transition-colors" /></a>
        </div>
      </div>

      <nav className={`w-full px-6 md:px-8 py-3 md:py-4 transition-colors duration-300 ${navBgClass} ${navTextColor}`}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center relative z-[1001]">
          <Link href="/" locale={locale} className="z-[1002]">
            {/* 🌟 动态读取后台 Logo */}
            <img 
              src={contact.logoUrl} 
              alt="Cheermo Logo" 
              className="h-5 md:h-5 w-auto object-contain transition-all duration-300"
              style={{ filter: (navTextColor === 'text-white') ? 'none' : 'brightness(0)' }} 
            />
          </Link>

          <div className="hidden xl:flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap text-start">
            {activeMenuItems.map((item) => (
               <Link key={item.key} href={item.path} locale={locale} className="relative group py-2">
                 {item.label}
                 <span className={`absolute bottom-0 start-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${navTextColor === 'text-white' ? 'bg-white' : 'bg-blue-600'}`}></span>
               </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 z-[1002]">
            <div className="hidden xl:block relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-sm transition-all duration-300 ${navTextColor === 'text-white' ? 'border-white/30 hover:bg-white/10' : 'border-zinc-200 hover:border-blue-600'}`}
              >
                {languages.find(l => l.code === locale)?.name} 
                <motion.div animate={{ rotate: langMenuOpen ? 180 : 0 }}><FaChevronDown size={10} /></motion.div>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-44 bg-white shadow-2xl rounded-sm py-2 text-zinc-900 border border-zinc-100 overflow-hidden`}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => switchLang(l.code)}
                        className={`relative w-full text-start px-5 py-3 text-[11px] font-bold uppercase tracking-wider group flex items-center justify-between transition-colors ${locale === l.code ? 'text-blue-600 bg-blue-50/50' : 'hover:text-blue-600'}`}
                      >
                        <motion.span whileHover={{ x: isRTL ? -5 : 5 }} className="relative z-10">{l.name}</motion.span>
                        {locale === l.code && <motion.div layoutId="activeDot" className="w-1 h-1 bg-blue-600 rounded-full" />}
                        <div className="absolute inset-0 bg-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-0"></div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`xl:hidden text-2xl p-2 transition-all duration-300 ${burgerColor}`}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="fixed inset-0 bg-zinc-950 z-[1000] pt-24 px-6 xl:hidden flex flex-col w-full h-[100dvh] text-start"
            >
               <div className="flex flex-col h-full text-white">
                  <div className="flex flex-col overflow-y-auto flex-1 no-scrollbar">
                    {activeMenuItems.map((item, index) => (
                      <Link key={item.key} href={item.path} locale={locale} className="flex justify-between items-center py-5 border-b border-white/10 group">
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-zinc-600">0{index + 1}</span>
                            <span className="text-sm font-bold uppercase tracking-[0.1em] group-hover:text-blue-500 transition-colors">
                              {item.label}
                            </span>
                         </div>
                         <span className={`text-zinc-600 text-xs group-hover:text-blue-500 transition-colors ${isRTL ? 'rotate-180' : ''}`}>→</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-auto pb-12 pt-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-500">Select Region</h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {languages.map((l) => (
                        <button key={l.code} onClick={() => switchLang(l.code)} className={`text-[10px] font-bold uppercase px-3 py-2 border rounded-sm transition-all ${locale === l.code ? 'border-blue-600 text-blue-500 bg-blue-900/20' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}`}>
                          {l.name}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/10 w-full">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-500 flex-shrink-0"><FaPhoneAlt size={12}/></div>
                          <span className="text-xs font-mono text-zinc-400 tracking-wider truncate">{contact.phone}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-500 flex-shrink-0"><FaEnvelope size={12}/></div>
                          <span className="text-xs font-mono text-zinc-400 tracking-wider truncate">{contact.email}</span>
                       </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

import Link from 'next/link'
import { useState } from 'react'
import { 
  FaLinkedinIn, FaInstagram, FaYoutube, FaPlus, FaArrowRight, 
  FaGlobe, FaCheck, FaSpinner, FaFacebookF, FaTwitter, FaTiktok, FaWhatsapp 
} from 'react-icons/fa'

// 清洗后台填写的带域名的死链接
const getCleanLink = (url) => {
  if (!url || url === '#') return '#';
  return url.replace(/^https?:\/\/[^\/]+/, '');
};

const FooterAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full py-5 md:py-0 text-left group"
      >
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity md:hidden"></span>
          {title}
        </h4>
        <FaPlus className={`md:hidden text-zinc-600 text-xs transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-600' : ''}`} />
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} md:block pb-6 md:pb-0`}>
        {children}
      </div>
    </div>
  );
};

export default function Footer({ t, cmsNav, cmsSettings }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  // 🌟 1. 动态读取后台配置的页脚标题
  const col1Title = cmsSettings?.footerCol1Title || t.footer_col_solutions || "Solutions";
  const col2Title = cmsSettings?.footerCol2Title || t.footer_col_corp || "Corporate";

  // 🌟 2. 像拉链一样组装后台的 URL 和 Label
  let column1Links = [];
  if (cmsSettings?.footerCol1Links && cmsSettings?.footerCol1Items) {
    column1Links = cmsSettings.footerCol1Links.map((item, i) => ({
      href: item.url,
      label: cmsSettings.footerCol1Items[i]?.label || ''
    })).filter(link => link.label); // 过滤掉空项
  } else {
    column1Links = [
      { label: t.nav_ppf, href: '/products/ppf' },
      { label: t.nav_window, href: '/products/window' },
      { label: t.nav_arch, href: '/products/arch' }
    ];
  }

  let column2Links = [];
  if (cmsSettings?.footerCol2Links && cmsSettings?.footerCol2Items) {
    column2Links = cmsSettings.footerCol2Links.map((item, i) => ({
      href: item.url,
      label: cmsSettings.footerCol2Items[i]?.label || ''
    })).filter(link => link.label);
  } else {
    column2Links = [
      { label: t.nav_about, href: '/about' },
      { label: t.nav_logistics, href: '/news' },
      { label: t.nav_portal, href: '/contact' }
    ];
  }

  // 🌟 3. 接管全局联系方式与社媒矩阵
  const contact = {
    phone: cmsSettings?.phone || cmsNav?.phone || "+86 18665730730",
    email: cmsSettings?.email || cmsNav?.email || "INFO@CHEERMO.COM",
    footerDesc: cmsSettings?.seoDesc || t.footer_desc || "Engineered for performance. Providing world-class protective film solutions since 1995."
  };

  // 智能过滤：只显示后台填写了 URL 的社媒图标
  const activeSocials = [
    { Icon: FaFacebookF, url: cmsSettings?.facebook },
    { Icon: FaInstagram, url: cmsSettings?.instagram },
    { Icon: FaTwitter, url: cmsSettings?.twitter },
    { Icon: FaYoutube, url: cmsSettings?.youtube },
    { Icon: FaLinkedinIn, url: cmsSettings?.linkedin },
    { Icon: FaWhatsapp, url: cmsSettings?.whatsapp },
    { Icon: FaTiktok, url: cmsSettings?.tiktok }
  ].filter(s => s.url && s.url.trim() !== '' && s.url !== '#');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-white/10">
      <div className="w-full h-[2px] bg-gradient-to-r from-blue-900 via-blue-600 to-zinc-900"></div>

      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* 1. 品牌栏 */}
          <div className="md:col-span-4 p-8 md:p-12 md:border-r border-white/5 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                 <FaGlobe className="animate-pulse" />
                 <span className="text-[10px] font-mono uppercase tracking-widest">Global Manufacturing</span>
              </div>
              
              <Link href="/">
                {/* 🌟 优先读取后台上传的 Logo */}
                <img src={cmsSettings?.logoUrl || "/logo.svg"} alt={cmsSettings?.siteName || "Cheermo"} className="h-7 md:h-8 w-auto object-contain transition-all duration-300" />
              </Link>

              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-light text-start">
                {contact.footerDesc}
              </p>
            </div>
            
            {activeSocials.length > 0 && (
              <div className="space-y-4 pt-8 text-start">
                 <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Connect With Us</p>
                 <div className="flex flex-wrap gap-3">
                   {activeSocials.map((social, i) => (
                     <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 bg-white/0 hover:bg-white/5 flex items-center justify-center transition-all text-zinc-400 hover:text-blue-500 hover:border-blue-500/50 rounded-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                       <social.Icon size={14} />
                     </a>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* 2. 链接群组 */}
          <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 text-start">
            <div className="p-8 md:p-12 md:border-r border-white/5">
              <FooterAccordion title={col1Title}>
                <ul className="space-y-4 md:mt-8">
                  {column1Links.map((link, i) => (
                    <li key={i}>
                      <Link href={getCleanLink(link.href)} className="group flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-white transition-all hover:pl-2 uppercase tracking-wider">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterAccordion>
            </div>

            <div className="p-8 md:p-12 md:border-r border-white/5">
              <FooterAccordion title={col2Title}>
                <ul className="space-y-4 md:mt-8">
                  {column2Links.map((link, i) => (
                    <li key={i}>
                      <Link href={getCleanLink(link.href)} className="group block text-xs font-medium text-zinc-400 hover:text-white transition-all hover:pl-2 uppercase tracking-wider">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterAccordion>
            </div>
          </div>

          {/* 3. 订阅与通讯 */}
          <div className="md:col-span-3 p-8 md:p-12 bg-zinc-900/50 text-start">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              {t.footer_col_connect || "Contact"}
            </h4>
            
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              {t.footer_sub_text || "Subscribe to get the latest technical updates and product news."}
            </p>

            <form onSubmit={handleSubscribe} className="relative group mb-12">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={status === 'success' ? "Thanks!" : (t.footer_sub_placeholder || "Enter Email Address")}
                className={`w-full bg-zinc-950 border py-3 px-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors rounded-xl ${status === 'success' ? 'border-green-500' : 'border-white/10 focus:border-blue-600'}`}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-blue-500 p-2">
                {status === 'loading' ? <FaSpinner className="animate-spin" /> : status === 'success' ? <FaCheck className="text-green-500" /> : <FaArrowRight size={12} />}
              </button>
            </form>

            <div className="space-y-2 pt-8 border-t border-white/5">
               <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Sales Hotline</p>
               <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} dir="ltr" className="text-sm font-mono text-zinc-300 font-bold hover:text-blue-600 transition-colors block text-left">
                  {contact.phone}
               </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black py-4">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
          <p>{cmsSettings?.copyright || "© 2024 CHEERMO INC. ALL RIGHTS RESERVED."}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{t.footer_link_privacy || "Privacy"}</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">{t.footer_link_terms || "Terms"}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

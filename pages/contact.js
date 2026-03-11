import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa'

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

// 🌟 接收新增的 cmsSettings 参数
export default function Contact({ cmsNav, cmsSettings, currentLocale }) {
  const [mounted, setMounted] = useState(false);
  const t = translations[currentLocale] || zh;
  const isRTL = currentLocale === 'ar';

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', region: '', message: '' });
  const [status, setStatus] = useState('idle');

  // 🌟 联系方式优先从 cmsSettings 读取，再兜底
  const contactInfo = {
    phone: cmsSettings?.phone || cmsNav?.phone || "+86 18665730730",
    email: cmsSettings?.email || cmsNav?.email || "INFO@CHEERMO.COM",
    address: cmsSettings?.address || cmsNav?.address || "Cheermo Industrial Park, China"
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', region: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-zinc-50 text-zinc-900 font-sans selection:bg-blue-600 selection:text-white min-h-screen flex flex-col">
      <Head>
        <title>{`${t.nav_contact || 'Contact'} | ${cmsSettings?.siteName || 'Cheermo Performance'}`}</title>
      </Head>

      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />

      <main className="flex-1 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 text-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none text-zinc-900">
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl mb-16">
              {t.contact_desc || "Reach out to our global team for premium protection film solutions, technical support, and partnership opportunities."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-zinc-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex items-start gap-6">
                 <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <FaPhoneAlt size={20} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Customer Hotline</h3>
                    <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} dir="ltr" className="inline-block text-lg md:text-xl font-black text-zinc-900 font-mono tracking-tight hover:text-blue-600 transition-colors text-left">
                       {contactInfo.phone}
                    </a>
                 </div>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-zinc-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex items-start gap-6">
                 <div className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FaEnvelope size={20} />
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Global Sales</h3>
                    <a href={`mailto:${contactInfo.email}`} className="inline-block text-lg md:text-xl font-black text-zinc-900 font-mono tracking-tight uppercase hover:text-blue-600 transition-colors break-all">
                       {contactInfo.email}
                    </a>
                 </div>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-zinc-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex items-start gap-6">
                 <div className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt size={20} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Headquarters</h3>
                    <p className="text-base md:text-lg font-black text-zinc-900 leading-snug">{contactInfo.address}</p>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-zinc-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 mb-3 relative z-10">{t.contact_form_title || "Send a Message"}</h3>
                <p className="text-zinc-500 text-sm font-medium mb-10 relative z-10">{t.contact_form_sub || "We usually respond within 24 hours."}</p>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{t.contact_name}</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 md:p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{t.contact_email}</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 md:p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{t.contact_company}</label>
                      <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 md:p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{t.contact_region}</label>
                      <input type="text" required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 md:p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{t.contact_phone}</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 md:p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">{t.contact_msg}</label>
                    <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 md:p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none shadow-sm"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'} 
                    className={`w-full py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-300 ${
                      status === 'success' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-1'
                    }`}
                  >
                    {status === 'loading' && <><FaSpinner className="animate-spin" size={14} /> {t.contact_sending}</>}
                    {status === 'success' && <><FaCheckCircle size={16} /> {t.contact_success}</>}
                    {status === 'error' && <>{t.contact_error}</>}
                    {status === 'idle' && <><FaPaperPlane size={12} /> {t.contact_send}</>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 🌟 核心：将 cmsSettings 透传给 Footer */}
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
    const navConfig = await SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean();
    const activeNav = navConfig || await SiteConfig.findOne({ moduleName: 'nav_menu', language: '1' }).lean();

    // 🌟 核心读取逻辑：捞出全局设置
    const settingsDoc = await SiteConfig.findOne({ moduleName: 'settings_smart' }).lean();
    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const globalData = settingsDoc.data.globalData || {};
      const langData = settingsDoc.data.langData?.[targetLang] || {};
      // 将全球固定的(如社媒链接、Logo) 和 多语言相关的(SEO、名称) 合并传递给前台
      cmsSettings = { ...globalData, ...langData };
    }

    return {
      props: {
        cmsNav: JSON.parse(JSON.stringify(activeNav?.data || null)),
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        currentLocale
      }
    };
  } catch (error) {
    return { props: { cmsNav: null, cmsSettings: null, currentLocale } };
  }
}

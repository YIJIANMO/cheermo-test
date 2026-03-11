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

// 🌟 独立抽离的 7 国语言服务条款数据
const termsContent = {
  en: {
    title: "Terms of Use", date: "Effective Date: February 2026",
    sections: [
      { title: "1. Agreement to Terms", p: "By accessing our website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services." },
      { title: "2. Intellectual Property", p: "The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary (including but not limited to intellectual property) laws. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited." },
      { title: "3. Product Information", p: "We strive to ensure that information on this site is complete, accurate, and current. Despite our efforts, information on this site may occasionally be inaccurate, incomplete, or out of date. Weights, measures, product descriptions, recommendations, and commentary regarding products are provided for convenience purposes only." },
      { title: "4. Limitation of Liability", p: "In no event shall Cheermo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses." }
    ]
  },
  zh: {
    title: "使用条款", date: "生效日期：2026年2月",
    sections: [
      { title: "1. 协议条款", p: "通过访问我们的网站，您即同意受本使用条款的约束。如果您不同意这些条款，请不要使用我们的服务。" },
      { title: "2. 知识产权", p: "本网站的内容、组织、图形、设计、编译及其他相关事宜均受适用的版权和其他专有（包括但不限于知识产权）法律保护。严禁您复制、重新分发、使用或发布任何此类内容或本网站的任何部分。" },
      { title: "3. 产品信息", p: "我们努力确保本网站上的信息完整、准确且最新。尽管我们尽了最大努力，本网站上的信息偶尔仍可能不准确、不完整或过时。关于产品的重量、尺寸、产品描述、建议和评论仅为方便起见而提供。" },
      { title: "4. 责任限制", p: "在任何情况下，Cheermo 及其董事、员工、合作伙伴、代理商、供应商或附属公司，均不对任何间接、附带、特殊、后果性或惩罚性损害（包括但不限于利润、数据、使用、商誉的损失或其他无形损失）承担责任。" }
    ]
  },
  ru: {
    title: "Условия использования", date: "Дата вступления в силу: Февраль 2026 г.",
    sections: [
      { title: "1. Согласие с условиями", p: "Посещая наш веб-сайт, вы соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наши услуги." },
      { title: "2. Интеллектуальная собственность", p: "Содержание, организация, графика, дизайн, компиляция и другие вопросы, связанные с Сайтом, защищены применимыми законами об авторских правах и другими законами о собственности. Копирование, распространение, использование или публикация вами любых таких материалов строго запрещены." },
      { title: "3. Информация о продукте", p: "Мы стремимся к тому, чтобы информация на этом сайте была полной, точной и актуальной. Несмотря на наши усилия, информация иногда может быть неточной или устаревшей. Описания продуктов предоставляются исключительно для удобства." },
      { title: "4. Ограничение ответственности", p: "Ни при каких обстоятельствах Cheermo, ее директора, сотрудники или партнеры не несут ответственности за любые косвенные, случайные, специальные или штрафные убытки, включая потерю прибыли или данных." }
    ]
  },
  es: {
    title: "Términos de Uso", date: "Fecha de vigencia: Febrero de 2026",
    sections: [
      { title: "1. Aceptación de los Términos", p: "Al acceder a nuestro sitio web, usted acepta estar sujeto a estos Términos de Uso. Si no está de acuerdo con estos términos, no utilice nuestros servicios." },
      { title: "2. Propiedad Intelectual", p: "El contenido, organización, gráficos, diseño y otros asuntos relacionados con el Sitio están protegidos por derechos de autor y otras leyes de propiedad aplicables. Queda estrictamente prohibida la copia o redistribución de cualquier parte del Sitio." },
      { title: "3. Información del Producto", p: "Nos esforzamos por garantizar que la información en este sitio sea completa y precisa. Sin embargo, las descripciones de los productos y las recomendaciones se proporcionan únicamente para fines de conveniencia." },
      { title: "4. Limitación de Responsabilidad", p: "En ningún caso Cheermo, ni sus directores o empleados, serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluida la pérdida de beneficios o datos." }
    ]
  },
  ar: {
    title: "شروط الاستخدام", date: "تاريخ السريان: فبراير 2026",
    sections: [
      { title: "1. الموافقة على الشروط", p: "من خلال الوصول إلى موقعنا، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا." },
      { title: "2. الملكية الفكرية", p: "المحتوى والتنظيم والرسومات والتصميم وغيرها من الأمور المتعلقة بالموقع محمية بموجب حقوق الطبع والنشر المعمول بها وقوانين الملكية الأخرى. يُحظر تمامًا نسخ أو إعادة توزيع أي جزء من الموقع." },
      { title: "3. معلومات المنتج", p: "نحن نسعى جاهدين لضمان أن تكون المعلومات الموجودة على هذا الموقع كاملة ودقيقة. ومع ذلك، يتم توفير أوصاف المنتج والتوصيات لأغراض الراحة فقط." },
      { title: "4. حدود المسؤولية", p: "لن تكون شركة Cheermo أو مديروها أو موظفوها مسؤولين بأي حال من الأحوال عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو تأديبية، بما في ذلك فقدان الأرباح أو البيانات." }
    ]
  },
  ja: {
    title: "利用規約", date: "発効日：2026年2月",
    sections: [
      { title: "1. 規約への同意", p: "当社のウェブサイトにアクセスすることにより、お客様は本利用規約に拘束されることに同意したものとみなされます。これらの条件に同意しない場合は、当社のサービスを使用しないでください。" },
      { title: "2. 知的財産権", p: "本サイトに関連するコンテンツ、グラフィック、デザインなどは、適用される著作権法およびその他の財産権法によって保護されています。本サイトの一部または全部のコピー、再配布は固く禁じられています。" },
      { title: "3. 製品情報", p: "当社は本サイトの情報の正確性を保つよう努めていますが、製品の説明や推奨事項は利便性のためにのみ提供されています。" },
      { title: "4. 責任の制限", p: "Cheermoおよびその取締役、従業員は、利益やデータの損失を含む、いかなる間接的、偶発的、特別、結果的、または懲罰的損害についても責任を負いません。" }
    ]
  },
  tr: {
    title: "Kullanım Koşulları", date: "Yürürlük Tarihi: Şubat 2026",
    sections: [
      { title: "1. Şartların Kabulü", p: "Web sitemize erişerek bu Kullanım Koşullarına bağlı kalmayı kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın." },
      { title: "2. Fikri Mülkiyet", p: "Site ile ilgili içerik, organizasyon, grafikler, tasarım ve diğer hususlar geçerli telif hakları ve diğer mülkiyet yasaları kapsamında korunmaktadır. Sitenin herhangi bir bölümünün kopyalanması veya yeniden dağıtılması kesinlikle yasaktır." },
      { title: "3. Ürün Bilgisi", p: "Bu sitedeki bilgilerin eksiksiz ve doğru olmasını sağlamaya çalışıyoruz. Ancak, ürün açıklamaları ve öneriler yalnızca kolaylık sağlamak amacıyla sunulmaktadır." },
      { title: "4. Sorumluluğun Sınırlandırılması", p: "Cheermo veya yöneticileri, çalışanları hiçbir durumda kar veya veri kaybı dahil olmak üzere dolaylı, arızi, özel veya cezai zararlardan sorumlu tutulamaz." }
    ]
  }
};

export default function Terms({ cmsNav, cmsSettings, currentLocale }) {
  const router = useRouter();
  const locale = currentLocale || 'zh';
  const t = translations[locale] || zh;
  const isRTL = locale === 'ar';
  
  // 匹配当前语言，找不到默认用英语
  const content = termsContent[locale] || termsContent['en'];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-white text-zinc-900 selection:bg-blue-600/20 text-start">
      <Head>
        <title>{`${content.title} | ${cmsSettings?.siteName || 'Cheermo Performance'}`}</title>
      </Head>
      <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />

      <main className="max-w-[1000px] mx-auto px-6 md:px-8 py-32 md:py-40">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase mb-12">{content.title}</h1>
        
        <div className="prose prose-zinc prose-lg max-w-none text-start">
          <p className="text-zinc-500 font-bold mb-8">{content.date}</p>
          
          {content.sections.map((sec, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">{sec.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{sec.p}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 将数据透传给 Footer */}
      <Footer t={t} cmsNav={cmsNav} cmsSettings={cmsSettings} />
    </div>
  )
}

// 🌟 核心：注入后台 Navbar 导航与 Settings_smart 页脚数据
export async function getServerSideProps({ locale }) {
  const currentLocale = locale || 'zh';
  const langMap = { 'zh': '1', 'en': '2', 'ru': '3', 'es': '4', 'ar': '5', 'ja': '6', 'tr': '7' };
  const targetLang = langMap[currentLocale] || '1';

  try {
    await dbConnect();
    const [navConfig, settingsDoc] = await Promise.all([
      SiteConfig.findOne({ moduleName: 'nav_menu', language: targetLang }).lean(),
      SiteConfig.findOne({ moduleName: 'settings_smart' }).lean()
    ]);

    let cmsSettings = null;
    if (settingsDoc && settingsDoc.data) {
      const rawData = settingsDoc.data.data ? settingsDoc.data.data : settingsDoc.data;
      const globalData = rawData.globalData || {};
      const langData = rawData.langData?.[targetLang] || {};
      cmsSettings = { ...globalData, ...langData };
    }
    
    return {
      props: {
        cmsNav: JSON.parse(JSON.stringify(navConfig?.data || { items: [] })),
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        currentLocale
      }
    };
  } catch (error) {
    return { props: { cmsNav: null, cmsSettings: null, currentLocale } };
  }
}

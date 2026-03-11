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

// 🌟 独立抽离的 7 国语言隐私条款数据
const privacyContent = {
  en: {
    title: "Privacy Policy", date: "Last Updated: February 2026",
    sections: [
      { title: "1. Introduction", p: "Cheermo Advanced Materials (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website." },
      { title: "2. Data We Collect", p: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:", list: ["Identity Data: includes first name, last name, title.", "Contact Data: includes email address and telephone numbers.", "Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location."] },
      { title: "3. How We Use Your Data", p: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:", list: ["To respond to your inquiries regarding our products (PPF, Window Film).", "To improve our website, products/services, marketing and customer relationships."] },
      { title: "4. Data Security", p: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way." },
      { title: "5. Contact Us", p: "If you have any questions about this privacy policy, please contact us at:" }
    ]
  },
  zh: {
    title: "隐私政策", date: "最后更新：2026年2月",
    sections: [
      { title: "1. 简介", p: "Cheermo 高级材料（“我们”或“我们的”）尊重您的隐私，并承诺保护您的个人数据。本隐私政策将告知您在访问我们网站时，我们如何处理您的个人数据。" },
      { title: "2. 我们收集的数据", p: "我们可能收集、使用、存储和传输关于您的不同种类的个人数据，分类如下：", list: ["身份数据：包括名字、姓氏、头衔。", "联系数据：包括电子邮件地址和电话号码。", "技术数据：包括互联网协议 (IP) 地址、浏览器类型和版本、时区设置和位置。"] },
      { title: "3. 我们如何使用您的数据", p: "我们只会在法律允许的情况下使用您的个人数据。最常见的情况包括：", list: ["回复您关于我们产品（漆面保护膜、窗膜）的询价。", "改善我们的网站、产品/服务、营销和客户关系。"] },
      { title: "4. 数据安全", p: "我们已采取适当的安全措施，以防止您的个人数据意外丢失、被未经授权地使用或访问。" },
      { title: "5. 联系我们", p: "如果您对本隐私政策有任何疑问，请联系我们：" }
    ]
  },
  ru: {
    title: "Политика конфиденциальности", date: "Последнее обновление: Февраль 2026 г.",
    sections: [
      { title: "1. Введение", p: "Cheermo Advanced Materials («мы», «наш» или «нас») уважает вашу конфиденциальность и стремится защитить ваши личные данные. Эта политика конфиденциальности информирует вас о том, как мы обращаемся с вашими личными данными, когда вы посещаете наш веб-сайт." },
      { title: "2. Данные, которые мы собираем", p: "Мы можем собирать, использовать, хранить и передавать различные виды личных данных о вас, которые мы сгруппировали следующим образом:", list: ["Идентификационные данные: имя, фамилия, должность.", "Контактные данные: адрес электронной почты и номера телефонов.", "Технические данные: IP-адрес, тип и версия браузера, часовой пояс и местоположение."] },
      { title: "3. Как мы используем ваши данные", p: "Мы будем использовать ваши личные данные только тогда, когда это разрешено законом. Наиболее часто мы используем ваши данные в следующих случаях:", list: ["Для ответов на ваши запросы относительно нашей продукции (PPF, оконная пленка).", "Для улучшения нашего сайта, продуктов/услуг, маркетинга и отношений с клиентами."] },
      { title: "4. Безопасность данных", p: "Мы внедрили соответствующие меры безопасности, чтобы предотвратить случайную потерю, использование или несанкционированный доступ к вашим личным данным." },
      { title: "5. Свяжитесь с нами", p: "Если у вас есть вопросы по поводу этой политики конфиденциальности, свяжитесь с нами:" }
    ]
  },
  es: {
    title: "Política de Privacidad", date: "Última actualización: Febrero de 2026",
    sections: [
      { title: "1. Introducción", p: "Cheermo Advanced Materials (\"nosotros\", \"nuestro\" o \"nos\") respeta su privacidad y se compromete a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web." },
      { title: "2. Datos que recopilamos", p: "Podemos recopilar, utilizar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:", list: ["Datos de identidad: incluye nombre, apellido, título.", "Datos de contacto: incluye dirección de correo electrónico y números de teléfono.", "Datos técnicos: incluye dirección de protocolo de internet (IP), tipo y versión del navegador, configuración de zona horaria y ubicación."] },
      { title: "3. Cómo utilizamos sus datos", p: "Solo utilizaremos sus datos personales cuando la ley lo permita. Con mayor frecuencia, utilizaremos sus datos en las siguientes circunstancias:", list: ["Para responder a sus consultas sobre nuestros productos (PPF, láminas para ventanas).", "Para mejorar nuestro sitio web, productos/servicios, marketing y relaciones con los clientes."] },
      { title: "4. Seguridad de los datos", p: "Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan accidentalmente, se utilicen o se acceda a ellos de forma no autorizada." },
      { title: "5. Contáctenos", p: "Si tiene alguna pregunta sobre esta política de privacidad, contáctenos en:" }
    ]
  },
  ar: {
    title: "سياسة الخصوصية", date: "آخر تحديث: فبراير 2026",
    sections: [
      { title: "1. مقدمة", p: "تحترم Cheermo Advanced Materials (\"نحن\" أو \"خاصتنا\") خصوصيتك وتلتزم بحماية بياناتك الشخصية. ستبلغك سياسة الخصوصية هذه بكيفية تعاملنا مع بياناتك الشخصية عند زيارتك لموقعنا." },
      { title: "2. البيانات التي نجمعها", p: "قد نقوم بجمع واستخدام وتخزين ونقل أنواع مختلفة من البيانات الشخصية الخاصة بك والتي قمنا بتجميعها على النحو التالي:", list: ["بيانات الهوية: تشمل الاسم الأول، واسم العائلة، واللقب.", "بيانات الاتصال: تشمل عنوان البريد الإلكتروني وأرقام الهواتف.", "البيانات الفنية: تشمل عنوان بروتوكول الإنترنت (IP)، ونوع المتصفح وإصداره، وإعدادات المنطقة الزمنية والموقع."] },
      { title: "3. كيف نستخدم بياناتك", p: "لن نستخدم بياناتك الشخصية إلا عندما يسمح لنا القانون بذلك. في الغالب، سنستخدم بياناتك في الحالات التالية:", list: ["للرد على استفساراتك بشأن منتجاتنا (PPF، أفلام النوافذ).", "لتحسين موقعنا ومنتجاتنا/خدماتنا والتسويق وعلاقات العملاء."] },
      { title: "4. أمن البيانات", p: "لقد وضعنا تدابير أمنية مناسبة لمنع فقدان بياناتك الشخصية عن طريق الخطأ أو استخدامها أو الوصول إليها بطريقة غير مصرح بها." },
      { title: "5. اتصل بنا", p: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:" }
    ]
  },
  ja: {
    title: "プライバシーポリシー", date: "最終更新：2026年2月",
    sections: [
      { title: "1. はじめに", p: "Cheermo Advanced Materials（「当社」）は、お客様のプライバシーを尊重し、個人データの保護に努めています。本プライバシーポリシーは、当社のウェブサイトにアクセスした際の個人データの取り扱いについてお知らせするものです。" },
      { title: "2. 収集するデータ", p: "当社は、以下のように分類されるお客様のさまざまな種類の個人データを収集、使用、保存、移行する場合があります：", list: ["身元データ：名、姓、役職など。", "連絡先データ：メールアドレス、電話番号など。", "技術データ：インターネットプロトコル（IP）アドレス、ブラウザの種類とバージョン、タイムゾーン設定、位置情報など。"] },
      { title: "3. データの使用方法", p: "当社は、法律で許可されている場合にのみ個人データを使用します。主に以下の状況で使用されます：", list: ["製品（PPF、ウィンドウフィルム）に関するお問い合わせに対応するため。", "ウェブサイト、製品/サービス、マーケティング、顧客関係を改善するため。"] },
      { title: "4. データのセキュリティ", p: "個人データが誤って紛失したり、不正な方法で使用またはアクセスされたりすることを防ぐため、適切なセキュリティ対策を講じています。" },
      { title: "5. お問い合わせ", p: "本プライバシーポリシーについてご質問がある場合は、以下までお問い合わせください：" }
    ]
  },
  tr: {
    title: "Gizlilik Politikası", date: "Son Güncelleme: Şubat 2026",
    sections: [
      { title: "1. Giriş", p: "Cheermo Advanced Materials (\"biz\", \"bizim\"), gizliliğinize saygı duyar ve kişisel verilerinizi korumayı taahhüt eder. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde kişisel verilerinize nasıl baktığımız hakkında sizi bilgilendirecektir." },
      { title: "2. Topladığımız Veriler", p: "Sizinle ilgili aşağıda gruplandırdığımız farklı türde kişisel verileri toplayabilir, kullanabilir, saklayabilir ve aktarabiliriz:", list: ["Kimlik Verileri: ad, soyad, unvan içerir.", "İletişim Verileri: e-posta adresi ve telefon numaralarını içerir.", "Teknik Veriler: internet protokolü (IP) adresi, tarayıcı türü ve sürümü, saat dilimi ayarı ve konumu içerir."] },
      { title: "3. Verilerinizi Nasıl Kullanıyoruz", p: "Kişisel verilerinizi yalnızca yasaların izin verdiği durumlarda kullanacağız. Çoğunlukla, kişisel verilerinizi aşağıdaki durumlarda kullanacağız:", list: ["Ürünlerimiz (PPF, Cam Filmi) ile ilgili sorularınıza yanıt vermek için.", "Web sitemizi, ürünlerimizi/hizmetlerimizi, pazarlamamızı ve müşteri ilişkilerimizi geliştirmek için."] },
      { title: "4. Veri Güvenliği", p: "Kişisel verilerinizin yanlışlıkla kaybolmasını, kullanılmasını veya yetkisiz bir şekilde erişilmesini önlemek için uygun güvenlik önlemlerini aldık." },
      { title: "5. Bize Ulaşın", p: "Bu gizlilik politikası hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:" }
    ]
  }
};

export default function Privacy({ cmsNav, cmsSettings, currentLocale }) {
  const router = useRouter();
  const locale = currentLocale || 'zh';
  const t = translations[locale] || zh;
  const isRTL = locale === 'ar';
  
  // 获取当前语言的内容，找不到就用英文兜底
  const content = privacyContent[locale] || privacyContent['en'];
  const contactEmail = cmsSettings?.email || "INFO@CHEERMO.COM";

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-white text-zinc-900 selection:bg-blue-600/20">
      <Head>
        <title>{`${content.title} | ${cmsSettings?.siteName || 'Cheermo Performance'}`}</title>
      </Head>
     <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />

      <main className="max-w-[1000px] mx-auto px-6 md:px-8 py-32 md:py-40 text-start">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase mb-12">{content.title}</h1>
        
        <div className="prose prose-zinc prose-lg max-w-none text-start">
          <p className="text-zinc-500 font-bold mb-8">{content.date}</p>
          
          {content.sections.map((sec, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">{sec.title}</h3>
              <p className="text-zinc-600 leading-relaxed mb-4">{sec.p}</p>
              {sec.list && (
                <ul className="list-disc pl-6 text-zinc-600 space-y-2">
                  {sec.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          
          {/* 联系邮箱自动对接后台数据 */}
          <div className="mt-8">
             <p className="text-zinc-600">
               <strong className="text-blue-600 block mt-2 text-xl font-mono">{contactEmail}</strong>
             </p>
          </div>
        </div>
      </main>

      {/* 将参数传给 Footer，保证页脚不掉线 */}
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

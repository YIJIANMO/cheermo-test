/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // 这里配置你支持的所有语言代码
    locales: ['zh', 'en', 'ru', 'tr', 'es', 'ar', 'ja'],
    // 默认语言
    defaultLocale: 'zh',
    // 禁用自动检测浏览器语言（防止开发时自动跳转干扰）
    localeDetection: false,
  },
};

export default nextConfig;
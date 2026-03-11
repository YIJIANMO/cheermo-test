/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cheermo.com', // 替换为您实际的上线域名
  generateRobotsTxt: true, // 自动生成 robots.txt
  sitemapSize: 7000,
  // 排除不需要收录的页面（如 404, api 接口）
  exclude: ['/404', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
  },
}
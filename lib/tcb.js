// lib/tcb.js (现已改造为本地 CMS 桥接器)

const API_BASE = process.env.NEXT_PUBLIC_INTERNAL_API || 'http://127.0.0.1:4000';
export const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://127.0.0.1:4000';

// 1. 获取页面全局配置 (替代以前的 db.collection('HomeHero').get())
export async function getConfig(moduleName, lang = '1') {
  try {
    const res = await fetch(`${API_BASE}/api/config?moduleName=${moduleName}&lang=${lang}`);
    const json = await res.json();
    // 返回我们在后台填写的那个 JSON 对象/数组
    return json.data?.data || null;
  } catch (error) {
    console.error(`[获取配置失败] ${moduleName}:`, error);
    return null;
  }
}

// 2. 获取产品列表 (替代 db.collection('products').get())
export async function getProducts(lang = '1') {
  try {
    const res = await fetch(`${API_BASE}/api/products?lang=${lang}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('[获取产品失败]:', error);
    return [];
  }
}

// 3. 全新的图片链接转换工具 (秒杀以前的 getTempFileURL)
export function getImageUrl(path) {
  if (!path) return '';
  // 如果已经是完整的 http 链接则直接返回
  if (path.startsWith('http')) return path; 
  // 否则自动拼接你服务器的公网 IP 前缀
  return `${IMAGE_BASE}${path}`;
}
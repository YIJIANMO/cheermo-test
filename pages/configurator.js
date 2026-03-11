import React, { useState, Suspense, useMemo, useLayoutEffect, useEffect } from 'react'
import Head from 'next/head'
import { Canvas, useLoader } from '@react-three/fiber'
import { useGLTF, PresentationControls, Html, useCursor, Stage } from '@react-three/drei'
import { FaCar, FaWindowMaximize, FaSpinner, FaTimes, FaLayerGroup, FaMagic, FaCheckCircle, FaPalette } from 'react-icons/fa'
import * as THREE from 'three'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'

// 引入多语言和数据库模型
import zh from '../locales/zh.json'
import en from '../locales/en.json'
import ru from '../locales/ru.json'
import tr from '../locales/tr.json'
import es from '../locales/es.json'
import ar from '../locales/ar.json'
import ja from '../locales/ja.json'

import dbConnect from '../lib/mongodb'
import SiteConfig from '../models/SiteConfig'
import { ALL_COLORS } from '../data/carColors'

const translations = { zh, en, ru, tr, es, ar, ja };

// 玻璃膜预设
const GLASS_DATA = [
  { name: "高清前挡", hex: "#e0f2fe", opacity: 0.2 },
  { name: "常规隔热", hex: "#4b5563", opacity: 0.5 },
  { name: "隐私深黑", hex: "#020617", opacity: 0.9 },
];

// --- 3D 核心渲染器 ---
function CarRenderer({ path, mainTab, subMode, globalColor, globalTexture, globalName, partColors, glassConfigs, selectedPart, onPartSelect }) {
  const { scene } = useGLTF(path);
  const [hovered, setHover] = useState(null);
  useCursor(hovered && (subMode === 'part' || mainTab === 'glass'));

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const getMaterialProps = (colorName) => {
    const name = colorName ? colorName.toLowerCase() : '';
    let props = { metalness: 0.0, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 0.7 };
    if (name.includes('matte') || name.includes('哑') || name.includes('消光')) {
      props.metalness = 0.0; props.roughness = 0.8; props.clearcoat = 0.0; props.envMapIntensity = 0.3;
    } else if (name.includes('satin') || name.includes('缎面')) {
      props.metalness = 0.1; props.roughness = 0.45; props.clearcoat = 0.3; props.envMapIntensity = 0.4;
    } else if (name.includes('metallic') || name.includes('金属') || name.includes('钻')) {
      props.metalness = 0.3; props.roughness = 0.3; props.clearcoat = 1.0; props.envMapIntensity = 0.6;
    }
    return props;
  };

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();
        const isSelected = child.name === selectedPart;
        const isHovered = child.name === hovered;
        
        const isInterior = ['seat', 'steering', 'wheel_steering', 'dashboard', 'interior', 'leather', 'plastic', 'trim', 'mirror_in', 'console', 'gear', 'pedal', 'carpet'].some(k => name.includes(k));
        if (isInterior) return;
        if (name.includes('caliper') || name.includes('brake')) { child.material.color.set('#ff5500'); return; }
        if (name.includes('wheel') || name.includes('rim') || name.includes('tire')) { child.material.color.set('#101010'); return; }

        const isGlass = ['glass', 'window', 'windshield'].some(k => name.includes(k));
        if (isGlass) {
          if (!child.userData.isCloned) {
             child.material = child.material.clone();
             child.userData.isCloned = true;
          }
          const config = glassConfigs[child.name] || { hex: '#111111', opacity: 0.4 };
          child.material.color.set(config.hex);
          child.material.transparent = true;
          child.material.opacity = config.opacity;
          child.material.roughness = 0;
          child.material.metalness = 0.9; 

          if (mainTab === 'glass') {
             if (isSelected) child.material.emissive.setHex(0x555555);
             else if (isHovered) child.material.emissive.setHex(0x222222);
             else child.material.emissive.setHex(0x000000);
          } else {
             child.material.emissive.setHex(0x000000);
          }
          return;
        }

        const isBodyPaint = ['paint', 'body', 'hood', 'door', 'roof', 'fender', 'trunk', 'shell', 'bumper'].some(k => name.includes(k));
        if (isBodyPaint) {
          if (!child.userData.isCloned) {
            child.material = child.material.clone();
            child.userData.isCloned = true;
          }

          let activeColor = globalColor;
          let activeTexture = globalTexture;
          let activeName = globalName;

          if (subMode === 'part' && partColors[child.name]) {
             activeColor = partColors[child.name].hex;
             activeTexture = partColors[child.name].texture;
             activeName = partColors[child.name].name;
          }

          const matProps = getMaterialProps(activeName);
          
          if (activeTexture) {
             textureLoader.load(activeTexture, (tex) => {
                tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; 
                tex.repeat.set(1, 1); 
                tex.colorSpace = THREE.SRGBColorSpace; 
                tex.anisotropy = 16;
                tex.needsUpdate = true;
                if(child.material.map !== tex) {
                    child.material.map = tex;
                    child.material.needsUpdate = true;
                }
             });
             child.material.color.set('#ffffff'); 
          } else {
             child.material.map = null;
             child.material.color.set(activeColor);
          }

          Object.assign(child.material, matProps);

          if (mainTab === 'body' && subMode === 'part') {
             if (isSelected) {
                 child.material.emissive.set('#666666');
                 child.material.emissiveIntensity = 0.5;
             } else if (isHovered) {
                 child.material.emissive.set('#333333');
                 child.material.emissiveIntensity = 0.3;
             } else {
                 child.material.emissive.set('#000000');
                 child.material.emissiveIntensity = 0;
             }
          } else {
             child.material.emissive.set('#000000');
             child.material.emissiveIntensity = 0;
          }
          child.material.needsUpdate = true;
        }
      }
    });
  }, [globalColor, globalTexture, globalName, partColors, glassConfigs, selectedPart, hovered, mainTab, subMode, textureLoader, scene]);

  return <primitive object={scene} position={[0, -0.65, 0]} 
    onClick={(e) => {
      e.stopPropagation();
      const name = e.object.name.toLowerCase();
      const isGlass = ['glass', 'window', 'windshield'].some(k => name.includes(k));
      const isBody = ['paint', 'body', 'hood', 'door', 'roof', 'fender', 'trunk', 'shell', 'bumper'].some(k => name.includes(k));

      if (mainTab === 'glass' && isGlass) {
         onPartSelect(e.object.name);
      } else if (mainTab === 'body' && subMode === 'part' && isBody) {
         onPartSelect(e.object.name);
      } else {
         onPartSelect(null); 
      }
    }} 
    onPointerOver={(e) => { e.stopPropagation(); setHover(e.object.name); }} 
    onPointerOut={() => setHover(null)} 
  />;
}

// 🌟 1. 接收后台捞取的配置
export default function Configurator({ cmsNav, cmsSettings, currentLocale }) {
  const router = useRouter();
  const locale = currentLocale || 'zh';
  const t = translations[locale] || zh;
  const isRTL = locale === 'ar';
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [mainTab, setMainTab] = useState('body'); 
  const [subMode, setSubMode] = useState('full'); 
  const [selectedPart, setSelectedPart] = useState(null);
  
  const [globalColor, setGlobalColor] = useState('#1a1a1a');
  const [globalTexture, setGlobalTexture] = useState(null); 
  const [globalName, setGlobalName] = useState(''); 
  
  const [partColors, setPartColors] = useState({});
  const [glassConfigs, setGlassConfigs] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredColors = useMemo(() => {
    if (activeCategory === 'all') return ALL_COLORS;
    return ALL_COLORS.filter(c => c.category === activeCategory);
  }, [activeCategory]);

  const handleColorClick = (c) => {
    if (mainTab === 'body') {
        if (subMode === 'part') {
            if (selectedPart) {
                setPartColors(prev => ({
                    ...prev,
                    [selectedPart]: { hex: c.hex, texture: c.texture, name: c.name }
                }));
            } else {
                alert("请先直接点击车身上的部位进行选中！");
            }
        } else {
            setGlobalColor(c.hex);
            setGlobalTexture(c.texture);
            setGlobalName(c.name);
            setPartColors({}); 
        }
    }
  };

  if (!mounted) return null;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-black text-white h-screen w-screen flex flex-col overflow-hidden relative">
      <Head>
        {/* 🌟 2. 网页标题接管后台动态配置 */}
        <title>{`3D Configurator | ${cmsSettings?.siteName || 'CHEERMO'}`}</title>
      </Head>
      
      {/* 🌟 3. 将导航数据喂给 Navbar */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar t={t} locale={currentLocale} cmsNav={cmsNav} cmsSettings={cmsSettings} />
      </div>

      <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]} shadows gl={{ toneMapping: THREE.NoToneMapping }} camera={{ fov: 35, position: [-6, 2, 6] }}>
            <PresentationControls speed={1.5} global zoom={0.8} polar={[-0.1, Math.PI / 2.5]}>
              <Stage intensity={0.6} environment="city" adjustCamera={false}>
                <Suspense fallback={<Html center><FaSpinner className="animate-spin text-4xl text-blue-500"/></Html>}>
                  <CarRenderer 
                    path="/my-car.glb" 
                    mainTab={mainTab} subMode={subMode}
                    globalColor={globalColor} globalTexture={globalTexture} globalName={globalName}
                    partColors={partColors} glassConfigs={glassConfigs} 
                    selectedPart={selectedPart} onPartSelect={setSelectedPart}
                  />
                </Suspense>
              </Stage>
            </PresentationControls>
          </Canvas>
      </div>

      {selectedPart && (
         <div className="absolute top-24 left-8 z-40 p-4 bg-black/60 backdrop-blur-md border-l-4 border-blue-500 rounded-r-sm animate-in slide-in-from-left-5">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
               {mainTab === 'glass' ? 'Selected Glass' : 'Selected Part'}
            </p>
            <div className="flex items-center gap-4">
                <span className="text-xl font-black text-white uppercase">{selectedPart}</span>
                <button onClick={() => setSelectedPart(null)} className="text-zinc-500 hover:text-white"><FaTimes /></button>
            </div>
         </div>
      )}

      <div className="absolute bottom-0 left-0 w-full z-50 flex flex-col pointer-events-none">
           <div className="flex justify-between items-end px-8 pb-4 pointer-events-auto">
              <div className="flex gap-2">
                 <button onClick={() => { setMainTab('body'); setSelectedPart(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border transition-all shadow-lg ${mainTab === 'body' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white'}`}>
                    <FaPalette /> <span className="font-bold text-xs uppercase tracking-wider">车身改色</span>
                 </button>
                 <button onClick={() => { setMainTab('glass'); setSelectedPart(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border transition-all shadow-lg ${mainTab === 'glass' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white'}`}>
                    <FaWindowMaximize /> <span className="font-bold text-xs uppercase tracking-wider">玻璃贴膜</span>
                 </button>
              </div>
              {mainTab === 'body' && (
                  <div className="flex gap-2">
                     <button onClick={() => { setSubMode('full'); setSelectedPart(null); }} className={`flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border transition-all text-[10px] font-bold uppercase tracking-widest ${subMode === 'full' ? 'bg-white text-black border-white' : 'bg-black/60 text-zinc-500 border-white/10 hover:text-white'}`}>
                        <FaLayerGroup /> 全车覆盖
                     </button>
                     <button onClick={() => { setSubMode('part'); alert('💡 局部模式开启：请直接点击 3D 车身上的部位进行选中！'); }} className={`flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border transition-all text-[10px] font-bold uppercase tracking-widest ${subMode === 'part' ? 'bg-white text-black border-white' : 'bg-black/60 text-zinc-500 border-white/10 hover:text-white'}`}>
                        <FaMagic /> 局部 DIY
                     </button>
                  </div>
              )}
           </div>

           <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 p-6 pointer-events-auto transition-all">
              {mainTab === 'body' ? (
                <>
                  <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide pb-1">
                     {[
                       {id:'all', name:'全部'}, {id:'mono', name:'黑白灰'}, {id:'red', name:'红/粉'}, 
                       {id:'blue', name:'蓝/青'}, {id:'green', name:'绿/翠'}, {id:'yellow', name:'黄/橙/金'}, {id:'purple', name:'紫/幻彩'}
                     ].map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500'}`}>
                          {cat.name}
                        </button>
                     ))}
                  </div>
                  <div className="flex overflow-x-auto overflow-y-hidden gap-5 pb-4 scrollbar-hide">
                     {filteredColors.map((c) => (
                       <button key={c.id} onClick={() => handleColorClick(c)} className="flex-shrink-0 flex flex-col items-center gap-3 group w-[72px]">
                          <div className={`w-14 h-14 rounded-full border-2 transition-all overflow-hidden relative shadow-lg ${
                              (globalTexture === c.texture && subMode === 'full') ? 'border-white scale-110 ring-4 ring-white/10' : 'border-white/10 group-hover:border-white/60'
                          }`}>
                             <div className="absolute inset-0 z-0" style={{backgroundColor: c.hex}}></div>
                             <img src={c.texture} className="w-full h-full object-cover relative z-10 transition-opacity duration-300" loading="lazy" onError={(e) => { e.target.style.opacity = 0; }} />
                             {(globalTexture === c.texture && subMode === 'full') && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
                                   <FaCheckCircle className="text-white drop-shadow-md" />
                                </div>
                             )}
                          </div>
                          <span className="text-[9px] font-bold text-zinc-500 group-hover:text-white truncate w-full text-center transition-colors">{c.name}</span>
                       </button>
                     ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-8 px-4 py-4">
                   {GLASS_DATA.map((c, i) => (
                     <button key={i} onClick={() => { 
                         if(selectedPart) {
                             setGlassConfigs(p => ({...p, [selectedPart]: c})); 
                         } else {
                             alert("请先点击车身上的玻璃部位！");
                         }
                     }} className="flex-shrink-0 flex flex-col items-center gap-4 group">
                        <div className="w-16 h-16 rounded-full border-2 border-white/20 relative group-hover:border-blue-500 transition-all shadow-lg" style={{backgroundColor: c.hex}}>
                           <div className="absolute inset-0 bg-white rounded-full transition-opacity duration-300" style={{opacity: 1-c.opacity}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white">{c.name}</span>
                     </button>
                   ))}
                </div>
              )}
           </div>
      </div>
    </div>
  )
}

// 🌟 4. 新增：服务端获取后台设置
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
        cmsNav: navConfig?.data ? JSON.parse(JSON.stringify(navConfig.data)) : null,
        cmsSettings: JSON.parse(JSON.stringify(cmsSettings || null)),
        currentLocale
      }
    };
  } catch (error) {
    return { props: { cmsNav: null, cmsSettings: null, currentLocale } };
  }
}

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    // ✅ 移除所有变量，仅保留基础抗锯齿，让系统自动处理字体
    <main className="antialiased">
      <Component {...pageProps} />
    </main>
  );
}
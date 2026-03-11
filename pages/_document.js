import { Html, Head, Main, NextScript } from "next/document";

export default function Document(props) {
  // 自动获取当前的语言设置 (例如 zh, en, ru 等)
  const { locale } = props.__NEXT_DATA__;

  return (
    <Html lang={locale}>
      <Head>
        {/* ✅ 已启用 logo.png 作为浏览器标签图标 */}
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
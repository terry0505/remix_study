import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [
    { title: "내 포트폴리오" },
    { name: "description", content: "퍼블리셔 팀장의 경력 포트폴리오입니다." }
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  {
    rel: "stylesheet",
    href: "/style/global.css"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <a href="/">🏠 홈</a>
            <a href="/about">🙋‍♀️ 소개</a>
            <a href="/projects">🧩 프로젝트</a>
            <a href="/contact">📬 문의</a>
            <a href="/admin">🔐 관리자</a>
          </nav>
        </header>
        <main style={{ padding: "2rem" }}>
          <Outlet />
        </main>
        <footer
          style={{
            padding: "1rem",
            borderTop: "1px solid #ccc",
            marginTop: "2rem"
          }}
        >
          <p>@ {new Date().getFullYear()} 내 이름. All rights reserved</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

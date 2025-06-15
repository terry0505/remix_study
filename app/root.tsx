import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getUserToken } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getUserToken(request);

  if (!token) {
    return json({ user: null });
  }

  const { initializeFirebaseAdmin } = await import("~/lib/firebase.server");
  const { getAuth } = await import("firebase-admin/auth");

  initializeFirebaseAdmin();

  try {
    const decoded = await getAuth().verifyIdToken(token);
    const email = decoded.email ?? "";
    const isAdmin = email === process.env.ADMIN_EMAIL;
    return json({
      user: {
        email,
        isAdmin
      }
    });
  } catch (error) {
    console.error("유저 인증 실패:", error);
    return json({ user: null });
  }
}

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
    href: "/styles/global.css"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData("root") as
    | { user: { email: string; isAdmin?: boolean } }
    | undefined;
  const user = data?.user ?? null;

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
            <Link to="/">🏠 홈</Link>
            <Link to="/about">🙋‍♀️ 소개</Link>
            <Link to="/projects">🧩 프로젝트</Link>
            <Link to="/contact">📬 문의</Link>
            {/* 관리자 전용 메뉴 */}
            {user?.isAdmin && (
              <>
                <Link to="/admin/messages">📬 문의 메시지</Link>
                <Link to="/admin/projects">🔐 관리자</Link>
              </>
            )}

            <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
              {user ? (
                <>
                  <span>👤 {user.email}</span>
                  <Form action="/logout" method="post">
                    <button type="submit">🚪 로그아웃</button>
                  </Form>
                </>
              ) : (
                <>
                  <Link to="/login">🔐 로그인</Link>
                  <Link to="/signup">📝 회원가입</Link>
                </>
              )}
            </div>
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
          <p>© {new Date().getFullYear()} 내 이름. All rights reserved.</p>
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

import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getToProjects } from "~/lib/firebase.server";
import styles from "~/styles/home.module.scss";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "퍼블리셔 출신 프론트엔드 개발자, 박하나" },
    {
      name: "description",
      content:
        "데이터와 사용자 경험 사이의 경계를 연결하는 Firebase 기반 솔루션을 만들고 있습니다."
    }
  ];
};

// 🔌 Firestore에서 최신 프로젝트 3개 불러오기
export const loader = async ({}: LoaderFunctionArgs) => {
  const projects = await getToProjects(); // imageUrl, title, techStack 포함
  return json({ projects });
};

// 🌙 다크모드 토글
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);
  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className={styles.darkToggle}
    >
      {dark ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
}

export default function HomePage() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <main className={styles.heroWrap}>
      <section className={styles.hero}>
        <ThemeToggle />
        <h1>
          안녕하세요, <br />
          <span className={styles.name}>박하나</span>입니다.
        </h1>
        <p className={styles.subtitle}>M사 퍼블리셔 출신 프론트엔드 개발자</p>
        <p className={styles.desc}>
          데이터와 사용자 경험 사이의 경계를 연결하는
          <br />
          Firebase 기반 솔루션을 만들고 있습니다.
        </p>
        <div className={styles.actions}>
          <Link to="/projects" className={styles.primaryBtn}>
            🚀 프로젝트 보기
          </Link>
          <a href="/resume.pdf" className={styles.secondaryBtn}>
            📄 이력서 다운로드
          </a>
        </div>
      </section>
      <section className={styles.stackSection}>
        <h2>🛠 기술 스택</h2>
        <div className={styles.stackList}>
          {["React", "Next.js", "Remix", "Firebase", "SCSS", "TypeScript"].map(
            (tech) => (
              <span key={tech} className={styles.techBadge}>
                {tech}
              </span>
            )
          )}
        </div>
      </section>
      <section className={styles.projectPreview}>
        <h2>📂 최신 프로젝트</h2>
        <div className={styles.projectCards}>
          {projects.map((p) => (
            <div key={p.id} className={styles.projectCard}>
              <img
                src={p.imageUrl || "/images/default-thumbnail.jpg"}
                alt={p.title}
                className={styles.projectImage}
              />
              <h4>{p.title}</h4>
              <div className={styles.stackList}>
                {p.techStack.split(",").map((t: string, i: number) => (
                  <span key={i} className={styles.techBadge}>
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link to="/projects" className={styles.primaryBtn}>
          전체 프로젝트 보기 →
        </Link>
      </section>
    </main>
  );
}

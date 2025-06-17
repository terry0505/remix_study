import { useLoaderData } from "@remix-run/react";
import { getAllProjects } from "~/lib/firebase.server";
import { json } from "@remix-run/node";
import styles from "~/styles/home.module.scss";

export const loader = async () => {
  const projects = await getAllProjects();

  return json({ projects });
};

export default function ProjectsPage() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div className={styles.wrapper}>
      <h1>🧩 프로젝트 모음</h1>
      <div className={styles.projectList}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <img
              className={styles.projectImage}
              src={project.imageUrl || "/logo-light.png"}
              alt={project.title}
            />

            <h3>{project.title}</h3>

            <p>
              <strong>설명:</strong> {project.description}
            </p>
            <p>
              <strong>기간:</strong> {project.period}
            </p>
            <p>
              <strong>기술 스택:</strong>{" "}
              {project.techStack
                .split(",")
                .map((tech: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      background: "#eee",
                      padding: "0.2rem 0.5rem",
                      marginRight: "0.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem"
                    }}
                  >
                    {tech.trim()}
                  </span>
                ))}
            </p>

            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              등록일: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

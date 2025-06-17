import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "~/lib/firebase.client";
import styles from "~/styles/admin-project-list.module.scss";

type Project = {
  id: string;
  title: string;
  description: string;
  period: string;
  techStack: string;
  imageUrl: string;
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const result: Project[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(result);
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    await deleteDoc(doc(db, "projects", id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };
  return (
    <div className={styles.projectListWrap}>
      <h2>📁 등록된 프로젝트 목록</h2>
      {projects.length === 0 ? (
        <p>아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className={styles.projectItem}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className={styles.projectImage}
                />
              )}
              <div className={styles.projectInfo}>
                <strong>{project.title}</strong>
                <span>{project.period}</span>
                <br />
                <span>{project.techStack}</span>
                <div className={styles.actionButtons}>
                  <Link to={`/admin/projects/${project.id}/edit`}>✏️ 수정</Link>
                  <button onClick={() => handleDelete(project.id)}>
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

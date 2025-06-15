import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "~/lib/firebase.client";

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
    <div>
      <h2>📁 등록된 프로젝트 목록</h2>
      {projects.length === 0 ? (
        <p>아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} style={{ marginBottom: "1rem" }}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={{ maxWidth: "200px", marginBottom: "0.5rem" }}
                />
              )}
              <strong>{project.title}</strong> ({project.period})<br />
              <span>{project.techStack}</span>
              <br />
              <Link to={`/admin/projects/${project.id}/edit`}>
                ✏️ 수정
              </Link>{" "}
              <button onClick={() => handleDelete(project.id)}>🗑️ 삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

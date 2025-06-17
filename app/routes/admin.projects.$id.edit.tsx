import { useNavigate, useParams } from "@remix-run/react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "~/lib/firebase.client";
import styles from "~/styles/admin-project-form.module.scss";

export default function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("");
  const [techStack, setTechStack] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setPeriod(data.period);
        setTechStack(data.techStack);
      } else {
        setError("해당 프로젝트를 찾을 수 없습니다.");
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateDoc(doc(db, "projects", id), {
        title,
        description,
        period,
        techStack,
        updatedAt: serverTimestamp()
      });
      navigate("/admin/projects");
    } catch (err: any) {
      setError("수정 중 오류 발생: " + err.message);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.projectFormWrap}>
      <h2>✏️ 프로젝트 수정</h2>
      <form onSubmit={handleUpdate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
        <input
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="기간"
          required
        />
        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="기술 스택"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명"
          required
        />
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}

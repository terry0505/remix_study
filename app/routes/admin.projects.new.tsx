import { useNavigate } from "@remix-run/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "~/lib/firebase";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [techStack, setTechStack] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        title,
        period,
        techStack,
        description,
        createdAt: serverTimestamp()
      });
      navigate("/admin/projects"); // 등록 후 목록 페이지로 이동
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>새 프로젝트 등록</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="기간 (예: 2022.05 ~ 2023.02"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="기술 스택 (쉼표로 구분)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <button type="submit">등록하기</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

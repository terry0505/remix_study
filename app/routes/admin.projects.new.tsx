import { useNavigate } from "@remix-run/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { useState } from "react";
import { db, storage } from "~/lib/firebase";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [techStack, setTechStack] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      if (image) {
        const storageRef = ref(storage, `projects/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "projects"), {
        title,
        period,
        techStack,
        imageUrl,
        description,
        createdAt: serverTimestamp()
      });
      navigate("/admin/projects"); // 등록 후 목록 페이지로 이동
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <br />
        <button type="submit">등록하기</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

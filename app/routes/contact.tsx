import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "~/lib/firebase";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✨ 1. Firestore에 메시지 저장
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
        isRead: false
      });

      // ✉️ 2. 이메일 전송
      const res = await fetch(
        "https://us-central1-remix-portfolio-15677.cloudfunctions.net/api/sendMail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        }
      );

      if (res.ok) {
        setResult("✅ 메일이 성공적으로 전송되었습니다!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setResult("❌ 메일 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("오류:", error);
      setResult("❌ 메시지 저장 또는 메일 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📬 Contact</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="메시지"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br />
        <button type="submit">보내기</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}

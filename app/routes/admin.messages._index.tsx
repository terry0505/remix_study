import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
import { db } from "~/lib/firebase.client";
import { Link } from "@remix-run/react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead?: boolean;
  isReplied?: string;
  reply?: string;
  repliedAt?: { seconds: number; nanoseconds: number };
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(docs);
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await deleteDoc(doc(db, "messages", id));
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const toggleIsRead = async (id: string, current: boolean) => {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { isRead: !current });
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: !current } : msg))
    );
  };

  const filtered = messages.filter((msg) =>
    (msg.name + msg.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📬 문의 메시지 목록</h1>

      <input
        type="text"
        placeholder="이름 또는 이메일 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
      />

      {filtered.length === 0 ? (
        <p>🔍 검색 결과가 없습니다.</p>
      ) : (
        <ul>
          {filtered.map((msg) => (
            <li
              key={msg.id}
              style={{
                marginBottom: "1.5rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem"
              }}
            >
              <Link
                to={`/admin/messages/${msg.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <p>
                  <strong>이름:</strong> {msg.name}
                </p>
                <p>
                  <strong>이메일:</strong> {msg.email}
                </p>
                <p>
                  <strong>메시지:</strong> {msg.message}
                </p>
                <p>
                  <strong>날짜:</strong>{" "}
                  {msg.createdAt
                    ? new Date(msg.createdAt.seconds * 1000).toLocaleString()
                    : "날짜 없음"}
                </p>
              </Link>
              <p>
                <strong>처리 상태:</strong>{" "}
                {msg.isRead ? (
                  <span style={{ color: "green" }}>✅ 처리됨</span>
                ) : (
                  <span style={{ color: "orange" }}>⏳ 미처리</span>
                )}
              </p>
              <button onClick={() => toggleIsRead(msg.id, msg.isRead ?? false)}>
                🔁 상태 변경
              </button>{" "}
              <p>
                <strong>답변 상태:</strong>{" "}
                {msg.isReplied ? (
                  <span style={{ color: "blue" }}>📬 답변 완료</span>
                ) : (
                  <span style={{ color: "gray" }}>📭 미답변</span>
                )}
              </p>
              <button onClick={() => handleDelete(msg.id)}>🗑️ 삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

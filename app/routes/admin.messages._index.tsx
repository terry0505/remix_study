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
import styles from "~/styles/admin-messages.module.scss";

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
    <div className={styles.adminMessages}>
      <h1>📬 문의 메시지 목록</h1>

      <input
        type="text"
        placeholder="이름 또는 이메일 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {filtered.length === 0 ? (
        <p>🔍 검색 결과가 없습니다.</p>
      ) : (
        <ul className={styles.messageList}>
          {filtered.map((msg) => (
            <li key={msg.id} className={styles.messageItem}>
              <Link to={`/admin/messages/${msg.id}`}>
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
              <p className={styles.status}>
                <strong>처리 상태:</strong>{" "}
                <span className={msg.isRead ? styles.read : styles.unread}>
                  {msg.isRead ? "✅ 처리됨" : "⏳ 미처리"}
                </span>
              </p>
              <button
                onClick={() => toggleIsRead(msg.id, msg.isRead ?? false)}
                className={styles.actionBtn}
              >
                🔁 상태 변경
              </button>
              <p className={styles.status}>
                <strong>답변 상태:</strong>{" "}
                <span
                  className={msg.isReplied ? styles.replied : styles.unreplied}
                >
                  {msg.isReplied ? "📬 답변 완료" : "📭 미답변"}
                </span>
              </p>
              <button
                onClick={() => handleDelete(msg.id)}
                className={styles.actionBtn}
              >
                🗑️ 삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useParams, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "~/lib/firebase.client";
import styles from "~/styles/admin-message-detail.module.scss";

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

export default function MessageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!id) return;
      const docRef = doc(db, "messages", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setMsg({ id: snapshot.id, ...snapshot.data() } as Message);
      } else {
        alert("메시지를 찾을 수 없습니다.");
        navigate("/admin/messages");
      }
    };

    fetchMessage();
  }, [id, navigate]);

  const handleReplySubmit = async () => {
    if (!id || !reply.trim()) return;
    setIsSubmitting(true);

    try {
      const docRef = doc(db, "messages", id);
      await updateDoc(docRef, {
        reply,
        repliedAt: Timestamp.now(),
        isReplied: true
      });

      // ✉️ ✅ 답장 이메일 전송
      const response = await fetch(
        "https://us-central1-remix-portfolio-15677.cloudfunctions.net/api/sendReplyMail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: msg?.email, reply })
        }
      );

      if (!response.ok) {
        console.warn("이메일 전송 실패:", await response.text());
      }

      alert("답장이 저장되었습니다!");
      navigate("/admin/messages");
    } catch (error) {
      console.error("답장 저장 실패:", error);
      alert("답장 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!msg) return <p>불러오는 중...</p>;

  return (
    <div className={styles.messageDetailWrap}>
      <h1>📄 메시지 상세 보기</h1>
      <p>
        <strong>이름:</strong> {msg.name}
      </p>
      <p>
        <strong>이메일:</strong> {msg.email}
      </p>
      <p>
        <strong>메시지:</strong>
        <div className={styles.messageContent}>{msg.message}</div>
      </p>
      <p>
        <strong>날짜:</strong>{" "}
        {msg.createdAt
          ? new Date(msg.createdAt.seconds * 1000).toLocaleString()
          : "날짜 없음"}
      </p>
      <p>
        <strong>처리 상태:</strong> {msg.isRead ? "✅ 처리됨" : "⏳ 미처리"}
      </p>

      <div className={styles.buttonGroup}>
        <button
          onClick={() => navigate("/admin/messages")}
          className={`${styles.button} ${styles.secondary}`}
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {msg.reply && (
        <>
          <hr style={{ margin: "2rem 0" }} />
          <h3>📨 답변 내용</h3>
          <div className={styles.replyContent}>{msg.reply}</div>
          <p className={styles.replyDate}>
            답변일:{" "}
            {msg.repliedAt
              ? new Date(msg.repliedAt.seconds * 1000).toLocaleString()
              : "알 수 없음"}
          </p>
        </>
      )}

      <div className={styles.replyBox}>
        <h3>📨 답장 보내기</h3>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="답변 내용을 입력하세요"
          rows={4}
        />
        <div className={styles.buttonGroup}>
          <button
            onClick={handleReplySubmit}
            disabled={isSubmitting}
            className={styles.button}
          >
            ✅ 답장 저장
          </button>
        </div>
      </div>
    </div>
  );
}

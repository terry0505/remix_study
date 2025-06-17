import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { auth } from "~/lib/firebase.client";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "~/styles/login.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/projects");
    } catch (err: any) {
      setError("로그인 실패: " + err.message);
    }
  };

  return (
    <div className={styles.loginWrap}>
      <h1>관리자 로그인</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

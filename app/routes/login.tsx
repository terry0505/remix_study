import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "~/lib/firebase.client";
import styles from "~/styles/login-social.module.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      const res = await fetch("/auth/session", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        navigate("/");
      } else {
        setError("세션 저장 실패");
      }
    } catch (err: any) {
      console.error("로그인 실패:", err.code, err.message);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSocialLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      await fetch("/auth/session", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      navigate("/");
    } catch (err) {
      console.error("소셜 로그인 실패:", err);
      alert("소셜 로그인에 실패했습니다.");
    }
  };

  return (
    <div className={styles.loginWrap}>
      <h1>🔐 로그인</h1>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <form onSubmit={handleEmailLogin}>
        <p>
          <label>
            이메일:
            <input type="email" name="email" required />
          </label>
        </p>
        <p>
          <label>
            비밀번호:
            <input type="password" name="password" required />
          </label>
        </p>
        <button type="submit">로그인</button>
      </form>

      <hr />

      <button
        onClick={() => handleSocialLogin(googleProvider)}
        className={styles.socialBtn}
      >
        🔐 Google로 로그인
      </button>
      <button
        onClick={() => handleSocialLogin(githubProvider)}
        className={styles.socialBtn}
      >
        🐱 GitHub로 로그인
      </button>
    </div>
  );
}

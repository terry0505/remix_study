import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/lib/firebase.client';

export default function SignupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // 🔐 서버로 토큰 전달 → 세션 저장
      const res = await fetch('/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      console.log('세션 응답:', data);

      if (res.ok) {
        navigate('/');
      } else {
        setError('세션 저장 실패');
      }
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('이미 가입된 이메일입니다. 로그인 페이지로 이동해 주세요.');
      } else if (err.code === 'auth/weak-password') {
        setError('비밀번호는 최소 6자리 이상이어야 합니다.');
      } else {
        setError(err.message || '회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1>📝 회원가입</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSignup}>
        <p>
          <label>
            이메일:
            <input type='email' name='email' required />
          </label>
        </p>
        <p>
          <label>
            비밀번호:
            <input type='password' name='password' required />
          </label>
        </p>
        <button type='submit'>가입하기</button>
      </form>
    </div>
  );
}
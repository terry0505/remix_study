import { useEffect } from 'react';
import { useNavigate, Outlet } from '@remix-run/react';
import { auth } from '~/lib/firebase.client';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>관리자 전용 페이지</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <a href="/admin/projects">📁 프로젝트 목록</a> |{' '}
        <a href="/admin/projects/new">➕ 새 프로젝트 등록</a>
      </nav>

      {/* 🔽 여기에 하위 경로 내용이 렌더링됩니다 */}
      <Outlet />
    </div>
  );
}

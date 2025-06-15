import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET 환경변수가 필요합니다!');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'firebase_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function getUserToken(request: Request): Promise<string | null> {
  const session = await getUserSession(request);
  const token = session.get('token');
  return typeof token === 'string' ? token : null;
}

export async function setUserSession(request: Request, token: string) {
  const session = await getUserSession(request);
  session.set('token', token);
  return session;
}

export async function destroyUserSession(request: Request) {
  const session = await getUserSession(request);
  return sessionStorage.destroySession(session);
}

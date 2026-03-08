import { cookies } from 'next/headers';

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  return session?.value || null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

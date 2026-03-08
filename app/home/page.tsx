import { getSession, clearSession } from '@/lib/session';
import { getUserById } from '@/db/user.model';
import { getNotesByUserId } from '@/db/note.model';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';
import { UserDashboard } from '@/components/UserDashboard';

export default async function HomePage() {
  const userId = await getSession();
  if (!userId) {
    redirect('/');
  }

  const user = getUserById(userId);
  if (!user) {
    await clearSession();
    redirect('/');
  }

  const logoutAction = async () => {
    'use server';
    await clearSession();
    redirect('/');
  };

  const isAdmin = user.username === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          Bem-vindo, {user.name || user.username}
        </h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
            Sair
          </button>
        </form>
      </header>
      
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full mt-6">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserDashboard notes={getNotesByUserId(user.id)} />
        )}
      </main>
    </div>
  );
}

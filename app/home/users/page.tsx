import { getUsers, deleteUser } from '@/db/user.model';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const users = getUsers();
  const isAdmin = users.find(u => u.id === session)?.username === 'admin';
  if (!isAdmin) redirect('/home');

  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      deleteUser(id);
      revalidatePath('/home/users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Gerenciar Usuários</h1>
        <Link href="/home" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Voltar ao Painel
        </Link>
      </header>
      
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full mt-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username (Celular)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {u.username !== 'admin' && (
                      <form action={handleDelete} className="inline-block">
                        <input type="hidden" name="id" value={u.id} />
                        <button type="submit" className="text-red-600 hover:text-red-900">Excluir</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

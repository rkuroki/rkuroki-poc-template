import { getPageUrls, deletePageUrl, createPageUrl } from '@/db/pageurl.model';
import { getUsers } from '@/db/user.model';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminPageUrlsPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const users = getUsers();
  const isAdmin = users.find(u => u.id === session)?.username === 'admin';
  if (!isAdmin) redirect('/home');

  const pageUrls = getPageUrls();

  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      deletePageUrl(id);
      revalidatePath('/home/pageurls');
    }
  };

  const handleCreate = async (formData: FormData) => {
    'use server';
    const url = formData.get('url') as string;
    const path = formData.get('path') as string;
    if (url && path) {
      createPageUrl({ url, path });
      revalidatePath('/home/pageurls');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Gerenciar PageUrls</h1>
        <Link href="/home" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Voltar ao Painel
        </Link>
      </header>
      
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full mt-6 space-y-8">
        
        {/* Create Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Adicionar PageUrl</h2>
          <form action={handleCreate} className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL Base</label>
              <input type="text" id="url" name="url" placeholder="https://exemplo.com" required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-1">
              <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">Path</label>
              <input type="text" id="path" name="path" placeholder="/caminho" required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-[42px] transition-colors">
              Adicionar
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageUrls.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">Nenhum PageUrl cadastrado.</td>
                </tr>
              ) : (
                pageUrls.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.url}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.path}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="text-red-600 hover:text-red-900">Excluir</button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

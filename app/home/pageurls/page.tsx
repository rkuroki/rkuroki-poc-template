import { getPageUrls } from '@/db/pageurl.model';
import { getUsers } from '@/db/user.model';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CrudLayout } from '@/components/crud/CrudLayout';
import { upsertPageUrlAction, deletePageUrlAction } from '@/app/actions/crudPageUrls';

export default async function AdminPageUrlsPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const users = getUsers();
  const isAdmin = users.find(u => u.id === session)?.username === 'admin';
  if (!isAdmin) redirect('/home');

  const pageUrls = getPageUrls();

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'URL', accessor: 'url' as const },
    { header: 'Path', accessor: 'path' as const },
  ];

  const fields = [
    { name: 'url', label: 'URL Base', placeholder: 'Ex: https://exemplo.com' },
    { name: 'path', label: 'Path Correspondente', placeholder: 'Ex: /caminho' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Gerenciar PageUrls</h1>
        <a href="/home" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Voltar ao Painel
        </a>
      </header>
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">
        <CrudLayout 
          title="URLs Mapeadas"
          items={pageUrls}
          columns={columns}
          fields={fields}
          upsertAction={upsertPageUrlAction}
          deleteAction={deletePageUrlAction}
          entityName="pageurls"
        />
      </main>
    </div>
  );
}

import { getUsers } from '@/db/user.model';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CrudLayout } from '@/components/crud/CrudLayout';
import { upsertUserAction, deleteUserAction } from '@/app/actions/crudUsers';

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const users = getUsers();
  const isAdmin = users.find(u => u.id === session)?.username === 'admin';
  if (!isAdmin) redirect('/home');

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Username (Celular)', accessor: 'username' as const },
    { header: 'Nome', accessor: 'name' as const },
  ];

  const fields = [
    { name: 'username', label: 'Username (Celular apenas para não-admin)', placeholder: 'Ex: +55 11 9 9999 9999' },
    { name: 'name', label: 'Nome', placeholder: 'Ex: João da Silva' },
    { name: 'pwd', type: 'password', label: 'Senha (Deixe em branco para não alterar)', placeholder: '******' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Gerenciar Usuários</h1>
        <a href="/home" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Voltar ao Painel
        </a>
      </header>
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">
        <CrudLayout 
          title="Usuários Cadastrados"
          items={users}
          columns={columns}
          fields={fields}
          upsertAction={upsertUserAction}
          deleteAction={deleteUserAction}
          entityName="users"
        />
      </main>
    </div>
  );
}

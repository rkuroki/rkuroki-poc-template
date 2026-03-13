import { getNotes } from '@/db/note.model';
import { getUsers } from '@/db/user.model';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CrudLayout } from '@/components/crud/CrudLayout';
import { upsertNoteAction, deleteNoteAction } from '@/app/actions/crudNotes';

export default async function AdminNotesPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const users = getUsers();
  const isAdmin = users.find(u => u.id === session)?.username === 'admin';
  if (!isAdmin) redirect('/home');

  const rawNotes = getNotes();
  const userMap = new Map(users.map(u => [u.id, u.username]));

  const notes = rawNotes.map(n => ({
    ...n,
    username: userMap.get(n.userId) || n.userId,
  }));

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Nota', accessor: 'note' as const },
    { header: 'Ordem', accessor: 'order' as const },
    { header: 'Proprietário (Celular)', accessor: 'username' as const },
  ];

  const fields = [
    { name: 'note', label: 'Conteúdo da Nota', placeholder: 'Ex: Fazer compras...' },
    { name: 'order', type: 'number', label: 'Ordem de Exibição', placeholder: 'Ex: 0' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Gerenciar Todas as Notas</h1>
        <a href="/home" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Voltar ao Painel
        </a>
      </header>
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">
        <CrudLayout 
          title="Gerenciamento Global de Notas"
          items={notes}
          columns={columns}
          fields={fields}
          upsertAction={upsertNoteAction}
          deleteAction={deleteNoteAction}
          entityName="notes"
        />
      </main>
    </div>
  );
}

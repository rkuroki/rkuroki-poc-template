import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getUserById, getUsers } from '@/db/user.model';
import { getNoteByMne } from '@/db/note.model';
import { getPageUrlByMne } from '@/db/pageurl.model';
import { getUserByMne } from '@/db/user.model';
import { getFeatureFlagByMne } from '@/db/featureFlag.model';
import { updateEntityAction } from '@/app/actions/updateEntity';
import { EntityEditForm } from '@/components/crud/EntityEditForm';
import type { EditFieldDef } from '@/components/crud/EntityEditForm';

interface PageProps {
  params: Promise<{ entityName: string; mnemonic: string }>;
}

// Back-link paths for each entity
const backPaths: Record<string, string> = {
  notes: '/home/notes',
  pageurls: '/home/pageurls',
  users: '/home/users',
  featureflags: '/home/feature-flags',
};

export default async function EntityEditPage({ params }: PageProps) {
  const { entityName, mnemonic } = await params;

  const sessionUserId = await getSession();
  if (!sessionUserId) redirect('/');

  const currentUser = getUserById(sessionUserId);
  if (!currentUser) redirect('/');

  const isAdmin = currentUser.username === 'admin';

  // ── Resolve entity record & build fields ──────────────────────────────────
  let title = '';
  let fields: EditFieldDef[] = [];
  let isForbidden = false;

  if (entityName === 'notes') {
    const record = getNoteByMne(mnemonic);
    if (!record) return notFound();

    if (!isAdmin && record.userId !== sessionUserId) {
      isForbidden = true;
    }

    title = 'Editar Nota';
    fields = [
      { name: 'note', label: 'Conteúdo da Nota', defaultValue: record.note, placeholder: 'Ex: Fazer compras...' },
      { name: 'order', label: 'Ordem de Exibição', type: 'number', defaultValue: String(record.order), placeholder: '0' },
    ];

    // Admin-only: reassign userId via a select
    if (isAdmin) {
      const allUsers = getUsers();
      fields.push({
        name: 'userId',
        label: 'Proprietário (admin)',
        type: 'select',
        defaultValue: record.userId,
        options: allUsers.map(u => ({ value: u.id, label: `${u.username}${u.name ? ` (${u.name})` : ''}` })),
      });
    }
  } else if (entityName === 'pageurls') {
    if (!isAdmin) isForbidden = true;

    const record = getPageUrlByMne(mnemonic);
    if (!record) return notFound();

    title = 'Editar PageUrl';
    fields = [
      { name: 'url', label: 'URL Base', defaultValue: record.url, placeholder: 'Ex: https://exemplo.com' },
      { name: 'path', label: 'Path Correspondente', defaultValue: record.path, placeholder: 'Ex: /caminho' },
    ];
  } else if (entityName === 'users') {
    if (!isAdmin) isForbidden = true;

    const record = getUserByMne(mnemonic);
    if (!record) return notFound();

    title = `Editar Usuário: ${record.username}`;
    fields = [
      {
        name: 'username',
        label: 'Username',
        defaultValue: record.username,
        placeholder: 'Ex: +55 11 9 9999 9999',
        disabled: record.username === 'admin', // guard: admin cannot be renamed
        hint: record.username === 'admin' ? 'O usuário admin não pode ser renomeado.' : undefined,
      },
      { name: 'name', label: 'Nome', defaultValue: record.name ?? '', placeholder: 'Nome completo' },
      { name: 'pwd', label: 'Nova Senha (deixe em branco para manter)', type: 'password', placeholder: '••••••••' },
    ];
  } else if (entityName === 'featureflags') {
    if (!isAdmin) isForbidden = true;

    const record = getFeatureFlagByMne(mnemonic);
    if (!record) return notFound();

    title = `Editar Feature Flag: ${record.name}`;
    fields = [
      { name: 'name', label: 'Nome da Feature Flag', defaultValue: record.name, placeholder: 'Ex: ENABLE_NEW_UI' },
      { name: 'value', label: 'Valor', defaultValue: record.value, placeholder: 'Ex: true, false, 100' },
    ];
  } else {
    return notFound();
  }

  const boundAction = updateEntityAction.bind(null, entityName, mnemonic);
  const backPath = backPaths[entityName] ?? '/home';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <a href={backPath} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          ← Voltar
        </a>
      </header>

      <main className="flex-1 p-6 max-w-xl mx-auto w-full mt-6">
        {isForbidden ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 text-center">
            <div className="text-red-400 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">
              Você não tem permissão para editar este registro.
            </p>
            <a
              href="/home"
              className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Voltar ao Painel
            </a>
          </div>
        ) : (
          <EntityEditForm fields={fields} action={boundAction} />
        )}
      </main>
    </div>
  );
}

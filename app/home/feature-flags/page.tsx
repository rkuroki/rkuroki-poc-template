import { CrudLayout } from '@/components/crud/CrudLayout';
import { getAllFeatureFlags } from '@/db/featureFlag.model';
import { upsertFeatureFlagAction, deleteFeatureFlagAction } from '@/app/actions/featureFlags';
import { getSession } from '@/lib/session';
import { getUserById } from '@/db/user.model';
import { redirect } from 'next/navigation';

export default async function FeatureFlagsPage() {
  const userId = await getSession();
  if (!userId) redirect('/mgmt');
  
  const user = getUserById(userId);
  if (!user || user.username !== 'admin') {
    redirect('/home');
  }

  const flags = getAllFeatureFlags();

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Nome da Role / Flag', accessor: 'name' as const },
    { header: 'Valor Atribuído', accessor: 'value' as const },
    { header: 'Criado em', accessor: 'created_at' as const },
  ];

  const fields = [
    { name: 'name', label: 'Nome da Feature Flag', placeholder: 'Ex: ENABLE_NEW_UI' },
    { name: 'value', label: 'Valor', placeholder: 'Ex: true, false, 100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Gerenciar Feature Flags</h1>
        <a href="/home" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Voltar ao Painel
        </a>
      </header>
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">
        <CrudLayout 
          title="Feature Flags Cadastradas"
          items={flags}
          columns={columns}
          fields={fields}
          upsertAction={upsertFeatureFlagAction}
          deleteAction={deleteFeatureFlagAction}
        />
      </main>
    </div>
  );
}

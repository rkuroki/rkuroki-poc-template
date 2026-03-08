import Link from 'next/link';

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Painel do Administrador</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/home/users" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-blue-600 mb-2">Gerenciar Users</h3>
          <p className="text-sm text-gray-500">Visualizar, criar, editar e excluir usuários.</p>
        </Link>
        <Link href="/home/pageurls" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-blue-600 mb-2">Gerenciar PageUrls</h3>
          <p className="text-sm text-gray-500">Gerenciar mapeamentos de URLs públicos do sistema.</p>
        </Link>
        <Link href="/home/notes" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-blue-600 mb-2">Gerenciar Notas</h3>
          <p className="text-sm text-gray-500">Supervisionar todas as notas criadas pelos usuários.</p>
        </Link>
      </div>
    </div>
  );
}

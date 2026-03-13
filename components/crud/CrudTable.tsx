'use client';

import Link from 'next/link';

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T;
}

interface CrudTableProps<T> {
  items: T[];
  columns: ColumnDef<T>[];
  /** When provided, the Edit button navigates to this path. Receives the item and returns the URL. */
  editPath?: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete: (item: T) => void;
}

export function CrudTable<T extends { id: string | number }>({ items, columns, editPath, onEdit, onDelete }: CrudTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-sm text-gray-500">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={String(item.id)} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                    {item[col.accessor] !== null && item[col.accessor] !== undefined ? String(item[col.accessor]) : ''}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editPath ? (
                    <Link href={editPath(item)} className="text-blue-600 hover:text-blue-900 mr-4">
                      Editar
                    </Link>
                  ) : (
                    <button onClick={() => onEdit?.(item)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                  )}
                  <button onClick={() => { if(confirm('Tem certeza que deseja excluir?')) onDelete(item); }} className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

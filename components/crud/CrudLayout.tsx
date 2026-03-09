'use client';

import { useState, useTransition } from 'react';
import { CrudTable, ColumnDef } from './CrudTable';
import { CrudForm, FieldDef } from './CrudForm';

interface CrudLayoutProps<T> {
  title: string;
  items: T[];
  columns: ColumnDef<T>[];
  fields: FieldDef[];
  upsertAction: (prevState: unknown, formData: FormData) => Promise<{ error: string; success?: boolean }>;
  deleteAction: (id: string | number) => Promise<void>;
}

export function CrudLayout<T extends { id: string | number }>({ title, items, columns, fields, upsertAction, deleteAction }: CrudLayoutProps<T>) {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (item: T) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleDelete = (item: T) => {
    startTransition(async () => {
      await deleteAction(item.id);
      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Form Section */}
      <div className="w-full md:w-1/3">
        <CrudForm<T>
          fields={fields} 
          editingItem={editingItem} 
          onCancelEdit={handleCancelEdit} 
          upsertAction={upsertAction} 
        />
      </div>

      {/* Table Section */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
          <CrudTable<T>
            items={items} 
            columns={columns} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  );
}

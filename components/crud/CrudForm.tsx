'use client';

import { useActionState, useEffect, useRef } from 'react';
import { SubmitButton } from '@/components/SubmitButton';

export interface FieldDef {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface CrudFormProps<T> {
  fields: FieldDef[];
  editingItem: T | null;
  onCancelEdit: () => void;
  upsertAction: (prevState: unknown, formData: FormData) => Promise<{ error: string; success?: boolean }>;
}

export function CrudForm<T extends { id: string | number }>({ fields, editingItem, onCancelEdit, upsertAction }: CrudFormProps<T>) {
  const [state, formAction, isPending] = useActionState(upsertAction, { error: '', success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      onCancelEdit();
    }
  }, [state.success, onCancelEdit]);

  useEffect(() => {
    // Repopulate form defaultValues when editingItem changes
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [editingItem]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {editingItem ? 'Editar Registro' : 'Novo Registro'}
      </h3>
      
      <form ref={formRef} action={formAction} className="space-y-4">
        {editingItem && (
          <input type="hidden" name="id" value={String(editingItem.id)} />
        )}
        
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder || ''}
              defaultValue={editingItem ? String((editingItem as Record<string, unknown>)[field.name] || '') : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>
        ))}

        {state?.error && (
          <div className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md">
            {state.error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {editingItem && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isPending}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <SubmitButton
            disabled={isPending}
            pendingText="Salvando..."
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingItem ? 'Salvar' : 'Adicionar'}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

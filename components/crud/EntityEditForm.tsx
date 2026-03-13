'use client';

import { useActionState, useRef } from 'react';
import { SubmitButton } from '@/components/SubmitButton';
import type { EditActionResult } from '@/app/actions/updateEntity';

export interface EditFieldDef {
  name: string;
  label: string;
  type?: string; // 'text' | 'number' | 'password' | 'select'
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  hint?: string;
  options?: { value: string; label: string }[]; // for type='select'
}

interface EntityEditFormProps {
  fields: EditFieldDef[];
  action: (prevState: unknown, formData: FormData) => Promise<EditActionResult>;
}

export function EntityEditForm({ fields, action }: EntityEditFormProps) {
  const [state, formAction, isPending] = useActionState(action, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <form ref={formRef} action={formAction} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>

            {field.type === 'select' && field.options ? (
              <select
                id={field.name}
                name={field.name}
                defaultValue={field.defaultValue || ''}
                disabled={field.disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || ''}
                defaultValue={field.defaultValue || ''}
                disabled={field.disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
              />
            )}

            {field.hint && (
              <p className="mt-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded">{field.hint}</p>
            )}
            {state.fieldErrors?.[field.name] && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors[field.name].join(', ')}</p>
            )}
          </div>
        ))}

        <SubmitButton
          disabled={isPending}
          pendingText="Salvando..."
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar
        </SubmitButton>

        {/* Validation errors summary displayed below the submit button */}
        {state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
          <div className="mt-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
            <p className="font-semibold mb-1 text-sm">Corrija os erros abaixo:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {Object.entries(state.fieldErrors).map(([field, messages]) => (
                <li key={field}>
                  <strong>{field}:</strong> {messages.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.error && !state.success && (
          <div className="mt-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
            <p className="text-sm">{state.error}</p>
          </div>
        )}

        {state.success && (
          <div className="mt-4 p-4 text-green-700 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm font-medium">Registro salvo com sucesso!</p>
          </div>
        )}
      </form>
    </div>
  );
}

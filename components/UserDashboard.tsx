'use client';

import { useActionState, useRef, useEffect } from 'react';
import { addNoteAction } from '@/app/actions/notes';
import { SubmitButton } from '@/components/SubmitButton';

type Note = {
  id: string;
  note: string;
  order: number;
};

export function UserDashboard({ notes }: { notes: Note[] }) {
  const [state, formAction, isPending] = useActionState(addNoteAction, { error: '', success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-800">Minhas Notas</h2>

      <form ref={formRef} action={formAction} className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Adicionar Nova Nota
          </label>
          <input
            type="text"
            id="note"
            name="note"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Escreva sua anotação aqui..."
            required
            autoComplete="off"
          />
        </div>
        <SubmitButton
          disabled={isPending}
          pendingText="Adicionando..."
          className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-[42px]"
        >
          Adicionar
        </SubmitButton>
      </form>

      {state?.error && (
        <div className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md">
          {state.error}
        </div>
      )}

      <div className="mt-8">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Ordem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notes.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-500">
                    Você ainda não possui notas adicionadas.
                  </td>
                </tr>
              ) : (
                notes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                      {note.note}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {note.order}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

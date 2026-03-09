'use client';

import { useActionState } from 'react';
import { loginMgmtAction } from '@/app/actions/authMgmt';
import { SubmitButton } from '@/components/SubmitButton';

export default function MgmtLoginPage() {
  const [state, formAction, isPending] = useActionState(loginMgmtAction, { error: '' });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Administração</h1>
        
        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="admin"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red-400 bg-red-900/30 border border-red-800 py-2 px-3 rounded-md">
              {state.error}
            </div>
          )}

          <SubmitButton
            disabled={isPending}
            pendingText="Verificando..."
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 mt-2"
          >
            Acessar Painel
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

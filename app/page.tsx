'use client';

import { useState, useActionState } from 'react';
import { loginOrRegister } from '@/app/actions/auth';

export default function LoginPage() {
  const [displayValue, setDisplayValue] = useState('+55 11 ');
  const [rawUsername, setRawUsername] = useState('+5511');
  const [state, formAction, isPending] = useActionState(loginOrRegister, { error: '' });

  // Function to apply the mask: +55 11 9 8888 7777
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Ensure it always starts with 55
    if (!val.startsWith('55')) {
       val = '55' + val;
    }
    
    // Limit to 13 digits total (55 + 11 digits)
    if (val.length > 13) {
      val = val.substring(0, 13);
    }

    // Build the raw username string matching +55XXXXXXXXXXX
    setRawUsername('+' + val);

    // Apply the visual mask
    let masked = '+55 ';
    if (val.length > 2) {
      masked += val.substring(2, 4); // DD
    }
    if (val.length > 4) {
      masked += ' ' + val.substring(4, 5); // 9
    }
    if (val.length > 5) {
      masked += ' ' + val.substring(5, 9); // 8888
    }
    if (val.length > 9) {
      masked += ' ' + val.substring(9, 13); // 7777
    }

    setDisplayValue(masked.trim());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Validate length before submission
    if (rawUsername.length !== 14) {
      e.preventDefault();
      alert('O número de celular deve conter o DDD e 9 dígitos. (Ex: +55 11 9 8888 7777)');
      return;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 border p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Acessar Conta</h1>
        
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Celular
            </label>
            <input
              type="text"
              id="displayPhone"
              value={displayValue}
              onChange={handlePhoneChange}
              placeholder="+55 11 9 8888 7777"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
            {/* Hidden input to securely transmit the validated string without spaces */}
            <input type="hidden" name="username" value={rawUsername} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              No primeiro acesso, a senha cadastrada será padrão.
            </p>
          </div>

          {state?.error && (
            <div className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isPending ? 'Processando...' : 'Prosseguir'}
          </button>
        </form>
      </div>
    </div>
  );
}

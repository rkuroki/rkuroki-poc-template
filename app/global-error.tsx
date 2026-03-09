'use client';
 
import { useEffect } from 'react';
import { logClientError } from '@/app/actions/telemetry';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logClientError({
      message: error.message,
      stack: error.stack,
      pathname: 'global-error',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 p-8 rounded-lg shadow-md max-w-md w-full text-center border-t-4 border-red-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro Crítico de Sistema</h2>
            <p className="text-gray-600 mb-6 font-mono text-sm break-words bg-white p-2 rounded border border-red-200">
              {error.message || "A aplicação encontrou um erro fatal."}
            </p>
            <button
              onClick={() => reset()}
              className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Forçar Recarregamento
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

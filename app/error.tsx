'use client';

import { useEffect } from 'react';
import { logClientError } from '@/app/actions/telemetry';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our SQLite telemetry database
    logClientError({
      message: error.message,
      stack: error.stack,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border-t-4 border-red-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-6 font-mono text-sm break-words bg-gray-100 p-2 rounded">
          {error.message || "Ocorreu um erro inesperado."}
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

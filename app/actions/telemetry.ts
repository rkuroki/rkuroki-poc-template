'use server';

import db from '@/db/index';

export async function logClientError(errorPayload: {
  message: string;
  stack?: string;
  pathname?: string;
  userAgent?: string;
}) {
  try {
    const stmt = db.prepare(`
      INSERT INTO client_errors (error_message, stack_trace, pathname, user_agent) 
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(
      errorPayload.message,
      errorPayload.stack || null,
      errorPayload.pathname || null,
      errorPayload.userAgent || null
    );
  } catch (err) {
    console.error('Failed to log client error to telemetry db:', err);
  }
}

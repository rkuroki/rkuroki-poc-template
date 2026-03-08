import db from './index';
import { z } from 'zod';
import crypto from 'crypto';

export const NoteSchema = z.object({
  id: z.string().uuid(),
  note: z.string().min(1),
  order: z.number().int(),
  userId: z.string().uuid(),
});

export type Note = z.infer<typeof NoteSchema>;

export const NoteInsertPayloadSchema = z.object({
  note: z.string().min(1),
  order: z.number().int().optional().default(0),
});

export type NoteInsertPayload = z.infer<typeof NoteInsertPayloadSchema>;

export function getNotesByUserId(userId: string): Note[] {
  const stmt = db.prepare('SELECT * FROM notes WHERE userId = ? ORDER BY "order" ASC');
  return stmt.all(userId) as Note[];
}

export function getNoteById(id: string): Note | undefined {
  const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
  return stmt.get(id) as Note | undefined;
}

export function createNote(userId: string, payload: NoteInsertPayload): Note {
  const validated = NoteInsertPayloadSchema.parse(payload);
  const id = crypto.randomUUID();
  
  const stmt = db.prepare('INSERT INTO notes (id, note, "order", userId) VALUES (?, ?, ?, ?)');
  stmt.run(id, validated.note, validated.order, userId);
  
  return { id, note: validated.note, order: validated.order, userId };
}

export function updateNote(id: string, payload: Partial<NoteInsertPayload>): Note | undefined {
  const existing = getNoteById(id);
  if (!existing) return undefined;

  const note = payload.note !== undefined ? payload.note : existing.note;
  const order = payload.order !== undefined ? payload.order : existing.order;

  const stmt = db.prepare('UPDATE notes SET note = ?, "order" = ? WHERE id = ?');
  stmt.run(note, order, id);

  return { id, note, order, userId: existing.userId };
}

export function deleteNote(id: string): void {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  stmt.run(id);
}

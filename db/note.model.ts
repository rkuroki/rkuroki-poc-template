import db from './index';
import { z } from 'zod';
import crypto from 'crypto';
import { generateMnemonic } from '@/lib/mnemonic';

export const NoteSchema = z.object({
  id: z.string().uuid(),
  note: z.string().min(1),
  order: z.number().int(),
  userId: z.string().uuid(),
  mne: z.string().min(6),
  isUuidMne: z.number().int().transform(v => v === 1),
});

export type Note = Omit<z.infer<typeof NoteSchema>, 'isUuidMne'> & { isUuidMne: boolean };

export const NoteInsertPayloadSchema = z.object({
  note: z.string().min(1),
  order: z.number().int().optional().default(0),
  mne: z.string().min(6).optional(),
});

export type NoteInsertPayload = z.infer<typeof NoteInsertPayloadSchema>;

export function getNotesByUserId(userId: string): Note[] {
  const stmt = db.prepare('SELECT * FROM notes WHERE userId = ? ORDER BY "order" ASC');
  const rows = stmt.all(userId) as (Omit<Note, 'isUuidMne'> & { isUuidMne: number })[];
  return rows.map(row => ({ ...row, isUuidMne: Boolean(row.isUuidMne) }));
}

export function getNoteById(id: string): Note | undefined {
  const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
  const row = stmt.get(id) as (Omit<Note, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function createNote(userId: string, payload: NoteInsertPayload): Note {
  const validated = NoteInsertPayloadSchema.parse(payload);
  const id = crypto.randomUUID();
  const mne = validated.mne || generateMnemonic();
  const isUuidMne = !validated.mne ? 1 : 0;

  const stmt = db.prepare('INSERT INTO notes (id, note, "order", userId, mne, isUuidMne) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(id, validated.note, validated.order, userId, mne, isUuidMne);

  return { id, note: validated.note, order: validated.order, userId, mne, isUuidMne: Boolean(isUuidMne) };
}

export function updateNote(id: string, payload: Partial<NoteInsertPayload>): Note | undefined {
  const existing = getNoteById(id);
  if (!existing) return undefined;

  const note = payload.note !== undefined ? payload.note : existing.note;
  const order = payload.order !== undefined ? payload.order : existing.order;

  const stmt = db.prepare('UPDATE notes SET note = ?, "order" = ? WHERE id = ?');
  stmt.run(note, order, id);

  return { id, note, order, userId: existing.userId, mne: existing.mne, isUuidMne: existing.isUuidMne };
}

export function deleteNote(id: string): void {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  stmt.run(id);
}

export function getNotes(): Note[] {
  const stmt = db.prepare('SELECT * FROM notes');
  const rows = stmt.all() as (Omit<Note, 'isUuidMne'> & { isUuidMne: number })[];
  return rows.map(row => ({ ...row, isUuidMne: Boolean(row.isUuidMne) }));
}

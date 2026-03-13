import db from './index';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateMnemonic } from '@/lib/mnemonic';

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  pwd: z.string(),
  name: z.string().nullable().optional(),
  mne: z.string().min(6),
  isUuidMne: z.number().int().transform(v => v === 1),
});

export type User = Omit<z.infer<typeof UserSchema>, 'isUuidMne'> & { isUuidMne: boolean };

export const UserInsertPayloadSchema = z.object({
  username: z.string().min(1),
  pwd: z.string().min(1),
  name: z.string().optional(),
  mne: z.string().min(6).optional(),
});

export type UserInsertPayload = z.infer<typeof UserInsertPayloadSchema>;

export const UserUpdatePayloadSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório.').optional(),
  name: z.string().optional(),
  pwd: z.string().optional(),
});

export type UserUpdatePayload = z.infer<typeof UserUpdatePayloadSchema>;

export function getUserById(id: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id) as (Omit<User, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function getUserByMne(mne: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE mne = ?');
  const row = stmt.get(mne) as (Omit<User, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function getUserByUsername(username: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const row = stmt.get(username) as (Omit<User, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function createUser(payload: UserInsertPayload): User {
  const validated = UserInsertPayloadSchema.parse(payload);
  const id = crypto.randomUUID();
  const hashedPassword = bcrypt.hashSync(validated.pwd, 10);
  const mne = validated.mne || generateMnemonic();
  const isUuidMne = !validated.mne ? 1 : 0;

  const stmt = db.prepare('INSERT INTO users (id, username, pwd, name, mne, isUuidMne) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(id, validated.username, hashedPassword, validated.name || null, mne, isUuidMne);

  return {
    id,
    username: validated.username,
    pwd: hashedPassword,
    name: validated.name || null,
    mne,
    isUuidMne: Boolean(isUuidMne),
  };
}

export function updateUserPassword(id: string, newEncryptedPwd: string): void {
  const stmt = db.prepare('UPDATE users SET pwd = ? WHERE id = ?');
  stmt.run(newEncryptedPwd, id);
}

export function updateUserAdmin(id: string, name: string | null, newPwd?: string): void {
  if (newPwd) {
    const hashedPassword = bcrypt.hashSync(newPwd, 10);
    const stmt = db.prepare('UPDATE users SET name = ?, pwd = ? WHERE id = ?');
    stmt.run(name, hashedPassword, id);
  } else {
    const stmt = db.prepare('UPDATE users SET name = ? WHERE id = ?');
    stmt.run(name, id);
  }
}

export function updateUserFull(
  id: string,
  payload: { username?: string; name?: string | null; pwd?: string }
): void {
  const hashedPwd = payload.pwd ? bcrypt.hashSync(payload.pwd, 10) : undefined;
  const stmt = hashedPwd
    ? db.prepare('UPDATE users SET username = COALESCE(?, username), name = COALESCE(?, name), pwd = ? WHERE id = ?')
    : db.prepare('UPDATE users SET username = COALESCE(?, username), name = COALESCE(?, name) WHERE id = ?');

  if (hashedPwd) {
    stmt.run(payload.username ?? null, payload.name ?? null, hashedPwd, id);
  } else {
    stmt.run(payload.username ?? null, payload.name ?? null, id);
  }
}

export function getUsers(): User[] {
  const stmt = db.prepare('SELECT * FROM users');
  const rows = stmt.all() as (Omit<User, 'isUuidMne'> & { isUuidMne: number })[];
  return rows.map(r => ({ ...r, isUuidMne: Boolean(r.isUuidMne) }));
}

export function deleteUser(id: string): void {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}

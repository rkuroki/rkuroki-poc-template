import db from './index';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  pwd: z.string(),
  name: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserInsertPayloadSchema = z.object({
  username: z.string().min(1),
  pwd: z.string().min(1),
  name: z.string().optional(),
});

export type UserInsertPayload = z.infer<typeof UserInsertPayloadSchema>;

export function getUserById(id: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id) as User | undefined;
  return row ? { ...row } : undefined;
}

export function getUserByUsername(username: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const row = stmt.get(username) as User | undefined;
  return row ? { ...row } : undefined;
}

export function createUser(payload: UserInsertPayload): User {
  const validated = UserInsertPayloadSchema.parse(payload);
  const id = crypto.randomUUID();
  const hashedPassword = bcrypt.hashSync(validated.pwd, 10);
  
  const stmt = db.prepare('INSERT INTO users (id, username, pwd, name) VALUES (?, ?, ?, ?)');
  stmt.run(id, validated.username, hashedPassword, validated.name || null);
  
  return {
    id,
    username: validated.username,
    pwd: hashedPassword,
    name: validated.name || null,
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

export function getUsers(): User[] {
  const stmt = db.prepare('SELECT * FROM users');
  const rows = stmt.all() as User[];
  return rows.map(r => ({ ...r }));
}

export function deleteUser(id: string): void {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}

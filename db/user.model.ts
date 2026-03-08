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
  return stmt.get(id) as User | undefined;
}

export function getUserByUsername(username: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as User | undefined;
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

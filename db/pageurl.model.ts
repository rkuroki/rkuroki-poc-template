import db from './index';
import { z } from 'zod';
import crypto from 'crypto';

export const PageUrlSchema = z.object({
  id: z.string().uuid(),
  url: z.string().min(1),
  path: z.string().min(1),
});

export type PageUrl = z.infer<typeof PageUrlSchema>;

export const PageUrlInsertPayloadSchema = z.object({
  url: z.string().min(1),
  path: z.string().min(1),
});

export type PageUrlInsertPayload = z.infer<typeof PageUrlInsertPayloadSchema>;

export function getPageUrls(): PageUrl[] {
  const stmt = db.prepare('SELECT * FROM page_urls');
  return stmt.all() as PageUrl[];
}

export function getPageUrlById(id: string): PageUrl | undefined {
  const stmt = db.prepare('SELECT * FROM page_urls WHERE id = ?');
  return stmt.get(id) as PageUrl | undefined;
}

export function createPageUrl(payload: PageUrlInsertPayload): PageUrl {
  const validated = PageUrlInsertPayloadSchema.parse(payload);
  const id = crypto.randomUUID();
  
  const stmt = db.prepare('INSERT INTO page_urls (id, url, path) VALUES (?, ?, ?)');
  stmt.run(id, validated.url, validated.path);
  
  return { id, ...validated };
}

export function updatePageUrl(id: string, payload: Partial<PageUrlInsertPayload>): PageUrl | undefined {
  const existing = getPageUrlById(id);
  if (!existing) return undefined;

  const url = payload.url !== undefined ? payload.url : existing.url;
  const path = payload.path !== undefined ? payload.path : existing.path;

  const stmt = db.prepare('UPDATE page_urls SET url = ?, path = ? WHERE id = ?');
  stmt.run(url, path, id);

  return { id, url, path };
}

export function deletePageUrl(id: string): void {
  const stmt = db.prepare('DELETE FROM page_urls WHERE id = ?');
  stmt.run(id);
}

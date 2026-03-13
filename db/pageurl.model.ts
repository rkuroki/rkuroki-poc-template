import db from './index';
import { z } from 'zod';
import crypto from 'crypto';
import { generateMnemonic } from '@/lib/mnemonic';

export const PageUrlSchema = z.object({
  id: z.string().uuid(),
  url: z.string().min(1),
  path: z.string().min(1),
  mne: z.string().min(6),
  isUuidMne: z.number().int().transform(v => v === 1),
});

export type PageUrl = Omit<z.infer<typeof PageUrlSchema>, 'isUuidMne'> & { isUuidMne: boolean };

export const PageUrlInsertPayloadSchema = z.object({
  url: z.string().min(1),
  path: z.string().min(1),
  mne: z.string().min(6).optional(),
});

export type PageUrlInsertPayload = z.infer<typeof PageUrlInsertPayloadSchema>;

export const PageUrlUpdatePayloadSchema = z.object({
  url: z.string().min(1, 'A URL é obrigatória.').url('Deve ser uma URL válida.'),
  path: z.string().min(1, 'O path é obrigatório.'),
});

export type PageUrlUpdatePayload = z.infer<typeof PageUrlUpdatePayloadSchema>;

export function getPageUrls(): PageUrl[] {
  const stmt = db.prepare('SELECT * FROM page_urls');
  const rows = stmt.all() as (Omit<PageUrl, 'isUuidMne'> & { isUuidMne: number })[];
  return rows.map(r => ({ ...r, isUuidMne: Boolean(r.isUuidMne) }));
}

export function getPageUrlById(id: string): PageUrl | undefined {
  const stmt = db.prepare('SELECT * FROM page_urls WHERE id = ?');
  const row = stmt.get(id) as (Omit<PageUrl, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function getPageUrlByMne(mne: string): PageUrl | undefined {
  const stmt = db.prepare('SELECT * FROM page_urls WHERE mne = ?');
  const row = stmt.get(mne) as (Omit<PageUrl, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function createPageUrl(payload: PageUrlInsertPayload): PageUrl {
  const validated = PageUrlInsertPayloadSchema.parse(payload);
  const id = crypto.randomUUID();
  const mne = validated.mne || generateMnemonic();
  const isUuidMne = !validated.mne ? 1 : 0;

  const stmt = db.prepare('INSERT INTO page_urls (id, url, path, mne, isUuidMne) VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, validated.url, validated.path, mne, isUuidMne);

  return { id, url: validated.url, path: validated.path, mne, isUuidMne: Boolean(isUuidMne) };
}

export function updatePageUrl(id: string, payload: Partial<PageUrlInsertPayload>): PageUrl | undefined {
  const existing = getPageUrlById(id);
  if (!existing) return undefined;

  const url = payload.url !== undefined ? payload.url : existing.url;
  const path = payload.path !== undefined ? payload.path : existing.path;

  const stmt = db.prepare('UPDATE page_urls SET url = ?, path = ? WHERE id = ?');
  stmt.run(url, path, id);

  return { id, url, path, mne: existing.mne, isUuidMne: existing.isUuidMne };
}

export function deletePageUrl(id: string): void {
  const stmt = db.prepare('DELETE FROM page_urls WHERE id = ?');
  stmt.run(id);
}

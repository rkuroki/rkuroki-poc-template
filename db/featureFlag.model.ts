import db from './index';
import { z } from 'zod';
import { generateMnemonic } from '@/lib/mnemonic';

export const FeatureFlagUpdatePayloadSchema = z.object({
  name: z.string().min(1, 'O nome da flag é obrigatório.'),
  value: z.string().min(1, 'O valor da flag é obrigatório.'),
});

export type FeatureFlagUpdatePayload = z.infer<typeof FeatureFlagUpdatePayloadSchema>;

export type FeatureFlag = {
  id: number;
  name: string;
  value: string;
  created_at: string;
  mne: string;
  isUuidMne: boolean;
};

export function getAllFeatureFlags(): FeatureFlag[] {
  const rows = db.prepare('SELECT * FROM feature_flags ORDER BY name ASC').all() as (Omit<FeatureFlag, 'isUuidMne'> & { isUuidMne: number })[];
  return rows.map(r => ({ ...r, isUuidMne: Boolean(r.isUuidMne) }));
}

export function getFeatureFlagById(id: number): FeatureFlag | undefined {
  const row = db.prepare('SELECT * FROM feature_flags WHERE id = ?').get(id) as (Omit<FeatureFlag, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function getFeatureFlagByMne(mne: string): FeatureFlag | undefined {
  const row = db.prepare('SELECT * FROM feature_flags WHERE mne = ?').get(mne) as (Omit<FeatureFlag, 'isUuidMne'> & { isUuidMne: number }) | undefined;
  return row ? { ...row, isUuidMne: Boolean(row.isUuidMne) } : undefined;
}

export function createFeatureFlag(name: string, value: string, mne?: string) {
  const resolvedMne = mne || generateMnemonic();
  const isUuidMne = !mne ? 1 : 0;
  const stmt = db.prepare('INSERT INTO feature_flags (name, value, mne, isUuidMne) VALUES (?, ?, ?, ?)');
  return stmt.run(name, value, resolvedMne, isUuidMne);
}

export function updateFeatureFlag(id: number, name: string, value: string) {
  const stmt = db.prepare('UPDATE feature_flags SET name = ?, value = ? WHERE id = ?');
  return stmt.run(name, value, id);
}

export function deleteFeatureFlag(id: number) {
  return db.prepare('DELETE FROM feature_flags WHERE id = ?').run(id);
}

import db from './index';

export type FeatureFlag = {
  id: number;
  name: string;
  value: string;
  created_at: string;
};

export function getAllFeatureFlags(): FeatureFlag[] {
  return db.prepare('SELECT * FROM feature_flags ORDER BY name ASC').all() as FeatureFlag[];
}

export function createFeatureFlag(name: string, value: string) {
  const stmt = db.prepare('INSERT INTO feature_flags (name, value) VALUES (?, ?)');
  return stmt.run(name, value);
}

export function updateFeatureFlag(id: number, name: string, value: string) {
  const stmt = db.prepare('UPDATE feature_flags SET name = ?, value = ? WHERE id = ?');
  return stmt.run(name, value, id);
}

export function deleteFeatureFlag(id: number) {
  return db.prepare('DELETE FROM feature_flags WHERE id = ?').run(id);
}

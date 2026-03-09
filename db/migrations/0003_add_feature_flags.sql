-- db/migrations/0003_add_feature_flags.sql

CREATE TABLE IF NOT EXISTS feature_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

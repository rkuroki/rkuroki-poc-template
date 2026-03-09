-- db/migrations/0002_add_telemetry_table.sql

CREATE TABLE IF NOT EXISTS client_errors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  pathname TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

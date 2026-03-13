-- db/migrations/0004_add_mnemonic_fields.sql
-- Add mne (mnemonic, unique, min 6 chars) and isUuidMne (boolean) to all entity tables

ALTER TABLE users ADD COLUMN mne TEXT;
ALTER TABLE users ADD COLUMN isUuidMne INTEGER NOT NULL DEFAULT 1;
UPDATE users SET mne = lower(hex(randomblob(4))) || lower(hex(randomblob(4))) WHERE mne IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mne ON users(mne);

ALTER TABLE notes ADD COLUMN mne TEXT;
ALTER TABLE notes ADD COLUMN isUuidMne INTEGER NOT NULL DEFAULT 1;
UPDATE notes SET mne = lower(hex(randomblob(4))) || lower(hex(randomblob(4))) WHERE mne IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_mne ON notes(mne);

ALTER TABLE page_urls ADD COLUMN mne TEXT;
ALTER TABLE page_urls ADD COLUMN isUuidMne INTEGER NOT NULL DEFAULT 1;
UPDATE page_urls SET mne = lower(hex(randomblob(4))) || lower(hex(randomblob(4))) WHERE mne IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_urls_mne ON page_urls(mne);

ALTER TABLE feature_flags ADD COLUMN mne TEXT;
ALTER TABLE feature_flags ADD COLUMN isUuidMne INTEGER NOT NULL DEFAULT 1;
UPDATE feature_flags SET mne = lower(hex(randomblob(4))) || lower(hex(randomblob(4))) WHERE mne IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_feature_flags_mne ON feature_flags(mne);

-- db/seeds/001_admin_seed.sql

-- Admin User
INSERT OR IGNORE INTO users (id, username, pwd, name) 
VALUES ('11111111-1111-1111-1111-111111111111', 'admin', '$2b$10$oBVBtwve.yfzzfIR4MPgL.Z.Z/w.Dl9BrvnknUiqHw61WlZQ0LCFS', 'System Administrator');

-- Admin Notes
INSERT OR IGNORE INTO notes (id, note, "order", userId) VALUES ('33333333-3333-3333-3333-333333333330', 'Sample Note 1', 1, '11111111-1111-1111-1111-111111111111');

-- PageUrls
INSERT OR IGNORE INTO page_urls (id, url, path) VALUES ('44444444-4444-4444-4444-444444444444', 'https://github.com', '/github');

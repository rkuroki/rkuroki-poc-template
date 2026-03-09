# PLAN-20260309-08: Admin Management Login Route

Currently, the root `app/page.tsx` login interface strictly enforces a mobile phone regex mask (`+55 11 9 8888 7777`), which prevents typing alphanumeric usernames like `admin`. Since the `admin` user is seeded into the database to access the `/home` CRUD dashboards, there must be a way to sign in natively.

## Directory
`/plans/PLAN-20260309-08-admin_mgmt_login`

## Objectives
1. Build a dedicated login page at `/mgmt`.
2. This page should visually replicate the main login form but accept unrestricted text input for the `username` field.
3. Build a slightly adapted server action (`loginMgmtAction`) that bypasses the 14-character `+55` validation and authenticates directly against the database `pwd` hash without auto-registering new users.

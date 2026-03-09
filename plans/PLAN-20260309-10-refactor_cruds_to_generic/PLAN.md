# PLAN-20260309-10: Refactor CRUDs to Generic

The goal is to apply the highly reusable `CrudLayout`, `CrudTable`, and `CrudForm` components created in PLAN-09 to all the remaining CRUD entities: `Users`, `PageUrls`, and `Notes`.

## Directory
`/plans/PLAN-20260309-10-refactor_cruds_to_generic`

## Objectives
1. **Refactor `/home/users`**: Replace the custom table and form with `<CrudLayout>`. Ensure `deleteUserAction` and `upsertUserAction` are signature-compatible.
2. **Refactor `/home/pageurls`**: Replace the custom table and form with `<CrudLayout>`. Ensure `deletePageUrlAction` and `upsertPageUrlAction` are signature-compatible.
3. **Refactor `/home/notes`**: Replace the custom table and form with `<CrudLayout>`. Ensure `deleteNoteAction` and `upsertNoteAction` are signature-compatible.
4. Verify strict typings across all usages.

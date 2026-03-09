# TASK002: Cleanup Legacy Database Files

1. **Delete Dead Dependencies:**
   - Delete `lib/db.ts`, which attempts to connect to an obsolete `sqlite.db` file instead of our newly configured `db/index.ts` engine running off `.data/app.db`.
   - Audit the workspace to ensure the environment stays entirely strictly typed and compilation stays completely clean out of the box.

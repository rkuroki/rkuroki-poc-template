# TASK002: Implement FeatureFlag Entity

1. **Database layer**:
   - Create `db/migrations/0003_add_feature_flags.sql` with a `feature_flags` table (id, name, value).
   - Create `db/featureFlag.model.ts` mapping the DB actions.
2. **Server Actions**:
   - Create `app/actions/featureFlags.ts` exporting `createFlag`, `updateFlag`, `deleteFlag`.
3. **Page Route**:
   - Build `app/home/feature-flags/page.tsx`.
   - Fetch flags and inject them into `<CrudLayout>` passing the respective generic configurations.

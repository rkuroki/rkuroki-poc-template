# PLAN-20260309-09: Reusable Admin CRUD Components

The system needs a standardized way to build Admin CRUD interfaces for any entity (e.g., `Users`, `PageUrls`, `FeatureFlags`). To maximize productivity, the generic CRUD must allow creating and editing an entity on the very same page as the data table.

## Directory
`/plans/PLAN-20260309-09-reusable_admin_crud`

## Objectives
1. **Generic CRUD Page Layout**: Design a standard layout (e.g., split-screen or stacked) where the Data Table occupies one section, and a dynamic Create/Edit Form occupies the other. Clicking "Edit" on a row populates the form; submitting clears it back to "Create" mode.
2. **Reusable `CrudTable` Component**: A generic table displaying records, accepting column definitions. It should include an "Edit" and "Delete" button.
3. **Reusable `CrudForm` Component**: A generic form component generating inputs based on configuration. It will automatically switch between `createAction` and `updateAction` depending on whether an `id` is present.
4. **First Implementation**: Implement this pattern for the `FeatureFlag` entity mentioned in the `TODO.md` to prove the concept.

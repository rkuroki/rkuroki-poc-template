# TASK001: Build Generic Components

1. **`components/crud/CrudTable.tsx`**:
   - Construct a table that iterates over dynamic generic columns.
   - Include action buttons for "Edit" (calls a prop `onEdit(item)`) and "Delete" (invokes a Server Action).
2. **`components/crud/CrudForm.tsx`**:
   - Construct a form looping through field configurations (name, label, type).
   - Track an `editingItem` state. If `null`, it submits via `createAction`. If set, it submits via `updateAction`.
   - Utilize `<SubmitButton>` for protection.
3. **`components/crud/CrudLayout.tsx`**:
   - Create a unified container that holds the Table and the Form, managing the shared `editingItem` state between them (lifting state up).

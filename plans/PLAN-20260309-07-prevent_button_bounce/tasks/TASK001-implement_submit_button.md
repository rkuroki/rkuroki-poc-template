# TASK001: Implement Reusable SubmitButton

1. **Create `components/SubmitButton.tsx`:**
   - Define a client component (`'use client';`) that wraps a standard HTML `<button>`.
   - Use the `useFormStatus` hook from `react-dom` to extract the `pending` boolean.
   - Accept props like `children` (for normal text), `pendingText` (for disabled text), and standard button attributes.
   - Combine existing TailwindCSS classes to visualize the disabled state (e.g., `disabled:opacity-50 disabled:cursor-not-allowed`).

2. **Refactor Existing Forms:**
   - **Login Form (`app/page.tsx`)**: Replace the submit button. Ensure it displays "Aguarde..." while `pending`.
   - **Note Add Form (`components/UserDashboard.tsx`)**: Replace the submit button. Ensure it displays "Adicionando..." while `pending`.

# PLAN-20260309-07: Prevent Button Bounce

Currently, when a user clicks a form submit button (e.g., adding a Note or Logging in), they can click it multiple times rapidly before the server responds. This leads to duplicate submissions (button bounce).

This plan will address the issue by creating a reusable, state-aware `<SubmitButton>` component that disables itself while the form is pending.

## Directory
`/plans/PLAN-20260309-07-prevent_button_bounce`

## Objectives
1. Build a generic client-side `<SubmitButton>` using React 19's `useFormStatus` hook to track pending form states.
2. Replace the hardcoded `<button type="submit">` tags across the application with this new component, particularly in the Note Add form and the Login form.

### Expected Behavior
- When the user clicks "Adicionar" or "Prosseguir", the button text should change (e.g., "Adicionando..." or "Aguarde...") and it should become grayed out/disabled to prevent further clicks until the server action finishes.

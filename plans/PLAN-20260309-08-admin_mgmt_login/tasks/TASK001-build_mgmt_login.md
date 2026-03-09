# TASK001: Build /mgmt Login Route

1. **Create `app/mgmt/page.tsx`:**
   - Copy the structural design of `app/page.tsx`.
   - Remove the `+55` mask logic, `displayValue`, and `handlePhoneChange` complexities.
   - Bind a simple `<input type="text" name="username" />` field to accept 'admin' or any other username directly.
   - Utilize the new `<SubmitButton>` component to ensure zero-bounce processing.

2. **Create `app/actions/authMgmt.ts`:**
   - Clone `loginOrRegister` but remove the `+55` and length validation checks.
   - Change the fallback mechanism from "Auto-Register" to returning an `{ error: 'Usuário não encontrado.' }` response to strictly lock out non-seeded users from this interface.
   - Map a successful login directly to `/home`.

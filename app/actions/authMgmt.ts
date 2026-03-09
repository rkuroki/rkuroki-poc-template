'use server';

import { getUserByUsername } from '@/db/user.model';
import { setSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

type FormState = { error: string; success?: boolean };

export async function loginMgmtAction(prevState: FormState, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username) {
    return { error: 'O usuário é obrigatório.' };
  }
  if (!password) {
    return { error: 'A senha é obrigatória.' };
  }

  const user = getUserByUsername(username);

  // For /mgmt, we NEVER auto-register. We just reject unknown users.
  if (!user) {
    return { error: 'Usuário não encontrado ou credenciais inválidas.' };
  }

  // Validate password
  const isMatch = bcrypt.compareSync(password, user.pwd);
  if (!isMatch) {
    return { error: 'Usuário não encontrado ou credenciais inválidas.' };
  }

  // Set session cookie
  await setSession(user.id);
  
  // Redirect to home
  redirect('/home');
}

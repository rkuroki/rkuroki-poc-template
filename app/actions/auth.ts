'use server';

import { getUserByUsername, createUser } from '@/db/user.model';
import { setSession, clearSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

type FormState = { error: string; success?: boolean };

export async function loginOrRegister(prevState: FormState, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || username.length !== 14 || !username.startsWith('+55')) {
    return { error: 'O número de celular deve ter exatos 14 caracteres e começar com +55.' };
  }

  let user = getUserByUsername(username);

  if (!user) {
    // Primeito acesso: persistir com senha padrão
    user = createUser({
      username,
      pwd: '123456',
    });
  } else {
    // Acesso subsequente: validar senha
    if (!password) {
      return { error: 'Senha é obrigatória para acessar.' };
    }
    const isMatch = bcrypt.compareSync(password, user.pwd);
    if (!isMatch) {
      return { error: 'Senha incorreta.' };
    }
  }

  // Set session cookie
  await setSession(user.id);
  
  // Redirect to home
  redirect('/home');
}

export async function logoutAction() {
  await clearSession();
  redirect('/');
}

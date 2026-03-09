'use server';

import { createUser, updateUserAdmin, deleteUser, getUserById } from '@/db/user.model';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const userId = await getSession();
  if (!userId) throw new Error('Not authenticated');
  const user = getUserById(userId);
  if (!user || user.username !== 'admin') throw new Error('Not authorized');
  return user;
}

export async function upsertUserAction(prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get('id') as string | null;
    const username = formData.get('username') as string;
    const pwd = formData.get('pwd') as string;
    const name = formData.get('name') as string;

    if (!id && (!username || !pwd)) {
      return { error: 'Username e Password são obrigatórios para novos usuários.', success: false };
    }

    if (id) {
      if (id === 'admin' && username !== 'admin') {
        return { error: 'O usuário admin não pode ter seu username alterado.', success: false };
      }
      updateUserAdmin(id, name || null, pwd || undefined);
    } else {
      createUser({ username, pwd, name: name || undefined });
    }
    
    revalidatePath('/home/users');
    return { error: '', success: true };
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('UNIQUE constraint failed')) {
      return { error: 'Username já cadastrado.', success: false };
    }
    return { error: err.message || 'Ocorreu um erro.', success: false };
  }
}

export async function deleteUserAction(id: string | number) {
  await requireAdmin();
  if (typeof id === 'string' && id === 'admin') {
    throw new Error('Cannot delete admin user');
  }
  deleteUser(String(id));
  revalidatePath('/home/users');
}

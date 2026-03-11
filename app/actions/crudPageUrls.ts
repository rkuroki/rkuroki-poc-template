'use server';

import { createPageUrl, updatePageUrl, deletePageUrl } from '@/db/pageurl.model';
import { getSession } from '@/lib/session';
import { getUserById } from '@/db/user.model';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const userId = await getSession();
  if (!userId) throw new Error('Not authenticated');
  const user = getUserById(userId);
  if (!user || user.username !== 'admin') throw new Error('Not authorized');
  return user;
}

export async function upsertPageUrlAction(prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get('id') as string | null;
    const url = formData.get('url') as string;
    const path = formData.get('path') as string;
    const mne = (formData.get('mne') as string) || undefined;

    if (!url || !path) {
      return { error: 'URL e Path são obrigatórios.', success: false };
    }

    if (id) {
      updatePageUrl(id, { url, path });
    } else {
      createPageUrl({ url, path, mne });
    }
    
    revalidatePath('/home/pageurls');
    return { error: '', success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || 'Ocorreu um erro no servidor.', success: false };
  }
}

export async function deletePageUrlAction(id: string | number) {
  await requireAdmin();
  deletePageUrl(String(id));
  revalidatePath('/home/pageurls');
}

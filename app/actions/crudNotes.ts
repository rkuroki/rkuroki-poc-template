'use server';

import { createNote, updateNote, deleteNote } from '@/db/note.model';
import { getSession } from '@/lib/session';
import { getUserById } from '@/db/user.model';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const userId = await getSession();
  if (!userId) throw new Error('Not authenticated');
  const user = getUserById(userId);
  if (!user || user.username !== 'admin') throw new Error('Not authorized');
  return { user, userId };
}

export async function upsertNoteAction(prevState: unknown, formData: FormData) {
  try {
    const { userId } = await requireAdmin();
    const id = formData.get('id') as string | null;
    const note = formData.get('note') as string;
    const orderStr = formData.get('order') as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    const mne = (formData.get('mne') as string) || undefined;

    if (!note) {
      return { error: 'O texto da nota é obrigatório.', success: false };
    }

    if (id) {
      updateNote(id, { note, order });
    } else {
      createNote(userId, { note, order, mne });
    }
    
    revalidatePath('/home/notes');
    return { error: '', success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || 'Ocorreu um erro no servidor.', success: false };
  }
}

export async function deleteNoteAction(id: string | number) {
  await requireAdmin();
  deleteNote(String(id));
  revalidatePath('/home/notes');
}

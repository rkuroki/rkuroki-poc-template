'use server';

import { createNote } from '@/db/note.model';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import db from '@/db/index';

type NoteFormState = { error: string; success: boolean };

export async function addNoteAction(prevState: NoteFormState, formData: FormData) {
  const userId = await getSession();
  if (!userId) {
    return { error: 'Not authenticated', success: false };
  }

  const noteText = formData.get('note') as string;
  if (!noteText || noteText.trim() === '') {
    return { error: 'Note cannot be empty', success: false };
  }

  // Get max order safely to avoid rapidly sequenced collisions
  const stmt = db.prepare('SELECT MAX("order") as maxOrder FROM notes WHERE userId = ?');
  const result = stmt.get(userId) as { maxOrder: number | null };
  const nextOrder = (result.maxOrder ?? 0) + 1;

  createNote(userId, { note: noteText, order: nextOrder });

  revalidatePath('/home');
  return { error: '', success: true };
}

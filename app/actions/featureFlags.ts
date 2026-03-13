'use server';

import { createFeatureFlag, updateFeatureFlag, deleteFeatureFlag } from '@/db/featureFlag.model';
import { getSession } from '@/lib/session';
import { getUserById } from '@/db/user.model';
import { revalidatePath } from 'next/cache';

// Reusable Admin Guard
async function requireAdmin() {
  const userId = await getSession();
  if (!userId) throw new Error('Not authenticated');
  const user = getUserById(userId);
  if (!user || user.username !== 'admin') throw new Error('Not authorized');
  return user;
}

export async function upsertFeatureFlagAction(prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string;
    const value = formData.get('value') as string;
    const mne = (formData.get('mne') as string) || undefined;

    if (!name || !value) {
      return { error: 'O nome e o valor são obrigatórios.', success: false };
    }

    if (id) {
      updateFeatureFlag(parseInt(id, 10), name, value);
    } else {
      createFeatureFlag(name, value, mne);
    }
    
    revalidatePath('/home/feature-flags');
    return { error: '', success: true };
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('UNIQUE constraint failed')) {
      return { error: 'Já existe uma feature flag com esse nome.', success: false };
    }
    return { error: err.message || 'Ocorreu um erro no servidor.', success: false };
  }
}

export async function deleteFeatureFlagAction(id: string | number) {
  await requireAdmin();
  deleteFeatureFlag(typeof id === 'string' ? parseInt(id, 10) : id);
  revalidatePath('/home/feature-flags');
}

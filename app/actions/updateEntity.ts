'use server';

import { getSession } from '@/lib/session';
import { getUserById } from '@/db/user.model';
import { revalidatePath } from 'next/cache';

// Note
import { getNoteByMne, updateNote, NoteUpdatePayloadSchema } from '@/db/note.model';
// PageUrl
import { getPageUrlByMne, updatePageUrl, PageUrlUpdatePayloadSchema } from '@/db/pageurl.model';
// User
import { getUserByMne, updateUserFull, UserUpdatePayloadSchema } from '@/db/user.model';
// FeatureFlag
import { getFeatureFlagByMne, updateFeatureFlag, FeatureFlagUpdatePayloadSchema } from '@/db/featureFlag.model';

export type EditActionResult = {
  success: boolean;
  fieldErrors?: Record<string, string[]>;
  error?: string;
};

export async function updateEntityAction(
  entityName: string,
  mnemonic: string,
  prevState: unknown,
  formData: FormData
): Promise<EditActionResult> {
  const sessionUserId = await getSession();
  if (!sessionUserId) return { success: false, error: 'Não autenticado.' };

  const currentUser = getUserById(sessionUserId);
  if (!currentUser) return { success: false, error: 'Usuário não encontrado.' };

  const isAdmin = currentUser.username === 'admin';

  try {
    if (entityName === 'notes') {
      const record = getNoteByMne(mnemonic);
      if (!record) return { success: false, error: 'Registro não encontrado.' };

      // Ownership check: admin can edit any note, user only their own
      if (!isAdmin && record.userId !== sessionUserId) {
        return { success: false, error: 'forbidden' };
      }

      const rawPayload: Record<string, unknown> = {
        note: formData.get('note'),
        order: formData.get('order'),
      };
      // Admin-only: userId reassignment
      const rawUserId = formData.get('userId');
      if (isAdmin && rawUserId) rawPayload.userId = rawUserId;

      const parsed = NoteUpdatePayloadSchema.safeParse(rawPayload);
      if (!parsed.success) {
        return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
      }

      updateNote(record.id, parsed.data);
      revalidatePath(`/crud/notes/${mnemonic}`);
      return { success: true };
    }

    if (entityName === 'pageurls') {
      if (!isAdmin) return { success: false, error: 'forbidden' };

      const record = getPageUrlByMne(mnemonic);
      if (!record) return { success: false, error: 'Registro não encontrado.' };

      const parsed = PageUrlUpdatePayloadSchema.safeParse({
        url: formData.get('url'),
        path: formData.get('path'),
      });
      if (!parsed.success) {
        return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
      }

      updatePageUrl(record.id, parsed.data);
      revalidatePath(`/crud/pageurls/${mnemonic}`);
      return { success: true };
    }

    if (entityName === 'users') {
      if (!isAdmin) return { success: false, error: 'forbidden' };

      const record = getUserByMne(mnemonic);
      if (!record) return { success: false, error: 'Registro não encontrado.' };

      const parsed = UserUpdatePayloadSchema.safeParse({
        username: formData.get('username') || undefined,
        name: formData.get('name') || undefined,
        pwd: formData.get('pwd') || undefined,
      });
      if (!parsed.success) {
        return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
      }

      // Guard: the special 'admin' account cannot be renamed
      if (record.username === 'admin' && parsed.data.username && parsed.data.username !== 'admin') {
        return {
          success: false,
          fieldErrors: { username: ['O usuário admin não pode ser renomeado.'] },
        };
      }

      updateUserFull(record.id, {
        username: parsed.data.username,
        name: parsed.data.name ?? null,
        pwd: parsed.data.pwd,
      });
      revalidatePath(`/crud/users/${mnemonic}`);
      return { success: true };
    }

    if (entityName === 'featureflags') {
      if (!isAdmin) return { success: false, error: 'forbidden' };

      const record = getFeatureFlagByMne(mnemonic);
      if (!record) return { success: false, error: 'Registro não encontrado.' };

      const parsed = FeatureFlagUpdatePayloadSchema.safeParse({
        name: formData.get('name'),
        value: formData.get('value'),
      });
      if (!parsed.success) {
        return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
      }

      updateFeatureFlag(record.id, parsed.data.name, parsed.data.value);
      revalidatePath(`/crud/featureflags/${mnemonic}`);
      return { success: true };
    }

    return { success: false, error: `Entidade desconhecida: ${entityName}` };
  } catch (err: unknown) {
    const e = err as Error;
    return { success: false, error: e.message || 'Erro no servidor.' };
  }
}

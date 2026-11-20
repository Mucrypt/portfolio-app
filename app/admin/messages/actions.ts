'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import { createClient } from '@/lib/supabase/server'

const input = z.object({
  id: z.uuid(),
  status: z.enum(['new', 'read', 'replied', 'archived']),
})

export async function setMessageStatus(id: string, status: string): Promise<{ ok: boolean; message?: string }> {
  await requireAdmin()
  const parsed = input.safeParse({ id, status })
  if (!parsed.success) return { ok: false, message: 'Invalid request.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_inquiries')
    .update({
      status: parsed.data.status,
      ...(parsed.data.status === 'replied' ? { responded_at: new Date().toISOString() } : {}),
    })
    .eq('id', parsed.data.id)
  if (error) {
    console.error('[admin messages] status', error.code, error.message)
    return { ok: false, message: 'Could not save. Try again.' }
  }
  revalidatePath('/admin/messages')
  return { ok: true }
}

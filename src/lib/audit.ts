import { supabase, hasSupabaseEnv } from './supabase'
import { useAuthStore } from '../store/authStore'

export async function logAudit(action: string, resource?: string, delta?: unknown) {
  try {
    if (!hasSupabaseEnv || !useAuthStore.getState().session) return
    const uid = useAuthStore.getState().session!.user.id
    const roleId = useAuthStore.getState().currentRoleId
    await supabase!.from('audit_logs').insert({
      actor_user_id: uid,
      actor_role: roleId ? useAuthStore.getState().roles.find(r => r.id === roleId)?.role : null,
      action,
      resource,
      delta,
    })
  } catch {
    // ignore audit error to avoid disrupting UX
  }
}

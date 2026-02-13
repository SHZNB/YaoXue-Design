import React from 'react'
import { useAuthStore } from '../store/authStore'
import { logAudit } from '../lib/audit'

export const RoleSwitcher: React.FC = () => {
  const { roles, currentRoleId, setCurrentRoleId } = useAuthStore()

  if (!roles.length) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">当前角色</span>
      <select
        className="text-sm border rounded px-2 py-1"
        value={currentRoleId ?? ''}
        onChange={async (e) => {
          const id = e.target.value || null
          setCurrentRoleId(id)
          const role = useAuthStore.getState().roles.find(r => r.id === id)
          await logAudit('switch_role', 'user_roles', { to: role?.role, user_role_id: id })
        }}
      >
        <option value="">未选择</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id} disabled={r.status !== 'active'}>
            {r.role}{r.status !== 'active' ? '（已停用）' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

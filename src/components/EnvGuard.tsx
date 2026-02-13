import React from 'react'
import { hasSupabaseEnv } from '../lib/supabase'

export const EnvGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  if (!hasSupabaseEnv) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">服务配置缺失</h2>
          <p className="text-slate-600 mb-4">
            当前站点未配置必要的后端环境变量，暂无法使用登录与数据功能。
          </p>
          <div className="text-sm text-slate-500">
            请配置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY 后重新部署。
          </div>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

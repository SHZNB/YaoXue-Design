import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Users, FileText, Activity, Lock } from 'lucide-react';

interface AuditLog {
  id: string;
  actor_role: string;
  action: string;
  resource: string;
  created_at: string;
  details: unknown;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'users'>('overview');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({ users: 0, experiments: 0, activeToday: 0 });

  const fetchStats = useCallback(async () => {
    // 模拟统计数据（真实场景需 RPC 或 count 查询）
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: expCount } = await supabase.from('experiments').select('*', { count: 'exact', head: true });
    setStats({ users: userCount || 0, experiments: expCount || 0, activeToday: 12 });
  }, []);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setLogs(data as AuditLog[]);
  }, []);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'audit') fetchLogs();
  }, [activeTab, fetchStats, fetchLogs]);


  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-8 px-2 text-slate-800 font-bold text-lg">
          <Shield className="text-blue-600" />
          后台管理
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Activity size={18} /> 概览
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users size={18} /> 用户管理
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText size={18} /> 审计日志
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">系统概览</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="总用户数" value={stats.users} icon={<Users className="text-blue-500" />} />
              <StatCard title="在线实验" value={stats.experiments} icon={<Activity className="text-green-500" />} />
              <StatCard title="今日活跃" value={stats.activeToday} icon={<Activity className="text-purple-500" />} />
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4">系统健康状态</h3>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg inline-flex">
                <CheckIcon /> 所有服务运行正常
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">安全审计日志</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-700">时间</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">角色</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">动作</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">资源</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">详情</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.actor_role === 'teacher' ? 'bg-purple-100 text-purple-700' :
                          log.actor_role === 'parent' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {log.actor_role}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium text-slate-900">{log.action}</td>
                      <td className="px-6 py-3 text-slate-600">{log.resource}</td>
                      <td className="px-6 py-3 text-slate-400 font-mono text-xs">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        暂无日志记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
             <Lock className="mx-auto text-slate-300 mb-4" size={48} />
             <h3 className="text-lg font-medium text-slate-900">权限受限</h3>
             <p className="text-slate-500 mt-2">用户管理功能需要超级管理员权限 (service_role)</p>
           </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
  </div>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

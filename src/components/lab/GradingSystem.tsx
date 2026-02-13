import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle, Circle } from 'lucide-react';
import { LogPayload } from '../../utils/logger';

export interface LogEntry {
  id: string;
  experiment_id: string;
  user_id: string;
  action: string;
  payload: LogPayload;
  timestamp: string; // or created_at depending on DB schema, code says timestamp in order
}

interface Step {
  id: string;
  description: string;
  points: number;
  condition: (logs: LogEntry[]) => boolean;
}

interface GradingSystemProps {
  experimentId: string;
  steps: Step[];
  onScoreUpdate?: (score: number) => void;
}

export const GradingSystem: React.FC<GradingSystemProps> = ({ experimentId, steps, onScoreUpdate }) => {
  const { profile } = useAuthStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // 监听实验日志
  useEffect(() => {
    if (!profile) return;

    // 加载历史日志
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('experiment_logs')
        .select('*')
        .eq('experiment_id', experimentId)
        .eq('user_id', profile.id)
        .order('timestamp', { ascending: true });
      if (data) setLogs(data as LogEntry[]);
    };

    fetchLogs();

    // 订阅新日志
    const channel = supabase
      .channel(`grading-${profile.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'experiment_logs',
        filter: `user_id=eq.${profile.id}`
      }, (payload) => {
        if (payload.new.experiment_id === experimentId) {
          setLogs(prev => [...prev, payload.new as LogEntry]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [experimentId, profile]);


  // 实时评分逻辑
  useEffect(() => {
    const newCompletedSteps: string[] = [];
    let newScore = 0;

    steps.forEach(step => {
      if (step.condition(logs)) {
        newCompletedSteps.push(step.id);
        newScore += step.points;
      }
    });

    setCompletedSteps(newCompletedSteps);
    setScore(newScore);
    if (onScoreUpdate) onScoreUpdate(newScore);

    // 更新数据库中的总分 (防抖处理建议在生产环境中添加)
    if (profile) {
      supabase
        .from('user_progress')
        .upsert({ 
          user_id: profile.id, 
          experiment_id: experimentId, 
          score: newScore,
          status: newScore >= 100 ? 'completed' : 'in_progress',
          last_accessed_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.error('Failed to update score:', error);
        });
    }

  }, [logs, steps, experimentId, onScoreUpdate, profile]); // 依赖日志更新重新计算

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">实验评分</h3>
        <div className="text-2xl font-bold text-blue-600">{score} <span className="text-sm text-slate-500">/ 100</span></div>
      </div>
      
      <div className="space-y-3">
        {steps.map(step => {
          const isCompleted = completedSteps.includes(step.id);
          return (
            <div key={step.id} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${isCompleted ? 'bg-green-50' : 'bg-slate-50'}`}>
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isCompleted ? 'text-green-800' : 'text-slate-600'}`}>
                  {step.description}
                </p>
                <span className="text-xs text-slate-400">+{step.points} 分</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


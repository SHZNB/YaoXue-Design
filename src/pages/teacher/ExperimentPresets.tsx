import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Save, Plus, Trash2, Settings } from 'lucide-react';

interface Experiment {
  id: string;
  title: string;
}

interface Preset {
  id: string;
  name: string;
  config: Record<string, unknown>;
  experiment_id: string;
}

export const ExperimentPresets: React.FC = () => {
  const { profile } = useAuthStore();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<string>('');
  const [newPresetName, setNewPresetName] = useState('');
  const [configJson, setConfigJson] = useState('{\n  "gravity": 9.8,\n  "lightIntensity": 1.0\n}');

  useEffect(() => {
    const fetchExperiments = async () => {
      const { data } = await supabase.from('experiments').select('id, title');
      if (data) setExperiments(data);
    };

    const fetchPresets = async () => {
      if (!profile?.id) return;
      const { data } = await supabase
        .from('experiment_presets')
        .select('*')
        .eq('teacher_id', profile.id);
      if (data) setPresets(data);
      setLoading(false);
    };

    fetchExperiments();
    if (profile?.id) fetchPresets();
  }, [profile?.id]);

  const handleSave = async () => {
    if (!selectedExperiment || !newPresetName) return;
    try {
      const config = JSON.parse(configJson);
      const { data, error } = await supabase
        .from('experiment_presets')
        .insert({
          experiment_id: selectedExperiment,
          teacher_id: profile?.id,
          name: newPresetName,
          config
        })
        .select()
        .single();

      if (error) throw error;
      setPresets([...presets, data]);
      setNewPresetName('');
      alert('预设保存成功！');
    } catch {
      alert('保存失败，请检查JSON格式或网络连接');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该预设吗？')) return;
    await supabase.from('experiment_presets').delete().eq('id', id);
    setPresets(presets.filter(p => p.id !== id));
  };


  if (profile?.role !== 'teacher') {
    return <div className="p-8 text-center">仅教师可访问此页面</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="text-blue-600" />
        实验参数预设管理
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：新建预设 */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} /> 新建预设
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">选择实验</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedExperiment}
                onChange={e => setSelectedExperiment(e.target.value)}
              >
                <option value="">请选择...</option>
                {experiments.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">预设名称</label>
              <input 
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="例如：低重力环境"
                value={newPresetName}
                onChange={e => setNewPresetName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">参数配置 (JSON)</label>
              <textarea 
                className="w-full p-2 border rounded-lg font-mono text-sm h-48"
                value={configJson}
                onChange={e => setConfigJson(e.target.value)}
              />
            </div>

            <button 
              onClick={handleSave}
              disabled={!selectedExperiment || !newPresetName}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} /> 保存预设
            </button>
          </div>
        </div>

        {/* 右侧：预设列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b bg-slate-50">
              <h2 className="font-semibold text-slate-700">已保存的预设</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-500">加载中...</div>
            ) : presets.length === 0 ? (
              <div className="p-8 text-center text-slate-500">暂无预设配置</div>
            ) : (
              <div className="divide-y">
                {presets.map(preset => (
                  <div key={preset.id} className="p-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-slate-900">{preset.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        实验: {experiments.find(e => e.id === preset.experiment_id)?.title || '未知'}
                      </p>
                      <pre className="mt-2 text-xs bg-slate-100 p-2 rounded text-slate-600 overflow-x-auto max-w-md">
                        {JSON.stringify(preset.config, null, 2)}
                      </pre>
                    </div>
                    <button 
                      onClick={() => handleDelete(preset.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

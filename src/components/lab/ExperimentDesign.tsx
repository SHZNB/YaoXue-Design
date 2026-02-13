import React, { useState } from 'react';
import { Settings2, Save } from 'lucide-react';

interface Variable {
  id: string;
  name: string;
  variable_type: 'independent' | 'dependent' | 'controlled';
  unit?: string;
}

interface DesignData {
  independentVariable: string;
  dependentVariable: string;
}

interface ExperimentDesignProps {
  variables: Variable[];
  onSave: (hypothesis: string, design: DesignData) => void;
}

export const ExperimentDesign: React.FC<ExperimentDesignProps> = ({ variables, onSave }) => {
  const [hypothesis, setHypothesis] = useState('');
  const [selectedIV, setSelectedIV] = useState<string>(''); // Independent Variable
  const [selectedDV, setSelectedDV] = useState<string>(''); // Dependent Variable

  const independentVars = variables.filter(v => v.variable_type === 'independent');
  const dependentVars = variables.filter(v => v.variable_type === 'dependent');
  const controlledVars = variables.filter(v => v.variable_type === 'controlled');

  const handleSave = () => {
    onSave(hypothesis, { independentVariable: selectedIV, dependentVariable: selectedDV });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Settings2 className="text-purple-600" size={20} />
          实验设计
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* 1. 提出假设 */}
        <section>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">1</span>
            提出假设 (Hypothesis)
          </h4>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="例如：如果光照强度增加，那么植物生长的速度会加快..."
            className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
          />
        </section>

        {/* 2. 定义变量 */}
        <section>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">2</span>
            定义变量 (Variables)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">自变量 (你改变的)</label>
              <select 
                value={selectedIV}
                onChange={(e) => setSelectedIV(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
              >
                <option value="">选择自变量...</option>
                {independentVars.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.unit})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">因变量 (你测量的)</label>
              <select 
                value={selectedDV}
                onChange={(e) => setSelectedDV(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded bg-white text-sm"
              >
                <option value="">选择因变量...</option>
                {dependentVars.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.unit})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">控制变量 (保持不变)</label>
            <div className="flex flex-wrap gap-2">
              {controlledVars.map(v => (
                <span key={v.id} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs border border-slate-200">
                  {v.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 实验分组 */}
        <section>
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">3</span>
            实验分组
          </h4>
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="font-bold text-blue-800 text-sm mb-1">对照组 (Control)</div>
              <p className="text-xs text-blue-600">保持自然/标准状态，用于对比基准。</p>
            </div>
            <div className="flex-1 p-3 bg-green-50 border border-green-100 rounded-lg">
              <div className="font-bold text-green-800 text-sm mb-1">实验组 (Experimental)</div>
              <p className="text-xs text-green-600">施加自变量变化，观察因变量反应。</p>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleSave}
          disabled={!hypothesis || !selectedIV || !selectedDV}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={18} /> 保存实验设计
        </button>
      </div>
    </div>
  );
};

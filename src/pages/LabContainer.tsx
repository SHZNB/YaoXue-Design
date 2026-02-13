import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GradingSystem, LogEntry } from '../components/lab/GradingSystem';
import { generateReport } from '../utils/reportGenerator';
import { useCollaboration } from '../lib/collaboration';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Users, FileText, Download } from 'lucide-react';
import { ExperimentMetadata } from '../types/lab';

interface ExperimentStep {
  id: string;
  step_order: number;
  instruction: string;
  completed?: boolean;
}

interface ExperimentVariable {
  id: string;
  name: string;
  type: string;
  unit?: string;
}

interface DataTemplateItem {
  key: string;
  name: string;
  type: string;
}

// 动态导入实验组件
import { PhysicsLab } from '../experiments/PhysicsLab';
import { ChemistryLab } from '../experiments/ChemistryLab';
import { BiologyLab } from '../experiments/BiologyLab';
import { GeographyLab } from '../experiments/GeographyLab';
import { LabGuide } from '../components/lab/LabGuide';
import { ExperimentDesign } from '../components/lab/ExperimentDesign';
import { DataCollector } from '../components/lab/DataCollector';

type TabType = 'guide' | 'design' | 'simulation' | 'notebook';

export const LabContainer: React.FC = () => {
  const { subjectName, experimentId } = useParams<{ subjectName: string; experimentId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  
  const [experiment, setExperiment] = useState<ExperimentMetadata | null>(null);
  const [score, setScore] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  
  // New State for Scientific Rigor
  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [steps, setSteps] = useState<ExperimentStep[]>([]);
  const [variables, setVariables] = useState<ExperimentVariable[]>([]);
  const [dataTemplate, setDataTemplate] = useState<DataTemplateItem[]>([]);

  // 协同 Hook (基于实验 ID 作为房间号)
  const { peers } = useCollaboration(experimentId || '');

  useEffect(() => {
    const fetchExperiment = async () => {
      const { data } = await supabase
        .from('experiments')
        .select('*')
        .eq('id', experimentId)
        .single();
      if (data) setExperiment(data);
    };

    const fetchProtocolData = async () => {
      // Fetch Steps
      const { data: stepsData } = await supabase
        .from('experiment_steps')
        .select('*')
        .eq('experiment_id', experimentId)
        .order('step_order');
      if (stepsData) setSteps(stepsData);

      // Fetch Variables
      const { data: varsData } = await supabase
        .from('experiment_variables')
        .select('*')
        .eq('experiment_id', experimentId);
      if (varsData) setVariables(varsData);

      // Fetch Data Template
      const { data: tmplData } = await supabase
        .from('experiment_data_templates')
        .select('*')
        .eq('experiment_id', experimentId);
      if (tmplData) {
        const formatted = tmplData.map(t => ({ key: t.column_name, name: t.column_name, type: t.data_type }));
        setDataTemplate(formatted);
      }
    };

    if (experimentId) {
      fetchExperiment();
      fetchProtocolData();
    }
  }, [experimentId]);

  const handleGenerateReport = async () => {
    setReportGenerating(true);
    // 获取最近日志
    const { data: logs } = await supabase
      .from('experiment_logs')
      .select('*')
      .eq('experiment_id', experimentId)
      .eq('user_id', profile?.id)
      .order('timestamp', { ascending: true });

    const success = await generateReport('lab-canvas-container', {
      title: experiment?.title || '未命名实验',
      studentName: profile?.full_name || '未命名学生',
      score,
      completedAt: new Date().toLocaleString(),
      logs: logs || []
    });
    
    if (success) alert('报告已生成并下载！');
    setReportGenerating(false);
    setShowReportModal(false);
  };

  // 模拟评分规则 (真实场景应从数据库加载)
  const gradingSteps = [
    { id: 'step1', description: '启动实验环境', points: 10, condition: (logs: LogEntry[]) => logs.length > 0 },
    { id: 'step2', description: '完成首次交互', points: 30, condition: (logs: LogEntry[]) => logs.some(l => l.action !== 'init') },
    { id: 'step3', description: '达成实验目标', points: 60, condition: (logs: LogEntry[]) => logs.some(l => l.action === 'complete') },
  ];

  // 规范化学科名称匹配 (支持中文和英文，不区分大小写)
  const isSubject = (key: string) => {
    const map: Record<string, string[]> = {
      'Physics': ['physics', 'Physics', '物理'],
      'Chemistry': ['chemistry', 'Chemistry', '化学'],
      'Biology': ['biology', 'Biology', '生物'],
      'Geography': ['geography', 'Geography', '地理']
    };
    return map[key]?.includes(subjectName || '');
  };

  if (!experiment) return <div className="p-8 text-center">加载实验中...</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* 顶部工具栏 */}
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">{experiment.title}</h1>
          
          {/* 导航 Tabs */}
          <div className="flex bg-slate-700 rounded-lg p-1 ml-8">
            {(['guide', 'design', 'simulation', 'notebook'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-md text-xs font-bold transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'guide' ? '1. 实验指南' : 
                 tab === 'design' ? '2. 实验设计' : 
                 tab === 'simulation' ? '3. 模拟实验' : '4. 数据记录'}
              </button>
            ))}
          </div>
        </div>


        <div className="flex items-center gap-4">
          {/* 协同状态 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-full">
            <Users size={16} className="text-green-400" />
            <span className="text-xs font-medium">{Object.keys(peers).length + 1} 人在线</span>
          </div>

          <div className="h-6 w-px bg-slate-600 mx-2"></div>

          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
          >
            <FileText size={16} /> 生成报告
          </button>
        </div>
      </header>

      {/* 主体区域 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 内容区：根据 Tab 切换 */}
        <div className="flex-1 relative bg-slate-100 flex flex-col">
          {activeTab === 'guide' && (
            <div className="p-6 max-w-4xl mx-auto w-full h-full text-slate-900">
              <LabGuide 
                steps={steps.length > 0 ? steps : [{ id: '1', step_order: 1, instruction: '暂无详细步骤，请直接开始实验。' }]} 
                onToggleStep={(id) => {
                  setSteps(s => s.map(step => step.id === id ? { ...step, completed: !step.completed } : step));
                }} 
              />
            </div>
          )}

          {activeTab === 'design' && (
            <div className="p-6 max-w-4xl mx-auto w-full h-full text-slate-900">
              <ExperimentDesign 
                variables={variables.map(v => ({ ...v, variable_type: v.type as 'independent' | 'dependent' | 'controlled' }))} 
                onSave={(hypo, design) => console.log('Saved:', hypo, design)} 
              />
            </div>
          )}

          {activeTab === 'notebook' && (
            <div className="p-6 max-w-5xl mx-auto w-full h-full text-slate-900">
              <DataCollector 
                columns={dataTemplate.length > 0 ? dataTemplate.map(t => ({ ...t, type: t.type as 'number' | 'text' | 'boolean' })) : [
                  { key: 'time', name: '时间 (s)', type: 'number' },
                  { key: 'value', name: '观测值', type: 'number' }
                ]}
                onDataUpdate={(d) => console.log('Data:', d)}
              />
            </div>
          )}

          {/* 仿真区：始终保持渲染状态以维持 WebGL 上下文，只是隐藏 */}
          <div className={`flex-1 relative bg-black ${activeTab !== 'simulation' ? 'hidden' : 'block'}`} id="lab-canvas-container">
            {isSubject('Physics') ? (
              <PhysicsLab experimentId={experimentId || ''} />
            ) : isSubject('Chemistry') ? (
              <ChemistryLab experimentId={experimentId || ''} />
            ) : isSubject('Biology') ? (
              <BiologyLab experimentId={experimentId || ''} />
            ) : isSubject('Geography') ? (
              <GeographyLab experimentId={experimentId || ''} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-xl font-bold text-slate-300">实验建设中</h3>
                <p className="mt-2 text-slate-500">该学科 ({subjectName}) 的实验正在加紧开发中...</p>
              </div>
            )}

            {/* 覆盖层：协同用户鼠标/状态 */}
            {Object.entries(peers).map(([id, user]) => (
              <div 
                key={id}
                className="absolute pointer-events-none transition-all duration-100 flex flex-col items-center"
                style={{ left: `${user.x}%`, top: `${user.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: user.color }}
                />
                <span className="mt-1 text-xs bg-black/50 px-1 rounded text-white whitespace-nowrap">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧边栏：仅在模拟模式下显示评分 */}
        {activeTab === 'simulation' && (
          <aside className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col overflow-y-auto text-slate-900">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 mb-2">实时评分</h2>
              <div className="text-3xl font-bold text-blue-600">{score}</div>
            </div>
            
            <div className="flex-1 p-4">
              <GradingSystem 
                experimentId={experimentId || ''} 
                steps={gradingSteps} 
                onScoreUpdate={setScore} 
              />
            </div>
          </aside>
        )}
      </div>

      {/* 报告生成模态框 */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 text-slate-900">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" /> 实验报告
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">最终得分</span>
                <span className="font-bold text-blue-600 text-lg">{score}</span>
              </div>
              <p className="text-sm text-slate-500">
                点击下方按钮将生成包含当前实验截图、操作日志与得分详情的 PDF 报告。
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
              >
                取消
              </button>
              <button 
                onClick={handleGenerateReport}
                disabled={reportGenerating}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {reportGenerating ? '生成中...' : <><Download size={18} /> 下载 PDF</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

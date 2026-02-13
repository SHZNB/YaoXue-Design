import React, { useState, useEffect } from 'react';
import { logAction } from '../components/lab/GradingSystem';
import { FlaskConical, Droplets, Flame, RefreshCw } from 'lucide-react';

interface ChemistryLabProps {
  experimentId: string;
}

type Chemical = 'water' | 'acid' | 'base' | 'indicator';
type Color = 'transparent' | 'red' | 'blue' | 'purple';

export const ChemistryLab: React.FC<ChemistryLabProps> = ({ experimentId }) => {
  const [beakerContent, setBeakerContent] = useState<{ volume: number; ph: number; chemicals: Chemical[] }>({
    volume: 0,
    ph: 7,
    chemicals: []
  });
  const [color, setColor] = useState<Color>('transparent');
  const [reaction, setReaction] = useState('');

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'chemistry_lab' });
  }, [experimentId]);

  // 简单的化学反应状态机
  useEffect(() => {
    let newColor: Color = 'transparent';
    let newReaction = '';

    const hasIndicator = beakerContent.chemicals.includes('indicator');
    const hasAcid = beakerContent.chemicals.includes('acid');
    const hasBase = beakerContent.chemicals.includes('base');

    if (beakerContent.volume > 0) {
      if (hasIndicator) {
        if (beakerContent.ph < 7) newColor = 'red';
        else if (beakerContent.ph > 7) newColor = 'blue';
        else newColor = 'purple';
      } else {
        newColor = 'transparent';
      }

      if (hasAcid && hasBase) {
        newReaction = '中和反应进行中... 产生热量';
        // 模拟中和
        if (Math.abs(beakerContent.ph - 7) < 0.5) {
          logAction(experimentId, 'complete', { result: 'neutralized' });
        }
      }
    }

    setColor(newColor);
    setReaction(newReaction);
  }, [beakerContent, experimentId]);

  const addChemical = (type: Chemical) => {
    logAction(experimentId, 'add_chemical', { type });
    
    setBeakerContent(prev => {
      let phChange = 0;
      if (type === 'acid') phChange = -2;
      if (type === 'base') phChange = 2;
      
      // 简单的体积与PH混合算法
      const newVolume = prev.volume + 50;
      let newPh = prev.ph;
      
      if (prev.volume === 0) {
        newPh = type === 'acid' ? 3 : type === 'base' ? 11 : 7;
      } else {
        newPh = Math.max(1, Math.min(14, prev.ph + phChange));
      }

      return {
        volume: newVolume,
        ph: newPh,
        chemicals: [...prev.chemicals, type]
      };
    });
  };

  const reset = () => {
    setBeakerContent({ volume: 0, ph: 7, chemicals: [] });
    logAction(experimentId, 'reset');
  };

  const getColorClass = (c: Color) => {
    switch (c) {
      case 'red': return 'bg-red-500/50';
      case 'blue': return 'bg-blue-500/50';
      case 'purple': return 'bg-purple-500/50';
      default: return 'bg-blue-100/20';
    }
  };

  return (
    <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 2D 游戏界面 */}
      
      <div className="absolute top-8 left-8 bg-slate-700/80 p-4 rounded-xl text-white backdrop-blur">
        <h3 className="font-bold mb-2 flex items-center gap-2"><FlaskConical /> 试剂架</h3>
        <div className="grid grid-cols-2 gap-3">
          <ToolBtn onClick={() => addChemical('water')} label="蒸馏水" icon={<Droplets className="text-blue-300" />} />
          <ToolBtn onClick={() => addChemical('indicator')} label="指示剂" icon={<Droplets className="text-purple-300" />} />
          <ToolBtn onClick={() => addChemical('acid')} label="稀盐酸" icon={<FlaskConical className="text-red-300" />} />
          <ToolBtn onClick={() => addChemical('base')} label="氢氧化钠" icon={<FlaskConical className="text-green-300" />} />
        </div>
      </div>

      <div className="relative">
        {/* 烧杯容器 */}
        <div className="w-64 h-80 border-4 border-slate-400 border-t-0 rounded-b-3xl relative overflow-hidden bg-slate-900/30 backdrop-blur-sm">
          {/* 液体层 */}
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out ${getColorClass(color)}`}
            style={{ height: `${Math.min(100, beakerContent.volume / 5)}%` }}
          >
            {/* 气泡动画 */}
            {reaction && (
              <div className="absolute inset-0 flex justify-center items-end opacity-50 animate-pulse">
                <div className="w-full h-full bg-gradient-to-t from-white/20 to-transparent" />
              </div>
            )}
          </div>
          
          {/* 刻度线 */}
          <div className="absolute right-0 bottom-10 w-4 h-0.5 bg-slate-500/50" />
          <div className="absolute right-0 bottom-20 w-6 h-0.5 bg-slate-500/80" />
          <div className="absolute right-0 bottom-30 w-4 h-0.5 bg-slate-500/50" />
          <div className="absolute right-0 bottom-40 w-6 h-0.5 bg-slate-500/80" />
        </div>

        {/* 状态指示 */}
        <div className="absolute -right-40 top-10 space-y-4">
          <div className="bg-slate-700 p-3 rounded-lg text-white w-32">
            <div className="text-xs text-slate-400">PH 值</div>
            <div className="text-2xl font-mono font-bold">{beakerContent.ph.toFixed(1)}</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg text-white w-32">
            <div className="text-xs text-slate-400">溶液体积</div>
            <div className="text-2xl font-mono font-bold">{beakerContent.volume} ml</div>
          </div>
        </div>

        {/* 反应提示 */}
        {reaction && (
          <div className="absolute -top-16 left-0 right-0 flex justify-center">
            <div className="bg-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce flex items-center gap-2">
              <Flame size={16} /> {reaction}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={reset}
        className="mt-12 flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors"
      >
        <RefreshCw size={18} /> 清空烧杯
      </button>

      <div className="absolute bottom-4 text-slate-500 text-xs">
        实验提示：先加入指示剂，再分别滴加酸碱观察颜色变化
      </div>
    </div>
  );
};

const ToolBtn = ({ onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-all active:scale-95"
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

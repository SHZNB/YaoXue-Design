import React, { useState, useEffect } from 'react';
import { logAction } from '../../utils/logger';
import { useTranslation } from 'react-i18next';
import { Mountain, Activity, ArrowLeftRight } from 'lucide-react';

interface GeographyLabProps {
  experimentId: string;
}

type ForceType = 'none' | 'pressure' | 'tension';

export const PlateTectonics: React.FC<GeographyLabProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [forceType, setForceType] = useState<ForceType>('none');
  const [magnitude, setMagnitude] = useState(0); // 0-100
  const [deformation, setDeformation] = useState(0); // 0-100 (cumulative)
  const [structureType, setStructureType] = useState<'normal' | 'fold' | 'fault'>('normal');

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'geography_lab' });
  }, [experimentId]);

  // 模拟地质变化逻辑
  useEffect(() => {
    if (forceType === 'none') return;

    const interval = setInterval(() => {
      setDeformation(prev => {
        const change = magnitude * 0.05;
        const nextVal = Math.min(100, prev + change);
        
        // 结构判定
        if (nextVal > 80) {
          if (forceType === 'pressure' && structureType !== 'fold') {
            setStructureType('fold');
            logAction(experimentId, 'structure_formed', { type: 'fold' });
          } else if (forceType === 'tension' && structureType !== 'fault') {
            setStructureType('fault');
            logAction(experimentId, 'structure_formed', { type: 'fault' });
          }
        }
        
        return nextVal;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [forceType, magnitude, structureType, experimentId]);

  const handleReset = () => {
    setForceType('none');
    setMagnitude(0);
    setDeformation(0);
    setStructureType('normal');
    logAction(experimentId, 'reset');
  };

  // 可视化层样式计算
  const getLayerStyle = (index: number) => {
    const baseHeight = 40;
    let transform = '';
    
    if (structureType === 'fold') {
      // 褶皱模拟：正弦波
      // const wave = Math.sin(index) * 10 * (deformation / 100);
      transform = `scaleY(${1 + deformation / 200}) skewX(${deformation / 5}deg)`;
    } else if (structureType === 'fault') {
      // 断层模拟：错动
      const offset = index % 2 === 0 ? deformation : -deformation;
      transform = `translateX(${offset}px) rotate(${deformation / 10}deg)`;
    }

    return {
      height: `${baseHeight}px`,
      transform,
      transition: 'transform 0.2s ease-out'
    };
  };

  const handleForceChange = (type: ForceType) => {
    setForceType(type);
    logAction(experimentId, 'set_force', { type });
  };

  const handleMagnitudeChange = (val: number) => {
    setMagnitude(val);
    logAction(experimentId, 'set_magnitude', { magnitude: val });
  };

  return (
    <div className="w-full h-full bg-stone-100 flex flex-col p-6 relative overflow-hidden">
      {/* 标题与状�?*/}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <Mountain className="text-stone-600" />
          {t('geography.plate_tectonics.simulator')}
        </h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-stone-200">
          <span className="text-sm text-stone-500 mr-2">{t('geography.plate_tectonics.current_structure')}:</span>
          <span className="font-bold text-stone-800">
            {structureType === 'normal' ? t('geography.plate_tectonics.horizontal_layers') : 
             structureType === 'fold' ? t('geography.fold') : t('geography.fault')}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
        {/* 模拟区域 */}
        <div className="flex-1 flex items-center justify-center relative bg-stone-200 rounded-xl border-4 border-stone-300 overflow-hidden shadow-inner">
          {/* 岩层展示 */}
          <div className={`relative w-96 transition-all duration-500 ${structureType === 'fold' ? 'w-80' : 'w-96'}`}>
            {/* 左侧力指�?*/}
            {forceType === 'pressure' && (
              <ArrowLeftRight className="absolute -left-16 top-1/2 text-red-500 animate-pulse" size={48} />
            )}
            {forceType === 'tension' && (
              <ArrowLeftRight className="absolute -left-16 top-1/2 text-blue-500 rotate-180" size={48} />
            )}

            {/* 岩层堆叠 */}
            <div className="border-2 border-stone-800 bg-white shadow-xl relative overflow-hidden">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i}
                  className={`w-full border-b border-stone-800 flex items-center justify-center text-xs text-white/50 font-bold tracking-widest
                    ${i === 0 ? 'bg-amber-700' : 
                      i === 1 ? 'bg-stone-600' : 
                      i === 2 ? 'bg-orange-800' : 
                      i === 3 ? 'bg-yellow-700' : 'bg-red-900'}`}
                  style={getLayerStyle(i)}
                >
                  {t('geography.layer')} {5 - i}
                </div>
              ))}
            </div>

            {/* 右侧力指�?*/}
            {forceType === 'pressure' && (
              <ArrowLeftRight className="absolute -right-16 top-1/2 text-red-500 animate-pulse" size={48} />
            )}
            {forceType === 'tension' && (
              <ArrowLeftRight className="absolute -right-16 top-1/2 text-blue-500 rotate-180" size={48} />
            )}
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 flex flex-col gap-6 md:w-80 shrink-0">
          <div className="space-y-4">
            <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
              <Activity size={16} /> {t('geography.plate_tectonics.force_type')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleForceChange('pressure')}
                className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                  forceType === 'pressure' ? 'border-red-500 bg-red-50 text-red-700' : 'border-stone-200 hover:border-red-300'
                }`}
              >
                {t('geography.pressure')} ({t('geography.plate_tectonics.pressure_label')})
              </button>
              <button
                onClick={() => handleForceChange('tension')}
                className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                  forceType === 'tension' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-stone-200 hover:border-blue-300'
                }`}
              >
                {t('geography.tension')} ({t('geography.plate_tectonics.tension_label')})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-stone-700 flex items-center justify-between">
              <span>{t('geography.plate_tectonics.force_magnitude')}</span>
              <span>{magnitude}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={magnitude}
              onChange={(e) => handleMagnitudeChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-600"
              disabled={forceType === 'none'}
            />
          </div>

          <button
            onClick={handleReset}
            className="mt-auto px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-bold transition-colors w-full"
          >
            {t('lab.reset')}
          </button>
        </div>
      </div>
    </div>
  );
};


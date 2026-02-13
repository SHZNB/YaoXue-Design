import React, { useState } from 'react';
import { logAction } from '../../utils/logger';
import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VolcanoProps {
  experimentId: string;
}

export const Volcano: React.FC<VolcanoProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [viscosity, setViscosity] = useState(50);
  const [gasContent, setGasContent] = useState(50);
  const [erupting, setErupting] = useState(false);

  const handleErupt = () => {
    setErupting(true);
    logAction(experimentId, 'erupt', { viscosity, gasContent });
    setTimeout(() => setErupting(false), 5000);
  };

  const handleViscosityChange = (val: number) => {
    setViscosity(val);
    logAction(experimentId, 'set_viscosity', { viscosity: val });
  };

  const handleGasChange = (val: number) => {
    setGasContent(val);
    logAction(experimentId, 'set_gas', { gas: val });
  };

  return (
    <div className="w-full h-full bg-slate-800 flex flex-col md:flex-row items-center justify-center p-8 overflow-hidden gap-12">
      {/* Volcano Model */}
      <div className="relative flex-1 h-full flex items-end justify-center">
        {/* Ash Cloud */}
        {erupting && gasContent > 60 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-gray-500 rounded-full blur-xl opacity-80 animate-pulse" />
        )}
        
        {/* Lava */}
        {erupting && (
          <div 
            className="absolute bottom-[200px] left-1/2 -translate-x-1/2 w-8 bg-red-500 rounded-full transition-all duration-1000"
            style={{ 
              height: viscosity > 70 ? '100px' : '300px', // High viscosity = slow flow
              width: viscosity > 70 ? '20px' : '40px',
              animation: `flow ${viscosity > 70 ? '2s' : '0.5s'} infinite`
            }} 
          />
        )}

        {/* Mountain */}
        <div className="w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[200px] border-b-stone-700 relative z-10">
          {/* Crater */}
          <div className="absolute -top-[200px] -left-[20px] w-10 h-4 bg-red-900 rounded-full" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-xl w-96 text-white shrink-0">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Flame /> {t('geography.volcano.parameters')}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm">{t('geography.volcano.viscosity')} (Viscosity)</label>
            <input 
              type="range" value={viscosity} onChange={(e) => handleViscosityChange(Number(e.target.value))} 
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t('geography.volcano.shield_volcano')}</span>
              <span>{t('geography.volcano.stratovolcano')}</span>
            </div>
          </div>

          <div>
            <label className="text-sm">{t('geography.volcano.gas_content')} (Gas Content)</label>
            <input 
              type="range" value={gasContent} onChange={(e) => handleGasChange(Number(e.target.value))} 
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-gray-400"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t('geography.volcano.effusive')}</span>
              <span>{t('geography.volcano.explosive')}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleErupt}
          disabled={erupting}
          className="mt-6 w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {erupting ? t('geography.volcano.erupting') : t('geography.volcano.simulate_eruption')}
        </button>
      </div>
    </div>
  );
};


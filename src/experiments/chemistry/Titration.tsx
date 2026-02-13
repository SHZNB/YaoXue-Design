import React, { useState, useEffect } from 'react';
import { logAction } from '../../utils/logger';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';

interface TitrationProps {
  experimentId: string;
}

interface TitrationData {
  volume: number;
  ph: string;
  color: string;
  [key: string]: unknown;
}

export const Titration: React.FC<TitrationProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [volume, setVolume] = useState(0); // Added base volume
  const [ph, setPh] = useState(1); // Starting with strong acid
  const [color, setColor] = useState('#ef4444'); // Red (Acid)
  const [dataPoints, setDataPoints] = useState<TitrationData[]>([]);

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'titration' });
  }, [experimentId]);

  const addDrop = () => {
    const newVolume = volume + 1;
    setVolume(newVolume);
    
    // Simulate PH curve (Sigmoid)
    // Inflection point at 25ml
    const newPh = 1 + 13 / (1 + Math.exp(-0.5 * (newVolume - 25)));
    setPh(newPh);

    // Color indicator (Phenolphthalein: Clear -> Pink)
    // Simplified: Red (Acid) -> Purple (Neutral) -> Blue (Base)
    if (newPh < 6) setColor('#ef4444'); // Red
    else if (newPh < 8) setColor('#a855f7'); // Purple
    else setColor('#3b82f6'); // Blue

    logAction(experimentId, 'add_drop', { volume: newVolume, ph: newPh });
  };

  const handleRecord = () => {
    const newData: TitrationData = {
      volume,
      ph: ph.toFixed(2),
      color: ph < 6 ? 'Red' : ph < 8 ? 'Purple' : 'Blue'
    };
    setDataPoints([...dataPoints, newData]);
    logAction(experimentId, 'record_data', newData);
  };

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col p-4 gap-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-1">
        <div className="relative w-64 h-96 shrink-0">
          {/* Burette */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-48 bg-slate-200 border border-slate-400 rounded-b-md z-10">
            <div className="absolute bottom-0 w-full bg-blue-400 transition-all duration-300" style={{ height: `${100 - (volume/50)*100}%` }} />
          </div>
          
          {/* Beaker */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 bg-white/50 border-2 border-slate-400 rounded-b-xl overflow-hidden backdrop-blur-sm">
            <div 
              className="absolute bottom-0 w-full transition-all duration-500"
              style={{ height: `${20 + volume}%`, backgroundColor: color, opacity: 0.6 }}
            />
          </div>

          {/* Drop Animation */}
          <button 
            onClick={addDrop}
            className="absolute top-48 left-1/2 -translate-x-1/2 mt-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 shadow-lg z-20"
          >
            <ArrowDown size={20} />
          </button>
        </div>

        <div className="flex flex-row md:flex-col gap-8">
          <div className="bg-white p-4 rounded-xl shadow-sm w-48">
            <div className="text-sm text-slate-500">{t('chemistry.titration.added_volume')}</div>
            <div className="text-2xl font-bold text-slate-800">{volume} ml</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm w-48">
            <div className="text-sm text-slate-500">{t('chemistry.titration.ph_level')}</div>
            <div className="text-2xl font-bold text-slate-800">{ph.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Data Panel */}
      <div className="h-64 shrink-0">
        <ExperimentDataPanel
          title={t('lab.titration_data', { defaultValue: 'Titration Data' })}
          columns={[
            { key: 'volume', label: t('chemistry.titration.volume', { defaultValue: 'Volume (ml)' }) },
            { key: 'ph', label: 'pH' },
            { key: 'color', label: t('chemistry.titration.color', { defaultValue: 'Color' }) }
          ]}
          data={dataPoints}
          onRecord={handleRecord}
          className="h-full"
        />
      </div>
    </div>
  );
};


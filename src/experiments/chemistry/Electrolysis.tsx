import React, { useState } from 'react';
import { logAction } from '../../utils/logger';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';

interface ElectrolysisProps {
  experimentId: string;
}

interface ElectrolysisData {
  voltage: number;
  bubblesRate: string;
  [key: string]: unknown;
}

export const Electrolysis: React.FC<ElectrolysisProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [voltage, setVoltage] = useState(0);
  const [bubbles, setBubbles] = useState(0);
  const [dataPoints, setDataPoints] = useState<ElectrolysisData[]>([]);

  const handleVoltageChange = (v: number) => {
    setVoltage(v);
    setBubbles(v * 5); // More voltage = more bubbles
    logAction(experimentId, 'set_voltage', { voltage: v });
  };

  const handleRecord = () => {
    const newData: ElectrolysisData = {
      voltage,
      bubblesRate: bubbles > 0 ? t('chemistry.electrolysis.bubbles_rate', { count: bubbles, defaultValue: `${bubbles} bubbles/min` }) : t('chemistry.electrolysis.no_bubbles', { defaultValue: 'None' })
    };
    setDataPoints([...dataPoints, newData]);
    logAction(experimentId, 'record_data', newData);
  };

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col p-4 gap-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-1">
        {/* Beaker & Electrodes */}
        <div className="relative w-64 h-64 bg-blue-100/50 border-4 border-slate-400 border-t-0 rounded-b-3xl overflow-hidden shrink-0">
          {/* Electrodes */}
          <div className="absolute top-0 left-16 w-4 h-48 bg-slate-600" />
          <div className="absolute top-0 right-16 w-4 h-48 bg-slate-600" />
          
          {/* Bubbles Animation */}
          {voltage > 0 && (
            <>
              <div className="absolute left-16 bottom-16 w-full h-32 flex flex-col gap-2 animate-pulse">
                 {Array.from({ length: Math.min(bubbles, 10) }).map((_, i) => (
                   <div key={i} className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                 ))}
              </div>
              <div className="absolute right-16 bottom-16 w-full h-32 flex flex-col gap-2 animate-pulse">
                 {Array.from({ length: Math.min(bubbles, 10) }).map((_, i) => (
                   <div key={i} className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                 ))}
              </div>
            </>
          )}
        </div>

        {/* Power Supply */}
        <div className="bg-slate-800 p-6 rounded-xl text-white w-80">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" />
            <h3 className="font-bold">{t('chemistry.electrolysis.power_supply')}</h3>
          </div>
          <input 
            type="range" 
            min="0" max="12" step="1" 
            value={voltage} 
            onChange={(e) => handleVoltageChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
          <div className="text-center mt-2 font-mono text-xl">{voltage} V</div>
        </div>
      </div>

      {/* Data Panel */}
      <div className="h-64 shrink-0">
        <ExperimentDataPanel
          title={t('lab.electrolysis_data', { defaultValue: 'Electrolysis Data' })}
          columns={[
            { key: 'voltage', label: t('chemistry.electrolysis.voltage', { defaultValue: 'Voltage (V)' }) },
            { key: 'bubblesRate', label: t('chemistry.electrolysis.bubbles', { defaultValue: 'Bubbles Rate' }) }
          ]}
          data={dataPoints}
          onRecord={handleRecord}
          className="h-full"
        />
      </div>
    </div>
  );
};


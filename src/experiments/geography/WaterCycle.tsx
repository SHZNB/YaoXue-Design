import React, { useState, useEffect } from 'react';
import { logAction } from '../../utils/logger';
import { CloudRain, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WaterCycleProps {
  experimentId: string;
}

export const WaterCycle: React.FC<WaterCycleProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);

  useEffect(() => {
    logAction(experimentId, 'init', { type: 'water_cycle' });
  }, [experimentId]);

  const handleTempChange = (val: number) => {
    setTemperature(val);
    logAction(experimentId, 'set_temperature', { temperature: val });
  };

  const handleHumidityChange = (val: number) => {
    setHumidity(val);
    logAction(experimentId, 'set_humidity', { humidity: val });
  };

  return (
    <div className="w-full h-full bg-sky-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Scene Area */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Sky */}
        <div className="absolute top-10 left-10">
          <Sun size={64} className="text-yellow-400 animate-spin-slow" />
        </div>

        {/* Clouds (Condensation) */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-4 transition-opacity duration-1000" style={{ opacity: humidity / 100 }}>
          <CloudRain size={64} className="text-slate-400" />
          <CloudRain size={80} className="text-slate-500" />
          <CloudRain size={64} className="text-slate-400" />
        </div>

        {/* Rain (Precipitation) */}
        {humidity > 70 && (
          <div className="absolute top-40 left-1/2 -translate-x-1/2 w-64 h-64 flex justify-center gap-8 animate-pulse">
            <ArrowDown className="text-blue-500" />
            <ArrowDown className="text-blue-500" />
            <ArrowDown className="text-blue-500" />
          </div>
        )}

        {/* Evaporation */}
        {temperature > 30 && (
          <div className="absolute bottom-32 left-1/4 w-32 flex justify-center gap-4 animate-bounce">
            <ArrowUp className="text-white/50" />
            <ArrowUp className="text-white/50" />
          </div>
        )}

        {/* Ground/Ocean */}
        <div className="absolute bottom-0 w-full h-32 bg-blue-600 flex items-end">
          <div className="w-1/3 h-16 bg-green-700 rounded-tr-full" /> {/* Land */}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/90 p-6 shadow-lg z-10 w-full md:w-80 shrink-0 flex flex-col justify-center">
        <h3 className="font-bold text-slate-700 mb-4">{t('geography.water_cycle.climate_control')}</h3>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">{t('geography.water_cycle.temperature')} ({temperature}°C)</label>
            <input 
              type="range" min="0" max="50" value={temperature} onChange={(e) => handleTempChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg accent-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">{t('geography.water_cycle.humidity')} ({humidity}%)</label>
            <input 
              type="range" min="0" max="100" value={humidity} onChange={(e) => handleHumidityChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


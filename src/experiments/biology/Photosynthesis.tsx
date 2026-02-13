import React, { useState, useEffect } from 'react';
import { logAction } from '../../utils/logger';
import { Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';

interface PhotosynthesisProps {
  experimentId: string;
}

interface PhotosynthesisData {
  distance: number;
  bubblesRate: number;
  [key: string]: unknown;
}

export const Photosynthesis: React.FC<PhotosynthesisProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [lightDistance, setLightDistance] = useState(50); // cm
  const [bubbles, setBubbles] = useState(0);
  const [dataPoints, setDataPoints] = useState<PhotosynthesisData[]>([]);

  useEffect(() => {
    // Closer light = more bubbles (Oxygen)
    const rate = Math.max(0, (100 - lightDistance) / 10);
    const interval = setInterval(() => {
      setBubbles(b => b + rate);
    }, 1000);
    return () => clearInterval(interval);
  }, [lightDistance]);

  const handleDistanceChange = (val: number) => {
    setLightDistance(val);
    logAction(experimentId, 'set_distance', { distance: val });
  };

  const handleRecord = () => {
    // Calculate current rate (bubbles per second roughly)
    const rate = Math.max(0, (100 - lightDistance) / 10);
    const newData = { distance: lightDistance, bubblesRate: parseFloat(rate.toFixed(1)) };
    setDataPoints(prev => [...prev, newData]);
    logAction(experimentId, 'record_rate', newData);
  };

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col p-8 gap-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-1">
        <div className="flex items-end gap-0 shrink-0">
          {/* Lamp */}
          <div className="flex flex-col items-center" style={{ marginRight: `${lightDistance * 2}px`, transition: 'margin 0.3s' }}>
            <Sun size={48} className="text-yellow-500 animate-pulse" />
            <div className="w-2 h-32 bg-slate-400" />
            <div className="w-16 h-4 bg-slate-600 rounded-t-lg" />
          </div>

          {/* Beaker & Plant */}
          <div className="relative w-48 h-64 bg-blue-100/50 border-4 border-slate-400 border-t-0 rounded-b-2xl overflow-hidden">
            {/* Elodea Plant */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-32 bg-green-600 rounded-t-full">
              <div className="absolute -left-4 top-4 w-4 h-2 bg-green-600 rotate-45 rounded-full" />
              <div className="absolute -right-4 top-8 w-4 h-2 bg-green-600 -rotate-45 rounded-full" />
              <div className="absolute -left-4 top-16 w-4 h-2 bg-green-600 rotate-45 rounded-full" />
            </div>

            {/* Oxygen Bubbles */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: Math.min(Math.floor(bubbles) % 20, 20) }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-2 h-2 bg-white/80 rounded-full animate-bounce"
                  style={{ 
                    left: `${40 + Math.random() * 20}%`, 
                    bottom: `${20 + Math.random() * 10}%`,
                    animationDuration: `${1 + Math.random()}s` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-96 bg-white p-6 rounded-xl shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-2">{t('biology.photosynthesis.light_distance')} (cm)</label>
          <input 
            type="range" 
            min="10" max="100" 
            value={lightDistance} 
            onChange={(e) => handleDistanceChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex justify-between mt-2 text-slate-500 text-xs">
            <span>10cm ({t('biology.photosynthesis.high_light')})</span>
            <span>{lightDistance}cm</span>
            <span>100cm ({t('biology.photosynthesis.low_light')})</span>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
            {t('biology.photosynthesis.oxygen_bubbles')}: <span className="font-bold text-lg">{Math.floor(bubbles)}</span>
          </div>
        </div>
      </div>

      {/* Data Panel */}
      <div className="w-full max-w-4xl mx-auto h-64 shrink-0">
        <ExperimentDataPanel
          title={t('biology.photosynthesis.data_record', { defaultValue: 'Photosynthesis Rate Data' })}
          columns={[
            { key: 'distance', label: t('biology.photosynthesis.distance', { defaultValue: 'Light Distance (cm)' }) },
            { key: 'bubblesRate', label: t('biology.photosynthesis.rate', { defaultValue: 'Bubbles Rate (per sec)' }) }
          ]}
          data={dataPoints}
          onRecord={handleRecord}
          className="h-full"
        />
      </div>
    </div>
  );
};


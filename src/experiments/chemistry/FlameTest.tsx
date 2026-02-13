import React, { useState } from 'react';
import { logAction } from '../../utils/logger';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';

interface FlameTestProps {
  experimentId: string;
}

interface FlameTestData {
  metal: string;
  color: string;
  [key: string]: unknown;
}

export const FlameTest: React.FC<FlameTestProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [isBurning, setIsBurning] = useState(false);
  const [dataPoints, setDataPoints] = useState<FlameTestData[]>([]);

  const METALS = [
    { id: 'Na', name: t('chemistry.flame_test.sodium'), color: '#eab308', colorName: 'Yellow-Orange' }, // Yellow-Orange
    { id: 'K', name: t('chemistry.flame_test.potassium'), color: '#d8b4fe', colorName: 'Lilac' }, // Lilac
    { id: 'Cu', name: t('chemistry.flame_test.copper'), color: '#22c55e', colorName: 'Green' }, // Green
    { id: 'Sr', name: t('chemistry.flame_test.strontium'), color: '#ef4444', colorName: 'Red' }, // Red
  ];

  const handleTest = (metalId: string) => {
    setSelectedMetal(metalId);
    setIsBurning(true);
    logAction(experimentId, 'test_metal', { metal: metalId });
    setTimeout(() => setIsBurning(false), 3000);
  };

  const handleRecord = () => {
    if (!selectedMetal) return;
    const metal = METALS.find(m => m.id === selectedMetal);
    if (!metal) return;

    const newData: FlameTestData = {
      metal: metal.name,
      color: metal.colorName
    };
    setDataPoints([...dataPoints, newData]);
    logAction(experimentId, 'record_observation', newData);
  };

  const currentColor = selectedMetal ? METALS.find(m => m.id === selectedMetal)?.color : '#3b82f6'; // Default blue flame

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col p-4 gap-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-1">
        {/* Burner */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className={`w-16 h-32 blur-md rounded-full animate-pulse transition-colors duration-500 mx-auto`}
               style={{ backgroundColor: isBurning ? currentColor : '#3b82f6', opacity: 0.8 }} />
          <div className="w-20 h-4 bg-slate-600 mx-auto mt-2 rounded-sm" />
          <div className="w-4 h-24 bg-slate-700 mx-auto" />
          <div className="w-32 h-4 bg-slate-800 mx-auto rounded-full" />
        </div>

        {/* Metal Selection */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {METALS.map(metal => (
            <button
              key={metal.id}
              onClick={() => handleTest(metal.id)}
              disabled={isBurning}
              className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all disabled:opacity-50 flex flex-col items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <span className="text-sm font-bold">{metal.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Panel */}
      <div className="h-64 shrink-0">
        <ExperimentDataPanel
          title={t('lab.flame_test_data', { defaultValue: 'Flame Test Observations' })}
          columns={[
            { key: 'metal', label: t('chemistry.flame_test.metal', { defaultValue: 'Metal' }) },
            { key: 'color', label: t('chemistry.flame_test.color', { defaultValue: 'Flame Color' }) }
          ]}
          data={dataPoints}
          onRecord={isBurning ? handleRecord : undefined} // Only allow recording when burning
          className="h-full"
        />
      </div>
    </div>
  );
};


import React, { Suspense, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Volcano } from './geography/Volcano';
import { WaterCycle } from './geography/WaterCycle';
import { PlateTectonics } from './geography/PlateTectonics';
import { useTranslation } from 'react-i18next';

interface GeographyLabProps {
  experimentId: string;
}

export const GeographyLab: React.FC<GeographyLabProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [experimentType, setExperimentType] = useState<string | null>(null);

  useEffect(() => {
    if (!experimentId || experimentId.startsWith('demo')) {
      setExperimentType('plate_tectonics'); // Default
      return;
    }

    const fetchExperimentType = async () => {
      const { data } = await supabase
        .from('experiments')
        .select('title')
        .eq('id', experimentId)
        .single();
      
      if (data) {
        if (data.title.includes('火山')) setExperimentType('volcano');
        else if (data.title.includes('水循环')) setExperimentType('water_cycle');
        else if (data.title.includes('板块') || data.title.includes('构造')) setExperimentType('plate_tectonics');
        else setExperimentType('plate_tectonics');
      }
    };

    fetchExperimentType();
  }, [experimentId]);

  if (!experimentType) return <div className="p-8 text-white">{t('lab.loading_experiment')}</div>;

  return (
    <Suspense fallback={<div className="p-8 text-white">{t('lab.initializing')}</div>}>
      {experimentType === 'volcano' && <Volcano experimentId={experimentId} />}
      {experimentType === 'water_cycle' && <WaterCycle experimentId={experimentId} />}
      {experimentType === 'plate_tectonics' && <PlateTectonics experimentId={experimentId} />}
    </Suspense>
  );
};

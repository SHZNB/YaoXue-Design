import React, { Suspense, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Titration } from './chemistry/Titration';
import { FlameTest } from './chemistry/FlameTest';
import { Electrolysis } from './chemistry/Electrolysis';
import { useTranslation } from 'react-i18next';

interface ChemistryLabProps {
  experimentId: string;
}

export const ChemistryLab: React.FC<ChemistryLabProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [experimentType, setExperimentType] = useState<string | null>(null);

  useEffect(() => {
    if (!experimentId || experimentId.startsWith('demo')) {
      setExperimentType('titration'); // Default
      return;
    }

    const fetchExperimentType = async () => {
      const { data } = await supabase
        .from('experiments')
        .select('title')
        .eq('id', experimentId)
        .single();
      
      if (data) {
        if (data.title.includes('中和') || data.title.includes('滴定')) setExperimentType('titration');
        else if (data.title.includes('焰色')) setExperimentType('flame_test');
        else if (data.title.includes('电解')) setExperimentType('electrolysis');
        else setExperimentType('titration');
      }
    };

    fetchExperimentType();
  }, [experimentId]);

  if (!experimentType) return <div className="p-8 text-white">{t('lab.loading_experiment')}</div>;

  return (
    <Suspense fallback={<div className="p-8 text-white">{t('lab.initializing')}</div>}>
      {experimentType === 'titration' && <Titration experimentId={experimentId} />}
      {experimentType === 'flame_test' && <FlameTest experimentId={experimentId} />}
      {experimentType === 'electrolysis' && <Electrolysis experimentId={experimentId} />}
    </Suspense>
  );
};

import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Microscope } from './biology/Microscope';
import { Photosynthesis } from './biology/Photosynthesis';
import { Genetics } from './biology/Genetics';

interface BiologyLabProps {
  experimentId: string;
}

export const BiologyLab: React.FC<BiologyLabProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [experimentType, setExperimentType] = useState<string | null>(null);

  useEffect(() => {
    if (!experimentId || experimentId.startsWith('demo')) {
      setExperimentType('photosynthesis'); // Default
      return;
    }

    const fetchExperimentType = async () => {
      const { data } = await supabase
        .from('experiments')
        .select('title')
        .eq('id', experimentId)
        .single();
      
      if (data) {
        if (data.title.includes('显微') || data.title.includes('细胞')) setExperimentType('microscope');
        else if (data.title.includes('光合') || data.title.includes('植物')) setExperimentType('photosynthesis');
        else if (data.title.includes('遗传') || data.title.includes('杂交')) setExperimentType('genetics');
        else setExperimentType('photosynthesis');
      }
    };

    fetchExperimentType();
  }, [experimentId]);

  if (!experimentType) return <div className="p-8 text-white">{t('lab.loading_experiment')}</div>;

  return (
    <Suspense fallback={<div className="p-8 text-white">{t('lab.initializing')}</div>}>
      {experimentType === 'microscope' && <Microscope experimentId={experimentId} />}
      {experimentType === 'photosynthesis' && <Photosynthesis experimentId={experimentId} />}
      {experimentType === 'genetics' && <Genetics experimentId={experimentId} />}
    </Suspense>
  );
};

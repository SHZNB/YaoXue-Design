import React, { Suspense, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FreeFall } from './physics/FreeFall';
import { Pendulum } from './physics/Pendulum';
import { Circuit } from './physics/Circuit';
import { useTranslation } from 'react-i18next';

interface PhysicsLabProps {
  experimentId: string;
}

export const PhysicsLab: React.FC<PhysicsLabProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [experimentType, setExperimentType] = useState<string | null>(null);

  useEffect(() => {
    // 如果没有 ID，默认显示自由落体 (开发调试用)
    if (!experimentId || experimentId.startsWith('demo')) {
      setExperimentType('free_fall');
      return;
    }

    const fetchExperimentType = async () => {
      const { data } = await supabase
        .from('experiments')
        .select('title')
        .eq('id', experimentId)
        .single();
      
      if (data) {
        if (data.title.includes('落体')) setExperimentType('free_fall');
        else if (data.title.includes('单摆')) setExperimentType('pendulum');
        else if (data.title.includes('电路')) setExperimentType('circuit');
        else setExperimentType('free_fall'); // Default fallback
      }
    };

    fetchExperimentType();
  }, [experimentId]);

  if (!experimentType) {
    return <div className="flex items-center justify-center h-full text-white">{t('lab.identifying')}</div>;
  }

  return (
    <div className="w-full h-full bg-slate-900">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-white">{t('lab.loading_engine')}</div>}>
        {experimentType === 'free_fall' && <FreeFall experimentId={experimentId} />}
        {experimentType === 'pendulum' && <Pendulum experimentId={experimentId} />}
        {experimentType === 'circuit' && <Circuit experimentId={experimentId} />}
      </Suspense>
    </div>
  );
};

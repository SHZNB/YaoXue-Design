import React, { useState } from 'react';
import { logAction } from '../../utils/logger';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';
import { ClipboardList } from 'lucide-react';

interface GeneticsProps {
  experimentId: string;
}

interface GeneticsData {
  p1: string;
  p2: string;
  stats: string;
  [key: string]: unknown;
}

export const Genetics: React.FC<GeneticsProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [parent1, setParent1] = useState('YY'); // Yellow
  const [parent2, setParent2] = useState('yy'); // Green
  const [offspring, setOffspring] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<GeneticsData[]>([]);

  const breed = () => {
    const p1Genes = parent1.split('');
    const p2Genes = parent2.split('');
    const newOffspring = [];

    // Simple Punnett Square logic
    for (const g1 of p1Genes) {
      for (const g2 of p2Genes) {
        // Sort alleles: Upper case first (Dominant)
        newOffspring.push((g1 < g2 ? g1 + g2 : g2 + g1)); 
      }
    }
    setOffspring(newOffspring);
    logAction(experimentId, 'breed', { p1: parent1, p2: parent2 });
  };

  const handleParentChange = (which: 'p1' | 'p2', genotype: string) => {
    if (which === 'p1') setParent1(genotype);
    else setParent2(genotype);
    logAction(experimentId, 'set_parent', { which, genotype });
  };

  const handleRecordStats = () => {
    if (offspring.length === 0) return;

    const counts: Record<string, number> = {};
    offspring.forEach(g => {
      counts[g] = (counts[g] || 0) + 1;
    });

    const statsStr = Object.entries(counts)
      .map(([geno, count]) => `${geno}: ${count}`)
      .join(', ');

    const newData = { p1: parent1, p2: parent2, stats: statsStr };
    setDataPoints(prev => [...prev, newData]);
    logAction(experimentId, 'record_stats', newData);
  };

  return (
    <div className="w-full h-full bg-green-50 flex flex-col p-8 gap-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-1">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-900 mb-8">{t('biology.genetics.mendel_experiment')}</h2>

          <div className="flex gap-16 items-center mb-12">
            <PeaCard genotype={parent1} onChange={(v: string) => handleParentChange('p1', v)} label={t('biology.genetics.p1')} t={t} />
            <span className="text-4xl text-slate-400">×</span>
            <PeaCard genotype={parent2} onChange={(v: string) => handleParentChange('p2', v)} label={t('biology.genetics.p2')} t={t} />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={breed}
              className="px-8 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-500 transition-all active:scale-95"
            >
              {t('biology.genetics.breed')}
            </button>
            <button
              onClick={handleRecordStats}
              disabled={offspring.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ClipboardList size={20} />
              {t('lab.record_stats', { defaultValue: 'Record Stats' })}
            </button>
          </div>
        </div>

        {offspring.length > 0 && (
          <div className="grid grid-cols-2 gap-4 bg-white p-8 rounded-xl shadow-sm border border-green-100 max-h-[80vh] overflow-y-auto">
            {offspring.map((geno, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                <div className={`w-12 h-12 rounded-full mb-2 ${geno.includes('Y') ? 'bg-yellow-400' : 'bg-green-500'}`} />
                <span className="font-mono font-bold text-slate-700">{geno}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Panel */}
      <div className="w-full max-w-4xl mx-auto h-64 shrink-0">
        <ExperimentDataPanel
          title={t('biology.genetics.data_record', { defaultValue: 'Genetic Statistics' })}
          columns={[
            { key: 'p1', label: t('biology.genetics.p1', { defaultValue: 'Parent 1' }) },
            { key: 'p2', label: t('biology.genetics.p2', { defaultValue: 'Parent 2' }) },
            { key: 'stats', label: t('biology.genetics.offspring_stats', { defaultValue: 'Offspring Stats' }) }
          ]}
          data={dataPoints}
          className="h-full"
        />
      </div>
    </div>
  );
};

interface PeaCardProps {
  genotype: string;
  onChange: (value: string) => void;
  label: string;
  t: (key: string) => string;
}

const PeaCard = ({ genotype, onChange, label, t }: PeaCardProps) => (
  <div className="flex flex-col items-center gap-4">
    <div className={`w-24 h-24 rounded-full shadow-inner ${genotype.includes('Y') ? 'bg-yellow-400' : 'bg-green-500'}`} />
    <select 
      value={genotype}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border border-slate-300 rounded-lg font-mono text-lg"
    >
      <option value="YY">{t('biology.genetics.dominant_homozygous')}</option>
      <option value="Yy">{t('biology.genetics.heterozygous')}</option>
      <option value="yy">{t('biology.genetics.recessive_homozygous')}</option>
    </select>
    <span className="text-sm font-bold text-slate-500">{label}</span>
  </div>
);


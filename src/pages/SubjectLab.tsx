import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Subject, Experiment } from '../types';
import { ArrowLeft, Play, Info, Trophy, ChevronRight } from 'lucide-react';

export const SubjectLab: React.FC = () => {
  const { subjectName } = useParams<{ subjectName: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!subjectName) return;

      // Fetch Subject
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('name', subjectName)
        .single();

      if (subjectError) {
        console.error('Error fetching subject:', subjectError);
      } else {
        setSubject(subjectData);

        // Fetch Experiments for this subject
        const { data: experimentsData, error: experimentsError } = await supabase
          .from('experiments')
          .select('*')
          .eq('subject_id', subjectData.id);

        if (experimentsError) {
          console.error('Error fetching experiments:', experimentsError);
        } else {
          setExperiments(experimentsData || []);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [subjectName]);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-48 bg-slate-200 rounded-3xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  if (!subject) return <div>未找到该实验室</div>;

  return (
    <div className="space-y-8">
      {/* Back Button & Breadcrumbs */}
      <nav className="flex items-center gap-4 text-sm font-medium text-slate-500">
        <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> 返回大厅
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900">{subject.display_name}</span>
      </nav>

      {/* Subject Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900">{subject.display_name}</h1>
            <p className="text-slate-600 max-w-xl">{subject.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-center min-w-[100px]">
              <div className="text-blue-600 font-bold text-2xl">{experiments.length}</div>
              <div className="text-blue-900 text-xs font-medium">可用实验</div>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-center min-w-[100px]">
              <div className="text-green-600 font-bold text-2xl">0</div>
              <div className="text-green-900 text-xs font-medium">已完成</div>
            </div>
          </div>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Play size={24} className="text-blue-500" />
          实验项目
        </h2>
        
        {experiments.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
            实验室正在扩建中，敬请期待更多精彩实验...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiments.map((exp) => (
              <div key={exp.id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 flex gap-6">
                <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                  {exp.thumbnail_url ? (
                    <img src={exp.thumbnail_url} alt={exp.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Beaker size={32} />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-600 border border-slate-100">
                    LV.{exp.difficulty_level}
                  </div>
                </div>
                
                <div className="flex-grow space-y-2">
                  <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {exp.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <Link 
                      to={`/lab/${subjectName}/${exp.id}`}
                      className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all px-3 py-1.5 hover:bg-blue-50 rounded-lg -ml-3"
                    >
                      开始实验 <ChevronRight size={16} />
                    </Link>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Info size={18} className="hover:text-blue-500 cursor-pointer transition-colors" />
                      <Trophy size={18} className="hover:text-amber-500 cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Beaker = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" />
  </svg>
);

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Subject } from '../types';
import { Link } from 'react-router-dom';
import { Beaker, FlaskConical, Globe, Ruler, Microscope, ArrowRight } from 'lucide-react';

const subjectIcons: Record<string, React.ReactNode> = {
  physics: <Ruler className="w-12 h-12" />,
  biology: <Microscope className="w-12 h-12" />,
  geography: <Globe className="w-12 h-12" />,
  chemistry: <FlaskConical className="w-12 h-12" />,
  engineering: <Beaker className="w-12 h-12" />,
};

const subjectColors: Record<string, string> = {
  physics: 'bg-blue-500',
  biology: 'bg-green-500',
  geography: 'bg-amber-500',
  chemistry: 'bg-purple-500',
  engineering: 'bg-indigo-500',
};

export const Home: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from('subjects').select('*');
      if (error) {
        console.error('Error fetching subjects:', error);
      } else {
        setSubjects(data || []);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm animate-pulse h-64"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          开启你的<span className="text-blue-600">科学探险</span>之旅
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          选择一个学科进入虚拟实验室，通过交互式仿真实验，像真正的科学家一样探索世界的奥秘。
        </p>
      </section>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/lab/${subject.name}`}
            className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${subjectColors[subject.name]} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className={`mb-6 p-4 rounded-2xl ${subjectColors[subject.name]} text-white shadow-lg shadow-${subject.name}-200 group-hover:scale-110 transition-transform duration-300`}>
              {subjectIcons[subject.name] || <Beaker className="w-12 h-12" />}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3">{subject.display_name}</h3>
            <p className="text-slate-500 mb-8 line-clamp-2">{subject.description}</p>
            
            <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
              进入实验室 <ArrowRight size={20} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

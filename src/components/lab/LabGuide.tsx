import React from 'react';
import { ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  step_order: number;
  instruction: string;
  safety_warning?: string;
  completed?: boolean;
}

interface LabGuideProps {
  steps: Step[];
  onToggleStep: (stepId: string) => void;
}

export const LabGuide: React.FC<LabGuideProps> = ({ steps, onToggleStep }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="text-blue-600" size={20} />
          实验步骤指南
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {steps.sort((a, b) => a.step_order - b.step_order).map((step) => (
          <div 
            key={step.id}
            className={`p-4 rounded-lg border transition-all ${
              step.completed 
                ? 'bg-green-50 border-green-200 opacity-75' 
                : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleStep(step.id)}
                className={`mt-1 min-w-[20px] h-5 rounded-full border flex items-center justify-center transition-colors ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 hover:border-blue-500'
                }`}
              >
                {step.completed && <CheckCircle size={14} />}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Step {step.step_order}
                  </span>
                </div>
                <p className={`text-sm ${step.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {step.instruction}
                </p>
                
                {step.safety_warning && (
                  <div className="mt-3 flex items-start gap-2 text-xs bg-amber-50 text-amber-800 p-2 rounded border border-amber-100">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>{step.safety_warning}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

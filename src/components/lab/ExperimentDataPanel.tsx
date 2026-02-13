import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Table as TableIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Column {
  key: string;
  label: string;
}

interface ExperimentDataPanelProps {
  title?: string;
  columns: Column[];
  data: Record<string, unknown>[];
  onRecord?: () => void;
  className?: string;
}

export const ExperimentDataPanel: React.FC<ExperimentDataPanelProps> = ({
  title,
  columns,
  data,
  onRecord,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge("bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2 text-slate-700">
          <TableIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">{title || t('lab.data_table')}</h3>
        </div>
        {onRecord && (
          <button
            onClick={onRecord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t('lab.record_data')}
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" className="px-6 py-3 border-b border-slate-200 font-medium whitespace-nowrap w-16">
                #
              </th>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-6 py-3 border-b border-slate-200 font-medium whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <TableIcon className="w-8 h-8 opacity-20" />
                    <p>{t('lab.no_data', { defaultValue: '暂无数据' })}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-slate-400 text-xs">
                    {index + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={`${index}-${col.key}`} className="px-6 py-3 text-slate-700 font-medium whitespace-nowrap">
                      {row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500 flex justify-end">
        <span>Total: {data.length}</span>
      </div>
    </div>
  );
};

export default ExperimentDataPanel;

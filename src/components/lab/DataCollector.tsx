import React, { useState } from 'react';
import { Table, Plus, Trash2, LineChart } from 'lucide-react';

interface DataColumn {
  key: string;
  name: string;
  type: 'number' | 'text' | 'boolean';
}

interface RowData {
  id: number;
  group: 'control' | 'experimental';
  [key: string]: string | number | boolean;
}

interface DataCollectorProps {
  columns: DataColumn[];
  onDataUpdate: (data: RowData[]) => void;
}

export const DataCollector: React.FC<DataCollectorProps> = ({ columns, onDataUpdate }) => {
  const [data, setData] = useState<RowData[]>([]);
  const [activeTab, setActiveTab] = useState<'control' | 'experimental'>('experimental');

  const handleAddRow = () => {
    const newRow: RowData = columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), { id: Date.now(), group: activeTab });
    const newData = [...data, newRow];
    setData(newData);
    onDataUpdate(newData);
  };

  const handleDeleteRow = (id: number) => {
    const newData = data.filter(row => row.id !== id);
    setData(newData);
    onDataUpdate(newData);
  };

  const handleCellChange = (id: number, key: string, value: string) => {
    const newData = data.map(row => 
      row.id === id ? { ...row, [key]: value } : row
    );
    setData(newData);
    onDataUpdate(newData);
  };

  const currentData = data.filter(row => row.group === activeTab);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Table className="text-emerald-600" size={20} />
          实验数据记录 (Lab Notebook)
        </h3>
        
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeTab === 'control' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            对照组
          </button>
          <button
            onClick={() => setActiveTab('experimental')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeTab === 'experimental' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            实验组
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(col => (
                <th key={col.key} className="p-3 text-left font-bold text-slate-600">
                  {col.name}
                </th>
              ))}
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(row => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                {columns.map(col => (
                  <td key={col.key} className="p-2">
                    <input
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={String(row[col.key])}
                      onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                      className="w-full p-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded bg-transparent focus:bg-white transition-colors"
                      placeholder="..."
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  <button 
                    onClick={() => handleDeleteRow(row.id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-400 italic">
                  暂无数据，点击下方按钮添加记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex justify-between">
        <button 
          onClick={handleAddRow}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> 添加一行
        </button>
        
        <button 
          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-emerald-200"
        >
          <LineChart size={16} /> 生成图表
        </button>
      </div>
    </div>
  );
};

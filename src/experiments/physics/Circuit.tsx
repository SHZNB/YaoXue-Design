import React, { useState, useEffect } from 'react';
import { logAction } from '../../utils/logger';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';
import { Canvas } from '@react-three/fiber';
import { ParticleSystem } from '../../components/lab/ParticleSystem';

interface CircuitProps {
  experimentId: string;
}

interface DataPoint {
  voltage: string;
  resistance: string;
  current: string;
  power: string;
  [key: string]: unknown;
}

export const Circuit: React.FC<CircuitProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [voltage, setVoltage] = useState(9); // Volts
  const [resistance, setResistance] = useState(100); // Ohms
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isShortCircuit, setIsShortCircuit] = useState(false);
  const [showSparks, setShowSparks] = useState(false);

  const current = isSwitchOn ? (voltage / resistance) : 0;
  const power = isSwitchOn ? (voltage * current) : 0;

  useEffect(() => {
    // Check for short circuit (High current > 5A)
    if (isSwitchOn && current > 5) {
      setIsShortCircuit(true);
      setShowSparks(true);
      logAction(experimentId, 'short_circuit_warning', { current });
    } else {
      setIsShortCircuit(false);
      setShowSparks(false);
    }
  }, [current, isSwitchOn, experimentId]);

  const handleToggle = () => {
    setIsSwitchOn(!isSwitchOn);
    logAction(experimentId, 'toggle_switch', { state: !isSwitchOn });
  };

  const handleRecord = () => {
    const newDataPoint = {
      voltage: voltage.toFixed(1) + ' V',
      resistance: resistance.toFixed(0) + ' Ω',
      current: current.toFixed(3) + ' A',
      power: power.toFixed(2) + ' W'
    };
    
    setDataPoints(prev => [...prev, newDataPoint]);
    logAction(experimentId, 'record_data', newDataPoint);
  };

  const columns = [
    { key: 'voltage', label: t('physics.circuit.voltage') },
    { key: 'resistance', label: t('physics.circuit.resistance') },
    { key: 'current', label: t('physics.circuit.ammeter') }, // Using ammeter translation for current
    { key: 'power', label: t('physics.circuit.power', { defaultValue: 'Power' }) },
  ];

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8 relative">
          {/* Schematic Canvas (SVG for simplicity) */}
          <div className="relative w-[600px] h-[400px] bg-white rounded-xl shadow-lg border-2 border-slate-300">
            <svg className="w-full h-full" viewBox="0 0 600 400">
              {/* Wires */}
              <path d="M100,200 H200" stroke="#334155" strokeWidth="4" />
              <path d="M400,200 H500" stroke="#334155" strokeWidth="4" />
              <path d="M100,200 V100 H500 V200" stroke="#334155" strokeWidth="4" fill="none" />
              <path d="M100,200 V300 H500 V200" stroke="#334155" strokeWidth="4" fill="none" />

              {/* Battery (Top) */}
              <g transform="translate(300, 100)">
                <rect x="-20" y="-15" width="40" height="30" fill="white" stroke="none" />
                <line x1="-10" y1="-15" x2="-10" y2="15" stroke="black" strokeWidth="2" />
                <line x1="10" y1="-25" x2="10" y2="25" stroke="black" strokeWidth="4" />
                <text x="-5" y="-30" textAnchor="middle" fontSize="14">{t('physics.circuit.battery')} ({voltage}V)</text>
              </g>

              {/* Resistor (Bottom) */}
              <g transform="translate(300, 300)">
                <rect x="-30" y="-10" width="60" height="20" fill="#e2e8f0" stroke="black" strokeWidth="2" />
                <path d="M-25,0 L-20,-8 L-10,8 L0,-8 L10,8 L20,-8 L25,0" fill="none" stroke="black" strokeWidth="2" />
                <text x="0" y="30" textAnchor="middle" fontSize="14">{t('physics.circuit.resistor')} ({resistance}Ω)</text>
              </g>

              {/* Switch (Left) */}
              <g transform="translate(100, 200)" onClick={handleToggle} className="cursor-pointer">
                <circle cx="0" cy="0" r="5" fill="black" />
                <line x1="0" y1="0" x2="30" y2={isSwitchOn ? 0 : -20} stroke="black" strokeWidth="4" />
                <circle cx="30" cy="0" r="5" fill="black" />
              </g>

              {/* LED/Load (Right) */}
              <g transform="translate(500, 200)">
                 <circle cx="0" cy="0" r="15" fill={isSwitchOn ? (isShortCircuit ? "#ef4444" : "#fbbf24") : "#cbd5e1"} stroke="black" strokeWidth="2" />
                 {isSwitchOn && !isShortCircuit && (
                   <g>
                     <line x1="-20" y1="-20" x2="-10" y2="-10" stroke="#fbbf24" strokeWidth="2" />
                     <line x1="20" y1="-20" x2="10" y2="-10" stroke="#fbbf24" strokeWidth="2" />
                     <line x1="0" y1="-25" x2="0" y2="-15" stroke="#fbbf24" strokeWidth="2" />
                   </g>
                 )}
                 {isShortCircuit && (
                    <text x="0" y="-25" textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="20">⚠️</text>
                 )}
              </g>
            </svg>
            
            {/* Short Circuit Sparks */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <Canvas>
                    <ParticleSystem 
                        trigger={showSparks} 
                        position={[3.5, 0, 0]} // Approximate 3D position over the resistor/battery area
                        color="#ef4444"
                        count={100}
                    />
                </Canvas>
            </div>

            {/* Meters */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-slate-800 text-green-400 p-2 rounded font-mono text-sm border border-slate-600 w-32">
                {t('physics.circuit.ammeter')}: {current.toFixed(3)} A
              </div>
              <div className="bg-slate-800 text-red-400 p-2 rounded font-mono text-sm border border-slate-600 w-32">
                {t('physics.circuit.voltmeter')}: {isSwitchOn ? voltage : 0} V
              </div>
            </div>
          </div>
        </div>

        {/* Data Panel */}
        <div className="w-80 border-l border-slate-200 bg-white/50 p-4">
          <ExperimentDataPanel
            title={t('lab.data_record')}
            columns={columns}
            data={dataPoints}
            onRecord={handleRecord}
            className="h-full bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="h-48 bg-white border-t border-slate-200 p-6 flex gap-8">
        <div className="flex-1 space-y-4">
          <ControlSlider label={`${t('physics.circuit.voltage')} (V)`} value={voltage} min={1.5} max={24} step={1.5} onChange={setVoltage} />
          <ControlSlider label={`${t('physics.circuit.resistance')} (Ω)`} value={resistance} min={10} max={1000} step={10} onChange={setResistance} />
        </div>
        
        <div className="flex flex-col justify-center items-center gap-4 w-48 border-l border-slate-100 pl-8">
          <button 
            onClick={handleToggle}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${isSwitchOn ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
          >
            {isSwitchOn ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
            <span className="font-bold">{isSwitchOn ? t('physics.circuit.switch_on') : t('physics.circuit.switch_off')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const ControlSlider = ({ label, value, min, max, step, onChange }: ControlSliderProps) => (
  <div className="flex items-center gap-4">
    <label className="w-32 text-sm font-bold text-slate-600">{label}</label>
    <input 
      type="range" 
      min={min} max={max} step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
    />
    <span className="w-12 text-right text-sm font-mono text-slate-800">{value}</span>
  </div>
);


import React, { useState } from 'react';
import { logAction } from '../../utils/logger';
import { ZoomIn, ZoomOut, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExperimentDataPanel } from '../../components/lab/ExperimentDataPanel';

interface MicroscopeProps {
  experimentId: string;
}

interface MicroscopeData {
  zoom: number;
  slide: string;
  [key: string]: unknown;
}

export const Microscope: React.FC<MicroscopeProps> = ({ experimentId }) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [slide, setSlide] = useState<'onion' | 'cheek' | null>(null);
  const [dataPoints, setDataPoints] = useState<MicroscopeData[]>([]);

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(1, Math.min(10, zoom + delta));
    setZoom(newZoom);
    logAction(experimentId, 'zoom', { level: newZoom });
  };

  const handleSlideChange = (newSlide: 'onion' | 'cheek') => {
    setSlide(newSlide);
    logAction(experimentId, 'select_slide', { slide: newSlide });
  };

  const handleCapture = () => {
    if (!slide) return;
    const newData = { zoom, slide: t(`biology.microscope.${slide === 'onion' ? 'onion_epidermis' : 'cheek_epithelium'}`) };
    setDataPoints(prev => [...prev, newData]);
    logAction(experimentId, 'capture_image', newData);
  };

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Viewport */}
        <div className="relative w-96 h-96 bg-black rounded-full border-8 border-slate-700 overflow-hidden shadow-2xl shrink-0">
          {slide ? (
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-300"
              style={{ 
                backgroundImage: slide === 'onion' ? 'url(https://placeholder.com/onion-cells.jpg)' : 'url(https://placeholder.com/cheek-cells.jpg)',
                transform: `scale(${zoom})`,
                backgroundColor: slide === 'onion' ? '#dcfce7' : '#fce7f3' // Fallback color
              }}
            >
              {/* Cellular Pattern Simulation (CSS) */}
              <div className="w-full h-full opacity-50" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                     backgroundSize: `${20/zoom}px ${20/zoom}px` 
                   }} 
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              {t('biology.microscope.place_slide')}
            </div>
          )}
          
          {/* Crosshair */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-full h-px bg-black" />
            <div className="h-full w-px bg-black absolute" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-8 items-center">
          <div className="flex gap-2">
            <button onClick={() => handleSlideChange('onion')} className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200">{t('biology.microscope.onion_epidermis')}</button>
            <button onClick={() => handleSlideChange('cheek')} className="px-4 py-2 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200">{t('biology.microscope.cheek_epithelium')}</button>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-lg">
            <button onClick={() => handleZoom(-1)} className="text-white p-2 hover:bg-slate-700 rounded"><ZoomOut /></button>
            <span className="text-white font-mono w-12 text-center">{zoom}x</span>
            <button onClick={() => handleZoom(1)} className="text-white p-2 hover:bg-slate-700 rounded"><ZoomIn /></button>
          </div>

          <button 
            onClick={handleCapture}
            disabled={!slide}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold shadow-lg transition-all active:scale-95"
          >
            <Camera size={20} />
            {t('lab.capture', { defaultValue: 'Capture' })}
          </button>
        </div>
      </div>

      {/* Data Panel */}
      <div className="w-full max-w-4xl h-64 shrink-0">
        <ExperimentDataPanel
          title={t('biology.microscope.observations', { defaultValue: 'Microscope Observations' })}
          columns={[
            { key: 'slide', label: t('biology.microscope.slide_type', { defaultValue: 'Slide Type' }) },
            { key: 'zoom', label: t('biology.microscope.zoom_level', { defaultValue: 'Zoom Level' }) }
          ]}
          data={dataPoints}
          className="h-full"
        />
      </div>
    </div>
  );
};


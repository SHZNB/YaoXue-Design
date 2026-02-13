// 实验模式枚举
export type LabMode = 'demo' | 'explore' | 'quiz';

// 实验结果数据结构
export interface LabResult {
  score?: number;
  dataPoints: Array<{ x: number; y: number; label?: string }>;
  errorMargin?: number;
  completionTime: number; // 秒
  logs: Array<{ timestamp: string; action: string; details: unknown }>;
}

// 统一的实验组件 Props 接口
export interface LabComponentProps {
  // 基础信息
  experimentId: string;
  
  // 模式控制
  mode: LabMode;
  
  // 初始参数 (实验变量)
  initialParams?: Record<string, unknown>;
  
  // 环境变量 (如重力、温度)
  envParams?: Record<string, unknown>;
  
  // 国际化
  locale?: string;
  
  // 事件回调
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onComplete?: (result: LabResult) => void;
  onError?: (error: Error) => void;
  onLog?: (action: string, details: unknown) => void;
  
  // 无障碍
  a11y?: {
    highContrast?: boolean;
    screenReaderEnabled?: boolean;
  };
}

// 实验元数据接口 (对应数据库扩展)
export interface ExperimentMetadata {
  id: string;
  title: string;
  description: string;
  equipmentList: string[];
  safetyLevel: 'low' | 'medium' | 'high';
  precautions: string;
  durationMinutes: number;
  chapter: string;
  knowledgePoints: string[];
}

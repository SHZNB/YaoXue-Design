-- 创建实验安全等级枚举类型
CREATE TYPE public.safety_level AS ENUM ('low', 'medium', 'high');

-- 扩展 experiments 表
ALTER TABLE public.experiments 
ADD COLUMN IF NOT EXISTS equipment_list JSONB DEFAULT '[]', -- 所需器材清单
ADD COLUMN IF NOT EXISTS safety_level safety_level DEFAULT 'low', -- 安全等级
ADD COLUMN IF NOT EXISTS precautions TEXT, -- 注意事项
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 45, -- 预计时长
ADD COLUMN IF NOT EXISTS chapter TEXT, -- 所属章节
ADD COLUMN IF NOT EXISTS knowledge_points JSONB DEFAULT '[]'; -- 知识点映射

-- 更新现有数据示例
UPDATE public.experiments 
SET 
    equipment_list = '["显微镜", "载玻片", "洋葱表皮"]',
    safety_level = 'low',
    precautions = '使用显微镜时注意调节光线，避免强光损伤眼睛。',
    duration_minutes = 40,
    chapter = '细胞生物学',
    knowledge_points = '["细胞结构", "显微镜使用"]'
WHERE title LIKE '%植物%';

UPDATE public.experiments 
SET 
    equipment_list = '["烧杯", "酸碱指示剂", "滴定管"]',
    safety_level = 'medium',
    precautions = '酸碱具有腐蚀性，请佩戴护目镜和手套。',
    duration_minutes = 50,
    chapter = '化学反应原理',
    knowledge_points = '["中和反应", "PH值测定"]'
WHERE title LIKE '%酸碱%';

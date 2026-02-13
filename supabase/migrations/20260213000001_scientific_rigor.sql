-- 1. 实验步骤表 (Standard Operating Procedures)
CREATE TABLE IF NOT EXISTS public.experiment_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    instruction TEXT NOT NULL, -- 具体操作指令
    expected_outcome TEXT, -- 预期现象
    safety_warning TEXT, -- 该步骤的安全提示
    image_url TEXT, -- 步骤示意图
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 实验变量定义 (Experimental Design)
CREATE TABLE IF NOT EXISTS public.experiment_variables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 变量名 (e.g., "光照强度")
    variable_type TEXT CHECK (variable_type IN ('independent', 'dependent', 'controlled')), -- 自变量/因变量/控制变量
    unit TEXT, -- 单位 (e.g., "lux")
    default_value JSONB, -- 默认值
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 数据记录模板 (Data Collection Template)
CREATE TABLE IF NOT EXISTS public.experiment_data_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    column_name TEXT NOT NULL, -- 列名
    data_type TEXT DEFAULT 'number', -- number, text, boolean
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 用户实验记录 (Lab Notebook)
CREATE TABLE IF NOT EXISTS public.user_experiment_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    group_type TEXT DEFAULT 'experimental', -- 'control' (对照组) or 'experimental' (实验组)
    hypothesis TEXT, -- 用户假设
    recorded_data JSONB DEFAULT '[]', -- 实际记录的数据 (Array of objects)
    conclusion TEXT, -- 实验结论
    verified BOOLEAN DEFAULT false, -- 是否已验证可重复性
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入示例数据 (生物实验：光照对植物生长的影响)
DO $$
DECLARE
    bio_exp_id UUID;
BEGIN
    SELECT id INTO bio_exp_id FROM public.experiments WHERE title LIKE '%植物%' LIMIT 1;

    IF bio_exp_id IS NOT NULL THEN
        -- 步骤
        INSERT INTO public.experiment_steps (experiment_id, step_order, instruction, safety_warning) VALUES
        (bio_exp_id, 1, '准备两个相同的种植容器，填入等量的土壤。', '小心处理土壤，避免吸入粉尘。'),
        (bio_exp_id, 2, '在两个容器中分别播种相同数量、相同品种的种子。', NULL),
        (bio_exp_id, 3, '设定对照组光照强度为 50% (模拟自然光)，实验组光照强度为 0% (黑暗) 或 100% (强光)。', '长时间注视强光可能损伤视力。'),
        (bio_exp_id, 4, '每天定时浇水，并记录植物生长高度。', NULL);

        -- 变量
        INSERT INTO public.experiment_variables (experiment_id, name, variable_type, unit) VALUES
        (bio_exp_id, '光照强度', 'independent', '%'),
        (bio_exp_id, '植物高度', 'dependent', 'cm'),
        (bio_exp_id, '水分', 'controlled', 'ml'),
        (bio_exp_id, '温度', 'controlled', '°C');

        -- 数据模板
        INSERT INTO public.experiment_data_templates (experiment_id, column_name, data_type) VALUES
        (bio_exp_id, '天数', 'number'),
        (bio_exp_id, '对照组高度', 'number'),
        (bio_exp_id, '实验组高度', 'number'),
        (bio_exp_id, '叶片颜色', 'text');
    END IF;
END $$;

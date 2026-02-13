-- 创建实验预设表
CREATE TABLE public.experiment_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    config JSONB DEFAULT '{}', -- 存储初始参数，如重力、光强等
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 创建实验日志表（用于评分与报告）
CREATE TABLE public.experiment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    experiment_id UUID REFERENCES public.experiments(id),
    action TEXT NOT NULL, -- 操作动作，如 "connect_circuit", "add_chemical"
    payload JSONB DEFAULT '{}', -- 动作详情
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 启用 RLS
ALTER TABLE public.experiment_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_logs ENABLE ROW LEVEL SECURITY;

-- 策略：教师可以管理自己的预设
CREATE POLICY "Teachers can manage own presets" ON public.experiment_presets
    FOR ALL USING (auth.uid() = teacher_id);

-- 策略：所有登录用户可读取预设（用于加载实验）
CREATE POLICY "Users can read presets" ON public.experiment_presets
    FOR SELECT USING (auth.role() = 'authenticated');

-- 策略：用户只能插入自己的日志
CREATE POLICY "Users can insert own logs" ON public.experiment_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 策略：用户只能读取自己的日志
CREATE POLICY "Users can read own logs" ON public.experiment_logs
    FOR SELECT USING (auth.uid() = user_id);

-- 插入更多实验数据
INSERT INTO public.experiments (title, description, thumbnail_url, content_url, difficulty_level, subject_id)
SELECT 
    '凸透镜成像规律', 
    '探究物距、像距与焦距的关系，观察实像与虚像的变化。', 
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', 
    '/lab/optics/lens', 
    'medium',
    id
FROM public.subjects WHERE name = '物理'
LIMIT 1;

INSERT INTO public.experiments (title, description, thumbnail_url, content_url, difficulty_level, subject_id)
SELECT 
    '酸碱中和滴定', 
    '使用指示剂监测酸碱反应终点，计算未知溶液浓度。', 
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', 
    '/lab/chemistry/titration', 
    'hard',
    id
FROM public.subjects WHERE name = '化学'
LIMIT 1;

-- 教师可见性：赋予 service_role 权限以便管理员管理
GRANT ALL ON public.experiment_presets TO service_role;
GRANT ALL ON public.experiment_logs TO service_role;

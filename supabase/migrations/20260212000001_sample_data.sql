-- Insert sample experiments for Physics
INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '重力实验室', '探索重力加速度对不同物体的影响，体验在不同星球上的重力差异。', 1
FROM subjects WHERE name = 'physics'
ON CONFLICT DO NOTHING;

INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '光的折射', '通过棱镜观察光的折射现象，学习彩虹的形成原理。', 2
FROM subjects WHERE name = 'physics'
ON CONFLICT DO NOTHING;

INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '简单电路', '连接电池、灯泡和开关，学习串联和并联电路的基础知识。', 1
FROM subjects WHERE name = 'physics'
ON CONFLICT DO NOTHING;

-- Insert sample experiments for Biology
INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '植物生长日记', '在加速时间中观察种子发芽、生根、长叶的全过程。', 1
FROM subjects WHERE name = 'biology'
ON CONFLICT DO NOTHING;

INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '微观世界', '使用虚拟显微镜观察洋葱表皮细胞和口腔上皮细胞。', 2
FROM subjects WHERE name = 'biology'
ON CONFLICT DO NOTHING;

-- Insert sample experiments for Geography
INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '火山爆发', '模拟火山喷发过程，了解岩浆、火山灰和地壳运动。', 3
FROM subjects WHERE name = 'geography'
ON CONFLICT DO NOTHING;

INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '水循环', '观察蒸发、凝结、降水的水循环过程，理解天气变化。', 1
FROM subjects WHERE name = 'geography'
ON CONFLICT DO NOTHING;

-- Insert sample experiments for Chemistry
INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '酸碱中和', '使用石蕊试纸和PH试纸测试不同溶液的酸碱度。', 2
FROM subjects WHERE name = 'chemistry'
ON CONFLICT DO NOTHING;

INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '分子工坊', '像搭积木一样搭建水分子、二氧化碳分子等常见分子结构。', 3
FROM subjects WHERE name = 'chemistry'
ON CONFLICT DO NOTHING;

-- Insert sample experiments for Engineering
INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '小小桥梁设计师', '设计并搭建一座桥梁，测试它的承重能力。', 2
FROM subjects WHERE name = 'engineering'
ON CONFLICT DO NOTHING;

INSERT INTO experiments (subject_id, title, description, difficulty_level)
SELECT id, '投石车攻城', '利用杠杆原理制作投石车，调整支点位置改变投射距离。', 2
FROM subjects WHERE name = 'engineering'
ON CONFLICT DO NOTHING;

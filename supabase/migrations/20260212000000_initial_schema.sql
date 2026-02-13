-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent')) DEFAULT 'student',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- 'physics', 'biology', 'geography', 'chemistry', 'engineering'
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create experiments table
CREATE TABLE IF NOT EXISTS experiments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content_url TEXT, -- Link to the simulation/game asset
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, experiment_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB, -- Flexible criteria definition
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read everyone's basic profile (for leaderboard/social), but only update their own
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subjects: Readable by everyone, Insert/Update only by service role (admin)
CREATE POLICY "Subjects are viewable by everyone" 
ON subjects FOR SELECT USING (true);

-- Experiments: Readable by everyone
CREATE POLICY "Experiments are viewable by everyone" 
ON experiments FOR SELECT USING (true);

-- User Progress: Users can see and update their own progress. Teachers/Parents might need access later (omitted for MVP simplicity)
CREATE POLICY "Users can view own progress" 
ON user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Achievements: Readable by everyone
CREATE POLICY "Achievements are viewable by everyone" 
ON achievements FOR SELECT USING (true);

-- User Achievements: Users can view their own. System (via functions or service role) inserts/updates.
CREATE POLICY "Users can view own achievements" 
ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON profiles TO authenticated;

GRANT SELECT ON subjects TO anon, authenticated;
GRANT SELECT ON experiments TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;

GRANT SELECT ON achievements TO anon, authenticated;
GRANT SELECT ON user_achievements TO authenticated;

-- Insert initial subjects data
INSERT INTO subjects (name, display_name, description) VALUES
('physics', '物理实验室', '探索力学、光学、电学和热学的奥秘'),
('biology', '生物实验室', '观察生命奥秘，探索动植物的世界'),
('geography', '地理探索室', '领略山川地貌，了解地球的脉动'),
('chemistry', '化学实验室', '体验物质变化的奇妙反应'),
('engineering', '工程设计室', '动手设计，创造未来的工程奇迹')
ON CONFLICT (name) DO NOTHING;

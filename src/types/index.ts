export type Role = 'student' | 'teacher' | 'parent';

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon_url: string | null;
}

export interface Experiment {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  content_url: string | null;
  difficulty_level: number;
}

import { create } from 'zustand';
import { supabase, hasSupabaseEnv } from '../lib/supabase';
import { Profile } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  lastProfileFetchTs?: number;
  roles: Array<{ id: string; role: 'student' | 'teacher' | 'parent'; status: 'active' | 'suspended' }>;
  currentRoleId: string | null;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  setCurrentRoleId: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  loading: true,
  roles: [],
  currentRoleId: null,
  initialize: async () => {
    try {
      if (!hasSupabaseEnv) {
        set({ loading: false, session: null, profile: null, roles: [], currentRoleId: null });
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });

      if (session) {
        const now = Date.now();
        let current = null as Profile | null;
        // simple cache: avoid refetch within 5 seconds
        set((s) => ({ lastProfileFetchTs: s.lastProfileFetchTs ?? 0 }));
        const shouldFetch =
          !useAuthStore.getState().profile ||
          !useAuthStore.getState().lastProfileFetchTs ||
          now - (useAuthStore.getState().lastProfileFetchTs ?? 0) > 5000;
        if (shouldFetch) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          current = profile as Profile | null;
          set({ profile: current, lastProfileFetchTs: now });
        }
        // load roles
        await useAuthStore.getState().fetchRoles();
        // restore currentRoleId
        const saved = localStorage.getItem('currentRoleId');
        if (saved) set({ currentRoleId: saved });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session });
        if (session) {
          const now = Date.now();
          const shouldFetch =
            !useAuthStore.getState().profile ||
            !useAuthStore.getState().lastProfileFetchTs ||
            now - (useAuthStore.getState().lastProfileFetchTs ?? 0) > 5000;
          if (shouldFetch) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            set({ profile, lastProfileFetchTs: now });
          }
          await useAuthStore.getState().fetchRoles();
        } else {
          set({ profile: null, roles: [], currentRoleId: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    if (!hasSupabaseEnv) {
      set({ session: null, profile: null });
      return;
    }
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // ignore aborted request caused by navigation
      } else {
        console.error('signOut error:', err);
      }
    }
    set({ session: null, profile: null });
    // audit
    import('../lib/audit').then(({ logAudit }) => logAudit('sign_out'));
  },
  fetchRoles: async () => {
    try {
      if (!hasSupabaseEnv || !useAuthStore.getState().session) {
        set({ roles: [] });
        return;
      }
      const uid = useAuthStore.getState().session!.user.id;
interface UserRoleData {
  id: string;
  role: 'student' | 'teacher' | 'parent';
  status: 'active' | 'suspended';
}

// ...

      const { data } = await supabase
        .from('user_roles')
        .select('id, role, status')
        .eq('user_id', uid);
      set({ roles: (data as unknown as UserRoleData[])?.map(r => ({ id: r.id, role: r.role, status: r.status })) ?? [] });
    } catch (e) {
      console.error('fetchRoles error:', e);
      set({ roles: [] });
    }
  },
  setCurrentRoleId: (id) => {
    set({ currentRoleId: id });
    if (id) localStorage.setItem('currentRoleId', id);
    else localStorage.removeItem('currentRoleId');
  },
}));

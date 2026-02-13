import { supabase } from '../lib/supabase';

export interface LogPayload {
  [key: string]: unknown;
}

// Simple in-memory throttle cache
const throttleCache: Record<string, number> = {};
// Increase throttle time to 1000ms for non-critical logs
const THROTTLE_MS = 1000;
// Allow burst of logs for critical actions
const CRITICAL_ACTIONS = ['start_simulation', 'reset', 'record_data', 'complete_challenge'];

export const logAction = async (experimentId: string, action: string, payload: LogPayload = {}) => {
  // Create a unique key for throttling based on experiment and action
  const throttleKey = `${experimentId}:${action}`;
  const now = Date.now();
  
  // Check if we should throttle this log
  const isCritical = CRITICAL_ACTIONS.includes(action);
  const throttleLimit = isCritical ? 0 : THROTTLE_MS; // No throttle for critical actions

  if (!isCritical && throttleCache[throttleKey] && now - throttleCache[throttleKey] < throttleLimit) {
    return;
  }
  
  // Update last log time
  throttleCache[throttleKey] = now;

  try {
    // 检查是否有 Supabase 连接
    if (!supabase) {
      console.warn('Supabase client not available, skipping log:', { experimentId, action, payload });
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    
    // 如果没有用户登录（例如在 Storybook 中），使用 mock 用户 ID
    const userId = userData.user?.id || '00000000-0000-0000-0000-000000000000';

    const { error } = await supabase.from('experiment_logs').insert({
      experiment_id: experimentId,
      action,
      payload,
      user_id: userId
    });

    if (error) {
      // 忽略特定的开发环境错误 (如表不存在)
      if (error.code === 'PGRST205') {
        console.warn('Log table not found (dev/storybook mode):', action);
      } else {
        console.error('Log action failed:', error);
      }
    }
  } catch (err) {
    console.error('Unexpected error logging action:', err);
  }
};

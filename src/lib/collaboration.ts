import { useEffect, useState, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useAuthStore } from '../store/authStore';

interface UserState {
  x: number;
  y: number;
  z: number;
  color: string;
  name: string;
}

export const useCollaboration = (roomId: string) => {
  const { profile } = useAuthStore();
  const [peers, setPeers] = useState<Record<string, UserState>>({});
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!profile || !roomId) return;

    // 随机颜色
    const myColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    const channel = supabase.channel(`room-${roomId}`, {
      config: {
        presence: {
          key: profile.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users: Record<string, UserState> = {};
        
        Object.keys(newState).forEach(key => {
          if (key === profile.id) return; // 跳过自己
          const userState = newState[key][0] as unknown as UserState;
          if (userState) {
            users[key] = {
              x: userState.x || 0,
              y: userState.y || 0,
              z: userState.z || 0,
              color: userState.color || '#ccc',
              name: userState.name || 'Anonymous'
            };
          }
        });
        setPeers(users);
      })
      .on('broadcast', { event: 'pos' }, ({ payload }) => {
        // 实时位置更新 (低延迟)
        setPeers(prev => ({
          ...prev,
          [payload.userId]: {
            ...prev[payload.userId],
            x: payload.x,
            y: payload.y,
            z: payload.z
          }
        }));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            name: profile.full_name,
            color: myColor,
            x: 0, y: 0, z: 0
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, profile]);

  const broadcastPosition = (x: number, y: number, z: number) => {
    if (channelRef.current && profile) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'pos',
        payload: { userId: profile.id, x, y, z }
      });
    }
  };

  return { peers, broadcastPosition };
};

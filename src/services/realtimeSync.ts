import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type RealtimeConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

class RealtimeSyncManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private statusListeners: Set<(status: RealtimeConnectionStatus) => void> = new Set();
  private currentStatus: RealtimeConnectionStatus = 'disconnected';

  public addStatusListener(cb: (status: RealtimeConnectionStatus) => void): () => void {
    this.statusListeners.add(cb);
    cb(this.currentStatus);
    return () => {
      this.statusListeners.delete(cb);
    };
  }

  private setStatus(status: RealtimeConnectionStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  public subscribeToChannel(
    channelName: string,
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    callback: (payload: any) => void
  ): () => void {
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
      this.channels.delete(channelName);
    }

    this.setStatus('connecting');

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.setStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          this.setStatus('disconnected');
        }
      });

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
      if (this.channels.size === 0) {
        this.setStatus('disconnected');
      }
    };
  }

  public unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
    this.setStatus('disconnected');
  }
}

export const realtimeSyncManager = new RealtimeSyncManager();

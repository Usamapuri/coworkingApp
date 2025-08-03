import { createClient } from '@supabase/supabase-js';
import session from 'express-session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grrwjmuosgwoayqytodc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycndqbXVvc2d3b2F5cXl0b2RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA2NjA3NSwiZXhwIjoyMDY5NjQyMDc1fQ.hmaLXUyDbQpIJKmXrdQcC45to3MmWyFriOrHcvA6q_w';

const supabase = createClient(supabaseUrl, supabaseKey);

interface SessionData {
  sid: string;
  sess: string;
  expire: Date;
}

export class SupabaseSessionStore extends session.Store {
  private ttl: number;

  constructor(options: { ttl?: number } = {}) {
    super();
    this.ttl = options.ttl || 86400; // 24 hours default
  }

  async get(sid: string, callback: (err: any, session?: any) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('sess, expire')
        .eq('sid', sid)
        .single();

      if (error || !data) {
        return callback(null, null);
      }

      // Check if session has expired
      if (new Date(data.expire) < new Date()) {
        // Delete expired session
        await this.destroy(sid);
        return callback(null, null);
      }

      const session = JSON.parse(data.sess);
      callback(null, session);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid: string, session: any, callback?: (err?: any) => void): Promise<void> {
    try {
      const expire = new Date(Date.now() + this.ttl * 1000);
      const sess = JSON.stringify(session);

      const { error } = await supabase
        .from('sessions')
        .upsert({
          sid,
          sess,
          expire: expire.toISOString()
        }, {
          onConflict: 'sid'
        });

      if (error) {
        throw error;
      }

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('sid', sid);

      if (error) {
        throw error;
      }

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async touch(sid: string, session: any, callback?: (err?: any) => void): Promise<void> {
    try {
      const expire = new Date(Date.now() + this.ttl * 1000);
      const sess = JSON.stringify(session);

      const { error } = await supabase
        .from('sessions')
        .update({
          sess,
          expire: expire.toISOString()
        })
        .eq('sid', sid);

      if (error) {
        throw error;
      }

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async all(callback: (err: any, sessions?: any) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('sid, sess, expire');

      if (error) {
        throw error;
      }

      const sessions: { [key: string]: any } = {};
      const now = new Date();

      for (const row of data || []) {
        if (new Date(row.expire) > now) {
          sessions[row.sid] = JSON.parse(row.sess);
        }
      }

      callback(null, sessions);
    } catch (error) {
      callback(error);
    }
  }

  async clear(callback?: (err?: any) => void): Promise<void> {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .neq('sid', ''); // Delete all sessions

      if (error) {
        throw error;
      }

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async length(callback: (err: any, length?: number) => void): Promise<void> {
    try {
      const { count, error } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      callback(null, count || 0);
    } catch (error) {
      callback(error);
    }
  }
} 
/**
 * Supabase Client Configuration
 * 
 * For production deployment:
 * 1. Install @supabase/supabase-js: npm install @supabase/supabase-js
 * 2. Set environment variables in .env.local
 * 3. Uncomment the real initialization code below
 * 
 * For development without Supabase, this provides a localStorage fallback.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For production use, uncomment and install @supabase/supabase-js
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Mock Supabase client for development/testing
 * Provides basic CRUD operations using localStorage
 */
export const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (field, value) => ({
        single: async () => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const item = data.find(d => d[field] === value);
          return { data: item, error: null };
        },
        maybeSingle: async () => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const item = data.find(d => d[field] === value);
          return { data: item || null, error: null };
        },
        then: async (callback) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const filtered = data.filter(d => d[field] === value);
          return callback({ data: filtered, error: null });
        },
      }),
      then: async (callback) => {
        const data = JSON.parse(localStorage.getItem(table) || '[]');
        return callback({ data, error: null });
      },
    }),
    insert: (values) => ({
      select: () => ({
        then: async (callback) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const arrayValues = Array.isArray(values) ? values : [values];
          arrayValues.forEach(v => {
            v.id = v.id || crypto.randomUUID();
            data.push(v);
          });
          localStorage.setItem(table, JSON.stringify(data));
          return callback({ data: arrayValues, error: null });
        },
      }),
    }),
    update: (values) => ({
      eq: (field, value) => ({
        select: () => ({
          then: async (callback) => {
            const data = JSON.parse(localStorage.getItem(table) || '[]');
            const index = data.findIndex(d => d[field] === value);
            if (index >= 0) {
              data[index] = { ...data[index], ...values };
              localStorage.setItem(table, JSON.stringify(data));
              return callback({ data: [data[index]], error: null });
            }
            return callback({ data: [], error: 'Not found' });
          },
        }),
      }),
    }),
    upsert: (values) => ({
      select: () => ({
        then: async (callback) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const arrayValues = Array.isArray(values) ? values : [values];
          arrayValues.forEach(v => {
            const index = data.findIndex(d => d.id === v.id);
            if (index >= 0) {
              data[index] = { ...data[index], ...v };
            } else {
              v.id = v.id || crypto.randomUUID();
              data.push(v);
            }
          });
          localStorage.setItem(table, JSON.stringify(data));
          return callback({ data: arrayValues, error: null });
        },
      }),
    }),
    delete: () => ({
      eq: (field, value) => ({
        then: async (callback) => {
          const data = JSON.parse(localStorage.getItem(table) || '[]');
          const filtered = data.filter(d => d[field] !== value);
          localStorage.setItem(table, JSON.stringify(filtered));
          return callback({ data: filtered, error: null });
        },
      }),
    }),
  }),
  
  auth: {
    getSession: async () => {
      const session = JSON.parse(localStorage.getItem('auth_session') || 'null');
      return { data: { session }, error: null };
    },
    signUp: async (credentials) => {
      return { data: { user: credentials }, error: null };
    },
    signInWithPassword: async (credentials) => {
      return { data: { user: credentials }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('auth_session');
      return { error: null };
    },
  },
};

export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseAnonKey;

export default supabase;

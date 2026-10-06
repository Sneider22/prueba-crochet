import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si las variables no están disponibles, exportamos un cliente nulo para evitar crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables de Supabase no encontradas. El catálogo usará los productos locales.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

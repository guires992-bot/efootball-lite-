import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_CUSTOM_URL = 'efootball_supabase_custom_url';
const STORAGE_KEY_CUSTOM_KEY = 'efootball_supabase_custom_key';

export interface SupabaseDiagnostic {
  status: 'valid' | 'missing' | 'invalid_url_token' | 'invalid_url_format' | 'placeholder_value';
  message: string;
}

// Read from Vite environment variables or custom local storage override
export function getActiveSupabaseConfig(): {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  isLocalOverride: boolean;
  diagnostic: SupabaseDiagnostic;
} {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CUSTOM_URL) : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CUSTOM_KEY) : null;

  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '';

  const isLocalOverride = Boolean(customUrl && customKey);
  const url = (customUrl || envUrl || '').trim();
  const anonKey = (customKey || envKey || '').trim();

  let diagnostic: SupabaseDiagnostic;

  if (!url && !anonKey) {
    diagnostic = {
      status: 'missing',
      message: 'Variables Supabase absentes. Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans Netlify ou dans un fichier .env.',
    };
  } else if (!url) {
    diagnostic = {
      status: 'missing',
      message: 'VITE_SUPABASE_URL est manquante. Renseigne l\'URL de ton projet Supabase (https://<id>.supabase.co).',
    };
  } else if (!anonKey) {
    diagnostic = {
      status: 'missing',
      message: 'VITE_SUPABASE_ANON_KEY est manquante. Copie la clé anon public depuis Project Settings > API.',
    };
  } else if (url.includes('your-project') || anonKey.includes('your-anon-public-key')) {
    diagnostic = {
      status: 'placeholder_value',
      message: 'Les identifiants Supabase contiennent encore les valeurs d\'exemple par défaut.',
    };
  } else if (
    url.startsWith('sb_publishable_') ||
    url.startsWith('sb_secret_') ||
    url.startsWith('eyJ')
  ) {
    diagnostic = {
      status: 'invalid_url_token',
      message: `La valeur fournie dans VITE_SUPABASE_URL ("${url.slice(0, 16)}...") est une clé ou un jeton, et non une URL HTTP(S) de projet. L'URL doit être au format https://<id-du-projet>.supabase.co.`,
    };
  } else if (!url.startsWith('https://') && !url.startsWith('http://')) {
    diagnostic = {
      status: 'invalid_url_format',
      message: 'L\'URL Supabase doit débuter par https:// (ex: https://monprojet.supabase.co).',
    };
  } else if (anonKey.length < 20) {
    diagnostic = {
      status: 'placeholder_value',
      message: 'La clé publique anon Supabase semble trop courte (moins de 20 caractères).',
    };
  } else {
    diagnostic = {
      status: 'valid',
      message: 'Configuration Supabase valide et prête.',
    };
  }

  const isConfigured = diagnostic.status === 'valid';

  return { url, anonKey, isConfigured, isLocalOverride, diagnostic };
}

export function setCustomSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, anonKey.trim());
    supabaseInstance = null; // reset cached instance
    window.location.reload();
  }
}

export function clearCustomSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_URL);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_KEY);
    supabaseInstance = null;
    window.location.reload();
  }
}

// Global Supabase client instance
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getActiveSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

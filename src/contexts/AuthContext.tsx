import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, getActiveSupabaseConfig, SupabaseDiagnostic } from '../lib/supabaseClient';
import { UserProfile, UserStatsSummary, SyncStatus } from '../types/auth';
import {
  fetchOnlineUserProfile,
  syncOnlineDataToLocal,
  migrateLocalDataToSupabase,
} from '../services/syncService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  isLocalOverride: boolean;
  diagnostic: SupabaseDiagnostic;
  syncStatus: SyncStatus;
  syncError: string | null;
  userStats: UserStatsSummary | null;
  signUp: (email: string, password: string, username: string, avatarUrl?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateUserProfile: (username: string, avatarUrl: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  triggerSync: () => Promise<void>;
  importLocalData: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for human-readable error messages in French
function formatAuthError(err: any): string {
  if (!err) return 'Une erreur inconnue est survenue.';
  const msg = (err.message || '').toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Adresse e-mail ou mot de passe incorrect. Vérifie tes identifiants.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Cette adresse e-mail est déjà utilisée par un autre joueur.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Adresse e-mail non confirmée. Vérifie ta boîte de réception pour valider ton compte.';
  }
  if (msg.includes('password should be at least')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Trop de tentatives rapprochées. Patiente quelques instants avant de réessayer.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Impossible de contacter le serveur Supabase. Vérifie ta connexion Internet.';
  }
  return err.message || 'Une erreur est survenue lors de l\'opération.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStatsSummary | null>(null);

  const { isConfigured, isLocalOverride, diagnostic } = getActiveSupabaseConfig();
  const supabase = getSupabaseClient();

  // Load active session and profile
  const loadUserSession = async () => {
    if (!supabase || !isConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const p = await fetchOnlineUserProfile(currentSession.user.id);
        setProfile(p);
        // Sync online data
        setSyncStatus('syncing');
        const syncResult = await syncOnlineDataToLocal(currentSession.user.id);
        if (syncResult.success) {
          setSyncStatus('synced');
          setUserStats(syncResult.stats);
        } else {
          setSyncStatus('error');
          setSyncError(syncResult.error || 'Erreur de synchronisation');
        }
      }
    } catch (err: any) {
      console.warn('Error loading session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserSession();

    if (!supabase || !isConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await fetchOnlineUserProfile(newSession.user.id);
        setProfile(p);
        const syncResult = await syncOnlineDataToLocal(newSession.user.id);
        if (syncResult.success) {
          setSyncStatus('synced');
          setUserStats(syncResult.stats);
        }
      } else {
        setProfile(null);
        setUserStats(null);
        setSyncStatus('idle');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  // Sign up
  const signUp = async (email: string, password: string, username: string, avatarUrl: string = 'avatar-1') => {
    if (!supabase || !isConfigured) {
      return { error: 'Supabase n’est pas encore configuré. Renseigne tes clés d’API.' };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            avatar_url: avatarUrl,
          },
        },
      });

      if (error) {
        return { error: formatAuthError(error) };
      }

      // If user profile wasn't auto-created by trigger yet (e.g. before email confirmation), try to insert manually
      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: username.trim(),
            avatar_url: avatarUrl,
            xp: 0,
            level_tier: 'Espoir en Formation',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        const p = await fetchOnlineUserProfile(data.user.id);
        setProfile(p);
      }

      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    if (!supabase || !isConfigured) {
      return { error: 'Supabase n’est pas configuré. Active tes clés pour te connecter.' };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: formatAuthError(error) };
      }

      if (data.user) {
        const p = await fetchOnlineUserProfile(data.user.id);
        setProfile(p);
        setSyncStatus('syncing');
        const syncResult = await syncOnlineDataToLocal(data.user.id);
        if (syncResult.success) {
          setSyncStatus('synced');
          setUserStats(syncResult.stats);
        }
      }

      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    if (!supabase) return;
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserStats(null);
      setSyncStatus('idle');
    } catch (err) {
      console.warn('Error signing out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPasswordForEmail = async (email: string) => {
    if (!supabase || !isConfigured) {
      return { error: 'Supabase n’est pas configuré.' };
    }

    try {
      const redirectUrl = `${window.location.origin}/#reinitialisation`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
      if (error) return { error: formatAuthError(error) };
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  // Update password
  const updateUserPassword = async (newPassword: string) => {
    if (!supabase || !isConfigured) {
      return { error: 'Supabase n’est pas configuré.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: formatAuthError(error) };
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  // Update profile
  const updateUserProfile = async (username: string, avatarUrl: string) => {
    if (!supabase || !isConfigured || !user) {
      return { error: 'Action non disponible : utilisateur non connecté.' };
    }

    try {
      // Check if username changed and is already taken
      if (profile && profile.username !== username) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username.trim())
          .neq('id', user.id)
          .maybeSingle();

        if (existing) {
          return { error: 'Ce pseudonyme est déjà pris par un autre compétiteur.' };
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) return { error: formatAuthError(error) };

      // Refresh local profile state
      const updated = await fetchOnlineUserProfile(user.id);
      setProfile(updated);
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchOnlineUserProfile(user.id);
    setProfile(p);
  };

  const triggerSync = async () => {
    if (!user) return;
    setSyncStatus('syncing');
    setSyncError(null);
    const res = await syncOnlineDataToLocal(user.id);
    if (res.success) {
      setSyncStatus('synced');
      setUserStats(res.stats);
    } else {
      setSyncStatus('error');
      setSyncError(res.error || 'Erreur');
    }
  };

  const importLocalData = async () => {
    if (!user) {
      return { success: false, message: 'Connecte-toi pour importer tes données locales.' };
    }
    setSyncStatus('syncing');
    const res = await migrateLocalDataToSupabase(user.id);
    if (res.success) {
      await triggerSync();
      return res;
    } else {
      setSyncStatus('error');
      setSyncError(res.message);
      return res;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured,
        isLocalOverride,
        diagnostic,
        syncStatus,
        syncError,
        userStats,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
        updateUserProfile,
        refreshProfile,
        triggerSync,
        importLocalData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

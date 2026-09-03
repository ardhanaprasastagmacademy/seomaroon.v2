import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.PUBLIC_SUPABASE_URL || 'https://wycnbdiivphkpwsfwcvj.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y25iZGlpdnBoa3B3c2Z3Y3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0Mjk1OTgsImV4cCI6MjEwNDAwNTU5OH0.iCpG72WB1KN-jxGue_g-YlZsK-1coGMgHMwdTxKRiKY';

// Create Supabase client — used for data sync operations only (no login required)
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,      // No session management needed (login disabled)
    autoRefreshToken: false,    // No token refresh needed
    detectSessionInUrl: false,  // No OAuth callback detection needed
  },
});

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * Lightweight AuthService — login is disabled.
 * This exists purely to maintain API compatibility with store.ts
 * No network requests are made on initialization.
 */
class AuthService {
  private user: User | null = null;
  private session: Session | null = null;
  private isLoading = false;
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    // No-op: login is disabled, no session to verify
    this.isLoading = false;
  }

  private notify() {
    const state: AuthState = {
      user: this.user,
      session: this.session,
      isLoading: this.isLoading,
    };
    this.listeners.forEach(cb => cb(state));
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    listener({
      user: this.user,
      session: this.session,
      isLoading: this.isLoading,
    });
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getUser(): User | null {
    return this.user;
  }

  public getSession(): Session | null {
    return this.session;
  }

  public isLoadingState(): boolean {
    return this.isLoading;
  }

  /**
   * Google OAuth — disabled. Kept for API compatibility.
   */
  public async signInWithGoogle(_redirectTo?: string) {
    console.warn('Google Sign-In is disabled.');
    return undefined;
  }

  /**
   * Sign out — disabled. Kept for API compatibility.
   */
  public async signOut() {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

export const authService = new AuthService();

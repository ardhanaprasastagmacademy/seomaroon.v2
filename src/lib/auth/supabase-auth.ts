import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env?.PUBLIC_SUPABASE_URL || 'https://wycnbdiivphkpwsfwcvj.supabase.co';
const rawKey = (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y25iZGlpdnBoa3B3c2Z3Y3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0Mjk1OTgsImV4cCI6MjEwNDAwNTU5OH0.iCpG72WB1KN-jxGue_g-YlZsK-1coGMgHMwdTxKRiKY';
const SUPABASE_URL = String(rawUrl).trim();
const SUPABASE_ANON_KEY = String(rawKey).trim();

// Create Supabase client with active session persistence
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

class AuthService {
  private user: User | null = null;
  private session: Session | null = null;
  private isLoading = true;
  private listeners: Set<(state: AuthState) => void> = new Set();
  private isInitialized = false;
  private isRegistering = false;

  constructor() {
    this.init();
  }

  private async init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      // 1. Check existing session
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        this.session = data.session;
        this.user = data.session.user;
      }
      if (error) {
        console.warn('Initial session check error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase auth getSession failed:', e);
    } finally {
      this.isLoading = false;
      this.notify();
    }

    // 2. Listen to real-time auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (this.isRegistering) {
        // Suppress automatic login notifications while registering a new account
        return;
      }
      this.session = session;
      this.user = session?.user || null;
      this.isLoading = false;
      this.notify();
    });
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
   * Register with Email & Password
   * Note: Does NOT automatically log the user in. The session is cleared so user must login explicitly.
   */
  public async signUpWithEmail(email: string, password: string, fullName?: string) {
    this.isRegistering = true;
    this.isLoading = true;
    this.notify();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      // Strict Unique Email Protection:
      // If an email is already registered in Supabase, data.user.identities will be an empty array []
      if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
        throw new Error('Email ini sudah terdaftar. 1 email hanya dapat digunakan untuk 1 akun unik. Silakan masuk (login) ke akun Anda.');
      }

      // Explicitly sign out if Supabase automatically created a session.
      // User must manually log in after receiving the success notification.
      if (data?.session) {
        await supabase.auth.signOut();
      }
      this.session = null;
      this.user = null;

      return data;
    } finally {
      this.isRegistering = false;
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Login with Email & Password
   */
  public async signInWithEmail(email: string, password: string) {
    this.isLoading = true;
    this.notify();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (data.session) {
        this.session = data.session;
        this.user = data.session.user;
      }
      return data;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Resend confirmation email
   */
  public async resendConfirmationEmail(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
    });
    if (error) throw error;
    return data;
  }

  /**
   * Sign out
   */
  public async signOut() {
    this.isLoading = true;
    this.notify();

    try {
      await supabase.auth.signOut();
      this.user = null;
      this.session = null;
    } catch (e) {
      console.warn('Sign out error:', e);
      this.user = null;
      this.session = null;
    } finally {
      this.isLoading = false;
      this.notify();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }
}

export const authService = new AuthService();

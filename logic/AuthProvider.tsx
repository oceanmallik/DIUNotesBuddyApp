// app/(logic)/AuthProvider.tsx
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Define what information we want to share across the app
type AuthProps = {
  user: User | null;
  session: Session | null;
  initialized: boolean;
};

// Create the Context
const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to make it easy to use this context in your screens
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if the user is already logged in when the app starts
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setInitialized(true);
    };
    checkSession();

    // 2. Listen for any changes (like the user clicking 'Log Out' or completing a Google Sign-In)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Cleanup the listener when the app closes
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}
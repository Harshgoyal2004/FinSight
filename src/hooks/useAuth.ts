
// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting the user and setLoading(false)
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false); // Ensure loading is false on error
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth); // Use the aliased firebaseSignOut
      // onAuthStateChanged will handle setting the user to null and setLoading(false)
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false); // Ensure loading is false on error
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

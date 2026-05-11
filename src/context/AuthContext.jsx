import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session ?? null);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("initSession error:", err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadCompany() {
      if (!user?.id) {
        setCompany(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("owner_user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("loadCompany error:", error);
          setCompany(null);
          return;
        }

        setCompany(data || null);
      } catch (err) {
        console.error("loadCompany unexpected error:", err);
        setCompany(null);
      }
    }

    loadCompany();
  }, [user]);

  async function logout() {
    try {
      await supabase.auth.signOut();
    } finally {
      setSession(null);
      setUser(null);
      setCompany(null);
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      session,
      user,
      company,
      loading,
      logout,
    }),
    [session, user, company, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
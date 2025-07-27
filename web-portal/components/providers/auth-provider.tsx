"use client";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null; // Replace 'any' with proper Supabase user type
  loading: boolean;
  toggleLoading: Dispatch<SetStateAction<boolean>>; // Optional function to toggle loading state
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true,toggleLoading:() => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Fetch initial user session
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setLoading(false);
        // router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes (e.g., sign-out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setLoading(false);
        // router.push("/login");
      } else if (event === "SIGNED_IN") {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return <AuthContext.Provider value={{ user, loading,toggleLoading: setLoading}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
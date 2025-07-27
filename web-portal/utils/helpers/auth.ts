import { RegisterFormInputsType, LoginFormInputsType } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export async function registerUser(data: RegisterFormInputsType) {
  try {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          full_name: data.full_name,
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (
      authData?.user &&
      authData.user.identities &&
      authData.user.identities.length > 0
    ) {
      return {
        success: true,
        message: "Registration successful! You can now login",
      };
    } else {
      return {
        success: false,
        message:
          "This email is already registered. Please sign in or use a different email.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signInWithPassword(data: LoginFormInputsType) {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Login successful!" };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred, Try Again!",
    };
  }
}

// utils/helpers/auth.ts
export async function oAuthentication(provider: "google" | "github") {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options:{
        redirectTo:`${process.env.NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL}`
      }
    
    });
    
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: "An unexpected error occurred." };
  }
}
export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return null;
  } else {
    return session;
  }
}
export async function signOut() {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, message: "Error signing out: " + error.message };
    }
    return { success: true, message: "Signed out successfully!" };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Try Again",
    };
  }
}

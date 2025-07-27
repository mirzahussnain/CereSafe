
import { createClient } from "@/lib/supabase/client";
import { UserProfileType } from "@/lib/types";
import { User } from "@supabase/supabase-js";

export async function uploadAvatarImage(file: File, user: User) {
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: signedData, error: signedError } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 60 * 60);

    if (signedError || !signedData?.signedUrl) throw signedError;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: filePath },
    });

    if (updateError) throw updateError;

    return {
      success: 1,
      message: "Avatar updated!",
      url: signedData.signedUrl,
    };
  } catch (error) {
    console.error(error);
    return { success: 0, message: "Failed to upload avatar.", url: null };
  }
}

export async function updateAccountDetails(newData: UserProfileType) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.updateUser({
      data: {
        full_name: newData.full_name,
        username: newData.username,
      },
    });
    if (!error) {
      return { success: 1, message: "Details Updated", data: user };
    } else {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    return { success: 0, message: "Failed to update details", data: null };
  }
}

export async function removeAccount(apiPath: string | undefined) {
  if (!apiPath) return { success: 0, message: "API path not found" };

  try {
    const supabase = createClient();

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (sessionError || userError || !sessionData.session || !userData.user) {
      return { success: 0, message: "Not Authenticated. Invalid session or user." };
    }

    const avatar_path = userData.user.user_metadata?.avatar_url || "";
    const user_id = userData.user.id;

    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session.access_token}`,
      },
      body: JSON.stringify({ avatar_path, user_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: 0, message: `Failed: ${errorText}` };
    }

    const resultText = await response.text(); 
    return { success: 1, message: resultText || "User Account Deleted Successfully." };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: 0, message: "Failed to delete account" };
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
   
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

   
    if (authError || !user?.id) {
      return NextResponse.json(
        { success: 0, message: "Authentication required" },
        { status: 401 }
      );
    }
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

     return NextResponse.json(
      { 
        success: 1, 
        data,
      },
      { status: 200 }
    );

  } catch (error:any) {
     return NextResponse.json(
      { 
        success: 0,
        message: `${error?.message}`,
      
      },
      { status: 500 }
    );
  }
}

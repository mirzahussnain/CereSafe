import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        const supabase=await createClient()
        const {data:{user}}=await supabase.auth.getUser();
        if(!user){
            const result=await supabase.from("advices").select("risk_level,advices,description").eq("risk_factor","general")
            if(result.status===200){
                return {success:1,data:result.data,message:"General recommendation fetched successfully."}
            }
            else{
                throw new Error(`Failed to Fetch Recommendations:${result.error}`)
            }
        }
        else{
            const result=await supabase.from("recommendations").select("risk_level,advices,description,risk_factor").not("risk_factor", "eq", "general")
            if(result.status===200){
                
                return NextResponse.json({success:1, data:result.data,message:"Personalized recommendation fetched successfully"})
            }
            else{
                throw new Error(`Failed to Fetch Recommendations:${result.error}`)
            }
        }
    }catch(error:any){
        return NextResponse.json({success:0,message:`${error.message}`})
    }
}
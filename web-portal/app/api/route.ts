import { NextResponse } from "next/server"

export async function GET(request:Request){
    return NextResponse.json({success:1,message:"Welcome To CeraSafe Api"})
}
"use client";
import { Home } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Loader } from "./loader";
import { useAuth } from "../providers/auth-provider";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [avatarUrl,setAvatarUrl]=useState<string | null>()
  const {user,loading}=useAuth();
  const supabase=createClient()
  const currentPath =
    pathname === "/dashboard"
      ? "Overview"
      : `${pathname.slice(11).charAt(0).toUpperCase()}${pathname.slice(12)}`;



  useEffect(()=>{
    if(user){
       const fetchAvatar = async () => {
        const avatarPath:string = user.user_metadata.avatar_url;
        if (!avatarPath) return;

        if(avatarPath.startsWith("http")){
            setAvatarUrl(avatarPath)
           
        }
        else{
            
            const { data, error } = await supabase.storage
              .from("avatars")
              .createSignedUrl(avatarPath, 60 * 60);
    
            if (!error && data?.signedUrl) {
              setAvatarUrl(data.signedUrl);
            }
          };
        }
        fetchAvatar();
    }
  },[user])


  if(loading) return <Loader/>
  if (!user) {
    return null; // Redirect handled by useAuth
  }
  return (
    <header className="w-full p-2  flex justify-between items-center">
      <div className="font-semibold text-primary/40 flex gap-1.5 p-3 items-center">
        <Home size={15} />
        <span>/</span>
        <span>Dashboard</span>
        <span>/</span>
        <span className="font-bold">{currentPath}</span>
      </div>
      <div className="flex items-center gap-2">
        {
          avatarUrl ? (

            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
            />
          ):(
            <Image src={"/avatar.jpg"}  alt="User Avatar"  width={40}
              height={40}  className="rounded-full"/>
          )
        }
      </div>
    </header>
  );
}

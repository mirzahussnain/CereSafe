"use client";

import { Loader } from "@/components/layout/loader";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { UserProfileType } from "@/lib/types";
import { removeAccount, updateAccountDetails, uploadAvatarImage } from "@/utils/helpers/account-handling";
import { BasicUserProfileSchema } from "@/utils/helpers/schema-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AccountSettings() {
  const supabase = createClient();
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, loading,toggleLoading } = useAuth();
  
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const form = useForm<UserProfileType>({
    resolver: zodResolver(BasicUserProfileSchema),
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 1_000_000) {
      toast.error("File is too large. Max size is 1MB.");
      return;
    }
    setUploading(true);

    try {
      const response=await uploadAvatarImage(file,user)
      if(response.success && response.url){
        setAvatarUrl(response.url);
        toast.success(response.message)
      }
      else{
        throw new Error(response.message)
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: UserProfileType) => {
    toggleLoading(true);
    const result=await updateAccountDetails(data)
    if(result.success && result.data){
        form.setValue("username",data.username)
        form.setValue("full_name",data.full_name)
        form.setValue("email",data.email)
        toast.success(result.message)
        setIsEditable(false)
        toggleLoading(false)
    }
    else{
        toast.error(result.message)
        toggleLoading(false)
    }
  };

  const handleAccountRemoval=async()=>{
    if(!user) return 
    const apiPath=process.env.NEXT_PUBLIC_SUPABASE_DELETE_USER
    const choice=window.confirm("Are you sure to delete the account?")
    if(choice){
        toggleLoading(true)
        const response=await removeAccount(apiPath);
        if(response.success){
            toggleLoading(false)
            toast.success(response.message)
            await supabase.auth.signOut();
            redirect("/")
            
        }
        else{
            toggleLoading(false)
            toast.error(response.message)
        }
    }
  }

  useEffect(() => {
    if (user) {
      form.setValue("id", user.id);
      form.setValue("username", user.user_metadata.username || "");
      form.setValue("full_name", user.user_metadata.full_name || "");
      form.setValue("email", user.email || "");

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
  }, [user]);

  if (loading || !user || form.formState.isLoading)
    return <Loader />;

  return (
    <div className="w-[350px] md:w-4xl md:max-w-5xl lg:w-5xl lg:max-w-6xl max-w-xl py-3 px-2 bg-overlay-2/60 mx-auto my-auto rounded-xl flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col items-center gap-4">
        {avatarUrl  ? (
          <Image
            src={avatarUrl}
            width={160}
            height={140}
            className="rounded-full object-cover w-38 h-38"
            alt="User Avatar"
            priority
          />
        ) : (
          <div className="rounded-full w-24 h-24 bg-neutral-400/50 flex items-center justify-center text-sm text-secondary-foreground/50">
            No Photo
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            className="px-7 py-2 text-sm tracking-wider mx-auto bg-secondary-foreground text-secondary cursor-pointer hover:bg-secondary-foreground/80"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          <Button variant={"destructive"} className="cursor-pointer"
          onClick={handleAccountRemoval}>
            Delete Account
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <Card className="w-full px-4 bg-white dark:bg-black/60 relative">
        <CardHeader className="text-center align-text-top">
          <CardTitle className="text-lg font-medium text-primary-foreground -mb-5 tracking-wider italic">
            Profile Details
          </CardTitle>
        </CardHeader>

        <CardContent className="border-y-2 border-primary rounded-b-2xl rounded-t-2xl py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:space-x-4"
            >
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your Full Name"
                        {...field}
                        className="w-full"
                        disabled={!isEditable}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your Username"
                        {...field}
                        className="w-full"
                        disabled={!isEditable}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-3">
                    <FormLabel className="text-secondary">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        {...field}
                        className="w-full"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="col-span-full mx-auto px-5 cursor-pointer bg-secondary text-secondary-foreground"
                disabled={!isEditable}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>

        <Button
          size="sm"
          className="absolute top-2 right-3 cursor-pointer bg-accent-foreground/60"
          onClick={() => setIsEditable((prev) => !prev)}
        >
          <Edit />
        </Button>
      </Card>
    </div>
  );
}

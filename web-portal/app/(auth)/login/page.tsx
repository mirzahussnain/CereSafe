'use client';
import OAuth from '@/components/layout/OAuth';
import { LoginFormInputsType } from '@/lib/types';
import { signInWithPassword } from '@/utils/helpers/auth';
import { loginSchema } from '@/utils/helpers/schema-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed, User } from 'lucide-react';
import Link from 'next/link';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Login() {
  const [displayPassword, setDisplayPassword] = useState(false);
  const router = useRouter();
  const searchParams=useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputsType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const onSubmit = async (data: LoginFormInputsType) => {
    try{
      const result=await signInWithPassword(data);
      if(result.success){
        toast.success("Login is Successful",{duration:2000})
        setTimeout(()=>{
          reset();
          router.push("/dashboard");
        },1500)
      }
      else{
        toast.error(result.message)
      }
    }catch(error){
      toast.error("An unexpected error occured. Try Again")
    }
    
  };

 

  return (
    <div className="w-full p-[20px] md:p-0 flex justify-center items-center min-h-full bg-background/20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-[450px] backdrop-blur-[25px] border-primary rounded-2xl pt-[7.5em] pr-[1.5em] md:pr-[1.5em] pb-[4em] pl-[1.5em] md:pl-[2.5em] text-foreground shadow-[0_0_10px_2px] shadow-overlay-2"
      >
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-overlay-2 w-[140px] h-[70px] rounded-b-2xl 
          before:content-[''] before:absolute before:-top-[0.2px] before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent before:shadow-[15px_0_0_0] before:shadow-overlay-2/90
          after:content-[''] after:absolute after:-top-[0.2px] after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent after:shadow-[-15px_0_0_0] after:shadow-overlay-2/90"
        >
          <span className="text-[30px] text-foreground">Login</span>
        </div>
        <OAuth />
        <div className="w-full flex items-center gap-2 my-4">
          <span className="flex-grow border-t border-overlay-2"></span>
          <span className="text-sm sm:text-base text-foreground">OR</span>
          <span className="flex-grow border-t border-overlay-2"></span>
        </div>
        <div className="relative flex flex-col my-[20px] mx-0">
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full h-[55px] text-[16px] bg-transparent text-foreground py-[20px] px-[50px] border-2 border-overlay-2 rounded-3xl outline-none mb-[10px] peer"
            required
          />
          <label
            htmlFor="email"
            className={`${
              !watchedEmail
                ? 'absolute top-[15px] left-[20px]'
                : 'absolute -top-[10px] left-[20px] text-[14px] bg-overlay-2 rounded-[30px] text-foreground py-0 px-[10px]'
            } pointer-events-none transition-all duration-200`}
          >
            Email
          </label>
          <User className="absolute top-[18px] right-[25px] text-[20px]" />
          {errors.email && <p className="text-sm text-red-500 mt-1 ml-2">{errors.email.message}</p>}
        </div>
        <div className="relative flex flex-col my-[20px] mx-0">
          <input
            type={displayPassword ? 'text' : 'password'}
            id="password"
            {...register('password')}
            className="w-full h-[55px] text-[16px] bg-transparent text-foreground py-[20px] px-[50px] border-2 border-overlay-2 rounded-3xl outline-none mb-[10px] peer"
            required
          />
          <label
            htmlFor="password"
            className={`${
              !watchedPassword
                ? 'absolute top-[15px] left-[20px]'
                : 'absolute -top-[10px] left-[20px] text-[14px] bg-overlay-2 rounded-[30px] text-foreground py-0 px-[10px]'
            } pointer-events-none transition-all duration-200`}
          >
            Password
          </label>
           <button
            type="button"
            className="absolute md:hidden top-[18px] right-[25px] text-[20px] cursor-pointer"
            onClick={() => setDisplayPassword(!displayPassword)}
          >
            {displayPassword ? <Eye /> : <EyeClosed />}
          </button>
          {errors.password && <p className="text-sm text-red-500 mt-1 ml-2">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end text-[15px]">
          <Link href="#" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="relative flex flex-col my-[20px] mx-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[50px] bg-overlay-2 text-[16px] font-medium border-none rounded-[30px] cursor-pointer transition-[.3s] hover:bg-overlay-2/50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        <div className="text-center">
          <span>
            Don&apos;t have an account? <Link href="/register" className="font-medium hover:underline">Register</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
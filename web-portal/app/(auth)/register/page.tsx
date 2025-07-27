'use client';
import OAuth from '@/components/layout/OAuth';
import { Button } from '@/components/ui/button';
import { RegisterFormInputsType } from '@/lib/types';
import { registerUser } from '@/utils/helpers/auth';
import { registerSchema } from '@/utils/helpers/schema-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Eye, EyeClosed, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Register() {
  const [displayPassword, setDisplayPassword] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputsType>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedFullname = watch('full_name');
  const watchedPassword = watch('password');
  const watchedEmail = watch('email');
  const watchedUsername = watch('username');

  const onSubmit = async (data: RegisterFormInputsType) => {
    const result = await registerUser(data);
    if (result.success) {
      toast.success(result.message, { duration: 2000 });
      reset();
      setTimeout(()=>{router.push('/dashboard'),[1500]})
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-background/20 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-md sm:max-w-lg bg-background/50 backdrop-blur-[25px] rounded-2xl pt-20 pb-8 px-4 sm:px-6 text-foreground shadow-[0_0_10px_2px] shadow-overlay-2"
      >
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-overlay-2 w-32 sm:w-36 h-16 rounded-b-xl 
          before:content-[''] before:absolute before:-top-[0.1px] before:-left-6 before:w-6 before:h-6 before:rounded-tr-[50%] before:bg-transparent before:shadow-[10px_0_0_0] before:shadow-overlay-2/90
          after:content-[''] after:absolute after:-top-[0.1px] after:-right-6 after:w-6 after:h-6 after:rounded-tl-[50%] after:bg-transparent after:shadow-[-10px_0_0_0] after:shadow-overlay-2/90"
        >
          <span className="text-2xl sm:text-3xl font-semibold text-secondary-foreground">Register</span>
        </div>
        <OAuth />
        <div className="w-full flex items-center gap-2 my-4">
          <span className="flex-grow border-t border-overlay-2"></span>
          <span className="text-sm sm:text-base text-foreground">OR</span>
          <span className="flex-grow border-t border-overlay-2"></span>
        </div>
        <div className="relative flex flex-col my-3">
          <input
            type="text"
            id="name"
            className={`w-full h-12 sm:h-14 text-sm sm:text-base bg-transparent text-foreground py-4 px-6 sm:px-8 border-2 border-overlay-2 rounded-3xl outline-none peer ${errors.full_name && 'border-destructive'}`}
            {...register('full_name')}
          />
          <label
            htmlFor="name"
            className={`${
              !watchedFullname
                ? 'absolute top-3 sm:top-4 left-4 sm:left-5 text-sm sm:text-base'
                : 'absolute -top-2.5 left-4 sm:left-5 text-xs sm:text-sm bg-overlay-2 rounded-full px-2 sm:px-3 py-0'
            } pointer-events-none transition-all duration-200 text-foreground`}
          >
            Name
          </label>
          <User className="absolute top-3 sm:top-4 right-4 sm:right-5 text-lg sm:text-xl" />
          {errors.full_name && <span className="text-destructive text-xs sm:text-sm mt-1">{errors.full_name.message}</span>}
        </div>
        <div className="relative flex flex-col my-3">
          <input
            type="text"
            id="username"
            className={`w-full h-12 sm:h-14 text-sm sm:text-base bg-transparent text-foreground py-4 px-6 sm:px-8 border-2 border-overlay-2 rounded-3xl outline-none peer ${errors.username && 'border-destructive'}`}
            {...register('username')}
          />
          <label
            htmlFor="username"
            className={`${
              !watchedUsername
                ? 'absolute top-3 sm:top-4 left-4 sm:left-5 text-sm sm:text-base'
                : 'absolute -top-2.5 left-4 sm:left-5 text-xs sm:text-sm bg-overlay-2 rounded-full px-2 sm:px-3 py-0'
            } pointer-events-none transition-all duration-200 text-foreground`}
          >
            Username
          </label>
          <User className="absolute top-3 sm:top-4 right-4 sm:right-5 text-lg sm:text-xl" />
          {errors.username && <span className="text-destructive text-xs sm:text-sm mt-1">{errors.username.message}</span>}
        </div>
        <div className="relative flex flex-col my-3">
          <input
            type="email"
            id="email"
            className={`w-full h-12 sm:h-14 text-sm sm:text-base bg-transparent text-foreground py-4 px-6 sm:px-8 border-2 border-overlay-2 rounded-3xl outline-none peer ${errors.email && 'border-destructive'}`}
            {...register('email')}
          />
          <label
            htmlFor="email"
            className={`${
              !watchedEmail
                ? 'absolute top-3 sm:top-4 left-4 sm:left-5 text-sm sm:text-base'
                : 'absolute -top-2.5 left-4 sm:left-5 text-xs sm:text-sm bg-overlay-2 rounded-full px-2 sm:px-3 py-0'
            } pointer-events-none transition-all duration-200 text-foreground`}
          >
            Email
          </label>
          <MailIcon className="absolute top-3 sm:top-4 right-4 sm:right-5 text-lg sm:text-xl" />
          {errors.email && <span className="text-destructive text-xs sm:text-sm mt-1">{errors.email.message}</span>}
        </div>
        <div className="relative flex flex-col my-3">
          <input
            type={displayPassword ? 'text' : 'password'}
            id="password"
            className={`w-full h-12 sm:h-14 text-sm sm:text-base bg-transparent text-foreground py-4 px-6 sm:px-8 border-2 border-overlay-2 rounded-3xl outline-none peer ${errors.password && 'border-destructive'}`}
            {...register('password')}
          />
          <label
            htmlFor="password"
            className={`${
              !watchedPassword
                ? 'absolute top-3 sm:top-4 left-4 sm:left-5 text-sm sm:text-base'
                : 'absolute -top-2.5 left-4 sm:left-5 text-xs sm:text-sm bg-overlay-2 rounded-full px-2 sm:px-3 py-0'
            } pointer-events-none transition-all duration-200 text-foreground`}
          >
            Password
          </label>
          {/* <button
            type="button"
            className="absolute top-3 sm:top-4 right-4 sm:right-5 text-lg sm:text-xl cursor-pointer"
            onClick={() => setDisplayPassword(!displayPassword)}
          >
            {displayPassword ? <Eye /> : <EyeClosed />}
          </button> */}
          {errors.password && <span className="text-destructive text-xs sm:text-sm mt-1">{errors.password.message}</span>}
        </div>
        <div className="relative flex flex-col my-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 sm:h-14 text-sm sm:text-base font-medium rounded-3xl bg-overlay-2 text-secondary-foreground hover:bg-overlay-2/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </div>
        <div className="text-center text-sm sm:text-base">
          <span>
            Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Sign In</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
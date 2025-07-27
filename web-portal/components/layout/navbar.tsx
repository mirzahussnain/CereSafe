"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavigationMenuContent } from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers/auth-provider";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNav } from "./mobile-nav";
import { Loader } from "./loader";
import { Button } from "../ui/button";
import { signOut } from "@/utils/helpers/auth";
import router from "next/router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { navItems } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const [avatarUrl,setAvatarUrl]=useState<string|null>()
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };


  useEffect(()=>{
    if(user){
      const fetchAvatar = async () => {
        const supabase=createClient();
        
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

      fetchAvatar();
    }
  },[user])
 
  if (loading) return <Loader />;

  return (
    <nav className="min-w-full h-20 bg-transparent flex justify-center items-center p-3 fixed z-50">
      {/* Desktop Navbar */}
      <div
        className="hidden w-[950px] md:flex items-center h-16 rounded-lg bg-conic/[from_var(--border-angle)] from-background via-secondary to-background
         from-80% via-90% to-100% p-px animate-rotate-border"
      >
        <div className="w-full h-full dark:bg-neutral-900 bg-background rounded-lg dark:border dark:border-neutral-800">
          <div className="w-full h-full rounded-lg p-4 flex justify-between items-center backdrop-blur-md shadow-lg">
            {/* Logo or Title */}
            <div className="flex items-center">
              <Image
                src="/logo2.png"
                alt="CereSafe Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-purple-500 text-transparent bg-clip-text">
                Cera<span className="text-xl">Safe</span>
              </h1>
            </div>
            {/* Navigation Menu */}
            <NavigationMenu
              className="hidden md:flex font-semibold text-base flex-1/2 justify-center items-center"
              viewport={false}
            >
              <NavigationMenuList className="flex gap-6">
                {navItems?.map((item, index) => {
                  if (Array.isArray(item)) {
                    return (
                      <NavigationMenuItem key={`services-${index}`}>
                        <NavigationMenuTrigger
                          className={`text-sm font-medium bg-transparent shadow-none transition-colors hover:cursor-pointer relative hover:text-secondary ${
                            pathname.startsWith("/services") &&
                            "text-secondary underline underline-offset-4"
                          }`}
                        >
                          Services
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-x-2 md:w-[220px] fixed rounded-xl top-15">
                            {item.map((service) => (
                              <li key={service.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    className={`from-muted/50 to-muted flex h-full w-full flex-col border-b-2 border-primary/40 justify-end bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md hover:bg-foreground/50 hover:text-secondary ${
                                      pathname === service.href &&
                                      "text-secondary"
                                    }`}
                                    href={service.href}
                                  >
                                    <div className="mt-4 mb-2 text-lg font-medium">
                                      {service.label}
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                      {service.desc}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  }
                  return (
                    <NavigationMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className={`text-sm font-medium transition-colors text-primary hover:text-secondary ${
                          pathname === item.href &&
                          "text-secondary underline underline-offset-4"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
            {/* User Profile or Sign In/Sign Up */}
            <div className="flex items-center space-x-2">
              <Link href={'/services/stroke-prediction/'}className="py-1 px-5 text-sm font-semibold border-2 hover:cursor-pointer hover:border-primary-foreground hover:text-secondary rounded-xl transition">
                Get Started
              </Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                          {
                            avatarUrl? (
                              <Image
                            src={
                              avatarUrl 
                            }
                            alt="User profile picture"
                            width={40}
                            height={20}
                            className="rounded-full object-cover  cursor-pointer hover:opacity-80 transition-opacity h-9"
                          />
                            ):(
                              <Image
                            src={
                             "/avatar.jpg"
                            }
                            alt="User profile picture"
                            width={40}
                            height={20}
                            className="rounded-full object-cover  cursor-pointer hover:opacity-80 transition-opacity w-9 h-9"
                          />
                            )
                          }
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-background/80 border-b-2 " align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard"
                            className="w-full cursor-pointer border-b-2  focus:bg-secondary-foreground/70"
                          >
                            My Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer   focus:bg-secondary-foreground/70"
                          onClick={handleLogout}
                        >
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Link
                    className="py-1 px-8 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 hover:cursor-pointer hidden md:inline-block transition"
                    href={"/login"}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="md:hidden w-full h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo2.png"
            alt="CereSafe Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-purple-500 text-transparent bg-clip-text ml-2">
            Cera<span className="text-xl">Safe</span>
          </h1>
        </div>
        <motion.button
          className="md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 text-black dark:text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </motion.button>
      </div>
      {/* Mobile Menu */}
      <MobileNav
        isMobileMenuOpen={isMobileMenuOpen}
        navItems={navItems}
        toggleMobileMenu={toggleMobileMenu}
        pathname={pathname}
        user={user}
      />
    </nav>
  );
}

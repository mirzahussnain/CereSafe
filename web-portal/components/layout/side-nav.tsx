"use client";

import {
  BarChart,
  History,
  LayoutDashboardIcon,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { signOut } from "@/utils/helpers/auth";
import { useAuth } from "../providers/auth-provider";
import { Loader } from "./loader";
import { SideNavMenu } from "@/lib/data";



export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [displaySideNav, setDisplaySideNav] = useState<boolean>(true);
  const {user,loading,toggleLoading}=useAuth();

  const slideVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  const handleLogout = async () => {
    try{
      toggleLoading(true)
      const result = await signOut();
      if (result.success) {
        localStorage.removeItem("PredictionResult");
        router.push("/");
        toggleLoading(false)
        toast.success(result.message);
      } else {
        throw new Error(result.message);
      }

    }catch(error:any){
      toast.error(error.message)
    }
  };

  if (loading || !user) {
    return <Loader/>
  }





  return (
    <>
      {/* Toggle button on mobile */}
      <button
        className={`lg:hidden fixed top-[36.6%] z-50 ${
          displaySideNav ? "left-[3.56rem]" : "left-0"
        } rounded-r-lg shadow-2xl py-2 bg-overlay-2/60 transition-all duration-300`}
        onClick={() => setDisplaySideNav(!displaySideNav)}
      >
        <div className="[writing-mode:vertical-rl] rotate-180 text-md h-10 flex items-center justify-center text-sm tracking-wider text-secondary-foreground">
          Menu
        </div>
      </button>
      <AnimatePresence>
        {displaySideNav && (
          <motion.aside
            key="sidenav"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed z-20 top-[36%] lg:static lg:min-h-screen lg:block lg:w-[20rem] w-fit lg:rounded-r-xl rounded-r-lg bg-overlay-2/60 shadow-2xl`}
          >
            <div className="w-full h-full lg:rounded-r-xl rounded-r-lg bg-accent/50 flex flex-col gap-2">
              <div className="hidden lg:flex flex-col lg:flex-row items-center justify-center py-2 border-b-2 lg:rounded-tr-xl rounded-tr-lg">
                <Image
                  src={"/logo2.png"}
                  alt="CereSafe Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-700 to-purple-500 text-transparent bg-clip-text ml-2">
                  Cere<span className="text-2xl">Safe</span>
                </h1>
              </div>
              {SideNavMenu.map((menu, index) => (
                <div key={`menu-group-${index}`}>
                  <span
                    className="hidden lg:inline-block px-4 mt-5 lg:mt-20 text-primary/40"
                    key={`menu-${index}`}
                  >
                    {menu.heading}
                  </span>
                  <ul className="flex flex-col justify-start items-start gap-1">
                    {menu.items.map((menuItem, index) => (
                      <Link
                        key={`menuItem-${index}`}
                        href={menuItem.path}
                        className={`w-full flex gap-2 py-3 lg:py-4 lg:px-9 px-4.5 relative before:hidden lg:before:block ${
                          pathname === menuItem.path &&
                          "before:content-[''] before:absolute before:top-0 before:left-0 before:w-2.5 before:h-full before:bg-overlay-2 before:rounded-tr-full before:rounded-br-full before:z-50 text-primary"
                        }`}
                      >
                        <span
                          className={`${
                            pathname === menuItem.path && "text-overlay-2"
                          } text-sm`}
                        >
                          {menuItem.icon}
                        </span>
                        <span
                          className={`hidden lg:inline-block text-sm lg:text-lg ${
                            pathname === menuItem.path && "text-overlay-2"
                          } font-semibold`}
                        >
                          {menuItem.title}
                        </span>
                      </Link>
                    ))}
                  </ul>
                </div>
              ))}
              <Button
                onClick={handleLogout}
                className="my-2 lg:my-20 flex text-lg lg:p-5 w-fit lg:w-[12rem] mx-auto cursor-pointer bg-none lg:bg-secondary-foreground"
              >
                <LogOut />
                <span className="hidden lg:inline-block">Logout</span>
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

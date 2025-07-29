"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { XIcon } from "../ui/icon";
import { Github, LinkedinIcon } from "lucide-react";
import { useAuth } from "../providers/auth-provider";
import { Loader } from "./loader";

export default function Footer() {
  const { loading } = useAuth();
  if (loading) return <Loader />;
  return (
    <footer className="min-h-screen from-overlay-2 to-overlay-1 dark:from-background dark:to-primary-foreground bg-linear-to-bl  pt-16 px-4  mx-auto flex flex-col items-center gap-16">
      <div className="mx-auto w-[90%] max-w-sm md:max-w-full bg-zinc-200/80 dark:bg-primary-foreground/80 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl md:text-5xl font-semibold text-center mt-10 md:mb-6 tracking-wide">
          Ready to get started?
        </h1>
        <div className="flex justify-center items-center gap-2 ">
          {/* <Button variant="outline" className="p-4 px-8 md:px-10 lg:px-12 hover:cursor-pointer">
                    Get Started
                </Button> */}
          <Button className="py-5 px-8 md:px-10 lg:px-12 hover:cursor-pointer bg-secondary text-secondary-foreground">
            <Link href={"/services/stroke-prediction"}>Get Started</Link>
          </Button>
        </div>
      </div>
      <div className="w-full mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {/* Logo and Social Links */}
        <div className="flex md:flex-col justify-between items-center md:justify-start md:items-start md:gap-3 border-b-2 pb-3 md:pb-0 md:border-none">
          <Link className="flex justify-start items-center gap-2" href={"/"}>
            <Image
              src="/logo2.png"
              alt="CereSafe Logo"
              width={40}
              height={40}
              className="rounded-full bg-primary/50"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-purple-500 text-transparent bg-clip-text">
              Cere<span className="text-lg">Safe</span>
            </h1>
          </Link>
          <ul className="flex justify-start items-center gap-5 px-2 text-muted-foreground">
            <li>
              <Link href="https://x.com/Hussy23king3">
                <XIcon size={20} />
              </Link>
            </li>
            <li>
              <Link href="https://linkedin.com/in/hussnain-ali-202738191">
                <LinkedinIcon size={20} />
              </Link>
            </li>
            <li>
              <Link href="https://github.com/mirzahussnain">
                <Github />
              </Link>
            </li>
          </ul>
        </div>
        {/* Services Col-1*/}
        <div className="text-sm md:text-lg flex flex-col justify-start items-start text-left gap-2 text-gray-500/70 dark:text-zinc-500 font-medium  tracking-wide p-2 ">
          <h2 className="text-white font-semibold">Services</h2>
          <Link className="hover:text-white transition-colors" href={"/services/stroke-prediction/about"}>
            Stroke Prediciton
          </Link>
          <Link className="hover:text-white transition-colors" href={"/services/health-shorts/about"}>
            Healthcare Shorts
          </Link>
        </div>
        {/* About Col-2 */}
        <div className="text-sm md:text-lg flex flex-col justify-start items-start text-left gap-2 text-gray-500/70 dark:text-zinc-500 font-medium tracking-wide p-2">
          <h2 className="text-white font-semibold">Project</h2>
          <Link className="hover:text-white transition-colors" href={"/about"}>
            About
          </Link>
          <Link className="hover:text-white transition-colors" href={""}>
            Demo Videos
          </Link>
          <Link className="hover:text-white transition-colors" href={"/contact"}>
            Contact
          </Link>
        </div>
      </div>

      {/* Rules and Footer End */}
      <div className="w-full border-t-2 py-6 flex flex-col md:flex-row justify-center items-start md:justify-between gap-3 px-2">
        <div className="flex justify-center items-center gap-8 md:gap-10 font-semibold text-lg text-gray-500/70 dark:text-zinc-400">
          <Link href={"/policy"} className=" hover:cursor-pointer hover:text-white">
            Policy
          </Link>
          <Link href={"/terms-of-service"} className="hover:cursor-pointer hover:text-white">
            Terms of Service
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Copyright &copy; {new Date().getFullYear()} CereSafe. All rights
          reserved.
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        <p>Made with ❤️ by Hussnain Ali</p>
      </div>
    </footer>
  );
}

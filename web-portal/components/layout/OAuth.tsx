"use client";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { oAuthentication } from "@/utils/helpers/auth";

export default function OAuth() {
  const pathname = usePathname();
  const handleOAuthSignIn = async (
    provider: "google" | "github",
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const result = await oAuthentication(provider);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 text-base sm:text-lg mb-4">
      <Button
        className="w-full py-5 flex justify-center items-center gap-2 bg-secondary-foreground text-primary-foreground cursor-pointer hover:bg-overlay-2/50"
        onClick={(e) => handleOAuthSignIn("google", e)}
        type="button"
      >
        <Image
          width={20}
          height={20}
          src="/google-icon-logo.svg"
          alt="Google Icon"
        />
        {`${pathname.startsWith("/login") ? "Sign In" : "Sign Up"} with Google`}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full py-5 flex justify-center items-center gap-2 hover:bg-overlay-2/50 cursor-pointer"
        onClick={(e) => handleOAuthSignIn("github", e)}
      >
        <Github size={20} className="w-5 h-5" />
        {`${pathname.startsWith("/login") ? "Sign In" : "Sign Up"} with Github`}
      </Button>
    </div>
  );
}

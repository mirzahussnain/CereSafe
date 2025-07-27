import { CircleArrowRight, Stethoscope } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen  pt-16 md:pt-0 px-4 md:px-8 lg:px-36 mx-auto bg-theme-image">
      {/* Left column: heading, description & button */}
      <div className="space-y-6 text-center md:text-left md:pt-2">
        <span className="text-sm md:text-lg text-primary-foreground font-semibold tracking-widest">
          Predict, Prevent and Protect
        </span>
        <h1 className="text-3xl  md:text-5xl font-bold">
          Empowering proactive healthcare with{" "}
          <span className="text-primary-foreground">
            Artifical Intelligence
          </span>
        </h1>
        <p className="text-secondary-foreground text-sm md:text-lg md:text-justify">
          Leverage machine learning to analyze patient data, predict stroke risk
          early, and take proactive steps toward better outcomes.
        </p>
        <Button
          variant="default"
          className="max-w-sm md:w-auto md:min-w-[12rem] py-5 md:py-7 hover:cursor-pointer tracking-widest  text-secondary-foreground bg-secondary hover:bg-secondary/80
          text-[0.85rem] md:text-[1rem] md:text-lg"
        >
          <Link href={'/services/stroke-prediction'} className="flex items-center gap-2">
          
          <span>Get Started</span>
          <CircleArrowRight />
          </Link>
        </Button>
      </div>

    

      <div className="relative  flex justify-center md:justify-end md:h-fit  md:py-2 rounded-tr-[8rem] overflow-hidden">
        {/* Gradient background fade blending into image */}
        <div className="absolute md:bottom-0  lg:right-3 md:right-10 right-8 w-3/4  max-w-[400px] h-full bg-gradient-to-t from-transparent via-primary-foreground/40 to-overlay-1/80 z-0
        rounded-tr-[8rem] rounded-tl-4xl" />

        {/* Clear and sharp image */}
        <Image
          src="/hero1.png"
          alt="Illustration of ML stroke prediction"
          className="relative z-10 object-cover"
          width={500}
          height={500}
          priority
      
        />
      </div>
    </div>
  );
}

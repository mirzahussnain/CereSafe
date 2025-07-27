import Timeline from "@/components/ui/timeline";
import { LandingPageData } from "@/lib/data";

export default function HowItWorks() {
  return (
    <section
      className="min-h-screen px-4 md:px-8 lg:px-36 mx-auto flex flex-col items-center gap-10 pb-16"
    >
      {/* Section Heading */}
      <h2 className="bg-secondary/80 text-white px-3 py-4 rounded-b-3xl text-2xl font-semibold shadow-sm tracking-wide">
        How it works?
      </h2>

      {/* Section Content */}
      <p className="text-muted-foreground text-center max-w-2xl text-xl">
        Enter a few basic health details and get an AI-powered stroke risk
        estimation instantly.
      </p>
      <Timeline data={LandingPageData} />
      {/* Add your input form or CTA component here */}
      {/* Example placeholder */}
      {/* <div className="w-full max-w-2xl bg-background border border-muted rounded-lg p-6 shadow-md">
   
    <p className="text-center text-sm text-muted-foreground italic">
      * This tool is intended for educational purposes only.
    </p>
  </div> */}
    </section>
  );
}

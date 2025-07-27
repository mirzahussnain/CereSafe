import { DotLoader } from "react-spinners";
export function Loader() {
  return (
    <div className="absolute right-1  min-w-screen h-screen flex flex-col bg-secondary-foreground items-center justify-center gap-0.5 text-lg text-secondary-foreground z-[100]">
      <DotLoader color="#eb7281" loading speedMultiplier={2} />
      <h2 className="tracking-wide text-secondary/90">Loading....</h2>
    </div>
  );
}

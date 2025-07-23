import React from "react";
import { Boxes } from "@/components/Boxes";
import { cn } from "@/lib/utils";
import { HomeDock } from "@/components/AppBar";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { ArrowRightIcon } from "@radix-ui/react-icons";

// Overlay for the radial mask effect
const LandingOverlay = () => (
  <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
);

// Main Landing Page component
export const LandingPage = () => (
  <div
    className="h-96 relative w-full overflow-hidden bg-neutral-850 flex flex-col items-center justify-center rounded-lg min-h-screen"
  >
    <LandingOverlay />
    <Boxes />
    {/* Name Card */}
    {/* 
      Container for the BentoCard
      - 'w-full' makes the container take full width
      - 'flex justify-end' aligns the card to the right
      - 'pr-8' adds right padding (adjust this value to move left/right)
      - 'w-3/5' makes the card 60% of its original width (40% less wide)
    */}
    <div className="w-full flex justify-center ml-90">
      <BentoCard
        name="Chaitanya"
        description="Welcome to my portfolio"
        size="lg"
      className="w-1/3"
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(1.2) rotate(0deg) translateZ(0)`,
      }}
      />
    </div>
    <HomeDock />
  </div>
);

export default LandingPage; 
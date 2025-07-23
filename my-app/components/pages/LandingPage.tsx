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

// Main heading
const LandingHeading = () => (
  <h1
    className={cn(
      "md:text-4xl text-xl text-white relative z-20 font-semibold"
    )}
  >
    Hi, I'm Madhurya!
  </h1>
);

// Subheading/description
const LandingSubheading = () => (
  <p className="text-center mt-2 text-neutral-300 relative z-20">
    A true chaos engineer ngl
  </p>
);

// Main Landing Page component
export const LandingPage = () => (
  <div
    className="h-96 relative w-full overflow-hidden bg-neutral-600 flex flex-col items-center justify-center rounded-lg min-h-screen"
  >
    <LandingOverlay />
    <Boxes />
    {/* Demo BentoCard with all required props */}
    <BentoCard
      name="Hi, I'm Madhurya!"
      className="max-w-md mx-auto bg-white"
      background={null}
      Icon={ArrowRightIcon}
      description={
        <>
          <LandingHeading />
          <LandingSubheading />
        </>
      }
      href="#"
      cta="Learn More"
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(1.4) rotate(0deg) translateZ(0)`
      }}
    />
    <HomeDock />
  </div>
);

export default LandingPage; 
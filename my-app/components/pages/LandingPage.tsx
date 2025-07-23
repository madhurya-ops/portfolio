import React from "react";
import { Boxes } from "@/components/Boxes";
import { cn } from "@/lib/utils";
import { HomeDock } from "@/components/AppBar";

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
    style={{ fontFamily: 'inherit' }}
  >
    Tailwind is Awesome
  </h1>
);

// Subheading/description
const LandingSubheading = () => (
  <p className="text-center mt-2 text-neutral-300 relative z-20" style={{ fontFamily: 'inherit' }}>
    Framer motion is the best animation library ngl
  </p>
);

// Main Landing Page component
export const LandingPage = () => (
  <div
    className="h-96 relative w-full overflow-hidden bg-neutral-600 flex flex-col items-center justify-center rounded-lg min-h-screen"
    style={{ fontFamily: '"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}
  >
    <LandingOverlay />
    <Boxes />
    <LandingHeading />
    <LandingSubheading />
    <HomeDock />
  </div>
);

export default LandingPage; 
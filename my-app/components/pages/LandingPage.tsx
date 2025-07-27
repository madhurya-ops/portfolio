import React from "react";
import { Boxes } from "@/components/Boxes";
import { HomeDock } from "@/components/AppBar";
import NameCard from "@/components/magicui/NameCard";

// Overlay for the radial mask effect
const LandingOverlay = () => (
  <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
);

// Main Landing Page component
export const LandingPage = () => (
  <div
    className="h-96 relative w-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center rounded-lg min-h-screen"
  >
    <LandingOverlay />
    <Boxes />
    <div className="z-100"style={{
        // transform: Applies a series of 2D/3D transformations to the grid for a dynamic, skewed look.
        // You can adjust skew, scale, rotation, or remove for a flat grid.
        transform: `translate(2%,-2%) scale(1) rotate(0deg) translateZ(0)`,
      }}>
    <NameCard/>
    </div>
    <HomeDock />
  </div>
  
);

export default LandingPage; 
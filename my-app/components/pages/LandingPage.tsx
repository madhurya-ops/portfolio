import React from "react";
import { Boxes } from "@/components/Boxes";
import { cn } from "@/lib/utils";
import { HomeDock } from "@/components/AppBar";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import NameCard from "@/components/magicui/NameCard";

// Overlay for the radial mask effect
const LandingOverlay = () => (
  <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
);

// Main Landing Page component
export const LandingPage = () => (
  <div
    className="h-96 relative w-full overflow-hidden bg-neutral-850 flex flex-col items-center justify-center rounded-lg min-h-screen"
  >
  {/* Bottom right - availability */}
  <div className="absolute bottom-5 right-5 z-100">
              <div className="font-mono flex justify-end items-center gap-1 text-sm font-light text-zinc-400">
                <div className="size-1.5 rounded-full bg-green-500" />
                <p className="text-xs font-light">Available for work</p>
              </div>
              <div className="flex items-center justify-center">
                <time
                  className="text-[10px] font-light font-mono tabular-nums tracking-wider text-zinc-500"
                  dateTime={new Date().toISOString()}
                  aria-label="Current time"
                >
                  {new Date().toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  ,{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </time>
              </div>
    </div>
    <LandingOverlay />
    <Boxes />
    <div style={{
        // transform: Applies a series of 2D/3D transformations to the grid for a dynamic, skewed look.
        // You can adjust skew, scale, rotation, or remove for a flat grid.
        transform: `translate(5%,-20%) skewX(-40deg) skewY(10deg) scale(1) rotate(0deg) translateZ(0)`,
      }}>
    <NameCard/>
    </div>
    <HomeDock />
  </div>
  
);

export default LandingPage; 
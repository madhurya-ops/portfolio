"use client";
import React, { useMemo, useRef } from "react";
import { Boxes, BoxesRef } from "@/components/Boxes";
import { HomeDock } from "@/components/AppBar";
import NameCard from "@/components/magicui/NameCard";

// Memoized overlay component for better performance
const LandingOverlay = React.memo(() => (
  <div 
    className="absolute inset-0 w-full h-full bg-neutral-950 z-20 pointer-events-none"
    style={{
      maskImage: 'radial-gradient(transparent,white)',
      WebkitMaskImage: 'radial-gradient(transparent,white)',
      willChange: 'auto'
    }}
  />
));
LandingOverlay.displayName = 'LandingOverlay';

// Main Landing Page component
export const LandingPage = () => {
  // Reference to the Boxes component to trigger wave
  const boxesRef = useRef<BoxesRef>(null);

  // Handle NameCard click to trigger radial wave
  const handleNameCardClick = () => {
    boxesRef.current?.triggerRadialWave();
  };

  // Memoized transform style for NameCard positioning
  const nameCardStyle = useMemo(() => ({
    transform: `translate(2%,-2%) scale(1) rotate(0deg) translateZ(0)`,
    willChange: 'transform'
  }), []);

  // Memoized container style with custom cursor for grids
  const containerStyle = useMemo(() => ({
    cursor: 'url(/cursor.svg), auto'
  }), []);

  return (
    <>
      {/* Custom cursor styles for the grid boxes */}
      <style jsx global>{`
        .boxes-container * {
          cursor: url(/cursor.svg), auto !important;
        }
        
        .boxes-container .cell,
        .boxes-container [class*="box"],
        .boxes-container [class*="grid"] {
          cursor: url(/cursor.svg), auto !important;
        }
      `}</style>
      
      <div 
        className="h-96 relative w-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center rounded-lg min-h-screen"
        style={containerStyle}
      >
        <LandingOverlay />
        <div className="boxes-container">
          <Boxes ref={boxesRef} />
        </div>
        <div 
          className="z-50 cursor-pointer" 
          style={nameCardStyle}
          onClick={handleNameCardClick}
        >
          <NameCard />
        </div>
        <HomeDock />
      </div>
    </>
  );
};

export default LandingPage;

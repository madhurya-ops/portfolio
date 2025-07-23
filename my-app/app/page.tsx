// Import Next.js's Image component (not used in this version, but useful for images)
import Image from "next/image";
// Import the animated Boxes background component
import { Boxes } from "@/app/Boxes";
// Import the cn utility for conditional className joining
import { cn } from "@/lib/utils";

// Main page component
export default function Home() {
  return (
    // Main container div
    // - h-96: fixed height for the demo (can be changed)
    // - min-h-screen: ensures full viewport height
    // - relative: for absolutely positioned children (background, overlays)
    // - w-full: full width
    // - overflow-hidden: hides overflow from animated background
    // - bg-neutral-900: dark grey background (can be changed)
    // - flex, flex-col, items-center, justify-center: center content
    // - rounded-lg: rounded corners (can be removed)
    <div
      className="h-96 relative w-full overflow-hidden bg-neutral-900 flex flex-col items-center justify-center rounded-lg min-h-screen"
      // Apple UI font stack for a modern, clean look
      style={{ fontFamily: '"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Overlay for a subtle radial mask effect on the background */}
      <div className="absolute inset-0 w-full h-full bg-neutral-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      {/* Animated background grid of boxes */}
      {/* To customize the animation, colors, or grid, edit Boxes in app/Boxes.tsx */}
      <Boxes />
      {/* Main heading text */}
      {/*
        - md:text-4xl: large text on medium+ screens
        - text-xl: base size on small screens
        - text-white: white color
        - relative z-20: ensures text is above background
        - font-semibold: bold
        - className uses cn for easy extension
        - style fontFamily: inherit from parent (Apple UI stack)
        To change the heading, edit the text below.
      */}
      <h1 className={cn("md:text-4xl text-xl text-white relative z-20 font-semibold")}
        style={{ fontFamily: 'inherit' }}
      >
        Tailwind is Awesome
      </h1>
      {/* Subheading/description text */}
      {/*
        - text-center: center align
        - mt-2: margin top
        - text-neutral-300: light grey
        - relative z-20: above background
        - style fontFamily: inherit
        To change the description, edit the text below.
      */}
      <p className="text-center mt-2 text-neutral-300 relative z-20" style={{ fontFamily: 'inherit' }}>
        Framer motion is the best animation library ngl
      </p>
    </div>
  );
}

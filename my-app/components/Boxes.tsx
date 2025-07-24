"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Core component for the animated background grid
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // --- CUSTOMIZABLE: Number of rows in the grid ---
  // rows: Controls the vertical density of the grid. More rows = more horizontal lines and more boxes.
  const rows = new Array(90).fill(1); // Change 120 for more/fewer rows

  // --- CUSTOMIZABLE: Number of columns in the grid ---
  // cols: Controls the horizontal density of the grid. More columns = more vertical lines and more boxes.
  const cols = new Array(60).fill(1); // Change 100 for more/fewer columns
  
  // --- CUSTOMIZABLE: Color palette for box hover effect ---
  // colors: Array of CSS color values. When a box is hovered, one of these colors is picked at random for the background.
  const colors = [
    "rgb(23 78 166)", 
    "rgb(165 14 14)", 
    "rgb(66 103 210)",  
    "rgb(234 67 53)", 
    "rgb(251 188 4)", 
    "rgb(52 168 83)", 
    "rgb(210 227 252)",  
    "rgb(254 239 195)", 
    "rgb(206 234 214)"
  ];

  // getRandomColor: Returns a random color from the colors array above.
  // Used to set the background color of a box when hovered.
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    // Outer container for the grid
    <div
      style={{
        // transform: Applies a series of 2D/3D transformations to the grid for a dynamic, skewed look.
        // You can adjust skew, scale, rotation, or remove for a flat grid.
        transform: `translate(-40%,-60%) skewX(-40deg) skewY(10deg) scale(1.2) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        // className: Utility classes for positioning, sizing, and layout of the grid container.
        // - absolute: positions the grid absolutely relative to its parent
        // - left-1/4, -top-1/4: offsets the grid
        // - p-4: padding
        // - flex: flexbox layout for rows
        // - w-full h-full: makes grid fill the parent
        // - z-0: places grid behind other content
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {/* Render each row in the grid */}
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          // className: Sets the size and left border for each row of boxes.
          // - w-16: width of each box
          // - h-8: height of each box
          // - border-l: left border for the row
          // - border-slate-700: border color
          // - relative: for positioning child elements
          className="w-16 h-8 border-l border-neutral-600 relative"
        >
          {/* Render each column in the row */}
          {cols.map((_, j) => (
            <motion.div
              // whileHover: Animation config for when a box is hovered.
              // - backgroundColor: sets a random color from the palette
              // - transition: duration of the color change (0 = instant)
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              // animate: Animation config for the box's transition state.
              // - transition: duration for smoothness of any animated property
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              // className: Sets the size and borders for each box.
              // - w-16: width of the box
              // - h-8: height of the box
              // - border-r: right border
              // - border-t: top border
              // - border-slate-700: border color
              // - relative: for positioning the icon
              className="w-16 h-8 border-r border-t border-neutral-800 relative"
            >
              {/* No icon rendered here; only the animated boxes remain. */}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// Memoized export for performance (prevents unnecessary re-renders)
export const Boxes = React.memo(BoxesCore); 
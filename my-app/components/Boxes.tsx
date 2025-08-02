"use client";
import React, { useState, useCallback, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the ref interface for external control
export interface BoxesRef {
  triggerRadialWave: () => void;
}

// Core component for the animated background grid
export const BoxesCore = forwardRef<BoxesRef, { className?: string }>(
  ({ className, ...rest }, ref) => {
    // --- STATE: Track clicked boxes ---
    const [clickedBoxes, setClickedBoxes] = useState<Record<string, string>>({});
    
    // --- STATE: Track wave animation ---
    const [waveBoxes, setWaveBoxes] = useState<Record<string, { color: string; delay: number }>>({});
    const [isWaveActive, setIsWaveActive] = useState(false);

    // Ref to access the grid container for dynamic center calculation
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridCenter, setGridCenter] = useState({ x: 0, y: 0 });

    // --- CUSTOMIZABLE: Number of rows and columns ---
    const rows = new Array(60).fill(1);
    const cols = new Array(40).fill(1);
    
    // --- CUSTOMIZABLE: Color palette ---
    const colors = [
      "rgb(23 78 166)",   // Blue
      "rgb(165 14 14)",   // Red
      "rgb(66 103 210)",  // Light Blue  
      "rgb(234 67 53)",   // Google Red
      "rgb(251 188 4)",   // Yellow
      "rgb(52 168 83)",   // Green
      "rgb(210 227 252)", // Very Light Blue
      "rgb(254 239 195)", // Light Yellow
      "rgb(206 234 214)"  // Light Green
    ];

    const getRandomColor = () => {
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Dynamically calculate grid center on mount/resize
    useEffect(() => {
      const updateCenter = () => {
        if (gridRef.current) {
          const rect = gridRef.current.getBoundingClientRect();
          setGridCenter({
            x: rect.width / 2,
            y: rect.height / 2
          });
        }
      };

      updateCenter();
      window.addEventListener('resize', updateCenter);
      return () => window.removeEventListener('resize', updateCenter);
    }, []);

    // Calculate distance from page center (behind NameCard)
    const calculateDistanceFromCenter = (row: number, col: number) => {
      // Calculate box position relative to grid
      const boxWidth = gridRef.current ? gridRef.current.clientWidth / cols.length : 0;
      const boxHeight = gridRef.current ? gridRef.current.clientHeight / rows.length : 0;
      const boxX = col * boxWidth + boxWidth / 2;
      const boxY = row * boxHeight + boxHeight / 2;
      
      const deltaX = boxX - gridCenter.x;
      const deltaY = boxY - gridCenter.y;
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    // Trigger radial wave animation
    const triggerRadialWave = useCallback(() => {
      if (isWaveActive || gridCenter.x === 0) return; // Prevent multiple waves or before center is calculated
      
      setIsWaveActive(true);
      const newWaveBoxes: Record<string, { color: string; delay: number }> = {};
      
      // Calculate wave timing for each box based on distance from center
      let maxDistance = 0;
      rows.forEach((_, i) => {
        cols.forEach((_, j) => {
          const distance = calculateDistanceFromCenter(i, j);
          if (distance > maxDistance) maxDistance = distance;
        });
      });
      
      const waveSpeed = 0.8; // Total wave duration in seconds (quick wave)
      
      rows.forEach((_, i) => {
        cols.forEach((_, j) => {
          const boxId = `box-${i}-${j}`;
          const distance = calculateDistanceFromCenter(i, j);
          const delay = (distance / maxDistance) * waveSpeed;
          
          newWaveBoxes[boxId] = {
            color: getRandomColor(),
            delay: delay
          };
        });
      });
      
      setWaveBoxes(newWaveBoxes);
      
      // Clear wave after animation completes (includes fade-out time)
      setTimeout(() => {
        setWaveBoxes({});
        setIsWaveActive(false);
      }, (waveSpeed + 0.4) * 1000); // Extra 0.4s for smooth fade-out
    }, [isWaveActive, rows.length, cols.length, gridCenter]);

    // Expose triggerRadialWave to parent components
    useImperativeHandle(ref, () => ({
      triggerRadialWave
    }));

    // Handle individual box clicks
    const handleClick = useCallback((i: number, j: number, currentHoverColor?: string) => {
      const boxId = `box-${i}-${j}`;
      
      setClickedBoxes(prev => {
        const newState = { ...prev };
        
        if (newState[boxId]) {
          delete newState[boxId];
        } else {
          newState[boxId] = currentHoverColor || getRandomColor();
        }
        
        return newState;
      });
    }, []);

    return (
      <div
        ref={gridRef}
        style={{
          transform: `translate(-50%,-50%) scale(1.4) rotate(0deg) translateZ(0)`,
        }}
        className={cn(
          "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
          className
        )}
        {...rest}
      >
        {rows.map((_, i) => (
          <motion.div
            key={`row` + i}
            className="w-11 h-11 border-l border-gray-900 relative"
          >
            {cols.map((_, j) => {
              const boxId = `box-${i}-${j}`;
              const isClicked = !!clickedBoxes[boxId];
              const waveData = waveBoxes[boxId];
              const hasWave = !!waveData;
              
              return (
                <motion.div
                  key={`col` + j}
                  // Regular hover animation (only if not clicked and no wave)
                  whileHover={!isClicked && !hasWave ? {
                    backgroundColor: getRandomColor(),
                    transition: { duration: 0 },
                  } : {}}
                  
                  // Wave animation with fade-in/out
                  animate={{
                    backgroundColor: hasWave 
                      ? [
                          "rgba(0,0,0,0)", // Start transparent
                          waveData.color,  // Peak color
                          "rgba(0,0,0,0)"  // Fade back to transparent
                        ]
                      : isClicked 
                        ? clickedBoxes[boxId] 
                        : "rgba(0,0,0,0)", // Default transparent
                    transition: hasWave 
                      ? {
                          duration: 0.4, // Quick color duration per box
                          delay: waveData.delay,
                          times: [0, 0.5, 1], // Color peaks at midpoint for smooth wave
                          ease: "easeInOut" // Smooth fade-in/out
                        }
                      : { duration: 0.2 } // Quick reset for non-wave states
                  }}
                  
                  onClick={(e) => {
                    if (!hasWave) { // Prevent clicks during wave
                      const currentBg = (e.target as HTMLElement).style.backgroundColor;
                      handleClick(i, j, currentBg);
                    }
                  }}
                  
                  className="w-11 h-11 border-r border-t border-neutral-800 relative cursor-pointer"
                >
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>
    );
  }
);

BoxesCore.displayName = 'BoxesCore';

// Memoized export for performance
export const Boxes = React.memo(BoxesCore);

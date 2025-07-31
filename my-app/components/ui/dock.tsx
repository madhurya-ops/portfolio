"use client";

import React, { useRef, useEffect, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  magnification?: number;
  distance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
  "mx-auto w-max mt-8 h-[58px] select-none p-2 flex gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md",
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      direction = "bottom",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.matchMedia("(hover: none)").matches);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        // Only pass dock props to DockIcon components
        // Check if the child has the displayName of DockIcon
        if (child.type && typeof child.type === 'function' && 
            (child.type as React.ComponentType<any>).displayName === 'DockIcon') {
          return React.cloneElement(child as React.ReactElement<DockIconProps>, {
            mouseX: mouseX,
            magnification: magnification,
            distance: distance,
            isMobile: isMobile,
          });
        }
        
        // Return other elements as-is
        return child;
      });
    };

    return (
      <TooltipProvider>
        <motion.div
          ref={ref}
          onMouseMove={(e) => !isMobile && mouseX.set(e.pageX)}
          onMouseLeave={() => !isMobile && mouseX.set(Infinity)}
          {...props}
          className={cn(dockVariants({ className }), {
            "items-start": direction === "top",
            "items-center": direction === "middle",
            "items-end": direction === "bottom",
          })}
        >
          {renderChildren()}
        </motion.div>
      </TooltipProvider>
    );
  },
);

Dock.displayName = "Dock";

interface DockIconProps {

  className?: string;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  children?: React.ReactNode;
  isMobile?: boolean;
  href: string;
  tooltip?: string;
}

const DockIcon = ({
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  href,
  children,
  isMobile = false,
  tooltip,
}: DockIconProps) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const initialMouseX = useMotionValue(0);
  const mouseXValue = mouseX ?? initialMouseX;

  const distanceCalc = useTransform(mouseXValue, (val: number) => {
    if (isMobile) return 0;
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform<number, number>(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.a
          href={href}
          ref={ref}
          target={
            href === "/projects" ||
            href === "/" ||
            href === "/contact" ||
            href === "/chat" ||
            href === "/experience" ||
            href === "/art" ||
            href === "/blog"
              ? "_self"
              : "_blank"
          }
          style={{ width: isMobile ? 40 : width }}
          className={cn(
            "flex aspect-square items-center justify-center rounded-full",
            className,
          )}
        >
          {children}
        </motion.a>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
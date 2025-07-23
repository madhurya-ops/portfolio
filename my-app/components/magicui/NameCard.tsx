import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

/**
 * BentoCard Component
 * 
 * A simple name card component that displays a name and description.
 * 
 * @prop {string} name - The main title (name) to display
 * @prop {string} description - The description text to display below the name
 * @prop {string} [className] - Additional CSS classes to apply to the card
 * @prop {'sm' | 'md' | 'lg' | 'xl'} [size='md'] - Size variant of the card
 */
interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  description: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Size mapping for different card variants with wider text
const sizeMap = {
  sm: {
    card: 'h-40 w-[36rem]',  // Wider and taller for better text flow
    title: 'text-4xl',      // Larger base text size
    description: 'text-xl'   // Larger description size
  },
  md: {
    card: 'h-48 w-[44rem]',
    title: 'text-5xl',
    description: 'text-2xl'
  },
  lg: {
    card: 'h-56 w-[52rem]',
    title: 'text-6xl',
    description: 'text-3xl'
  },
  xl: {
    card: 'h-64 w-[72rem]',
    title: 'text-7xl',
    description: 'text-4xl'
  }
};

const BentoCard = ({
  name,
  description,
  className = '',
  size = 'md',
  ...props
}: BentoCardProps) => {
  const sizeStyles = sizeMap[size] || sizeMap.md;
  
  return (
    <div
      className={cn(
        // Base styles with animations
        "group relative flex items-center justify-center bg-white rounded-lg shadow-lg",
        "transform transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]",
        // Size variants
        sizeStyles.card,
        // Custom classes
        className,
      )}
      {...props}
    >
      {/* Animated background effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg" />
      
      {/* Content - Reduced padding for more text space */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-8 py-6">
        <div className="w-full text-center">
          <h1 className={cn(
            "font-bold text-gray-900 leading-tight tracking-tight transition-all duration-300",
            "group-hover:scale-[1.02] group-hover:text-gray-800",
            "max-w-4xl mx-auto w-full", // Wider text container
            "font-[SF Pro Display]", // Explicit SF Pro font
            sizeStyles.title
          )}>
            {name}
          </h1>
          <p className={cn(
            "text-gray-600 mt-6 font-normal transition-all duration-300",
            "group-hover:text-gray-700",
            "max-w-3xl mx-auto w-full", // Slightly narrower for better readability
            "font-[SF Pro Display]", // Explicit SF Pro font
            sizeStyles.description
          )}>
            {description}
          </p>
        </div>
      </div>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-100 rounded-lg transition-all duration-300 pointer-events-none" />
    </div>
  );
};

// Export components with proper typing
export { BentoCard, BentoGrid };
export type { BentoCardProps, BentoGridProps };

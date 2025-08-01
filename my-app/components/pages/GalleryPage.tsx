"use client"

import React, { useState, useCallback, useMemo } from "react";
import { HomeDock } from "@/components/AppBar";
import Image from "next/image";

// Pre-define aspect ratio calculations for better performance
const calculateGridClass = (w: number, h: number): string => {
  const aspectRatio = w / h;
  const isWide = aspectRatio > 1.5;
  const isTall = aspectRatio < 0.7;
  
  let classes = [];
  if (isWide) classes.push("lg:col-span-2");
  if (isTall) classes.push("lg:row-span-2");
  
  return classes.join(" ");
};

const GalleryPage = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Memoized image configuration with pre-calculated values
  const imageConfig = useMemo(() => [
    { 
      src: "/pic1.jpg", 
      w: 300, 
      h: 400,
      aspectRatio: "300 / 400",
      gridClass: calculateGridClass(300, 400),
      priority: true // First few images get priority loading
    },
    { 
      src: "/pic2.jpg", 
      w: 600, 
      h: 800,
      aspectRatio: "600 / 800",
      gridClass: calculateGridClass(600, 800),
      priority: true
    },
    { 
      src: "/pic10.jpg", 
      w: 600, 
      h: 800,
      aspectRatio: "600 / 800",
      gridClass: calculateGridClass(600, 800),
      priority: true
    },
    { 
      src: "/pic4.jpg", 
      w: 300, 
      h: 400,
      aspectRatio: "300 / 400",
      gridClass: calculateGridClass(300, 400),
      priority: false
    },
    { 
      src: "/pic6.jpg", 
      w: 300, 
      h: 720,
      aspectRatio: "300 / 720",
      gridClass: calculateGridClass(300, 720),
      priority: false
    },
    { 
      src: "/pic7.jpg", 
      w: 300, 
      h: 400,
      aspectRatio: "300 / 400",
      gridClass: calculateGridClass(300, 400),
      priority: false
    },
    { 
      src: "/pic8.jpg", 
      w: 300, 
      h: 300,
      aspectRatio: "300 / 300",
      gridClass: calculateGridClass(300, 300),
      priority: false
    },
    { 
      src: "/pic9.jpg", 
      w: 300, 
      h: 585,
      aspectRatio: "300 / 585",
      gridClass: calculateGridClass(300, 585),
      priority: false
    },
    { 
      src: "/pic11.jpg", 
      w: 900, 
      h: 400,
      aspectRatio: "900 / 400",
      gridClass: calculateGridClass(900, 400),
      priority: false
    }
  ], []);

  // Optimized image load handler
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  // Memoized container style function
  const getContainerStyle = useCallback((aspectRatio: string) => ({
    aspectRatio,
    background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
    willChange: "transform, box-shadow" // Hint for GPU acceleration
  }), []);

  return (
    <div className="min-h-screen bg-black p-2 pt-6">
      {/* Preload critical images */}
      <div className="hidden">
        {imageConfig.slice(0, 3).map((image, index) => (
          <link
            key={`preload-${index}`}
            rel="preload"
            as="image"
            href={image.src}
          />
        ))}
      </div>

      <div className="mx-auto grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imageConfig.map((image, index) => (
          <div
            key={`gallery-${index}`}
            className={`
              relative overflow-hidden rounded-xl transition-all duration-300 
              hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] 
              ${image.gridClass}
              ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'}
            `}
            style={getContainerStyle(image.aspectRatio)}
          >
            {/* Optimized placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
            
            <Image
              src={image.src}
              alt={`Gallery image ${index + 1}`}
              fill
              className={`
                object-cover transition-opacity duration-500
                ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'}
              `}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={image.priority}
              quality={85} // Optimized quality for faster loading
              onLoad={() => handleImageLoad(index)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        ))}
      </div>
      <HomeDock />
    </div>
  );
};

export default GalleryPage;

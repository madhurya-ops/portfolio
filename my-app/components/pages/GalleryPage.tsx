"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { HomeDock } from "@/components/AppBar";
import Image from "next/image";

// Pre-define aspect ratio calculations for better performance
const calculateGridClass = (w: number, h: number): string => {
  const aspectRatio = w / h;
  const isWide = aspectRatio > 1.5;
  const isTall = aspectRatio < 0.7;
  
  const classes = [];
  if (isWide) classes.push("lg:col-span-2");
  if (isTall) classes.push("lg:row-span-2");
  
  return classes.join(" ");
};

// Static image configuration with ORIGINAL SIZES maintained
const IMAGE_CONFIG = [
  { 
    src: "/pic1.jpg", 
    w: 300, 
    h: 400,
    aspectRatio: "300 / 400",
    gridClass: calculateGridClass(300, 400),
    priority: true
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
] as const;

// Optimized high-quality blur placeholder
const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// Optimized Image Component with intersection observer
const OptimizedImage = React.memo(({ 
  image, 
  index, 
  onLoad 
}: { 
  image: typeof IMAGE_CONFIG[0], 
  index: number, 
  onLoad: (index: number) => void 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad(index);
  }, [index, onLoad]);

  const containerStyle = useMemo(() => ({
    aspectRatio: image.aspectRatio,
    background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
    willChange: isVisible ? "transform, box-shadow" : "auto"
  }), [image.aspectRatio, isVisible]);

  return (
    <div
      ref={imgRef}
      className={`
        relative overflow-hidden rounded-xl transition-all duration-300 
        hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] 
        ${image.gridClass}
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
      `}
      style={containerStyle}
    >
      <div className={`
        absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 
        ${isLoaded ? 'opacity-0' : 'opacity-100'}
        transition-opacity duration-500
      `} />
      
      {isVisible && (
        <Image
          src={image.src}
          alt={`Gallery image ${index + 1}`}
          fill
          className={`
            object-cover transition-opacity duration-500
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={image.priority}
          quality={85}
          onLoad={handleLoad}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const GalleryPage = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Optimized image load handler with batched updates
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-black p-2 pt-6">
      {/* Preload critical images */}
      <div className="hidden">
        {IMAGE_CONFIG.slice(0, 3).map((image, index) => (
          <link
            key={`preload-${index}`}
            rel="preload"
            as="image"
            href={image.src}
          />
        ))}
      </div>

      <div className="mx-auto grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGE_CONFIG.map((image, index) => (
          <OptimizedImage
            key={`gallery-${index}`}
            image={image}
            index={index}
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      <HomeDock />
    </div>
  );
};

export default GalleryPage;

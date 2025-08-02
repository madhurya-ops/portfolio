"use client"

import React, { useState, useCallback } from "react";
import { HomeDock } from "@/components/AppBar";
import Image from "next/image";

interface ImageData {
  src: string;
  w: number;
  h: number;
  aspectRatio: string;
  gridClass: string;
  priority: boolean;
}

const calculateGridClass = (w: number, h: number): string => {
  const aspectRatio = w / h;
  const classes = [];
  if (aspectRatio > 1.5) classes.push("lg:col-span-2");
  if (aspectRatio < 0.7) classes.push("lg:row-span-2");
  return classes.join(" ");
};

const imageConfig: ImageData[] = [
  { src: "/pic1.jpeg", w: 445, h: 470, aspectRatio: "445 / 470", gridClass: calculateGridClass(445, 470), priority: true },
  { src: "/pic2.JPG", w: 900, h: 470, aspectRatio: "900 / 470", gridClass: calculateGridClass(900, 470), priority: true },

  { src: "/pic3.jpg", w: 300, h: 400, aspectRatio: "300 / 400", gridClass: calculateGridClass(300, 400), priority: false },
  { src: "/pic4.jpg", w: 300, h: 400, aspectRatio: "300 / 400", gridClass: calculateGridClass(300, 400), priority: false },
  { src: "/pic5.jpeg", w: 300, h: 720, aspectRatio: "300 / 720", gridClass: calculateGridClass(300, 720), priority: false },
  
  { src: "/pic9.JPG", w: 300, h: 585, aspectRatio: "300 / 585", gridClass: calculateGridClass(300, 585), priority: false },
  { src: "/pic6.jpeg", w: 300, h: 400, aspectRatio: "300 / 400", gridClass: calculateGridClass(300, 400), priority: false },
  { src: "/pic8.jpeg", w: 300, h: 265, aspectRatio: "300 / 265", gridClass: calculateGridClass(300, 265), priority: false },
  

  { src: "/pic11.jpeg", w: 300, h: 565, aspectRatio: "300 / 565", gridClass: calculateGridClass(300, 565), priority: false },
  { src: "/pic10.jpeg", w: 1000, h: 470, aspectRatio: "1000 / 470", gridClass: calculateGridClass(1000, 470), priority: false },
  
];


export default function GalleryPage() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  return (
    <div className="min-h-screen bg-black p-2 pt-6">
      <div className="hidden">
        {imageConfig.slice(0, 3).map((image, index) => (
          <link key={index} rel="preload" as="image" href={image.src} />
        ))}
      </div>

      <div className="mx-auto grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imageConfig.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] ${image.gridClass} ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'}`}
            style={{
              aspectRatio: image.aspectRatio,
              background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
            <Image
              src={image.src}
              alt={`Gallery image ${index + 1}`}
              fill
              className={`object-cover transition-opacity duration-500 ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={image.priority}
              quality={85}
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
}

import React from "react";
import { HomeDock } from "@/components/AppBar";
import Image from "next/image";

const GalleryPage = () => {
  const images = [
    { src: "/pic1.jpg", w: 300, h: 400 },
    { src: "/pic2.jpg", w: 600, h: 800 },
    { src: "/pic10.jpg", w: 600, h: 800 },
    { src: "/pic4.jpg", w: 300, h: 400 },
    //{ src: "/pic5.JPG", w: 600, h: 300 },
    { src: "/pic6.jpg", w: 300, h: 720 },
    { src: "/pic7.jpg", w: 300, h: 400 },
    { src: "/pic8.jpg", w: 300, h: 300 },
    { src: "/pic9.jpg", w: 300, h: 585 },
    { src: "/pic11.jpg", w: 900, h: 400 },
    
    
    
  ];

  const getGridItemClass = (w: number, h: number) => {
    const aspectRatio = w / h;
    const isWide = aspectRatio > 1.5;
    const isTall = aspectRatio < 0.7;
    
    return `${isWide ? "lg:col-span-2" : ""} ${isTall ? "lg:row-span-2" : ""}`.trim();
  };

  const getContainerStyle = (w: number, h: number) => ({
    aspectRatio: `${w} / ${h}`,
    background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)"
  });

  return (
    <div className="min-h-screen bg-black p-2 pt-6">
      <div className="mx-auto grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] ${getGridItemClass(image.w, image.h)}`}
            style={getContainerStyle(image.w, image.h)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <HomeDock />
    </div>
  );
};

export default GalleryPage;

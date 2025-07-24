import React from "react";
import { HomeDock } from "@/components/AppBar";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const GalleryPage = () => {
  return (
    <div>
      <h1>Gallery Page</h1>
      <p>This is the art gallery page.</p>
      <HomeDock />
    </div>
  );
};

export default GalleryPage;

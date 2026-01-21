"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";

// Import your banners
import FreshlyArrivedBanner from "/public/assets/images/shop/FreshlyArrivedBanner.png";
import FruitsBanner from "/public/assets/images/shop/FruitsBanner.png";
import HydroponicsBanner from "/public/assets/images/shop/HydroponicsBanner.png";
import GourmetBanner from "/public/assets/images/shop/GourmetBanner.png";

import vege from "/public/assets/images/shop/VeggiesBanner.png";
// Map normalized keywords -> banner images
const bannerMap: Record<string, any> = {
  "freshly-arrived": FreshlyArrivedBanner,
  "fruits": FruitsBanner,
  "hydroponics": HydroponicsBanner,
  "gourmet": GourmetBanner,
  "veggies": vege
};

// Normalizer function to handle: raw spaces, encoded spaces, mixed case
const normalize = (value?: string): string => {
  if (!value) return "";

  return decodeURIComponent(value)      // converts "%20" → " "
    .trim()                              // remove extra spaces
    .toLowerCase()                       // case-insensitive
    .replace(/\s+/g, "-");               // convert spaces → hyphens
};

const ShopHero = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const router = useRouter();

  // Example: "/shop/Freshly Arrived/2/New Items/11"
  const path = router.asPath;

  // Section = 3rd part of URL (index 2)
  const rawSection = path.split("/")[2];

  // Normalize it
  const section = normalize(rawSection);

  // Pick image OR default banner
  const selectedBanner = bannerMap[section] || FruitsBanner;

  return (
    <div className="relative w-full overflow-hidden mob:pt-[20vw]">
      <div
        className={`relative w-full ${isMobile ? "pt-[50px]" : "aspect-[2.4/1]"
          }`}
      >
        <Image
          src={selectedBanner}
          alt="Shop Section Banner"
          layout="responsive"
          width={1920}
          height={800}
          className="object-cover"
          priority
          quality={100}
        />
      </div>
    </div>
  );
};

export default ShopHero;


export const ShopHeroSingle = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1024px)");
  const router = useRouter();


  return (
    <div className="relative w-full overflow-x-hidden">
      {/* HERO HEIGHT - Reduced height */}
      <div
        className="
          relative w-full
          h-[40vw]         
          bg-[#f7f1dc]
          mob:h-[100vw]         
        "
      >
        <Image
          src={isMobile ? "https://cdn.originfresh.in/website/banners-jan-21-2026-01.webp" : "https://cdn.originfresh.in/website/banners-jan-21-202602.webp"}
          alt="Shop Hero Single Banner"
          fill
          priority
          quality={100}
          className="object-fit"
        />
      </div>
    </div>
  );
};
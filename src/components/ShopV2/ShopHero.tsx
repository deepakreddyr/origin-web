"use client";

import React,{useEffect} from "react";
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
    <div className="relative w-full overflow-hidden mob:pt-[20px]">
      <div
        className={`relative w-full ${
          isMobile ? "pt-[50px]" : "aspect-[2.4/1]"
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

  useEffect(() => {
    router.prefetch("/nectacot/567");
  }, [router]);

  return (
    <div className="relative w-full overflow-hidden mob:pt-[20px]">
      <div
        className={`relative w-full ${
          isMobile ? "pt-[50px]" : "aspect-[2.4/1]"
        }`}
      >
        {/* Background Image */}
        <div className="w-full relative">
          <Image
            src="https://cdn.originfresh.in/website/landingbanner.png"
            alt="Shop Hero Single Banner"
            layout="responsive"
            width={1920}
            height={800}
            className="object-cover"
            priority
            quality={100}
          />
        </div>

        {/* Button */}
        <div className="absolute inset-0 z-0 flex items-center justify-start">
          <button
            onClick={() =>
              router.push("/nectacot/567")
            }
            className={`
              absolute bg-[#FFD600] text-black font-[SofiaPro] font-semibold rounded-lg
              ${
                isMobile
                  ? "scale-[0.5] left-[6.5%] top-[78%] text-[4vw] py-2 px-6"
                  : isTablet
                    ? "scale-100 left-[6.5%] top-[70%] text-[1.4vw] py-2 px-6"
                    : "scale-100 left-[7%] top-[70%] text-[1.1vw] py-3 px-10"
              }
            `}
            style={{ transformOrigin: "left top" }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};
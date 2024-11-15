import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import OriginCarousel from "@/components/OriginCarousel"; // Adjust the path as necessary
import OriginButton from "@/components/OriginButton"; // Adjust the path as necessary
import CarouselButtons from "@/components/CarouselButtons"; // Adjust the path as necessary
import CA from "classnames";
import { Blog } from "@/utilities/types";
import OriginCardv2 from "@/components/Cards/OriginCardv2";
import { useRouter } from "next/router";

interface PopularBlogsProps {
  popularBlogs: Blog[];
}

const PopularBlogsSection: React.FC<PopularBlogsProps> = ({ popularBlogs }) => {
  const [sliderMarginLeft, setSliderMarginLeft] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const updateMarginLeft = () => {
      if (window.innerWidth >= 1150) {
        const sliderButtons = document.querySelector<HTMLElement>(
          ".poBlogs-sliderButtons"
        );
        if (sliderButtons) {
          setSliderMarginLeft(sliderButtons.offsetLeft);
        }
      } else {
        setSliderMarginLeft(0);
      }
    };

    // Initial update
    updateMarginLeft();

    // Update on resize
    window.addEventListener("resize", updateMarginLeft);
    return () => {
      window.removeEventListener("resize", updateMarginLeft);
    };
  }, []);

  return (
    <Container
      classes={{ maxWidthLg: "max-w-full px-0" }}
      style={
        {
          "--slider-margin-left": `${sliderMarginLeft}px`,
        } as React.CSSProperties
      }
    >
      <Container>
        <Typography variant="h5" className="mb-14">
          The Fresh Harvest Club
        </Typography>
      </Container>
      <OriginCarousel
        className={CA("poBlogs-slider")}
        slides={popularBlogs?.map((blog) => (
          <OriginCardv2
            classes={{
              cardRoot:
                "md:flex-[0_0_auto] md:hover:scale-100 transition-none flex-[0_0_250px] ",
            }}
            key={blog.date}
            item={blog}
          />
        ))}
        slidesPerView={3.85}
        spaceBetween={53}
        freeMode={{ enabled: true }}
        mousewheel={{
          forceToAxis: true,
        }}
        speed={1000}
        navigation={{
          nextEl: ".poBlogsRight",
          prevEl: ".poBlogsLeft",
        }}
      />
      <Container className="poBlogs-sliderButtons">
        <Box className="flex md:flex-row flex-wrap justify-center md:justify-between gap-5 m-0 mt-3">
          <OriginButton
            handleClick={() => router.push("/blogs")}
            variant="outlined"
            buttonText="Read more blogs"
            classes={{ iconButton: "py-2 px-4 md:py-4 md:px-7" }}
          />
          <CarouselButtons
            leftButtonClass="poBlogsRight"
            rightButtonClass="poBlogsLeft"
          />
        </Box>
      </Container>
    </Container>
  );
};

export default PopularBlogsSection;

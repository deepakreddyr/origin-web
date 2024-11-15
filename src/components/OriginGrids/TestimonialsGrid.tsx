import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RoundContainer from "../RoundContainer"; // Adjust the path as necessary
import TestimonialCard from "../Cards/TestimonialCard"; // Adjust the path as necessary
import classNames from "classnames";
import { Masonry } from "@mui/lab";
import OriginCarousel from "../OriginCarousel";
import ShowMoreSection from "../ShowMoreSection"; // Import the new component
import useDataToParent from "../../hooks/getDataToParent";

type Testimonial = {
  user: {
    image: string;
    title: string;
    subtitle: string;
  };
  content: string;
};

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const initialVisibleItems = 8;
  const totalTestimonials = testimonials.length;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isExpanded, setIsExpanded, handleShowAllChange } =
    useDataToParent(false);
  return (
    <Container className="px-0 md:px-5">
      <RoundContainer className="px-0 md:px-11 pt-[72px] md:pb-0 transition-all duration-500 ease-in-out">
        <Typography
          variant="h5"
          className="mb-8 md:mb-11 px-5 md:px-0 md:text-center"
        >
          Customer Stories
        </Typography>
        <Box
          className={classNames(
            "relative after:transition-all after:duration-1000 transition-all ease-in-out duration-1000",
            isMobile || isExpanded
              ? "after:translate-y-[144px] after:opacity-0 md:pb-[100px]"
              : "after:after:translate-y-0  after:opacity-1",
            "after:bg-gradient-to-t after:z-[1] after:from-white after:to-transparent after:absolute after:bottom-0 after:h-[144px] after:w-full"
          )}
        >
          {!isMobile ? (
            <ShowMoreSection
              initialVisibleItems={initialVisibleItems}
              totalItems={totalTestimonials}
              onShowAllChange={handleShowAllChange}
              classes={{
                buttonsContainer: classNames("absolute z-10 bottom-5"),
              }}
            >
              <Masonry columns={{ xs: 1, md: 3, lg: 4 }} spacing={2}>
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} />
                ))}
              </Masonry>
            </ShowMoreSection>
          ) : (
            <OriginCarousel
              navigation={false}
              slideClassName="first-of-type:ps-5 md:first-of-type:px-0"
              loop
              mousewheel={{
                forceToAxis: true,
              }}
              spaceBetween={20}
              slides={testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            />
          )}
        </Box>
      </RoundContainer>
    </Container>
  );
};

export default TestimonialsSection;

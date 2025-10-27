import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import HTMLReactParser from "html-react-parser";
import { CareersData } from "../../utilities/types";

interface HeroBannerProps {
  data: CareersData["banner"];
}

const HeroBanner = ({ data }: HeroBannerProps) => {
  return (
    <div className="relative z-[3] flex lg:flex-row flex-col items-end gap-10 lg:gap-0 bg-[#F8F4E9] mt-[142px] lg:mt-0 h-fit lg:h-screen">
      <Box className="relative top-0 right-0 lg:absolute rounded-[0_0_1.25rem_1.25rem] lg:rounded-[0_0_0_5rem] w-full lg:w-[36.1875rem] h-[21.875rem] lg:h-screen overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src={data?.bannerImage?.url}
          alt={data?.bannerImage?.alt}
          title={data?.bannerImage?.title}
          width={1000}
          height={1000}
          priority={true}
        />
      </Box>

      <Container maxWidth="lg" className="px-5 lg:px-4">
        <Stack className="gap-4 lg:gap-[2.0625rem] pb-14 lg:pb-[9.9375rem] max-w-full lg:max-w-[39.25rem]">
          <Typography
            variant="body1"
            className="font-medium text-[0.875rem] lg:text-[1.375rem] leading-[22.4px] lg:leading-[1.925rem]"
          >
            {HTMLReactParser(data?.title)}
          </Typography>

          <Typography
            variant="h1"
            className="font-semibold text-[#25874D] text-[2.5rem] lg:text-[3.8rem] xl:text-[4rem] leading-[2.75rem] lg:leading-[4.4rem]"
          >
            {HTMLReactParser(data?.desc)}
          </Typography>

          <Button className="relative bg-primary hover:bg-primary px-6 lg:px-[2rem] py-2 lg:py-[0.9063rem] rounded-full w-fit font-slab font-medium text-[#231F20] text-[0.875rem] lg:text-lg normal-case">
            {HTMLReactParser(data?.button?.label || "")}
            <Typography
              variant="body1"
              className="top-[-0.625rem] right-[0.625rem] absolute bg-black rounded-full w-[1.1875rem] lg:w-[23px] h-[1.1875rem] lg:h-[1.4375rem] font-slab font-medium text-[12px] text-white lg:text-[14px] df"
            >
              {HTMLReactParser(data?.button?.data || "")}
            </Typography>
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default HeroBanner;

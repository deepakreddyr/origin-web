import { CareersData, overlapCardsList } from "../../../utilities/types";
import { Box, Stack, Typography } from "@mui/material";
import HTMLReactParser from "html-react-parser";
import Image from "next/image";
import React from "react";

interface CarersInfoCardProps {
  data: overlapCardsList;
}

const CarersInfoCard = ({ data }: CarersInfoCardProps) => {
  return (
    <Stack
      alignItems={"center"}
      className="w-full md:w-[300px] mx-auto gap-4 md:gap-8"
    >
      <Image
        src={data?.bannerImage?.url}
        alt={data?.bannerImage?.url || ""}
        title={data?.bannerImage?.url || ""}
        height={104}
        width={104}
        className=""
      />
      <Box className="flex flex-col gap-3">
        <Typography
          variant="h1"
          className="text-[14px] font-[Pro] font-bold leading-[22.4px] md:text-[22px] md:font-extrabold md:leading-[30.8px] text-center"
        >
          {HTMLReactParser(data?.title)}
        </Typography>
        <Typography
          variant="body1"
          className="text-[12px] font-[SofiaPro] leading-[19.2px] md:text-[18px] font-light md:leading-[28.8px] text-center"
        >
          {HTMLReactParser(data?.desc)}
        </Typography>
      </Box>
    </Stack>
  );
};

export default CarersInfoCard;

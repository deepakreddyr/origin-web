import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import HTMLReactParser from "html-react-parser";
import { overlapCardsList } from "../../utilities/types";
import CA from "classnames";

interface OverlapPinnedCardsProps {
  data: overlapCardsList;
  className?: string;
  index: string;
}

const OverlapPinnedCards = ({
  data,
  className,
  index,
}: OverlapPinnedCardsProps) => {
  return (
    <div
      className={CA(
        " sticky flex rounded-t-[35px] pt-[30px] lg:pt-[40px] px-[20px] md:px-0",
        className
      )}
    >
      <Container
        maxWidth="lg"
        className="flex flex-col gap-[16px] md:gap-[30px] lg:gap-[40px] px-0 md:px-[100px] lg:px-0"
      >
        <Stack
          justifyContent={"space-between"}
          className="flex-row items-start"
        >
          <Typography
            variant="h1"
            className="font-semibold text-[#25874D] text-[28px] lg:text-[56px] xs:text-[32px] leading-[38.4px] lg:leading-[61.6px] whitespace-nowrap"
          >
            {HTMLReactParser(data?.title || "")}
          </Typography>
          <Typography
            variant="h1"
            className="font-semibold text-[#25874D] text-[28px] lg:text-[48px] leading-[40.8px] lg:leading-[52.8px]"
          >
            {HTMLReactParser(index || "")}
          </Typography>
        </Stack>
        <Stack
          justifyContent={"space-between"}
          className="md:flex-row flex-col gap-[58px] md:gap-[30px] h-full overflow-hidden"
        >
          <Typography
            variant="body1"
            className="max-w-[551px] font-slab font-light text-[14px] text-left lg:text-[18px] leading-[22.4px] lg:leading-[28.8px]"
          >
            {HTMLReactParser(data?.desc || "")}
          </Typography>

          <Image
            className={CA(
              "object-cover object-top w-full md:w-[358px] lg:w-[458px] h-full rounded-t-[30px]"
            )}
            src={data?.bannerImage?.url}
            alt={data?.bannerImage?.alt}
            title={data?.bannerImage?.title}
            width={458}
            height={606}
            priority={true}
          />
        </Stack>
      </Container>
    </div>
  );
};

export default OverlapPinnedCards;

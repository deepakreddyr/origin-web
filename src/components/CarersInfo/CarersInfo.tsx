import { Box, Container, Stack, Typography } from "@mui/material";
import HTMLReactParser from "html-react-parser";
import { CareersData } from "../../utilities/types";
import CarersInfoCard from "./_components/CarersInfoCard";

interface CarersInfoProps {
  data: CareersData["infoCards"];
}

const CarersInfo = ({ data }: CarersInfoProps) => {
  return (
    <div className="relative flex flex-col items-center bg-[#FFFFFF] py-[80px] md:py-[150px] h-fit">
      <Container
        maxWidth="lg"
        className="flex flex-col gap-[40px] md:gap-[60px]"
      >
        <Stack alignItems={"center"} gap={3}>
          <Typography
            variant="h1"
            className="font-semibold text-[#25874D] text-[40px] text-center lg:text-[60.8px] xl:text-[64px] leading-[44px] lg:leading-[70.4px]"
          >
            {HTMLReactParser(data?.title)}
          </Typography>
          <Typography
            variant="body1"
            className="max-w-[548px] font-light text-[18px] text-center leading-[28.8px]"
          >
            {HTMLReactParser(data?.desc)}
          </Typography>
        </Stack>

        <Box className="gap-x-4 gap-y-10 md:gap-5 grid grid-cols-2 md:grid-cols-3">
          {data?.cardLists?.map((card, index) => {
            return <CarersInfoCard data={card} key={index} />;
          })}
        </Box>
      </Container>
    </div>
  );
};

export default CarersInfo;

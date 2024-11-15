import { Container, Stack, Typography } from "@mui/material";

const OurLocations = () => {
  return (
    <div className="bottom-0 z-[2] sticky bg-[#CFE6D2] -mt-16 rounded-b-[20px] md:rounded-b-[64px]">
      <Container maxWidth="lg">
        <Stack
          justifyContent={"space-between"}
          className="md:flex-row flex-col pt-[120px] md:pt-[194px] pb-[60px] md:pb-[130px]"
        >
          <Typography className="mb-[50px] md:mb-0 max-w-[100px] md:max-w-max font-[Stinger] font-normal text-[#25874D] text-[40px] md:text-5xl leading-[44px] md:leading-[70.4px]">
            Our Locations
          </Typography>
          <Stack className="md:flex-row flex-col gap-[30px] md:gap-[60px]">
            <Stack
              direction="column"
              className="gap-[5px] md:gap-[12px] w-full max-w-[300px]"
            >
              <Typography className="font-[Stinger] font-normal text-[22px] text-black md:text-[28px] leading-[30px]">
                Bengaluru
              </Typography>
              <Typography className="font-[SofiaPro] font-light text-[#231F20] text-sm md:text-base">
                838, 2nd Floor, 7th Main Rd, 2nd Stage, Sodepur, Appareddipalya,
                Indiranagar, Bengaluru, Karnataka 560038
              </Typography>
            </Stack>
            <Stack
              direction="column"
              className="gap-[5px] md:gap-[12px] w-full max-w-[300px]"
            >
              <Typography className="font-[Stinger] font-normal text-[22px] text-black md:text-[28px] leading-[30px]">
                Chennai
              </Typography>
              <Typography className="font-[SofiaPro] font-light text-[#231F20] text-sm md:text-base">
                No. 14, Reddy Street, Nerkundram, Chennai, Tamil Nadu, 600107
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
};

export default OurLocations;

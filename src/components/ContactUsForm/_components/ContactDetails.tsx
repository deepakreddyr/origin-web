import { Stack, Typography } from "@mui/material";

const ContactDetails = () => {
  return (
    <Stack
      direction="column"
      justifyContent={"space-between"}
      className="pb-10 md:pt-[21px] md:pb-[71px] gap-[60px] md:gap-0"
    >
      <Typography
        variant="h1"
        className="text-[64px] leading-[70.4px] text-[#25874D] font-normal"
      >
        Contact Us
      </Typography>

      <Stack direction="column" className="gap-[30px] md:gap-10">
        <Stack direction="column" className="gap-1 md:gap-3">
          <Typography className="text-[#00000099] text-lg font-slab font-light">
            Call us
          </Typography>
          <Typography className="font-slab text-[28px] leading-[30px] text-black font-normal">
            04446276129
          </Typography>
        </Stack>
        <Stack direction="column" className="gap-1 md:gap-3">
          <Typography className="text-[#00000099] text-lg font-slab font-light">
            Email us
          </Typography>
          <Typography className="font-slab text-[28px] leading-[30px] text-black font-normal">
            support@originfresh.in
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContactDetails;

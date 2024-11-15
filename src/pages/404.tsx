import { Logo } from "@/components/Header";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { NextPage } from "next";

const NotFoundPage: NextPage = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box className="place-content-center grid bg-[#000] bg-repeat h-dvh mix-blend-screen">
      <Box className="flex md:flex-row xs:flex-row flex-col items-center md:gap-10 w-max">
        <Logo className="min-w-[120px] sm:min-w-[200px] md:min-w-[300px] max-w-full h-[auto!important] animate-pulse fill-white ms-0" />
        <Typography
          variant="body1"
          component={"div"}
          className="max-w-screen-lg font-normal text-center text-oGrey-200 text-wrap ms-5"
        >
          <Typography variant={isMobile ? "h5" : isTablet ? "h4" : "h4"}>
            <span className="font-light">not </span>
            Found!
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFoundPage;

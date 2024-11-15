import { Marquee } from "@devnomic/marquee";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const featureList = [
  "🥑 More than 500 products",
  "⏰ Priority Deliveries",
  "🚛 Easy Refunds/Returns",
];

const PrimaryFeature = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Container className="relative z-10 flex md:justify-evenly gap-11 bg-primary-100 mt-[-57.5px] px-0 md:px-20 py-11 rounded-none lg:rounded-[210px] md:overflow-[unset] overflow-x-auto noscrollbar">
      {isMobile ? (
        <Marquee
          className="gap-[3rem] [--duration:15s] text-nowrap"
          innerClassName="gap-[3rem] [--gap:3rem]"
        >
          {featureList.map((text, index) => (
            <Typography
              key={index}
              variant="body1"
              className="flex items-center gap-3 w-max text-[18px] text-nowrap"
            >
              <span>{text.split(" ")[0]}</span>
              {text.slice(2)}
            </Typography>
          ))}
        </Marquee>
      ) : (
        featureList.map((text, index) => (
          <Typography
            key={index}
            variant="body1"
            className="flex items-center gap-3 w-max text-[18px] text-nowrap"
          >
            <span className="text-3xl">{text.split(" ")[0]}</span>
            {text.slice(2)}
          </Typography>
        ))
      )}
    </Container>
  );
};
export default PrimaryFeature;

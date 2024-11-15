import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { CardMedia } from "@mui/material"; // Removed Grid import

type USPPROPS = {
  cardData: {
    icon: string;
    title: string;
  };
};

const UspCard = ({ cardData }: USPPROPS) => {
  const { icon, title } = cardData;
  return (
    <Card style={{ boxShadow: "none" }}>
      <Box className="flex flex-col items-center py-6">
        <CardMedia
          component="img"
          className="mb-8 w-[104px]"
          image={icon}
          alt={title}
        />
        <Typography
          variant="body1"
          className="px-6 md:px-0 text-black text-center text-sm md:text-[22px] md:leading-[30px]"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>
      </Box>
    </Card>
  );
};

export default UspCard;

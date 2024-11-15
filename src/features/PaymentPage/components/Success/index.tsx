import { Box, Typography } from "@mui/material";
import Lottie from "react-lottie";

import OrderSuccessJson from "../../../../assets/json/Success.json";

const Success = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: OrderSuccessJson,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={200}
        width={200}
      />
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: "500",
        }}
      >
        Thanks For Your Order
      </Typography>
    </Box>
  );
};

export default Success;

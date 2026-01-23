import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import NoDataIcon from "../../../../../public/assets/svg/no-address.svg";

interface Props {
  onEditAddress: any;
}

const NoData = (props: Props) => {
  const { onEditAddress } = props;
  return (
    <Box
      className="no-data"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Changed to center
        textAlign: "center",
        gap: 1,
        height: "100%", // Take full height of container
        minHeight: "60vh", // Minimum height to ensure vertical centering looks good
      }}
    >
      <Box
        sx={{
          width: "80px",
          height: "80px",
          marginBottom: "20px",
          position: "relative"
        }}
      >
        <Image src={NoDataIcon} alt="No Address" fill style={{ objectFit: 'contain' }} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontFamily: "SofiaPro",
          fontSize: "20px",
          color: "#000",
          marginBottom: "8px"
        }}
      >
        No addresses saved
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "rgba(0, 0, 0, 0.60)",
          fontFamily: "SofiaPro",
          fontSize: "14px",
          maxWidth: "80%",
          lineHeight: 1.5
        }}
      >
        Add address by clicking on the + New Address button below.
      </Typography>
    </Box>
  );
};

export default NoData;

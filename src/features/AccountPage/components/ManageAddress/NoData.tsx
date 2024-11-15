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
        justifyContent: "between",

        textAlign: "center",
        gap: 1,
        paddingTop: "20px",
        paddingBottom: "20px",
        height: "74vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "8vw",
        }}
      >
        <Image src={NoDataIcon} alt="" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, fontFamily: "SofiaPro", fontSize: "20px" }}
          >
            No addresses saved
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(0, 0, 0, 0.60)",
              fontFamily: "SofiaPro",
              fontSize: "14px",
            }}
          >
            Add address by clicking on the + New Address button below.
          </Typography>
        </Box>
      </Box>
      {/* <Button
        variant="contained"
        color="success"
        sx={{
          marginTop: "auto",
          backgroundColor: "#FFDD00",
          color: "black",
          borderRadius: "25px",
          fontFamily: "SofiaPro",
          fontSize: "16px",
          fontWeight: 600,
          textTransform: "capitalize",
          boxShadow: "none",
          width: "100%",
          ":hover": {
            backgroundColor: "#ffdd00a6",
            color: "black",
            boxShadow: "none",
          },
        }}
        onClick={onEditAddress}
      >
        + New Address
      </Button> */}
    </Box>
  );
};

export default NoData;

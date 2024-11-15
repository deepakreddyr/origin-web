import { Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import * as React from "react";

import { serviceabilityCheck } from "../../context/atoms";

export default function ServiceabilityDropDown() {
  const serviceData = useAtomValue(serviceabilityCheck);

  const renderSuccessService = () => {
    return (
      <Typography
        sx={{
          fontWeight: "500",
          padding: "1.5rem",
          fontSize: "12px",
          color: "#00855B",
        }}
      >
        Right on 🙌 We are delivering to this location!
      </Typography>
    );
  };
  const renderFailService = () => {
    return (
      <Typography
        sx={{
          fontWeight: "500",
          padding: "1.5rem",
          fontSize: "12px",
          color: "#FC2F2F",
        }}
      >
        Far-out 🍂 We are not yet there...try another location
      </Typography>
    );
  };

  if (serviceData.loading)
    return (
      <Typography
        sx={{ fontWeight: "500", padding: "1.5rem", fontSize: "12px" }}
      >
        Checking for Serviceability...
      </Typography>
    );

  if (serviceData.isDeliverable) return renderSuccessService();

  return renderFailService();
}

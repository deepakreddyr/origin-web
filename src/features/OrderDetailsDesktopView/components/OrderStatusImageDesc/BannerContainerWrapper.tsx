import { Box } from "@mui/material";
import type { ReactNode } from "react";

const BannerContainerWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "10%",
        right: "12%",
        backgroundColor: "#00855B",
        padding: "0.2rem",
        borderRadius: "10px",
        color: "#ffffff",
      }}
    >
      <Box
        sx={{
          padding: "0.5rem 1rem",
          borderRadius: "10px",
          border: "1px solid #C6C6C6",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-7px",
            left: "10px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
        <span
          style={{
            position: "absolute",
            top: "-7px",
            right: "10px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
        {children}
        <span
          style={{
            position: "absolute",
            bottom: "0px",
            left: "10px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
        <span
          style={{
            position: "absolute",
            bottom: "0px",
            right: "10px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
      </Box>
    </Box>
  );
};

export default BannerContainerWrapper;

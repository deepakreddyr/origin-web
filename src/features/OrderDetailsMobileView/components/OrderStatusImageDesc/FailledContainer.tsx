import { Box } from "@mui/material";
import type { ReactNode } from "react";

const FailedContainerWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "15px",
        right: "15px",
        backgroundColor: "#854000",
        padding: "0.2rem",
        borderRadius: "5px",
        color: "#fff",
        minWidth: "100px",
      }}
    >
      <Box
        sx={{
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          border: "1px solid #C6C6C6",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-6px",
            left: "8px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "8px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
        {children}
        <span
          style={{
            position: "absolute",
            bottom: "3px",
            left: "8px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
        <span
          style={{
            position: "absolute",
            bottom: "3px",
            right: "8px",
            fontSize: "1rem",
          }}
        >
          .
        </span>
      </Box>
    </Box>
  );
};

export default FailedContainerWrapper;

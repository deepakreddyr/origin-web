import { FacebookRounded, Instagram, LinkedIn } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import Link from "next/link";
import React from "react";

const SocialLinks = () => {
  return (
    <Grid
      item
      xs={12}
      sx={{
        display: "flex",
        gap: { xs: "20px", sm: "24px" },
        mt: { xs: "40px", sm: "48px" },
      }}
    >
      <Link href={"https://www.instagram.com/originfresh.in/"} passHref>
        <IconButton
          component="a"
          sx={{
            backgroundColor: "#CFE6D2", // Replace with your theme color
            borderRadius: "8px",
            opacity: "2",
            padding: "8px",
          }}
        >
          <Instagram sx={{ width: "32px", height: "32px" }} />
        </IconButton>
      </Link>
      <Link
        href={"https://www.linkedin.com/company/origin-fresh-tech/"}
        passHref
      >
        <IconButton
          component="a"
          sx={{
            backgroundColor: "#CFE6D2", // Replace with your theme color
            borderRadius: "8px",
            opacity: "2",
            padding: "8px",
          }}
        >
          <LinkedIn sx={{ width: "32px", height: "32px" }} />
        </IconButton>
      </Link>
      <Link
        href={"https://www.facebook.com/profile.php?id=61553773096182"}
        passHref
      >
        <IconButton
          component="a"
          sx={{
            backgroundColor: "#CFE6D2", // Replace with your theme color
            borderRadius: "8px",
            opacity: "2",
            padding: "8px",
          }}
        >
          <FacebookRounded sx={{ width: "32px", height: "32px" }} />
        </IconButton>
      </Link>
    </Grid>
  );
};

export default SocialLinks;

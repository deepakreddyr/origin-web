import { Grid } from "@mui/material";
import React from "react";
import { FacebookRounded, Instagram, LinkedIn } from "@mui/icons-material";

const SocialLinks = () => {
  return (
    <Grid item xs={12} className="flex gap-5 sm:gap-6 mt-10 sm:mt-12">
      <a
        href="https://www.instagram.com/originfresh.in?igsh=ZXYxNnFvYXR4cWd5"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-secondary-200 rounded-lg p-1"
      >
        <Instagram className="w-8 h-8" />
      </a>
      <a
        href="https://www.linkedin.com/company/origin-fresh-tech/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-secondary-200 rounded-lg p-1"
      >
        <LinkedIn className="w-8 h-8" />
      </a>
      {/* <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-secondary-200 rounded-lg p-1"
      >
        <FacebookRounded className="w-8 h-8" />
      </a> */}
    </Grid>
  );
};

export default SocialLinks;

import { Grid } from "@mui/material";
import React from "react";
import { FacebookRounded, Instagram, LinkedIn } from "@mui/icons-material";
import Link from "next/link";

const SocialLinks = () => {
  return (
    <Grid item xs={12} className="flex gap-5 sm:gap-6 mt-10 sm:mt-12">
      <Link href={"#"} className={"bg-secondary-200 rounded-lg p-1"}>
        <Instagram className="w-8 h-8" />
      </Link>
      <Link href={"#"} className={"bg-secondary-200 rounded-lg p-1"}>
        <LinkedIn className="w-8 h-8" />
      </Link>
      <Link href={"#"} className={"bg-secondary-200 rounded-lg p-1"}>
        <FacebookRounded className="w-8 h-8" />
      </Link>
    </Grid>
  );
};

export default SocialLinks;

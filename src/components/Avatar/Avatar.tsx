import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Box, Typography } from "@mui/material";

type AvatarProps = {
  avatar: { image: string; title: string; subtitle: string };
};
export default function OriginAvatar({ avatar }: AvatarProps) {
  return (
    <Stack direction="row" className="gap-[18px]">
      <Avatar
        className="place-content-center grid bg-primary rounded-xl"
        variant="rounded"
        alt={avatar.title}
        src={avatar.image}
      />
      <Box className="flex flex-col">
        <Typography variant="body1" className="font-normal text-black text-sm">
          {avatar.title}
        </Typography>
        <Typography
          variant="body1"
          className="font-light text-gray-600 text-xs"
        >
          {avatar.subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

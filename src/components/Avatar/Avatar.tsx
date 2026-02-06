import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Box, Typography } from '@mui/material';

type AvatarProps = {
  avatar: { image: string; title: string; subtitle: string };
};
export default function OriginAvatar(props: any) {
  const { avatar } = props;

  // Support both nested user object (Testimonial type) and flat structure
  const image = avatar.user?.image || avatar.image;
  const title = avatar.user?.title || avatar.client_name || avatar.title;
  const subtitle = avatar.user?.subtitle || avatar.company || avatar.subtitle;

  return (
    <Stack direction="row" className="gap-[18px]">
      {/* <Avatar
        className="place-content-center grid bg-primary rounded-xl"
        variant="rounded"
        alt={title}
        src={image}
      /> */}
      <Box className="flex flex-col">
        <Typography variant="body1" className="font-normal text-black text-sm">
          {title}
        </Typography>
        <Typography variant="body1" className="font-light text-gray-600 text-xs">
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

import { Box, Typography } from '@mui/material';
import React from 'react';
import OriginAvatar from '../Avatar/Avatar'; // Adjust the path as necessary

const TestimonialCard = (props: any) => {
  const { testimonial } = props;
  return (
    <Box sx={{ mb: 2 }} className="bg-secondary-100 p-4 rounded-[10px] md:rounded-3xl h-full md:h-auto">
      <OriginAvatar avatar={testimonial} />
      <Typography variant="body1" className="mt-3 md:mt-2 font-light text-xs leading-5">
        {testimonial.content}
      </Typography>
    </Box>
  );
};

export default TestimonialCard;

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface WhyOriginAndTestimonialProps {
  category: string | string[] | null;
}

const WhyOriginAndTestimonial = ({ category }: WhyOriginAndTestimonialProps) => {
  const testimonialsMap: Record<string, { quote: string; author: string; title: string }> = {
    globalveggies: {
      quote: 'I used to shop for vegetables. Now I discover them. One box had Shimeji Mushroom, Thai eggplant, and something I had to Google — and it ended up being the best thing I cooked all month.',
      author: 'Edna Muthu',
      title: 'Part time vet, full time dog pamperer',
    },
    exploreall: {
      quote: 'I sliced it too thick the first time. My entire kitchen smelled like a spa with something to say. Never going back to supermarket ginger again.',
      author: 'Akhila Parekh',
      title: 'Home Chef/Weekend Show-off',
    },
    worldfruits: {
      quote: "Didn't know half of these fruits existed. Now I'm planning meals around them. It's like travelling by taste — without leaving the kitchen.",
      author: 'Karishma K',
      title: 'Entrepreneur and Chief Snacking Officer',
    },
    hydromicrogreens: {
      quote: "I tried the hydroponic greens for the first time. I was surprised by how clean, crunchy, and lovely they tasted. Plus, the fact that it's grown without all the regular chemicals makes it that much better.",
      author: 'Hiya Saksena',
      title: 'Senior Software Architect and gastronomy enthusiast',
    },
    locallygrown: {
      quote: 'These veggies have a fresh taste that actually makes a difference. I usually keep it simple so I can really enjoy the freshness. Would recommend for sure!',
      author: 'Aditi Bhattacharya',
      title: 'Graphic designer and snack specialist',
    },
    default: {
      quote: 'Every box feels like a surprise. Freshness, flavor, and quality that makes me actually excited to cook.',
      author: 'Origin Fresh Customer',
      title: 'Verified buyer',
    },
  };

  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');
  const selectedKey =
    typeof category === 'string' ? normalize(category) : 'default';

  const selectedTestimonial = testimonialsMap[selectedKey] || testimonialsMap['default'];

  const otherTestimonials = Object.entries(testimonialsMap)
    .filter(([key]) => key !== selectedKey)
    .map(([_, value]) => value);

  const allTestimonials = [selectedTestimonial, ...otherTestimonials];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? allTestimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === allTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const testimonial = allTestimonials[currentIndex];

  return (
    <Box className="flex flex-col items-center gap-[2.2vw] w-[80.7vw] mob:w-full mob:px-[4vw] pb-[2vw] mx-auto">
      {/* Testimonial Card */}
      <Box
        sx={{
          backgroundColor: '#FFFCF5',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          width: '100%',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ px: '4rem', '@media (max-width: 768px)': { px: '2rem' } }}>
          <Typography fontSize="20px" fontWeight={400} lineHeight={1.8}>
            “{testimonial.quote}”
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" gap={0.5} mb={2}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} sx={{ color: '#FFD700' }} />
          ))}
        </Box>
        <Typography fontWeight={700} fontSize="22px">
          {testimonial.author}
        </Typography>
        <Typography fontSize="14px" fontWeight={400}>
          {testimonial.title}
        </Typography>
      </Box>

      {/* Arrow Controls (Below the card) */}
      <Box display="flex" alignItems="center" justifyContent="center">
        <IconButton onClick={handlePrev}>
          <ArrowBackIosNewIcon sx={{ color: '#000' }}/>
        </IconButton>
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon sx={{ color: '#000' }}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default WhyOriginAndTestimonial;

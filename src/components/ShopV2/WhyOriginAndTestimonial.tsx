import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/router';
import desktopHero from '/public/assets/images/shop/heroBannerShop.png';

const WhyOriginAndTestimonial = () => {
  const router = useRouter();

  return (
    <Box className="flex flex-col gap-[2.2vw] w-[80.7vw] mob:w-full mob:px-[4vw] pb-[10vw] mx-auto">
      {/* Testimonial Section */}
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
        <Typography fontSize="18px" fontWeight={400} lineHeight={1.8}>
          I never imagined fresh mangosteen could taste this divine in India! <br />
          Super fresh, beautifully packed, and oh-so-juicy.
        </Typography>
        <Typography mt={2} mb={2} fontWeight={500} fontSize="18px">
          Origin Fresh has me hooked.
        </Typography>
        <Box display="flex" justifyContent="center" gap={0.5} mb={2}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} sx={{ color: '#FFD700' }} />
          ))}
        </Box>
        <Typography fontWeight={700} fontSize="22px">
          Anita R
        </Typography>
        <Typography fontSize="14px" fontWeight={400}>
          Marketing Head, Agency
        </Typography>
      </Box>

      {/* Why Origin Image Section */}
        <Box
        sx={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            width: '100%',
            mt: '8rem',
        }}
        >
        <Image
            src={desktopHero}
            alt="Why Origin"
            layout="responsive"
            width={1600}
            height={600}
            style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            }}
        />
        <Box
            sx={{
            position: 'absolute',
            top: '50%',
            right: '10%', // <== aligned to the right
            transform: 'translateY(-50%)',
            color: '#fff',
            textAlign: 'left',
            }}
        >
            <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: 'white', mb: 1 }}
            >
            Why Origin
            </Typography>
            <Box
            sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 600,
                px: 2,
                py: 1,
                display: 'inline-block',
                borderRadius: '6px',
                cursor: 'pointer',
            }}
            onClick={() => router.push('/about')}
            >
            Learn More
            </Box>
        </Box>
        </Box>

    </Box>
  );
};

export default WhyOriginAndTestimonial;

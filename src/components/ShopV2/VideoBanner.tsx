'use client';

import React, { useRef, useEffect } from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

interface VideoBannerProps {
  mobileVideoSrc: string; // 9:16 aspect ratio video for mobile
  desktopVideoSrc: string; // 16:9 aspect ratio video for desktop
  poster?: string; // Optional poster image
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  mobileVideoSrc,
  desktopVideoSrc,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  className = ''
}) => {
  const isMobile = useMediaQuery(768);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, [autoPlay, isMobile]);

  return (
    <div className={`relative w-full overflow-hidden m-0 p-0 ${className}`}>
      <div className="relative w-full overflow-hidden m-0 p-0">
        {/* Mobile Video (9:16) */}
        <video
          ref={videoRef}
          className={`w-full object-cover m-0 p-0 block ${
            isMobile ? 'block h-[75vh]' : 'hidden'
          }`}
          src={mobileVideoSrc}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
        />
        
        {/* Desktop Video (16:9) */}
        <video
          ref={videoRef}
          className={`w-full object-cover m-0 p-0 block ${
            isMobile ? 'hidden' : 'block h-[80vh]'
          }`}
          src={desktopVideoSrc}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
        />
      </div>
      
      {/* Optional overlay content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* You can add overlay content here if needed */}
      </div>
    </div>
  );
};

export default VideoBanner;
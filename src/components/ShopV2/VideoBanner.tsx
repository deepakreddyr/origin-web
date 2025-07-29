'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [playAttempted, setPlayAttempted] = useState(false);

  // Handle video play with multiple strategies
  const handleVideoPlay = async (videoElement: HTMLVideoElement) => {
    if (!videoElement || playAttempted) return;
    
    setPlayAttempted(true);
    
    try {
      // Ensure video is ready
      if (videoElement.readyState >= 2) {
        await videoElement.play();
      } else {
        // Wait for video to be ready
        videoElement.addEventListener('loadeddata', async () => {
          try {
            await videoElement.play();
          } catch (error) {
            console.log('Video autoplay failed after loadeddata:', error);
          }
        }, { once: true });
      }
    } catch (error) {
      console.log('Video autoplay failed:', error);
      
      // Fallback: Try to play on user interaction
      const playOnInteraction = async () => {
        try {
          await videoElement.play();
          document.removeEventListener('touchstart', playOnInteraction);
          document.removeEventListener('click', playOnInteraction);
        } catch (e) {
          console.log('Manual play also failed:', e);
        }
      };
      
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('click', playOnInteraction, { once: true });
    }
  };

  // Effect for mobile video
  useEffect(() => {
    if (isMobile && mobileVideoRef.current && autoPlay) {
      setPlayAttempted(false);
      handleVideoPlay(mobileVideoRef.current);
    }
  }, [isMobile, autoPlay]);

  // Effect for desktop video
  useEffect(() => {
    if (!isMobile && desktopVideoRef.current && autoPlay) {
      setPlayAttempted(false);
      handleVideoPlay(desktopVideoRef.current);
    }
  }, [isMobile, autoPlay]);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className={`relative w-full overflow-hidden m-0 p-0 ${className}`}>
      <div className="relative w-full overflow-hidden m-0 p-0">
        {/* Mobile Video (9:16) */}
        <video
          ref={mobileVideoRef}
          className={`w-full object-cover m-0 p-0 ${
            isMobile ? 'block h-[75vh]' : 'hidden'
          }`}
          src={mobileVideoSrc}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          preload="auto"
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          onLoadedData={handleVideoLoad}
          onCanPlay={() => {
            if (isMobile && mobileVideoRef.current && autoPlay && !playAttempted) {
              handleVideoPlay(mobileVideoRef.current);
            }
          }}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        
        {/* Desktop Video (16:9) */}
        <video
          ref={desktopVideoRef}
          className={`w-full object-cover m-0 p-0 ${
            isMobile ? 'hidden' : 'block h-[80vh]'
          }`}
          src={desktopVideoSrc}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoad}
          onCanPlay={() => {
            if (!isMobile && desktopVideoRef.current && autoPlay && !playAttempted) {
              handleVideoPlay(desktopVideoRef.current);
            }
          }}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
      
      {/* Loading indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {/* Optional overlay content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* You can add overlay content here if needed */}
      </div>
    </div>
  );
};

export default VideoBanner;
import React, { useRef, useState, useEffect } from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { IconButton } from '@mui/material';

interface VideoBannerProps {
  mobileVideoSrc: string;
  desktopVideoSrc: string;
  poster?: string;
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
  muted = false,
  loop = true,
  controls = false,
  className = ''
}) => {
  const isMobile = useMediaQuery(768);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [mounted, setMounted] = useState(false);

  // Only determine mobile/desktop AFTER hydration to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const src = mounted ? (isMobile ? mobileVideoSrc : desktopVideoSrc) : desktopVideoSrc;

  // When the src changes (mobile/desktop switch), reload and play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.load();
    video.play().catch(() => {
      // Autoplay blocked by browser — user must interact first
    });
  }, [src]);

  // Sync muted state to video element directly (avoids React re-render stutter)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const heightClass = isMobile ? 'h-[75vh]' : 'h-[85vh]';

  return (
    <div className={`relative w-full overflow-hidden m-0 p-0 ${className}`}>
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        controls={controls}
        playsInline
        preload="auto"
        className={`w-full object-cover m-0 p-0 ${heightClass}`}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* Mute/Unmute Toggle */}
      <div className="absolute bottom-4 right-4 z-20">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((prev) => !prev);
          }}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
          }}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </div>
    </div>
  );
};

export default VideoBanner;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

interface VideoBannerProps {
  mobileVideoSrc: string;
  desktopVideoSrc: string;
  poster?: string;
  loop?: boolean;
  controls?: boolean;
  className?: string;
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  mobileVideoSrc,
  desktopVideoSrc,
  poster,
  loop = true,
  controls = false,
  className = ''
}) => {
  const isMobile = useMediaQuery(768);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Always start muted so autoplay works on every hard reload (browser policy)
  const [isMuted, setIsMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src = mounted ? (isMobile ? mobileVideoSrc : desktopVideoSrc) : desktopVideoSrc;

  // Load and play whenever src changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = src;
    video.muted = true; // keep muted so autoplay succeeds
    video.load();

    const onCanPlay = () => {
      video.play().catch(() => {});
    };

    video.addEventListener('canplay', onCanPlay, { once: true });
    return () => video.removeEventListener('canplay', onCanPlay);
  }, [src]);

  // Sync muted state to DOM element directly
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
        poster={poster}
        muted
        loop={loop}
        controls={controls}
        playsInline
        preload="auto"
        className={`w-full object-cover m-0 p-0 ${heightClass}`}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* Unmute / Mute button */}
      <button
        onClick={() => setIsMuted((prev) => !prev)}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(0,0,0,0.55)',
          color: '#fff',
          border: '1.5px solid rgba(255,255,255,0.35)',
          borderRadius: '999px',
          padding: '10px',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'SofiaPro, sans-serif',
          letterSpacing: '0.02em',
          transition: 'background 0.2s ease, transform 0.15s ease',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
      >
        {isMuted ? <VolumeOffIcon style={{ fontSize: 20 }} /> : <VolumeUpIcon style={{ fontSize: 20 }} />}
      </button>
    </div>
  );
};

export default VideoBanner;

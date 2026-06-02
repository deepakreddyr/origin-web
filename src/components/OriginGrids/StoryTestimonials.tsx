'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

export type Story = {
  id: number;
  userName: string;
  userHandle: string;
  avatarImage: string;
  storyImage: string;
  duration?: number;
};

const QuoteIcon = () => (
  <svg viewBox="0 0 40 34" fill="currentColor" className="w-[24px] md:w-[2.2vw] h-auto text-[#A8AAA9]">
    <path d="M12.5 33.5C8.33333 33.5 4.95833 32.0625 2.375 29.1875C-0.208333 26.3125 -1.16667 22.375 0.5 17.375L6 0.5H16L12 14.5C14.3333 15.1667 16.0833 16.375 17.25 18.125C18.4167 19.875 19 21.8333 19 24C19 26.6667 18.0625 28.9167 16.1875 30.75C14.3125 32.5833 12.0833 33.5 9.5 33.5H12.5ZM33.5 33.5C29.3333 33.5 25.9583 32.0625 23.375 29.1875C20.7917 26.3125 19.8333 22.375 21.5 17.375L27 0.5H37L33 14.5C35.3333 15.1667 37.0833 16.375 38.25 18.125C39.4167 19.875 40 21.8333 40 24C40 26.6667 39.0625 28.9167 37.1875 30.75C35.3125 32.5833 33.0833 33.5 30.5 33.5H33.5Z" />
  </svg>
);

const Stars = () => (
  <div className="flex gap-[2px]">
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 14 13" fill="currentColor" className="w-[10px] md:w-[0.8vw] h-auto text-[#FFB800]">
        <path d="M7 0L9.1634 4.38287L14 5.0862L10.5 8.49887L11.3268 13L7 10.7263L2.6732 13L3.5 8.49887L0 5.0862L4.8366 4.38287L7 0Z" />
      </svg>
    ))}
  </div>
);

const STORIES: Story[] = [
  {
    id: 1,
    userName: 'Malavika Mohanan',
    userHandle: '@malavikamohanan_',
    avatarImage: '/assets/images/about/social1.png',
    storyImage: '/assets/images/about/social1.1.png',
    duration: 4000
  },
  {
    id: 2,
    userName: 'Shruti Mishra',
    userHandle: '@curlyveganyogi',
    avatarImage: '/assets/images/about/social2.png',
    storyImage: '/assets/images/about/social2.1.png',
    duration: 4000
  },
  {
    id: 3,
    userName: 'Shruti Mishra',
    userHandle: '@curlyveganyogi',
    avatarImage: '/assets/images/about/social2.png',
    storyImage: '/assets/images/about/social2.2.png',
    duration: 4000
  },
  {
    id: 4,
    userName: 'Shruti Mishra',
    userHandle: '@curlyveganyogi',
    avatarImage: '/assets/images/about/social2.png',
    storyImage: '/assets/images/about/social2.3.png',
    duration: 4000
  },
  {
    id: 5,
    userName: 'Shruti Mishra',
    userHandle: '@curlyveganyogi',
    avatarImage: '/assets/images/about/social2.png',
    storyImage: '/assets/images/about/social2.4.png',
    duration: 4000
  },
  {
    id: 6,
    userName: 'Shruti Mishra',
    userHandle: '@curlyveganyogi',
    avatarImage: '/assets/images/about/social2.png',
    storyImage: '/assets/images/about/socail2.5.png',
    duration: 4000
  },
  {
    id: 7,
    userName: 'Ankita B Chandak',
    userHandle: '@followyourchild',
    avatarImage: '/assets/images/about/social3.png',
    storyImage: '/assets/images/about/socail3.1.png',
    duration: 4000
  },
  {
    id: 8,
    userName: 'Ankita B Chandak',
    userHandle: '@followyourchild',
    avatarImage: '/assets/images/about/social3.png',
    storyImage: '/assets/images/about/socail3.2.png',
    duration: 4000
  },
  {
    id: 9,
    userName: 'Ankita B Chandak',
    userHandle: '@followyourchild',
    avatarImage: '/assets/images/about/social3.png',
    storyImage: '/assets/images/about/socail3.3.png',
    duration: 4000
  },
  {
    id: 10,
    userName: 'Akshitha Basavaraju',
    userHandle: '@fitnessforthefitmom',
    avatarImage: '/assets/images/about/social4.png',
    storyImage: '/assets/images/about/social4.1.png',
    duration: 4000
  },
  {
    id: 11,
    userName: 'Sarayu Hegde',
    userHandle: '@sarayu.hegde',
    avatarImage: '/assets/images/about/social5.png',
    storyImage: '/assets/images/about/social5.1.png',
    duration: 4000
  },
  {
    id: 12,
    userName: 'Sarayu Hegde',
    userHandle: '@sarayu.hegde',
    avatarImage: '/assets/images/about/social5.png',
    storyImage: '/assets/images/about/social5.2.png',
    duration: 4000
  },
  {
    id: 13,
    userName: 'Sumedha Sood',
    userHandle: '@_roseredrose_',
    avatarImage: '/assets/images/about/social6.png',
    storyImage: '/assets/images/about/social6.1.png',
    duration: 4000
  },
  {
    id: 14,
    userName: 'Sumedha Sood',
    userHandle: '@_roseredrose_',
    avatarImage: '/assets/images/about/social6.png',
    storyImage: '/assets/images/about/social6.2.png',
    duration: 4000
  }
];

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

const StoryViewer = ({ stories, startIndex, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const duration = stories[currentIndex]?.duration ?? 4000;

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    setProgress(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current!);
        goNext();
      }
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, duration, goNext]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  const story = stories[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[420px] h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-black select-none">
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-8 left-3 right-10 flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shrink-0">
            <Image
              src={story.avatarImage}
              alt={story.userName}
              width={32}
              height={32}
              className="object-cover w-full h-full scale-[1.3]"
            />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">{story.userName}</p>
            <p className="text-white/70 text-xs">{story.userHandle}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-8 right-3 z-10 text-white bg-black/40 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="w-full h-full">
          <Image src={story.storyImage} alt={story.userName} fill className="object-cover" priority />
        </div>

        <button className="absolute left-0 top-0 w-1/2 h-full z-[5]" onClick={goPrev} aria-label="Previous story" />
        <button className="absolute right-0 top-0 w-1/2 h-full z-[5]" onClick={goNext} aria-label="Next story" />
      </div>

      <button
        onClick={goPrev}
        disabled={currentIndex === 0}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition-all disabled:opacity-30"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        disabled={currentIndex === stories.length - 1}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center transition-all disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
};

const StoryTestimonials = () => {
  const [openStories, setOpenStories] = useState<Story[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uniqueUserStories = STORIES.filter(
    (story, index, self) => index === self.findIndex((s) => s.userHandle === story.userHandle)
  );

  const dotCount = Math.ceil(uniqueUserStories.length / 2);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      const index = Math.round(progress * (dotCount - 1));
      setActiveIndex(index);
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const scrollPos = (index / (dotCount - 1)) * (scrollWidth - clientWidth);
      scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="
            w-full bg-[#F6F4EB] overflow-hidden
            flex flex-col
            py-[8vw] md:py-[4vw]
            h-auto
        "
    >
      <div className="w-full">
        {/* ── Avatar area ── */}
        <div className="flex-1 flex items-start justify-center pt-[2vw] md:pt-0">
          <div className="relative flex items-center md:max-w-[1290px] mx-auto w-full">
            {/* Grid Container */}
            <div className="flex flex-col w-full">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                              flex items-start justify-start
                              overflow-x-auto no-scrollbar
                              snap-x snap-mandatory
                              w-full gap-[16px] md:gap-[42px]
                              px-[8vw] md:px-[20px] lg:px-0
                          "
              >
                {uniqueUserStories.map((story) => {
                  const userStories = STORIES.filter((s) => s.userHandle === story.userHandle);
                  return (
                    <button
                      key={story.id}
                      onClick={() => setOpenStories(userStories)}
                      className="flex flex-col items-center bg-[#F9F9F9] border-[#AFAFAFB2] border-[0.9px] md:border-[1px] rounded-[7px] md:rounded-[8px] pt-[10px] pb-[21px] px-[9px] md:pt-[13px] md:pb-[24px] md:px-[10px] group shrink-0 snap-center w-[162px] h-[231px] md:w-[180px] md:h-[257px]"
                      aria-label={`View ${story.userName}'s story`}
                    >
                      {/* Top row: Quote & Stars */}
                      <div className="flex justify-between items-start w-full">
                        <QuoteIcon />
                        <Stars />
                      </div>

                      {/* Image Ring */}
                      <div className="rounded-full p-[2.2px] md:p-[2.48px] bg-[#4CAF50] mb-[14px] md:mb-[8px]">
                        <div
                          className="
                                                rounded-full overflow-hidden border-white bg-white
                                                border-[1px] md:border-[1.14px]
                                                w-[134px] h-[134px]
                                                md:w-[149.23px] md:h-[149.23px]
                                            "
                        >
                          <Image
                            src={story.avatarImage}
                            alt={story.userName}
                            width={220}
                            height={220}
                            className="object-cover w-full h-full scale-[1.35]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center w-full mt-auto">
                        <span
                          className="
                                                text-black font-[SofiaPro] font-bold text-center leading-tight
                                                text-[12px] md:text-[14px]
                                                w-full truncate
                                            "
                        >
                          {story.userName}
                        </span>
                        <span
                          className="
                                                text-black/50 text-center leading-tight font-[SofiaPro]
                                                text-[10px] md:text-[12px]
                                                w-full truncate
                                                mt-[4px]
                                            "
                        >
                          {story.userHandle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-[6px] md:gap-[8px] mt-[6vw] md:mt-[2vw]">
                {Array.from({ length: dotCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToDot(i)}
                    className={`
                                      h-[8px] rounded-full transition-all duration-300
                                      ${i === activeIndex ? 'bg-black w-[8px]' : 'bg-[#B3B3B3] w-[8px]'}
                                  `}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openStories !== null && (
        <StoryViewer stories={openStories} startIndex={0} onClose={() => setOpenStories(null)} />
      )}
    </section>
  );
};

export default StoryTestimonials;

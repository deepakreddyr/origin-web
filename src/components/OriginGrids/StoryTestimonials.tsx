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
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleCount = 5;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uniqueUserStories = STORIES.filter(
    (story, index, self) => index === self.findIndex((s) => s.userHandle === story.userHandle)
  );

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < uniqueUserStories.length;

  // Determine slice count safely for hydration
  const sliceCount = isMounted && window.innerWidth < 768 ? uniqueUserStories.length : visibleCount;

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
            w-full bg-[#f2ae25] overflow-hidden
            flex flex-col
            h-auto min-h-[600px]
            lg:h-[90vh] lg:max-h-none
        "
    >
      <div className="mt-[5vw] mob:mt-10">
        {/* ── Heading ── */}
        <h2
          className="
                    shrink-0 text-center font-[Recoleta] font-bold text-black leading-none
                    text-[11vw] md:text-[8vw] lg:text-[7vw]
                    pt-[3.5vw] md:pt-[2.5vw] lg:pt-[2vw]
                "
        >
          The Cult Says
        </h2>

        {/* ── Avatar area ── */}
        <div className="flex-1 flex items-start justify-center pt-[8vw] md:pt-[4vw] lg:pt-[5vw]">
          <div className="relative flex items-center px-[8vw] md:px-[5.5vw] lg:px-[5vw] w-full max-w-[95vw] lg:max-w-[90vw]">
            {/* Left arrow — Hidden on mobile as we use native scroll */}
            <button
              onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              className="
                            hidden md:flex
                            absolute left-0 top-[60%] -translate-y-[150%]
                            items-center justify-center
                            text-[#231F20] leading-none
                            w-[4vw] h-[4vw]
                            disabled:opacity-20 disabled:cursor-not-allowed
                            hover:scale-110 active:scale-95 transition-all duration-200
                        "
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Grid Container:
                            Mobile: 2 rows, horizontal scroll, 2 columns visible via width
                            MD+: Single row (flex), no wrap
                        */}
            <div className="flex flex-col w-full">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                              grid grid-rows-2 grid-flow-col auto-cols-[calc(50%-1.75vw)] 
                              overflow-x-auto no-scrollbar
                              snap-x snap-mandatory
                              md:flex md:items-start md:justify-center md:overflow-visible
                              w-full gap-[3.5vw] md:gap-[3vw] lg:gap-[3vw]
                              pb-10 md:pb-0
                          "
              >
                {uniqueUserStories.slice(startIndex, startIndex + sliceCount).map((story) => {
                  const userStories = STORIES.filter((s) => s.userHandle === story.userHandle);
                  return (
                    <button
                      key={story.id}
                      onClick={() => setOpenStories(userStories)}
                      className="flex flex-col items-center gap-[3vw] md:gap-[1.2vw] lg:gap-[1vw] group shrink-0 snap-center"
                      aria-label={`View ${story.userName}'s story`}
                    >
                      <div className="rounded-full p-[0.6vw] md:p-[0.3vw] bg-[#E18D1F] shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <div
                          className="
                                                rounded-full overflow-hidden border-white bg-white
                                                border-[0.5vw] md:border-[0.2vw]
                                                w-[25vw] h-[25vw]
                                                md:w-[10vw] md:h-[10vw]
                                                lg:w-[13vw] lg:h-[13vw]
                                                min-w-[80px] min-h-[80px]
                                                md:min-w-[56px] md:min-h-[56px]
                                            "
                        >
                          <Image
                            src={story.avatarImage}
                            alt={story.userName}
                            width={220}
                            height={220}
                            className="object-cover w-full h-full scale-[1.3]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span
                          className="
                                                text-black font-[900] text-center leading-tight
                                                text-[3.5vw] md:text-[1.6vw] lg:text-[1.4vw]
                                                max-w-[25vw] md:max-w-[10vw] lg:max-w-[13vw]
                                            "
                        >
                          {story.userName}
                        </span>
                        <span
                          className="
                                                text-black/70 text-center leading-tight
                                                text-[2.8vw] md:text-[1.1vw] lg:text-[0.9vw]
                                                max-w-[25vw] md:max-w-[10vw] lg:max-w-[13vw]
                                                mt-[0.5vw] md:mt-[0.2vw]
                                            "
                        >
                          {story.userHandle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination Dots — Mobile only */}
              <div className="flex md:hidden justify-center gap-2 mt-[-2vw]">
                {Array.from({ length: dotCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToDot(i)}
                    className={`
                                      w-1.5 h-1.5 rounded-full transition-all duration-300
                                      ${i === activeIndex ? 'bg-black w-4' : 'bg-black/30'}
                                  `}
                  />
                ))}
              </div>
            </div>

            {/* Right arrow — Hidden on mobile */}
            <button
              onClick={() => setStartIndex((i) => Math.min(uniqueUserStories.length - visibleCount, i + 1))}
              disabled={!canNext}
              className="
                            hidden md:flex
                            absolute right-0 top-[60%] -translate-y-[150%]
                            items-center justify-center
                            text-[#231F20] leading-none
                            w-[4vw] h-[4vw]
                            disabled:opacity-20 disabled:cursor-not-allowed
                            hover:scale-110 active:scale-95 transition-all duration-200
                        "
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
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

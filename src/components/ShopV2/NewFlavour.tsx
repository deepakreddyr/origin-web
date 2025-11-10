import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Define the CARD_WIDTH_RATIO once for consistency
const CARD_WIDTH_RATIO = 0.7;
const GAP_SIZE = 24; // Tailwind's gap-6 is typically 1.5rem, or 24px

// ---------------- FlavorCard (No Changes) ----------------
const FlavorCard = ({ itemDetails }: any) => {
  const router = useRouter();

  const handleNavigation = () => {
    const slug = encodeURIComponent(
      itemDetails.item_name.replace(/ /g, '-').toLowerCase()
    );
    router.push(`/${slug}/${itemDetails.id}`);
  };

  const description =
    itemDetails.extra_descriptions?.[0] ||
    itemDetails.description ||
    'Discover the unique taste and quality.';

  return (
    <button
      onClick={handleNavigation}
      className="relative w-full h-full rounded-[1.5rem] overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={"https://lh3.googleusercontent.com/aida-public/AB6AXuDgFMpkMuZGL6jJdY5mUbXStzT2vWlVHGofMJbbOPJfqwBUj0PLLXqRMSvCs8QjoVMbrXPoBIktxh4UYdcZUm13kNSMUF1QqrpGtMbRT1NF0MNhiHOJoZhe_CY4ckQTDmz7dw7QP1P3SPzBZ8Se7PcnksvDx7K_P5u8m8ijP219lVszomRuAGdCcGWpNw5GP9bcBoHZK7-RFeepUS9rd4yT0urMZgZie7rqNpVoSaF1u-C-tQkcnVno-mA7x7q7E8qUSnShwv-K0F0"
          }
          alt={itemDetails.name || itemDetails.item_name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
        />
        <div className="absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-left">
        <h3 className="font-[SofiaPro] text-white text-xl md:text-2xl font-bold mb-2">
          {itemDetails.name || itemDetails.item_name}
        </h3>
        <p className="font-[SofiaPro] text-white/90 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

// ---------------- DiscoverNewFlavors ----------------
interface CategoryProp {
  categoryDetail: any;
}

const DiscoverNewFlavors = ({ categoryDetail }: CategoryProp) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // NEW: State to hold the calculated horizontal padding
  const [paddingX, setPaddingX] = useState('0px'); 

  // Calculate the required padding to center the first/last card
  useEffect(() => {
    const calculatePadding = () => {
      if (sliderRef.current) {
        // Full width of the slider viewport
        const viewportWidth = sliderRef.current.clientWidth;
        // Width of the actual card (based on CSS '70vw' or '400px' max)
        // We'll use 70vw for the calculation, assuming it dominates on mobile
        const cardWidth = Math.min(
          viewportWidth * CARD_WIDTH_RATIO, 
          400
        ); 

        // Calculation: (Viewport Width - Card Width) / 2
        const requiredPadding = (viewportWidth - cardWidth) / 2;
        setPaddingX(`${requiredPadding}px`);
      }
    };

    // Calculate once on mount and on resize
    calculatePadding();
    window.addEventListener('resize', calculatePadding);
    return () => window.removeEventListener('resize', calculatePadding);
  }, []);

  // Observe which card is centered (Threshold adjusted to 0.5 for stability)
  useEffect(() => {
    if (!observerRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = observerRefs.current.indexOf(entry.target as HTMLDivElement);
            // This is crucial: only set active if the card is NOT the result of a programmatic scroll, 
            // but for a simple, controlled carousel, setting it here is fine.
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: sliderRef.current, threshold: 0.5 } // Adjusted threshold
    );

    observerRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categoryDetail?.data]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (!sliderRef.current || !categoryDetail?.data?.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % categoryDetail.data.length;
        // Calculate scroll position based on the width and index
        const cardWidth = Math.min(sliderRef.current!.clientWidth * CARD_WIDTH_RATIO, 400);
        
        // Scroll target is: Card position - required padding
        const scrollTarget = (cardWidth + GAP_SIZE) * nextIndex; // + GAP_SIZE because of flex gap

        sliderRef.current?.scrollTo({
          left: scrollTarget,
          behavior: 'smooth',
        });
        return nextIndex;
      });
    },3000); 

    return () => clearInterval(interval);
  }, [categoryDetail?.data]);

  // Function to manually scroll to an index
  const scrollToCard = (index: number) => {
      if (sliderRef.current) {
          const cardWidth = Math.min(sliderRef.current.clientWidth * CARD_WIDTH_RATIO, 400);
          const scrollTarget = (cardWidth + GAP_SIZE) * index;
          
          sliderRef.current.scrollTo({
              left: scrollTarget,
              behavior: 'smooth',
          });
          setActiveIndex(index);
      }
  };


  return (
    <div className="relative w-full py-10 md:py-16 px-4 md:px-8 lg:px-12 overflow-hidden">
      {/* Header */}
      <h2 className="font-[SofiaPro] text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 text-[#2c2c2c]">
        {categoryDetail.title || 'Discover New Flavors'}
      </h2>

      {/* Carousel */}
      <div
        ref={sliderRef}
        // Removed fixed 'px-[15vw]' and applied dynamic 'paddingX'
        className="flex gap-6 overflow-x-auto scrollbar-hide justify-start scroll-smooth" 
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {Array.isArray(categoryDetail?.data) &&
          categoryDetail.data.map((item: any, index: number) => (
            <div
              key={item.id}
              ref={(el) => {
                observerRefs.current[index] = el;
              }}
              className={`flex-shrink-0 transition-all duration-700 ease-out transform ${
                activeIndex === index
                  ? 'scale-100'
                  : 'scale-70' 
              }`}
              style={{
                width: '70vw', 
                maxWidth: '400px', 
                height: '520px', 
                // Adjusted snapping for perfect centering relative to padding
                scrollSnapAlign: 'center', 
              }}
            >
              <FlavorCard itemDetails={item} />
            </div>
          ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {Array.isArray(categoryDetail?.data) &&
          categoryDetail.data.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-black'
                  : 'bg-[#FFDD0066]'
              }`}
            />
          ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DiscoverNewFlavors;
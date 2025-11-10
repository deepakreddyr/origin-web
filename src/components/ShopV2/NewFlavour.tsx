import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// ---------------- FlavorCard ----------------
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
          src={
            itemDetails.image ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDqn-qLVmFjXRMPRveJ7dqOv_2uhRHVJVqck4Kl7o-Y--CJt-_B04gYHBhxFyr9eE9Yzc28ehPMzCHwzeH32LOcjwJxRqmOG_D4EBF0wlTGCwGavkur56_CKn9j5KiY1B0UcxKekudK3WbH98QXByVJiSOFpCZHM3WCtkbNEa-4iBI3KxKzvAtZ54KoFCN2kjmbh5pIADmQtiutZqR6U6_iqFLFNVCdwPyr6j0Ff34h72Qu14o0WFWVEE5_NchGUSCTQRwYjbYYYBM'
          }
          alt={itemDetails.name || itemDetails.item_name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
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

  // Observe which card is centered
  useEffect(() => {
    if (!observerRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = observerRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: sliderRef.current, threshold: 0.6 }
    );

    observerRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categoryDetail?.data]);

  // Auto-scroll every 3 seconds (was 2 seconds)
  useEffect(() => {
    if (!sliderRef.current || !categoryDetail?.data?.length) return;

    // Define the custom card width for calculation
    const CARD_WIDTH_RATIO = 0.7; // Corresponds to the 70vw style below

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % categoryDetail.data.length;
        // Calculate scroll position based on the new card width
        const cardWidth = sliderRef.current!.clientWidth * CARD_WIDTH_RATIO;
        sliderRef.current?.scrollTo({
          left: cardWidth * nextIndex,
          behavior: 'smooth',
        });
        return nextIndex;
      });
    },3000); // **Changed from 2000 to 3000**

    return () => clearInterval(interval);
  }, [categoryDetail?.data]);

  // Function to manually scroll to an index
  const scrollToCard = (index: number) => {
      if (sliderRef.current) {
          const CARD_WIDTH_RATIO = 0.7; // Must match the style width
          const cardWidth = sliderRef.current.clientWidth * CARD_WIDTH_RATIO;
          sliderRef.current.scrollTo({
              left: cardWidth * index,
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
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory justify-start scroll-smooth px-[15vw]" // Adjusted padding for better center visibility
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
              className={`flex-shrink-0 snap-center transition-all duration-700 ease-out transform ${
                activeIndex === index
                  ? 'scale-100 opacity-100 z-20'
                  : 'scale-70 opacity-50 z-0' // **Smaller scale and opacity for non-active items**
              }`}
              style={{
                width: '70vw', // **Adjusted for a taller aspect ratio on mobile**
                maxWidth: '400px', // **Maximum width for center item**
                height: '520px', // **Increased height to change aspect ratio**
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
                  : 'bg-[#FFDD0066] hover:bg-gray-400'
              }`}
            />
          ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </div>
  );
};

export default DiscoverNewFlavors;
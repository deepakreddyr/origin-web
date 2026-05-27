import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import SearchIcon from '@mui/icons-material/Search';

import heroBg from '/public/assets/images/store/locationBanner.png';
import { CityEntry, StoreLocation } from '@/utilities/types';
import { checkServiceabilityAddress } from '@/features/AddressEditDetails/services/checkServiceability';

interface StoreLocatorHeroProps {
  cities: CityEntry[];
  activeCity?: string;
  stores?: StoreLocation[];
}

import { useAtom } from 'jotai';
import { isGMapLoadedAtom } from '@/context/global';

const SearchBar = ({ stores, cities, router }: { stores: StoreLocation[]; cities: CityEntry[]; router: any }) => {
  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init
  } = usePlacesAutocomplete({
    initOnMount: false,
    debounce: 300
  });

  const [isGMapLoaded] = useAtom(isGMapLoadedAtom);

  useEffect(() => {
    if (isGMapLoaded) {
      init();
    }
  }, [isGMapLoaded, init]);

  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        clearSuggestions();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  const handleSelectLocation = async (address: string) => {
    if (!address.trim()) return;
    setValue(address, false);
    clearSuggestions();
    setIsSearching(true);

    const addressLower = address.toLowerCase();

    const fallbackRedirect = () => {
      if (addressLower.includes('bangalore') || addressLower.includes('bengaluru')) {
        return router.push('/stores/bengaluru');
      }
      for (const city of cities) {
        if (addressLower.includes(city.slug.toLowerCase()) || addressLower.includes(city.label.toLowerCase())) {
          return router.push(`/stores/${city.slug}`);
        }
      }
      return router.push('/stores/not-found');
    };

    try {
      const results = await getGeocode({ address });
      if (results.length > 0) {
        const { lat, lng } = getLatLng(results[0]);
        const response = await checkServiceabilityAddress({ latitude: lat, longitude: lng });
        if (response.deliverable && response.store_id && stores) {
          const store = stores.find((s) => s.id === response.store_id);
          if (store) {
            return router.push(`/stores/${store.city}`);
          }
        }
      }
      // If we reach here, either no results, not deliverable, or store_id not found
      fallbackRedirect();
    } catch (e) {
      console.error(e);
      fallbackRedirect();
    } finally {
      setIsSearching(false);
    }
  };

  const executeSearch = () => {
    if (data && data.length > 0) {
      handleSelectLocation(data[0].description);
    } else if (value) {
      handleSelectLocation(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <div className="w-full max-w-[650px] flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center">
      <div className="relative w-full flex-1" ref={dropdownRef}>
        <div className="flex items-center bg-[#FDF9F3] rounded-full p-2 md:p-3 shadow-lg w-full">
          <div className="pl-4 pr-2 text-gray-500">
            <SearchIcon />
          </div>
          <input
            className="flex-1 w-full bg-transparent outline-none px-2 text-black placeholder-gray-500 text-[14px] md:text-[18px]"
            placeholder="Enter city or area..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {status === 'OK' && (
          <ul className="absolute top-full left-0 right-0 mt-2 bg-[#FDF9F3] rounded-2xl shadow-xl overflow-hidden z-50 text-left border border-gray-100">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                className="px-6 py-4 hover:bg-[#F5EAD4] cursor-pointer text-black"
                onClick={() => handleSelectLocation(description)}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="bg-[#FFB600] w-full sm:w-auto text-black font-semibold rounded-full px-8 py-3 md:px-10 md:py-[14px] text-[15px] md:text-[18px] hover:bg-[#FFC107] transition-colors shadow-lg whitespace-nowrap"
        onClick={executeSearch}
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

const StoreLocatorHero = ({ cities, activeCity, stores }: StoreLocatorHeroProps) => {
  const router = useRouter();

  const handleCityClick = (slug: string) => {
    router.push(`/stores/${slug}`, undefined, { scroll: false });
  };

  return (
    <section className="w-full flex flex-col relative z-30">
      {/* Hero Image & Overlay */}
      <div className="w-full relative h-[60vw] md:h-[40vw]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={heroBg}
            alt="Find an Origin Fresh Store Near You"
            className="w-full h-full object-cover"
            priority
            quality={90}
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 mt-[4vw]">
          <div className="bg-[#2B2B2B99] rounded-[20px] md:rounded-[30px] p-[6vw] md:p-[3.5vw] flex flex-col items-center max-w-[950px] w-full">
            <motion.h1
              className="font-[Recoleta] text-white text-center font-bold text-[6.5vw] md:text-[3.5vw] leading-[1.2] mb-[3vw] md:mb-[1vw]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Find an Origin Fresh Store Near You
            </motion.h1>

            <motion.p
              className="font-[SofiaPro] text-white/90 text-center text-[3.5vw] md:text-[1.4vw] mb-[5vw] md:mb-[2.5vw] w-full md:w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              From the heart of the farm to your neighborhood. Discover our curated selection of exotic fruits and fresh
              daily essentials.
            </motion.p>

            <motion.div
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              <SearchBar stores={stores || []} cities={cities} router={router} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* City Tabs */}
      <div className="w-full bg-[#FAF3E5] border-b-[1.13px] border-[#FAC51033]">
        <div className="max-w-[92vw] mx-auto pt-6 md:pt-8 pb-4 flex flex-wrap items-center justify-start gap-[6vw] md:gap-[3vw]">
          {cities.map((city) => {
            const isActive = activeCity === city.slug;
            const storeCount = stores?.filter((s) => s.city === city.slug).length || 0;

            return (
              <button
                key={city.slug}
                onClick={() => handleCityClick(city.slug)}
                className={`flex items-center gap-2 pb-1 md:pb-1 border-b-[3px] transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#B68D00] font-semibold text-[#2A2311]'
                    : 'border-transparent font-medium text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                <span className={`text-[16px] md:text-[20px] ${isActive ? 'font-[Recoleta]' : 'font-[SofiaPro]'}`}>
                  {city.label}
                </span>
                {city.status === 'coming-soon' ? (
                  <span className="bg-[#FFD54F] text-black text-[10px] md:text-[11px] px-2 md:px-2.5 py-0.5 md:py-1 rounded-full font-medium tracking-wide">
                    Coming soon
                  </span>
                ) : (
                  <span
                    className={`text-[12px] md:text-[13px] w-[22px] h-[22px] md:w-[26px] md:h-[26px] flex items-center justify-center rounded-full font-bold ${
                      isActive ? 'bg-[#5A4E27] text-[#FFCA0C]' : 'bg-[#E9E2D4] text-[#5A5A5A]'
                    }`}
                  >
                    {storeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoreLocatorHero;

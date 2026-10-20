import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl, unprotectedUrl } from '@/url';
import { getAddressAndStoreId, cleanImageUrl } from '@/utilities/utils';

type FamilySize = 2 | 3 | 4 | 5;

interface PlanDetails {
  weight: string;
  price: number;
  marketPrice?: number | null;
  priceMonth?: number;
  perDelivery?: number;
  selection: string;
}

interface ProductCardData {
  id: string | number;
  tag?: string;
  tagColor?: 'orange' | 'green';
  rating?: number;
  reviews?: string;
  title?: string;
  name?: string;
  display_title?: string;
  description?: string;
  item_description?: string;
  image?: string;
  website_image?: string | null;
  multiple_images?: string[];
  multiple_uoms?: any[];
  plans?: Record<FamilySize, PlanDetails>;
}

/**
 * Checks whether a given UOM's unit/name matches the requested family size.
 * Handles patterns such as:
 * - "Family 2", "Family of 2", "Family-2", "family2"
 * - Ranges: "family 2-3", "family2-3", "family 3-4", "family 4-5"
 * - Variations: "2 members", "for 2", "4 person", etc.
 */
const matchesFamilyText = (rawStr: string, targetFamily: number): boolean => {
  if (!rawStr) return false;

  // 1. Strip weight/volume specifications (e.g. 3.5kg, 500g, 5kg) to avoid false-positive digit matching
  const cleanStr = rawStr
    .replace(/\d+(\.\d+)?\s*(kg|kgs|g|gm|gms|gram|grams|ml|l|ltr|litres?|pound|lbs?)\b/gi, '')
    .trim();

  if (!cleanStr) return false;

  // 2. Check for ranges like "2-3", "3-4", "4-5", "2 to 3", "2 - 3", "2-4", "2 or 3"
  const rangeMatch = cleanStr.match(/(\d+)\s*(?:[-–—/]|to|or)\s*(\d+)/i);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      return targetFamily >= min && targetFamily <= max;
    }
  }

  // 3. Check for "family of X", "family X", "family-X", "familyX", "family: X"
  const familyMatch = cleanStr.match(/family\s*(?:of|size)?\s*[:#-]?\s*(\d+)/i);
  if (familyMatch) {
    const num = parseInt(familyMatch[1], 10);
    return num === targetFamily;
  }

  // 4. Check for "X person", "X people", "X members", "for X", "X pack", "X pax"
  const peopleMatch = cleanStr.match(/(?:for\s*)?(\d+)\s*(?:person|people|members?|pax|pack)/i);
  if (peopleMatch) {
    const num = parseInt(peopleMatch[1], 10);
    return num === targetFamily;
  }

  // 5. If "family" is anywhere in the string, look for targetFamily as a standalone or bound digit
  if (cleanStr.includes('family') || cleanStr.includes('fam')) {
    const digits = cleanStr.match(/\b\d+\b/g);
    if (digits && digits.some((d) => parseInt(d, 10) === targetFamily)) {
      return true;
    }
    const gluedMatch = cleanStr.match(new RegExp(`fam(?:ily)?\\s*${targetFamily}\\b`, 'i'));
    if (gluedMatch) {
      return true;
    }
  }

  // 6. If the entire cleaned string is just the number (e.g. "2" or "4")
  const trimmedDigitsOnly = cleanStr.replace(/[^\d]/g, '');
  if (trimmedDigitsOnly === String(targetFamily)) {
    return true;
  }

  return false;
};

const checkUomMatchesFamily = (uom: any, targetFamily: number): boolean => {
  if (!uom) return false;

  const textCandidates = [uom.unit, uom.name, uom.title, uom.conversion_text]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase().trim());

  if (textCandidates.length === 0) return false;

  return textCandidates.some((str) => matchesFamilyText(str, targetFamily));
};

const findMatchingUom = (product: any, family: FamilySize) => {
  const uoms = product.multiple_uoms || product.uom;
  if (Array.isArray(uoms) && uoms.length > 0) {
    const matching = uoms.filter((u: any) => checkUomMatchesFamily(u, family));
    if (matching.length === 0) return null;
    if (matching.length === 1) return matching[0];
    return matching.find((u: any) => u.is_default) || matching.find((u: any) => u.is_available) || matching[0];
  }
  if (checkUomMatchesFamily(product, family)) {
    return product;
  }
  return null;
};

const getPlanForFamily = (product: any, family: FamilySize): PlanDetails => {
  const matchedUom = findMatchingUom(product, family);

  if (matchedUom) {
    const rawPrice = Number(matchedUom.price ?? 0);
    const rawMarketPrice = matchedUom.market_price ? Number(matchedUom.market_price) : null;
    const marketPrice = rawMarketPrice && rawMarketPrice > rawPrice ? rawMarketPrice : null;
    const weight = matchedUom.conversion_text || matchedUom.weight || matchedUom.unit || '';

    let selection = '';
    if (Array.isArray(matchedUom.harvest_items) && matchedUom.harvest_items.length > 0) {
      selection = matchedUom.harvest_items.map((h: any) => `${h.weight ? h.weight + ' ' : ''}${h.title}`).join(', ');
    } else {
      selection = product.description || product.item_description || '';
    }

    return {
      weight,
      price: rawPrice,
      marketPrice,
      priceMonth: rawPrice,
      perDelivery: rawPrice,
      selection
    };
  }

  const rawPrice = Number(product.price ?? 0);
  const rawMarketPrice = product.market_price ? Number(product.market_price) : null;
  const marketPrice = rawMarketPrice && rawMarketPrice > rawPrice ? rawMarketPrice : null;
  return {
    weight: product.conversion_text || product.weight || '',
    price: rawPrice,
    marketPrice,
    priceMonth: rawPrice,
    perDelivery: rawPrice,
    selection: product.description || product.item_description || ''
  };
};

const getProductDisplayData = (product: any, index: number, selectedFamily: FamilySize) => {
  const plan = getPlanForFamily(product, selectedFamily);
  const title = product.item_name || product.display_title || product.title || product.name || 'Subscription Box';
  const description = product.description || product.item_description || '';
  const image =
    cleanImageUrl(product.image || product.website_image || product.logo || product.multiple_images?.[0]) ||
    '/onam.png';

  const tag = product.tag_text || product.tag || (product.tags && product.tags[0]) || '';

  const tagColor: 'orange' | 'green' = product.tagColor || (index % 2 === 0 ? 'orange' : 'green');
  const rating = Number(product.rating || 4.9);
  const reviews = product.reviews ? String(product.reviews) : '1.2k';

  return {
    id: product.id,
    title,
    description,
    image,
    tag,
    tagColor,
    rating,
    reviews,
    plan
  };
};

/* ── High-Fidelity Responsive Skeleton Loader ── */
const SubscriptionPlansSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={`w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className} animate-pulse`}>
      {/* ── Section 1 Skeleton: Rhythm Filter Bar (Mobile & Desktop) ── */}
      <div
        className="w-full max-w-[1332px] mx-auto bg-[#EAE6DE]/80 rounded-[13.5px] p-[27px] mob:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mob:gap-4 sm:gap-6 shadow-sm"
        style={{
          borderRadius: '13.5px',
          minHeight: '113.125px'
        }}
      >
        {/* Left: Icon & Title Placeholders */}
        <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <div className="w-11 h-11 mob:w-10 mob:h-10 sm:w-12 sm:h-12 rounded-[14px] bg-[#D6D0C4] flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-2.5 w-36 mob:w-28 bg-[#D0C9BC] rounded" />
            <div className="h-5 mob:h-4 w-64 mob:w-48 bg-[#C5BEB0] rounded" />
          </div>
        </div>

        {/* Right: Frequency Pill, Family Selector & Delivery Info Placeholders */}
        <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 w-full lg:w-auto justify-between lg:justify-end mob:w-full mob:pt-3 mob:border-t mob:border-black/5 mob:pl-0">
          <div className="w-[92px] h-[37px] rounded-full bg-white/70" />
          <div className="w-[180px] mob:w-44 h-[37px] rounded-full bg-white/70" />
          <div className="flex flex-col gap-1.5 mob:w-full sm:pl-5 sm:border-l sm:border-black/10">
            <div className="h-2.5 w-20 bg-[#D0C9BC] rounded" />
            <div className="h-3.5 w-36 bg-[#C5BEB0] rounded" />
          </div>
        </div>
      </div>

      {/* ── Section 2 Skeleton: Header & Product Cards (Mobile & Desktop) ── */}
      <div className="w-full max-w-[1332px] mx-auto mt-10 lg:mt-14">
        {/* Section Header Placeholder */}
        <div className="text-left mb-8 flex flex-col gap-2.5">
          <div className="h-3 w-44 mob:w-32 bg-[#D8D2C6] rounded" />
          <div className="h-9 mob:h-7 w-80 mob:w-60 bg-[#C5BEB0] rounded" />
          <div className="h-4 mob:h-3.5 w-full max-w-[560px] bg-[#E0DCD3] rounded" />
        </div>

        {/* Product Cards Grid: 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {[1, 2, 3].map((skeletonId) => (
            <div
              key={skeletonId}
              className="bg-white rounded-[22px] overflow-hidden border border-[#EBE8E0] shadow-sm flex flex-col justify-between"
            >
              {/* Card Image Area Placeholder */}
              <div className="relative w-full aspect-[4/3] bg-[#EAE7DF] p-3 flex justify-between items-start">
                <div className="h-5 w-24 bg-black/10 rounded-full" />
                <div className="h-5 w-14 bg-white/80 rounded-full self-end" />
              </div>

              {/* Card Body Placeholder */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 text-left">
                <div className="flex flex-col gap-2.5">
                  {/* Title & Weight */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-6 w-3/5 bg-[#D8D2C6] rounded" />
                    <div className="h-4 w-12 bg-[#E2DBD0] rounded" />
                  </div>

                  {/* Description lines */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="h-3.5 w-full bg-[#EFECE6] rounded" />
                    <div className="h-3.5 w-4/5 bg-[#EFECE6] rounded" />
                  </div>

                  {/* Selection Box */}
                  <div className="bg-[#F9F8F5] rounded-[12px] p-3 border border-[#EFECE6] mt-1 flex flex-col gap-1.5">
                    <div className="h-2.5 w-28 bg-[#DFDAD0] rounded" />
                    <div className="h-3 w-full bg-[#EAE6DE] rounded" />
                  </div>
                </div>

                {/* Bottom Price & Button */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-2 mb-3">
                    <div className="h-6 w-24 bg-[#D0C9BC] rounded" />
                    <div className="h-4 w-14 bg-[#DFDAD0] rounded" />
                  </div>
                  <div className="h-11 w-full bg-[#F5A623]/35 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface SubscriptionPlansSectionProps {
  onSubscribe?: (product: any, familySize: FamilySize) => void;
  className?: string;
  initialProducts?: any[];
}

const SubscriptionPlansSection: React.FC<SubscriptionPlansSectionProps> = ({
  onSubscribe,
  className = '',
  initialProducts
}) => {
  const router = useRouter();
  const [selectedFamily, setSelectedFamily] = useState<FamilySize>(2);
  const [productsList, setProductsList] = useState<any[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProducts);
  const familyOptions: FamilySize[] = [2, 3, 4, 5];

  const filteredProducts = productsList.filter((rawProduct) => {
    return Boolean(findMatchingUom(rawProduct, selectedFamily));
  });

  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    let apiUrl;

    if (token && addressFromLs) {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getCategories'] + `/20/sub-categories/103`;

      if (addressFromLs)
        additionalHeaders = {
          'store-id': addressFromLs.store_id
        };
    } else {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getCategories'] + `/20/sub-categories/103`;
    }

    const successHandler = (data: any) => {
      const items = data?.items;
      if (items && Array.isArray(items) && items.length > 0) {
        setProductsList(items);
      } else {
        setProductsList([]);
      }
      setIsLoading(false);
    };

    const failureHandler = () => {
      setProductsList([]);
      setIsLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, []);

  /* ── Display Skeleton Loader before the sections appear ── */
  if (isLoading) {
    return <SubscriptionPlansSkeleton className={className} />;
  }

  return (
    <section className={`w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
      {/* ── Section 1: Customize Subscription Rhythm Filter Bar ── */}
      <div
        className="w-full max-w-[1332px] mx-auto bg-[#EAE6DE] rounded-[13.5px] p-[27px] mob:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mob:gap-4 sm:gap-6 shadow-sm"
        style={{
          borderRadius: '13.5px',
          minHeight: '113.125px',
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
      >
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 mob:w-10 mob:h-10 sm:w-12 sm:h-12 rounded-[14px] bg-[#EA5824] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="8" cy="14" r="1" fill="currentColor" />
              <circle cx="12" cy="14" r="1" fill="currentColor" />
              <circle cx="16" cy="14" r="1" fill="currentColor" />
              <circle cx="8" cy="18" r="1" fill="currentColor" />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
              <circle cx="16" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span
              className="text-[#8D4320] font-bold text-[10px] sm:text-[11px] tracking-[0.12em] uppercase leading-none mb-1.5"
              style={{ fontFamily: 'SofiaPro' }}
            >
              CUSTOMIZE SUBSCRIPTION RHYTHM
            </span>
            <h2
              className="text-[#132B1E] font-semibold text-[22.5px] mob:text-[18px] leading-[31.5px] mob:leading-[1.3]"
              style={{
                fontFamily: 'Recoleta',
                fontWeight: 600,
                letterSpacing: '0px'
              }}
            >
              Tailor frequency to your cooking habits
            </h2>
          </div>
        </div>

        {/* Right: Frequency Pill, Family Selector & Delivery Info */}
        <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 w-full lg:w-auto justify-between lg:justify-end">
          {/* Frequency pill */}
          <div
            className="w-[92px] h-[37px] rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0"
            style={{
              width: '92px',
              height: '37px',
              borderRadius: '11248.88px',
              padding: '4.5px',
              backgroundColor: '#FFFFFF',
              opacity: 1,
              transform: 'rotate(0deg)'
            }}
          >
            <div
              className="w-full h-full rounded-full bg-[#F5A623] text-[#132B1E] font-semibold text-[13px] flex items-center justify-center text-center shadow-xs"
              style={{
                borderRadius: '11248.88px',
                fontFamily: 'SofiaPro'
              }}
            >
              Weekly
            </div>
          </div>

          {/* Family Size Selector */}
          <div className="bg-white rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-[#DFDAD0] shadow-sm">
            <span className="text-[#6B7268] text-[13px] font-medium pl-1.5" style={{ fontFamily: 'SofiaPro' }}>
              Family:
            </span>
            {familyOptions.map((size) => {
              const isActive = selectedFamily === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedFamily(size)}
                  className={`w-6 h-6 flex-shrink-0 rounded-full text-[13px] font-bold leading-none flex items-center justify-center text-center cursor-pointer transition-colors duration-150 ${
                    isActive ? 'bg-[#F5A623] text-[#132B1E]' : 'bg-transparent text-[#6B7268] hover:text-[#132B1E]'
                  }`}
                  style={{ fontFamily: 'SofiaPro' }}
                  aria-label={`Select family size of ${size}`}
                >
                  <span className="w-full text-center select-none">{size}</span>
                </button>
              );
            })}
          </div>

          {/* Free Delivery Info */}
          <div className="flex flex-col text-left sm:text-right pl-2 sm:pl-0 sm:border-l sm:border-black/10 sm:pl-5 mob:w-full mob:pt-3 mob:border-t mob:border-black/10 mob:pl-0">
            <span
              className="text-[#7A837A] uppercase font-bold text-[10px] tracking-wider leading-none mb-1"
              style={{ fontFamily: 'SofiaPro' }}
            >
              FREE DELIVERY
            </span>
            <span className="text-[#132B1E] font-bold text-[12px] leading-none" style={{ fontFamily: 'SofiaPro' }}>
              Sundays 7:00 AM – 11:00 AM
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Three ways to fill your kitchen ── */}
      <div className="w-full max-w-[1332px] mx-auto mt-10 lg:mt-14">
        {/* Section Header */}
        <div className="text-left mb-8">
          <span
            className="text-[#8D4320] font-bold text-[11px] tracking-[0.14em] uppercase leading-none mb-2 block"
            style={{ fontFamily: 'SofiaPro' }}
          >
            FIND YOUR WEEKLY FAVOURITES
          </span>
          <h2
            className="text-[#132B1E] font-semibold text-[32px] mob:text-[26px] sm:text-[38px] lg:text-[42px] leading-[1.1] mb-2.5"
            style={{ fontFamily: 'Recoleta' }}
          >
            Three ways to fill your kitchen.
          </h2>
          <p className="text-[#556057] text-[14px] sm:text-[17px]" style={{ fontFamily: 'SofiaPro' }}>
            Every box comes fresh from verified regenerative plots in recyclable thermal insulation.
          </p>
        </div>

        {/* Product Cards Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="w-full bg-white rounded-[22px] border border-[#EBE8E0] p-10 text-center shadow-xs">
            <p className="text-[#556057] text-[15px]" style={{ fontFamily: 'SofiaPro' }}>
              {productsList.length === 0
                ? 'No subscription boxes are currently available for this delivery area.'
                : `No subscription boxes are currently available for Family of ${selectedFamily}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {filteredProducts.map((rawProduct, idx) => {
              const product = getProductDisplayData(rawProduct, idx, selectedFamily);
              const currentPlan = product.plan;
              const matchedUom = findMatchingUom(rawProduct, selectedFamily);

              const handleNavigate = () => {
                const query = matchedUom?.variant_id
                  ? `?variant=${matchedUom.variant_id}&family=${selectedFamily}`
                  : `?family=${selectedFamily}`;
                router.push(`/subscriptionbox/${product.id || 236}${query}`);
              };

              return (
                <div
                  key={product.id || idx}
                  className="bg-white rounded-[22px] overflow-hidden border border-[#EBE8E0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image + Badges */}
                  <div
                    onClick={handleNavigate}
                    className="relative w-full aspect-[4/3] overflow-hidden bg-[#F2EEE7] cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Top-Left Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      {product.tag ? (
                        <span
                          className={`text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wider ${
                            product.tagColor === 'orange' ? 'bg-[#EA5824]' : 'bg-[#1E3F2F]'
                          }`}
                          style={{ fontFamily: 'SofiaPro' }}
                        >
                          {product.tag}
                        </span>
                      ) : null}

                      <span
                        className="bg-[#132B1E]/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wider"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        FAMILY OF {selectedFamily}
                      </span>
                    </div>

                    {/* Bottom-Right Rating Badge */}
                    <div
                      className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md text-[11px] font-bold text-[#132B1E]"
                      style={{ fontFamily: 'SofiaPro' }}
                    >
                      <span className="text-[#F5A623]">★</span>
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 text-left">
                    <div className="flex flex-col gap-2">
                      {/* Title and Weight */}
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={handleNavigate}
                          className="text-[#132B1E] hover:text-[#8D4320] transition-colors cursor-pointer font-semibold text-[20px] leading-tight"
                          style={{ fontFamily: 'Recoleta' }}
                        >
                          {product.title}
                        </h3>
                        <span
                          className="text-[#D96528] font-semibold text-[13px] flex-shrink-0 pt-0.5"
                          style={{ fontFamily: 'SofiaPro' }}
                        >
                          {currentPlan.weight}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className="text-[#556057] text-[13px] sm:text-[14px] leading-relaxed line-clamp-2"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        {product.description}
                      </p>

                      {/* This Week's Selection Box */}
                      {currentPlan.selection ? (
                        <div className="bg-[#F9F8F5] rounded-[12px] p-3 border border-[#EFECE6] mt-1">
                          <span
                            className="text-[#7A837A] uppercase font-bold text-[10px] tracking-wider mb-1 block"
                            style={{ fontFamily: 'SofiaPro' }}
                          >
                            THIS WEEK&apos;S SELECTION:
                          </span>
                          <p
                            className="text-[#2C3830] text-[12px] leading-snug line-clamp-2"
                            style={{ fontFamily: 'SofiaPro' }}
                          >
                            {currentPlan.selection}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* Bottom Price & Subscribe Button */}
                    <div className="pt-2">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span
                            className="text-[#132B1E] font-bold text-[24px] mob:text-[22px] leading-none"
                            style={{ fontFamily: 'Recoleta' }}
                          >
                            ₹{currentPlan.price.toLocaleString()}
                          </span>
                          {currentPlan.marketPrice && currentPlan.marketPrice > currentPlan.price ? (
                            <span
                              className="text-[#9BA39B] line-through text-[15px] mob:text-[13.5px] font-normal"
                              style={{ fontFamily: 'SofiaPro' }}
                            >
                              ₹{currentPlan.marketPrice.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onSubscribe) {
                            onSubscribe(rawProduct, selectedFamily);
                          } else {
                            handleNavigate();
                          }
                        }}
                        className="w-full bg-[#F5A623] hover:bg-[#EAA01E] active:scale-[0.98] text-[#132B1E] font-semibold text-[14px] py-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        style={{ fontFamily: 'SofiaPro' }}
                      >
                        <span>Subscribe</span>
                        <span className="text-[16px] leading-none">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SubscriptionPlansSection;

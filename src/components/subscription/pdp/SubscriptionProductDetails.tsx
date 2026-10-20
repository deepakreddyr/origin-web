import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useAtom } from 'jotai';
import { addressAtom } from '@/features/Address/context/atoms';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { protectedUrl, unprotectedUrl } from '@/url';
import { getAddressAndStoreId, cleanImageUrl } from '@/utilities/utils';
import { setLoginDetails } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent';
import * as gtag from '@/utilities/gtag';
import { trackEvent } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';
import { SubscriptionItemData, SubscriptionUOM } from './mockSubscriptionData';
import SubscriptionGallery from './SubscriptionGallery';
import SubscriptionBuyBox from './SubscriptionBuyBox';
import SubscriptionDispatchManifest from './SubscriptionDispatchManifest';
import SubscriptionProvenanceBanner from './SubscriptionProvenanceBanner';
import SubscriptionHarvestSequence from './SubscriptionHarvestSequence';

/* ── High-Fidelity Responsive Skeleton Loader for PDP ── */
const SubscriptionProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white min-h-screen pt-4 pb-16 animate-pulse">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-[54px]">
        {/* Top Breadcrumb Placeholder */}
        <div className="flex items-center justify-between gap-3 py-3 mb-6 border-b border-black/5">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#E4DFD5]" />
            <div className="h-3 w-12 rounded bg-[#E4DFD5]" />
            <div className="h-3 w-2 rounded bg-[#E4DFD5]" />
            <div className="h-3 w-20 rounded bg-[#E4DFD5]" />
            <div className="h-3 w-2 rounded bg-[#E4DFD5]" />
            <div className="h-3 w-36 mob:w-24 rounded bg-[#D6D0C4]" />
          </div>
        </div>

        {/* Main 2-Column Product Configurator & Details */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 xl:gap-[40px] mb-6 lg:mb-16">
          {/* Left Column on Desktop / Order 1, 3, 4 on Mobile */}
          <div className="contents lg:flex lg:flex-col lg:flex-1 lg:max-w-[758.25px] lg:gap-8 w-full">
            {/* 1. Gallery Skeleton (order-1 on mobile) */}
            <div className="order-1 lg:order-none w-full bg-[#F5F3EE] rounded-[18px] overflow-hidden border border-[#E8E4DA] p-3 sm:p-4">
              {/* Main image placeholder */}
              <div className="w-full h-[280px] sm:h-[400px] lg:h-[520px] rounded-[14px] bg-[#EAE7DF] relative overflow-hidden" />
              {/* Thumbnails placeholder */}
              <div className="flex items-center gap-3 mt-3.5 pt-2">
                <div className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-[13.5px] bg-[#E2DCD2]" />
                <div className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-[13.5px] bg-[#E2DCD2]" />
                <div className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-[13.5px] bg-[#E2DCD2]" />
              </div>
            </div>

            {/* 2. Dispatch Manifest Skeleton (order-3 on mobile) */}
            <div className="order-3 lg:order-none w-full bg-white rounded-[20px] p-6 sm:p-7 lg:p-8 border border-[#EBE8E0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3.5 h-3.5 rounded bg-[#DFDAD0]" />
                <div className="h-3 w-28 rounded bg-[#DFDAD0]" />
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="h-8 w-64 mob:w-48 bg-[#D0C9BC] rounded" />
                <div className="h-6 w-32 bg-[#EFE9DC] rounded-full" />
              </div>
              <div className="h-3.5 w-full max-w-[580px] bg-[#EAE6DE] rounded mb-6" />

              {/* 4 Manifest Card Skeletons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                {[1, 2, 3, 4].map((id) => (
                  <div
                    key={id}
                    className="bg-[#F5F3EE] rounded-[16px] p-5 border border-[#E8E4DA] flex flex-col justify-between h-[120px]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-[#D8D2C6] rounded" />
                      <div className="h-4 w-14 bg-[#E0DAD0] rounded-full" />
                    </div>
                    <div className="h-3 w-full bg-[#EAE6DE] rounded mt-2" />
                    <div className="h-3 w-3/4 bg-[#EAE6DE] rounded" />
                    <div className="h-3 w-24 bg-[#DCD6CA] rounded mt-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Provenance Banner Skeleton (order-4 on mobile) */}
            <div className="order-4 lg:order-none w-full bg-[#1A3828]/85 rounded-[20px] p-5 sm:p-6 lg:p-7 flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-[220px] h-[150px] sm:h-[170px] rounded-[14px] bg-white/10 shrink-0" />
              <div className="flex-1 flex flex-col gap-2.5 w-full">
                <div className="h-5 w-36 bg-white/15 rounded-full" />
                <div className="h-7 w-60 mob:w-44 bg-white/20 rounded" />
                <div className="h-3.5 w-full bg-white/15 rounded" />
                <div className="h-3.5 w-4/5 bg-white/15 rounded" />
                <div className="h-4 w-36 bg-white/20 rounded mt-1" />
              </div>
            </div>
          </div>

          {/* Right Column on Desktop / Order 2 on Mobile (Sticky Buy Box Skeleton) */}
          <div className="order-2 lg:order-none w-full lg:w-[480px] xl:w-[528.75px] shrink-0">
            <div className="bg-[#FDFBF7] rounded-[22px] p-5 sm:p-7 border border-[#EBE8E0] flex flex-col gap-5">
              {/* Title & Reviews */}
              <div className="flex flex-col gap-2">
                <div className="h-7 w-3/4 bg-[#D6D0C4] rounded" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 bg-[#E2DBD0] rounded-full" />
                  <div className="h-4 w-20 bg-[#EFEAE1] rounded" />
                </div>
              </div>

              {/* Plan Switcher */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="h-[64px] rounded-[14px] bg-[#EFECE6] border border-[#E4DFD5]" />
                <div className="h-[64px] rounded-[14px] bg-[#F7F5F0] border border-[#EAE6DE]" />
              </div>

              {/* Portion Selector */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-[#DFDAD0] rounded" />
                  <div className="h-3 w-28 bg-[#EAE6DE] rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 flex-1 rounded-full bg-[#EAE6DE]" />
                  <div className="h-10 flex-1 rounded-full bg-[#EAE6DE]" />
                </div>
              </div>

              {/* Delivery Slot Banner Placeholder */}
              <div className="h-12 rounded-[14px] bg-[#F7F3EB] border border-[#EFEAE0]" />

              {/* Pricing Box */}
              <div className="bg-[#F5F2EB] rounded-[14px] p-4 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="h-7 w-28 bg-[#D0C9BC] rounded" />
                  <div className="h-3 w-24 bg-[#E0DCD3] rounded" />
                </div>
                <div className="h-6 w-20 bg-[#DFDAD0] rounded" />
              </div>

              {/* CTA Button */}
              <div className="h-12 w-full rounded-full bg-[#F5A623]/35" />

              {/* Assurance bullets */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#EFECE6]">
                <div className="h-3.5 w-56 bg-[#EFECE6] rounded" />
                <div className="h-3.5 w-48 bg-[#EFECE6] rounded" />
                <div className="h-3.5 w-52 bg-[#EFECE6] rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Harvesting Sequence Skeleton */}
        <div className="w-full rounded-[24px] bg-[#132B1E]/90 p-6 sm:p-8 lg:p-10 mt-8">
          <div className="h-3 w-36 bg-white/20 rounded mb-2" />
          <div className="h-8 w-72 mob:w-56 bg-white/25 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((stepId) => (
              <div
                key={stepId}
                className="h-[150px] rounded-[16px] bg-white/5 border border-white/10 p-5 flex flex-col justify-between"
              >
                <div className="h-6 w-8 bg-white/20 rounded" />
                <div className="h-4 w-32 bg-white/20 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-4/5 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SubscriptionProductDetailsProps {
  initialData?: SubscriptionItemData;
}

const SubscriptionProductDetails: React.FC<SubscriptionProductDetailsProps> = ({ initialData }) => {
  const router = useRouter();
  const { isReady, query } = router;
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [address] = useAtom(addressAtom);
  const getDataFromApi = useGetDataFromApi();

  const [itemData, setItemData] = useState<SubscriptionItemData | null>(initialData || null);
  const [selectedUom, setSelectedUom] = useState<SubscriptionUOM | null>(initialData?.multiple_uoms?.[0] || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isReady) {
      const rawId = query.id ? String(query.id) : '';
      const currentId = rawId && rawId !== 'pdp' ? rawId : '236';

      if (fetchedIdRef.current === currentId) {
        return;
      }
      fetchedIdRef.current = currentId;

      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      const storeId = addressFromLs?.store_id;

      // Check for session consistency like normal PDP
      if ((token && !storeId) || (!token && storeId)) {
        console.warn('Inconsistent session state detected on PDP. Clearing session.');
        localStorage.clear();
        sessionStorage.clear();
        dispatch(
          setLoginDetails({
            isLogin: false,
            user: null,
            tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
            isSidebarOpen: false
          })
        );
        return;
      }

      let additionalHeaders: Record<string, string> = {};
      let apiUrl: string;

      if (token) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['searchForProduct'] + `/${currentId}`;
        if (storeId) {
          additionalHeaders = {
            'store-id': String(storeId)
          };
        }
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['searchForProduct'] + `/${currentId}`;
        if (addressFromLs?.store_id) {
          additionalHeaders = {
            'store-id': String(addressFromLs.store_id)
          };
        }
      }

      const successHandler = (data: any) => {
        if (data?.data) {
          const apiItem = data.data.item || data.data;

          const hasMultipleImages = Array.isArray(apiItem?.multiple_images) && apiItem.multiple_images.length > 0;
          const imagesList = hasMultipleImages
            ? apiItem.multiple_images.map((img: string) => cleanImageUrl(img))
            : [cleanImageUrl(apiItem?.image || apiItem?.website_image) || '/onam.png'];

          const parsedUoms: SubscriptionUOM[] = Array.isArray(apiItem?.multiple_uoms)
            ? apiItem.multiple_uoms.map((uom: any) => ({
                variant_id: uom.variant_id,
                uom_id: uom.uom_id,
                unit: uom.unit || '',
                weight: uom.weight || uom.conversion_text || '',
                minimum_quantity: uom.minimum_quantity ?? 1,
                maximum_quantity: uom.maximum_quantity ?? 10,
                stepper_quantity: uom.stepper_quantity ?? 1,
                is_visible: uom.is_visible ?? true,
                is_available: uom.is_available ?? true,
                is_default: uom.is_default ?? false,
                single_price: uom.single_price || uom.price || 0,
                price: uom.price || 0,
                per_delivery: uom.per_delivery || Math.round((uom.price || 0) / 4),
                formatted_price: uom.formatted_price || `₹${Number(uom.price || 0).toLocaleString()}`,
                cart_quantity: uom.cart_quantity || 0,
                conversion_text: uom.conversion_text || null,
                ripeness_types: uom.ripeness_types || null,
                cart_ripeness: uom.cart_ripeness || [],
                market_price: uom.market_price || 0,
                original_price: uom.original_price || uom.market_price || 0,
                harvest_items: Array.isArray(uom.harvest_items) ? uom.harvest_items : []
              }))
            : [];

          const resolvedItem: SubscriptionItemData = {
            id: apiItem.id,
            item_code: apiItem.item_code || '',
            name: apiItem.name || apiItem.item_name || 'Subscription Box',
            display_title: apiItem.display_title || apiItem.name || apiItem.item_name || 'Subscription Box',
            item_description: apiItem.description || apiItem.item_description || '',
            image: cleanImageUrl(apiItem.image || apiItem.website_image) || '/onam.png',
            website_image: cleanImageUrl(apiItem.website_image) || null,
            multiple_images: imagesList,
            tag_url: apiItem.tag_url ?? null,
            tags:
              Array.isArray(apiItem.tags) && apiItem.tags.length > 0
                ? apiItem.tags
                : ['COMMUNITY FAVORITE • BEST VALUE'],
            bg_color: apiItem.bg_color || '#F9F0DA',
            is_collaborate_item: Boolean(apiItem.is_collaborate_item),
            title: apiItem.title || "THIS WEEK'S SELECTION:",
            description: apiItem.description || apiItem.item_description || '',
            provider_id: apiItem.provider_id || null,
            navigation: apiItem.navigation || { to: `/api/v5/user/items/${apiItem.id}` },
            is_greyed: Boolean(apiItem.is_greyed),
            is_available: apiItem.is_available ?? true,
            is_orderable: apiItem.is_orderable ?? true,
            is_subscription: true,
            subscription_details: apiItem.subscription_details || {
              title: 'Monthly Crate',
              description: '4 Sunday Deliveries',
              discount_label: 'SAVE 15%'
            },
            single_trail: apiItem.single_trail || {
              title: 'Single Trial',
              description: 'One-off 1 Sunday'
            },
            ratings: apiItem.ratings || {
              review_count: 120,
              average_ratings: 4.9
            },
            multiple_uoms: parsedUoms
          };

          setItemData(resolvedItem);

          if (parsedUoms.length > 0) {
            const targetVariantId = query.variant ? Number(query.variant) : null;
            const targetFamily = query.family ? String(query.family) : null;
            let matchedUom = null;
            if (targetVariantId) {
              matchedUom = parsedUoms.find((u) => u.variant_id === targetVariantId);
            }
            if (!matchedUom && targetFamily) {
              matchedUom = parsedUoms.find((u) =>
                String(u.unit || u.weight || '')
                  .toLowerCase()
                  .includes(targetFamily.toLowerCase())
              );
            }
            setSelectedUom(matchedUom || parsedUoms.find((u) => u.is_default) || parsedUoms[0]);
          }

          // Track GA & CleverTap event like in normal PDP
          try {
            const defaultUOM = parsedUoms.find((uom) => uom.is_default) || parsedUoms[0];

            gtag.event({
              action: 'view_item',
              category: 'Ecommerce',
              items: [
                {
                  item_id: resolvedItem.id,
                  item_name: resolvedItem.name,
                  price: defaultUOM?.price,
                  item_category: apiItem.category_name,
                  item_variant: defaultUOM?.unit
                }
              ]
            });

            trackEvent(AnalyticsEvents.PRODUCT_VIEW, {
              prid: String(resolvedItem.id || ''),
              uom: defaultUOM?.unit || '',
              image: resolvedItem.website_image || resolvedItem.image || '',
              prqt: defaultUOM?.stepper_quantity || 1,
              product_name: resolvedItem.name || '',
              category: apiItem.category_name || '',
              selling_price: defaultUOM?.market_price || defaultUOM?.price || 0,
              final_price: defaultUOM?.price || 0,
              in_stock: defaultUOM?.is_available ? 'Yes' : 'No'
            });
          } catch (e) {
            console.error('Analytics tracking error:', e);
          }
        }
        setIsLoading(false);
      };

      const failureHandler = (err: any) => {
        console.error('Failed to fetch subscription product:', err);
        setIsLoading(false);
      };

      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, [isReady, query.id, query.variant, query.family, loginDetails?.isLogin, address?.defaultAddress?.store_id]);

  /* ── Display Skeleton Loader while fetching product ── */
  if (isLoading) {
    return <SubscriptionProductDetailsSkeleton />;
  }

  /* ── Not Found Fallback ── */
  if (!itemData) {
    return (
      <div className="w-full bg-white min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-[#132B1E] font-semibold text-[26px] mb-3" style={{ fontFamily: 'Recoleta' }}>
          Subscription Box Not Found
        </h2>
        <p className="text-[#556057] text-[15px] mb-6 max-w-md" style={{ fontFamily: 'SofiaPro' }}>
          We couldn&apos;t find the subscription box you were looking for. Please browse our active subscription plans.
        </p>
        <Link
          href="/subscriptionbox"
          className="bg-[#F5A623] hover:bg-[#EAA01E] text-[#132B1E] font-bold text-[14px] px-6 py-3 rounded-full transition-all"
          style={{ fontFamily: 'SofiaPro' }}
        >
          View Subscription Plans →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen pt-4 pb-16">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-[54px]">
        {/* Top Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 mb-6 text-[12.5px] border-b border-black/5">
          <div className="flex items-center gap-2 text-[#7A837A]" style={{ fontFamily: 'SofiaPro' }}>
            <Link href="/" className="hover:text-[#132B1E] flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/subscriptionbox" className="hover:text-[#132B1E]">
              Subscriptions
            </Link>
            <span>/</span>
            <span className="text-[#132B1E] font-medium">{itemData.display_title || itemData.name}</span>
          </div>
        </div>

        {/* Main 2-Column Product Configurator & Details */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 xl:gap-[40px] mb-6 lg:mb-16">
          {/* Left Column: Gallery + Dispatch Manifest + Provenance Banner */}
          <div className="contents lg:flex lg:flex-col lg:flex-1 lg:max-w-[758.25px] lg:gap-8">
            {/* Section 1: Gallery */}
            <div className="order-1 lg:order-none w-full">
              <SubscriptionGallery
                images={
                  itemData.multiple_images && itemData.multiple_images.length > 0
                    ? itemData.multiple_images
                    : [itemData.image]
                }
                portionSuitability={
                  selectedUom?.unit?.includes('2')
                    ? 'Ideal for 2–4 Persons'
                    : selectedUom?.unit?.includes('3')
                      ? 'Ideal for 3–5 Persons'
                      : 'Ideal for 4–6 Persons'
                }
              />
            </div>

            {/* Section 2: Dispatch Manifest (What's in this Sunday's Harvest Box) */}
            <div className="order-3 lg:order-none w-full">
              <SubscriptionDispatchManifest
                harvestItems={selectedUom?.harvest_items || []}
                totalWeight={selectedUom?.weight || selectedUom?.conversion_text || ''}
              />
            </div>

            {/* Section 3: Provenance Banner (Green Earth Organics) */}
            <div className="order-4 lg:order-none w-full">
              <SubscriptionProvenanceBanner />
            </div>
          </div>

          {/* Right Column: Sticky Buy Box (Appears as order-2 on mobile, right below Gallery and before Dispatch Manifest) */}
          <div className="order-2 lg:order-none w-full lg:w-[480px] xl:w-[528.75px] shrink-0 lg:sticky lg:top-[90px]">
            <SubscriptionBuyBox
              itemData={itemData}
              selectedUom={selectedUom}
              onSelectUom={(uom) => setSelectedUom(uom)}
            />
          </div>
        </div>

        {/* Section 4: The 24-Hour Harvesting Sequence */}
        <SubscriptionHarvestSequence />
      </div>
    </div>
  );
};

export default SubscriptionProductDetails;

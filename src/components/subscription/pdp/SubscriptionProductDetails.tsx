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
import { MOCK_SUBSCRIPTION_ITEM, SubscriptionItemData, SubscriptionUOM } from './mockSubscriptionData';
import SubscriptionGallery from './SubscriptionGallery';
import SubscriptionBuyBox from './SubscriptionBuyBox';
import SubscriptionDispatchManifest from './SubscriptionDispatchManifest';
import SubscriptionProvenanceBanner from './SubscriptionProvenanceBanner';
import SubscriptionHarvestSequence from './SubscriptionHarvestSequence';

interface SubscriptionProductDetailsProps {
  initialData?: SubscriptionItemData;
}

const SubscriptionProductDetails: React.FC<SubscriptionProductDetailsProps> = ({
  initialData = MOCK_SUBSCRIPTION_ITEM
}) => {
  const router = useRouter();
  const { isReady, query } = router;
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: any) => state.loginDetails);
  const [address] = useAtom(addressAtom);
  const getDataFromApi = useGetDataFromApi();

  const [itemData, setItemData] = useState<SubscriptionItemData>(initialData);
  const [selectedUom, setSelectedUom] = useState<SubscriptionUOM>(initialData.multiple_uoms[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isReady) {
      // By default for testing purpose, call ID 236 (or query.id if provided and not '71')
      const rawId = query.id ? String(query.id) : '';
      const currentId = !rawId || rawId === '71' ? '236' : rawId;

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

          setItemData((prev) => {
            const hasMultipleImages = apiItem?.multiple_images && apiItem.multiple_images.length > 0;
            const imagesList = hasMultipleImages
              ? apiItem.multiple_images.map((img: string) => cleanImageUrl(img))
              : [cleanImageUrl(apiItem?.image) || prev.image];

            const updatedItem: SubscriptionItemData = {
              ...prev,
              id: apiItem.id || prev.id,
              item_code: apiItem.item_code || prev.item_code,
              name: apiItem.name || prev.name,
              display_title: apiItem.name || prev.display_title,
              item_description: apiItem.description || apiItem.item_description || prev.item_description,
              image: cleanImageUrl(apiItem.image) || prev.image,
              website_image: cleanImageUrl(apiItem.website_image) || prev.website_image,
              multiple_images: imagesList,
              tag_url: apiItem.tag_url ?? prev.tag_url,
              tags: apiItem.tags && apiItem.tags.length > 0 ? apiItem.tags : prev.tags,
              bg_color: apiItem.bg_color || prev.bg_color,
              is_available: apiItem.is_available ?? prev.is_available,
              is_orderable: apiItem.is_orderable ?? prev.is_orderable,
              ratings: apiItem.ratings || prev.ratings,
              subscription_details: apiItem.subscription_details || prev.subscription_details,
              single_trail: apiItem.single_trail || prev.single_trail,
              multiple_uoms:
                apiItem.multiple_uoms && apiItem.multiple_uoms.length > 0
                  ? apiItem.multiple_uoms.map((uom: any, idx: number) => {
                      const fallbackUom = prev.multiple_uoms[idx] || prev.multiple_uoms[0];
                      return {
                        ...fallbackUom,
                        ...uom,
                        variant_id: uom.variant_id || fallbackUom.variant_id,
                        uom_id: uom.uom_id || fallbackUom.uom_id,
                        unit: uom.unit || fallbackUom.unit,
                        weight: uom.weight || fallbackUom.weight,
                        price: uom.price || fallbackUom.price,
                        single_price: uom.single_price || uom.price || fallbackUom.single_price,
                        per_delivery: uom.per_delivery || Math.round((uom.price || fallbackUom.price) / 4),
                        market_price: uom.market_price || fallbackUom.market_price,
                        harvest_items:
                          uom.harvest_items && uom.harvest_items.length > 0
                            ? uom.harvest_items
                            : fallbackUom.harvest_items
                      };
                    })
                  : prev.multiple_uoms
            };

            if (updatedItem.multiple_uoms && updatedItem.multiple_uoms.length > 0) {
              setSelectedUom(updatedItem.multiple_uoms[0]);
            }
            return updatedItem;
          });

          // Track GA & CleverTap event like in normal PDP
          try {
            const item = data.data.item || data.data;
            const defaultUOM = item?.multiple_uoms?.find((uom: any) => uom.is_default) || item?.multiple_uoms?.[0];

            gtag.event({
              action: 'view_item',
              category: 'Ecommerce',
              items: [
                {
                  item_id: item?.id,
                  item_name: item?.name,
                  price: defaultUOM?.price,
                  item_category: item?.category_name,
                  item_variant: defaultUOM?.variant_name
                }
              ]
            });

            trackEvent(AnalyticsEvents.PRODUCT_VIEW, {
              prid: String(item?.id || ''),
              uom: defaultUOM?.unit || '',
              image: item?.website_image || item?.image || '',
              prqt: defaultUOM?.stepper_quantity || 1,
              product_name: item?.name || '',
              category: item?.category_name || '',
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
  }, [isReady, query.id, loginDetails?.isLogin, address?.defaultAddress?.store_id]);

  return (
    <div className="w-full bg-white min-h-screen pt-4 pb-16">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-[54px]">
        {/* Top Breadcrumb & Next Harvest Dispatch Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 mb-4 text-[12.5px] border-b border-black/5">
          {/* Breadcrumbs */}
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

          {/* Next Harvest Dispatch Callout */}
          {/* <div className="flex items-center gap-1.5 text-[#8D4320] font-bold tracking-wider text-[11px] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#EA5824] animate-pulse" />
            <span style={{ fontFamily: 'SofiaPro' }}>NEXT HARVEST DISPATCH: THIS SUNDAY DAWN</span>
          </div> */}
        </div>

        {/* Main 2-Column Product Configurator & Details */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 xl:gap-[40px] mb-16">
          {/* Left Column: Gallery + Dispatch Manifest + Provenance Banner (Same size all the way down) */}
          <div className="w-full lg:flex-1 lg:max-w-[758.25px] flex flex-col gap-6">
            <SubscriptionGallery
              images={
                itemData.multiple_images && itemData.multiple_images.length > 0
                  ? itemData.multiple_images
                  : [itemData.image]
              }
              // harvestWeek="Harvest Week #42"
              portionSuitability={
                selectedUom?.unit?.includes('2')
                  ? 'Ideal for 2–4 Persons'
                  : selectedUom?.unit?.includes('3')
                    ? 'Ideal for 3–5 Persons'
                    : 'Ideal for 4–6 Persons'
              }
            />

            {/* Section 2: Dispatch Manifest (What's in this Sunday's Harvest Box) */}
            <SubscriptionDispatchManifest
              harvestItems={selectedUom?.harvest_items || []}
              totalWeight={selectedUom?.weight || '~3.2 kg'}
            />

            {/* Section 3: Provenance Banner (Green Earth Organics) */}
            <SubscriptionProvenanceBanner />
          </div>

          {/* Right Column: Sticky Buy Box */}
          <div className="w-full lg:w-[480px] xl:w-[528.75px] shrink-0 lg:sticky lg:top-[90px]">
            <SubscriptionBuyBox itemData={itemData} onSelectUom={(uom) => setSelectedUom(uom)} />
          </div>
        </div>

        {/* Section 4: The 24-Hour Harvesting Sequence */}
        <SubscriptionHarvestSequence />
      </div>
    </div>
  );
};

export default SubscriptionProductDetails;

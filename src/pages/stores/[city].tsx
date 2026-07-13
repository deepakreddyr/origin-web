import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import CustomHead from '@/components/shared/CustomHead';
import StoreLocatorHero from '@/components/StoreLocator/StoreLocatorHero';
import StoreList from '@/components/StoreLocator/StoreList';
import StoreMap from '@/components/StoreLocator/StoreMap';
import NoStoresView from '@/components/StoreLocator/NoStoresView';
import ComingSoonView from '@/components/StoreLocator/ComingSoonView';
import FutureDestinationTeaser from '@/components/StoreLocator/FutureDestinationTeaser';
import { CityEntry, StoreLocation } from '@/utilities/types';
import { trackEvent, timeEvent, stopTrackTime } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

interface StoreCityPageProps {
  citySlug: string;
  cityLabel: string;
  status: 'active' | 'coming-soon' | 'not-found';
  cities: CityEntry[];
  stores: StoreLocation[];
  mainMenuItems: any;
  footerData: any;
}

export default function StoreCityPage({
  citySlug,
  cityLabel,
  status,
  cities,
  stores,
  mainMenuItems,
  footerData
}: StoreCityPageProps) {
  // Filter stores belonging to this city
  const cityStores = stores.filter((s) => s.city === citySlug);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // Auto-select the first store of the city when page loads
  useEffect(() => {
    if (cityStores.length > 0) {
      setSelectedStoreId(cityStores[0].id);
    } else {
      setSelectedStoreId(null);
    }
  }, [citySlug]);

  // Analytics tracking on mount and city change
  useEffect(() => {
    trackEvent(AnalyticsEvents.STORE_LOCATOR, { city: citySlug, status: status });
    timeEvent(AnalyticsEvents.TRACK_STORE_LOCATOR);
    return () => {
      stopTrackTime(AnalyticsEvents.TRACK_STORE_LOCATOR);
    };
  }, [citySlug, status]);

  const handleSelectStore = (id: number) => {
    setSelectedStoreId(id);
    const store = cityStores.find((s) => s.id === id);
    if (store) {
      trackEvent(AnalyticsEvents.STORE_SELECTED, {
        store_id: id,
        store_name: store.name || '',
        city: citySlug
      });
    }
  };

  return (
    <Layout isHeaderSticky={true} transparentColor="white" mainMenuItems={mainMenuItems} footerData={footerData}>
      <CustomHead
        title={
          status === 'active'
            ? `${cityLabel} Stores | Origin Fresh`
            : status === 'coming-soon'
              ? `Origin Fresh is Coming to ${cityLabel}`
              : `Store Locator | Origin Fresh`
        }
        description={`Find Origin Fresh locations in ${cityLabel}. Explore fresh farm-sourced produce, organic groceries, and boutique shopping near you.`}
      />

      <div className="bg-[#FFF8EF] min-h-screen pb-[6vw] mob:pb-[15vw]">
        {/* Store locator Hero Banner */}
        <StoreLocatorHero cities={cities} activeCity={citySlug} stores={stores} />

        {/* Dynamic content area based on status */}
        {status === 'active' && (
          <div className="max-w-[92vw] mx-auto mt-[4vw] mob:mt-0">
            <div className="flex mob:flex-col-reverse gap-[3vw] mob:gap-[6vw]">
              {/* Left side: List of Stores */}
              <div className="w-[40%] mob:w-full flex flex-col">
                {/* <div className="mb-[1.5vw] mob:mb-[5vw] text-left">
                  <h2 className="font-[Recoleta] font-semibold text-[2.2vw] mob:text-[6.5vw] text-black">
                    Stores in {cityLabel}
                  </h2>
                  <p className="font-[SofiaPro] text-gray-500 text-[0.9vw] mob:text-[3.5vw]">
                    {cityStores.length} {cityStores.length === 1 ? 'store' : 'stores'} near you
                  </p>
                </div> */}
                <StoreList stores={cityStores} selectedStoreId={selectedStoreId} onSelectStore={handleSelectStore} />
              </div>

              {/* Right side: Map view */}
              <div className="w-[60%] mob:w-screen mob:-mx-[4vw] h-[38vw] mob:h-[400px] self-start sticky top-[8vw] mob:static">
                <StoreMap stores={cityStores} selectedStoreId={selectedStoreId} onSelectStore={handleSelectStore} />
              </div>
            </div>

            {/* Show Pune Teaser on active city pages, but obviously not on Pune itself */}
            {citySlug !== 'pune' && <FutureDestinationTeaser />}
          </div>
        )}

        {status === 'coming-soon' && <ComingSoonView cityLabel={cityLabel} />}

        {status === 'not-found' && <NoStoresView cityLabel={cityLabel} />}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { city } = context.query;
  const citySlug = (city as string)?.toLowerCase();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await response.json();
    const { mainMenuItems, footerData, cities, stores } = originApiData;

    // Check if the requested city is in our configuration
    const foundCity = cities.find((c: CityEntry) => c.slug === citySlug);

    let status: 'active' | 'coming-soon' | 'not-found' = 'not-found';
    let cityLabel = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

    if (foundCity) {
      status = foundCity.status;
      cityLabel = foundCity.label;
    }

    return {
      props: {
        citySlug,
        cityLabel,
        status,
        cities,
        stores,
        mainMenuItems,
        footerData
      }
    };
  } catch (error) {
    console.error('Error fetching store locator data:', error);
    return {
      props: {
        citySlug: citySlug || '',
        cityLabel: citySlug ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1) : '',
        status: 'not-found',
        cities: [],
        stores: [],
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

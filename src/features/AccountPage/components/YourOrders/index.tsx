import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';

import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout';
import { activeAccountsPageAtom, isAccountIsOpen } from '../../context/atoms';
import { getOrders } from '../../services/getOrders';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { mainApiUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';
import OrderCard from './OrderCard';
import OrdersSkeleton from '@/components/skeletonLoaders/sidebar/OrdersSkeleton';
import { trackEvent, timeEvent, stopTrackTime } from '@/utilities/analytics';
import { AnalyticsEvents } from '@/utilities/analyticsEvents';

interface Order {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: any;
}

const YourOrders = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order>({
    loading: true,
    success: false,
    error: false,
    data: null
  });
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const getDataFromApi = useGetDataFromApi();
  const [scrollPosition, setScrollPosition] = useState(0);
  const ordersListRef = useRef<HTMLDivElement>(null);

  const fetchOrders = (page: number) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_API_URL + mainApiUrl.getOrdersForUser + `?page=${page}`;
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};

    if (addressFromLs) {
      additionalHeaders = {
        'store-id': addressFromLs.store_id
      };
    }
    const successHandler = (data: any) => {
      setOrders((prevOrders) => ({
        ...prevOrders,
        loading: false,
        success: true,
        data: [...(prevOrders.data || []), ...(data?.data || [])]
      }));
      if (data?.meta?.has_next_page) {
        setPage(data.meta.current_page + 1);
      }
    };
    const failureHandler = (err: any) => {
      setOrders((prevOrders) => ({
        ...prevOrders,
        loading: false,
        error: true
      }));
    };
    getDataFromApi(url, successHandler, failureHandler, additionalHeaders);
  };

  useEffect(() => {
    fetchOrders(page);
    trackEvent(AnalyticsEvents.ORDERS);
    timeEvent(AnalyticsEvents.TRACK_ORDERS);
    return () => {
      stopTrackTime(AnalyticsEvents.TRACK_ORDERS);
    };
  }, []);

  const handleScroll = () => {
    if (!ordersListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ordersListRef.current;
    const scrollPosition = (scrollTop / (scrollHeight - clientHeight)) * 100;

    if (scrollPosition > 75 && !orders.loading) {
      setOrders((prev) => ({ ...prev, loading: true }));
      fetchOrders(page);
    }
  };

  return (
    <div
      ref={ordersListRef}
      onScroll={handleScroll}
      className="flex flex-col grow gap-[1.1vw] mob:gap-[4.1vw] overflow-y-auto"
    >
      {orders?.data?.map((order: any, index: number) => <OrderCard key={index} order={order} />)}
      {orders.loading && <OrdersSkeleton />}
      {!orders.loading && orders.error && (
        <div className="flex flex-col items-center justify-center py-[10vw] mob:py-[20vw] px-[5vw]">
          <p className="text-[1.1vw] mob:text-[4.5vw] font-medium text-red-500 text-center">
            Something went wrong while fetching your orders. Please try again later.
          </p>
        </div>
      )}
      {!orders.loading && !orders.error && orders.data && orders.data.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 py-[10vw] mob:py-[20vw] px-[5vw] text-center h-full min-h-[55vh]">
          <h3 className="text-[2vw] mob:text-[7vw] font-[Recoleta] font-bold text-black mb-[0.8vw] mob:mb-[2vw]">
            No orders yet
          </h3>
        </div>
      )}
    </div>
  );
};

export default YourOrders;

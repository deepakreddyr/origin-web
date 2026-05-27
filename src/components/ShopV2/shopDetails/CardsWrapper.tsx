import ItemCard from '@/components/shared/ItemCard';
import ProductCardLoader, { SingleProductCardLoader } from '@/components/skeletonLoaders/shop/ProductCardLoader';
import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { appendProductList, setPaginationDetails, setIsFetchingNextPage } from '@/store/slice/productsSlice';
import { protectedUrl, unprotectedUrl } from '@/url';
import { getAddressAndStoreId } from '@/utilities/utils';

const CardsWrapper = () => {
  const products = useSelector((state: any) => state.products);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query, isReady } = router;
  const getDataFromApi = useGetDataFromApi();
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchNextPage = useCallback(() => {
    if (products.isFetchingNextPage || products.currentPage >= products.lastPage || !isReady) return;

    dispatch(setIsFetchingNextPage(true));

    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let additionalHeaders = {};
    const storeId = localStorage.getItem('store-id');
    if (storeId && storeId !== 'null') {
      additionalHeaders = { 'store-id': storeId };
    }

    let apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    if (token && addressFromLs) {
      apiUrl += `${protectedUrl['getCategoriesV6']}/${query.cid}/sub-categories/${query.scid}?page=${products.currentPage + 1}&per_page=20`;
    } else {
      apiUrl += `${unprotectedUrl['getCategories']}/${query.cid}/sub-categories/${query.scid}`;
    }

    const successHandler = (data: any) => {
      const itemsData = data?.items?.data || [];
      dispatch(appendProductList(itemsData));
      dispatch(
        setPaginationDetails({
          currentPage: data?.items?.current_page || products.currentPage + 1,
          lastPage: data?.items?.last_page || products.lastPage
        })
      );
      dispatch(setIsFetchingNextPage(false));
    };

    const failureHandler = () => {
      dispatch(setIsFetchingNextPage(false));
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, [
    products.isFetchingNextPage,
    products.currentPage,
    products.lastPage,
    isReady,
    query.cid,
    query.scid,
    dispatch,
    getDataFromApi
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [fetchNextPage]);

  if (products.isProductListLoading) return <ProductCardLoader />;

  return (
    <>
      <div className="grid grid-cols-4 md:grid-cols-4 sm:grid-cols-3 mob:grid-cols-2 gap-[3.5vw] md:gap-[5vw] mob:gap-[5vw] w-full justify-items-center">
        {products.productsList?.map((item: any) => (
          <div key={item.id}>
            <ItemCard itemDetails={item} />
          </div>
        ))}
        {products.isFetchingNextPage &&
          Array.from({ length: 8 }).map((_, index) => <SingleProductCardLoader key={`loader-${index}`} />)}
      </div>
      {products.currentPage < products.lastPage && <div ref={loaderRef} className="w-full h-10 mt-4 mb-8" />}
    </>
  );
};

export default CardsWrapper;

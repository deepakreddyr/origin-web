import { setIsShopCategoriesFetched, setShopCategories } from '@/store/slice/shopCategoriesSlice';
import { protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CategorySection from '@/components/ShopV2/CategorySection';

const ShopByCategory = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const getDataFromApi = useGetDataFromApi();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const addressFromLs = getAddressAndStoreId();
    let apiUrl;
    let additionalHeaders = {};
    if (token) {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['getShopDetails'];
      if (addressFromLs)
        additionalHeaders = {
          'store-id': addressFromLs.store_id
        };
    } else {
      apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['getShopDetails'];
    }
    const successHandler = (data: any) => {
      dispatch(setShopCategories(data?.data));
      dispatch(setIsShopCategoriesFetched(true));
      setLoading(false);
    };
    const failureHandler = (data: any) => {
      dispatch(setShopCategories([]));
      dispatch(setIsShopCategoriesFetched(true));
      setLoading(false);
    };

    getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
  }, []);

  return (
    <div>
      <div className="px-[10vw] pb-[10vw] mob:px-[4vw] mob:pt-[8vw] ">{!loading && <CategorySection />}</div>
    </div>
  );
};

export default ShopByCategory;

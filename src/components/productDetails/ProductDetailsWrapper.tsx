import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useGetDataFromApi } from '@/utilities/hooks/useGetDataFromApi';
import { getAddressAndStoreId } from '@/utilities/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import StoringInfo from './StoringInfo';
import BreadCrumbNavigation from './BreadCrumbNavigation';
import ItemCard from '../shared/ItemCard';
import AddItemBtn from '../shared/AddItemBtn/AddItemBtn';
import NutritionInfo from './NutritionInfo';
import ItemQuantityAndCta from './ItemQuantityAndCta';
import AboutTheProduct from './AboutTheProduct';
import ForgetItemWrapper from './ForgetItemWrapper';
import ProductDetailsPageLoader from '../skeletonLoaders/shop/ProductDetailsPageLoader';
import backIcon from '/public/assets/icons/backIcon.png';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const ProductDetailsWrapper = () => {
  const mobile = useMediaQuery(600);
  const [productDetails, setProductDetails] = useState({
    item: {
      id: '',
      item_code: '',
      name: '',
      image: '',
      tag_url: null,
      bg_color: '',
      is_collaborate_item: false,
      title: '',
      description: '',
      provider_id: null,
      navigation: {
        to: ''
      },
      is_greyed: false,
      is_available: true,
      is_orderable: false,
      multiple_uoms: []
    },
    info: {},
    upsell_items: [],
    combo_items: [],
    isLoading: true
  });
  const getDataFromApi = useGetDataFromApi();
  const router = useRouter();
  const { isReady, query } = router;

  useEffect(() => {
    if (isReady) {
      const token = localStorage.getItem('user_token');
      const addressFromLs = getAddressAndStoreId();
      let additionalHeaders = {};

      let apiUrl;

      if (token) {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl['searchForProduct'] + `/${query.id}`;

        if (addressFromLs)
          additionalHeaders = {
            'store-id': addressFromLs.store_id
          };
      } else {
        apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + unprotectedUrl['searchForProduct'] + `/${query.id}`;
      }

      const successHandler = (data: any) => {
        if (data?.data) setProductDetails({ ...productDetails, ...data.data, isLoading: false });
      };
      const failureHandler = (data: any) => {};
      getDataFromApi(apiUrl, successHandler, failureHandler, additionalHeaders);
    }
  }, [isReady]);

  const productImage = () => {
    return (
      <div className="border rounded-[1.1vw] mob:rounded-b-[0vw] mob:border-b-0 mob:rounded-[4.1vw] mob:bg-[#F2EEE44D] border-beige-200  h-[24.2vw] mob:h-[72vw] flex items-center justify-center ">
        <div className="relative w-[20.7vw] mob:w-[50vw] mob:h-[45vw] h-[18vw] ">
          <Image src={productDetails.item.image} fill alt="" />
        </div>
      </div>
    );
  };

  if (productDetails.isLoading) return <ProductDetailsPageLoader />;
  return (
    <div className="pt-[12vw]  mob:pt-[28vw] mob:px-[4.1vw] px-[10vw] pb-[8vw] relative ">
      <div className=" items-center gap-[3vw] mb-[4.1vw] mob:mb-0 sticky top-[0vw] bg-white z-[2]  py-[4vw] hidden mob:flex">
        <button onClick={() => router.back()} className="relative w-[1.25vw] mob:w-[5vw] mob:h-[5vw] h-[1.25vw]">
          <Image src={backIcon} alt="back" />
        </button>
        <p className="font-[Stinger] font-semibold mob:text-[5.1vw] mt-[2vw] text-[1.67vw]">
          {productDetails.item.name}
        </p>
      </div>
      <div className="flex mob:flex-col gap-[1.67vw] mob:gap-[5vw] ">
        <div className="w-[31vw] mob:w-[92vw] flex flex-col gap-[1.67vw] mob:gap-[5.1vw] ">
          {productImage()}
          {mobile && <ItemQuantityAndCta productDetails={productDetails} />}
          <StoringInfo productDetails={productDetails} />{' '}
        </div>
        <div className="w-[47.2vw] mob:w-full flex flex-col mob:Gap-[5.1vw] gap-[1.67vw]">
          <p className="font-[Stinger] font-semibold text-[1.67vw] mob:hidden">{productDetails.item.name}</p>
          {!mobile && <ItemQuantityAndCta productDetails={productDetails} />}
          <NutritionInfo productDetails={productDetails} />
          <AboutTheProduct productDetails={productDetails} />
        </div>
      </div>
      <ForgetItemWrapper productDetails={productDetails} />
    </div>
  );
};

export default ProductDetailsWrapper;

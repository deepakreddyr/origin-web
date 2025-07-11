import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Dropdown from './Dropdown';
import { useRouter } from 'next/router';
import SubCategoryPills from './SubCategoryPills';
import DropdownAndPillsSkeleton from '@/components/skeletonLoaders/shop/DropdownAndPillsSkeleton';

interface Props {
  filters: any;
  setFilters: any;
}
// let filtersInitialState = {}
const CategoryAndSubCategory = (props: Props) => {
  const { filters, setFilters } = props;
  const [dropdownList, setDropdownList] = useState([]);
  const shopCategories = useSelector((state: any) => state.shopCategories);
  const products = useSelector((state: any) => state.products);
  const router = useRouter();
  const { query, isReady } = router;

  useEffect(() => {
    const handleBackNavigation = (url: string) => {
      if (url !== '/shop') {
        router.replace('/shop');
      }
    };

    router.beforePopState(() => {
      router.replace('/shop');
      return false;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  useEffect(() => {
    if (shopCategories.isCategoriesFetched) {
      const list = shopCategories.categories.find((item: any) => item.type === 'main-category');
      setDropdownList(list.data);
    }
  }, [shopCategories.isCategoriesFetched]);

  const handleStateChange = (value: any, name: any) => {
    let url: any;
    if (name === 'category') {
      const categories = shopCategories.categories.find((item: any) => item.type === 'main-category');
      const defaultSubCategoryList = categories.data.find((item: any) => item.name === value.name);
      let subCategoryName = defaultSubCategoryList.sub_categories[0].name;
      let subCategoryId = defaultSubCategoryList.sub_categories[0].id;
      console.log(categories);
      url = `/shop/${value.name}/${value.id}/${subCategoryName}/${subCategoryId}`;
    } else if (name === 'subCategory') {
      url = `/shop/${filters.category}/${filters.cid}/${value.name}/${value.id}`;
    }
    // if (name === 'category') {
    //     setFilters({
    //         ...filters,
    //         [name]: value.name,
    //         cid: value.id,
    //     })
    // }
    // if (name === 'subCategory') {
    //     setFilters({
    //         ...filters,
    //         [name]: value.name,
    //         scid: value.id,
    //     })
    // }

    router.push(url, undefined, { shallow: true });
  };

  const handleSubCategoryChange = (value: any, name: any) => {
    let url: any;
    url = `/shop/${filters.category}/${filters.cid}/${value.name}/${value.id}`;
    router.push(url, undefined, { shallow: true });
  };

  return (
    <div
      className="sticky pt-[4vw] border-b  
 border-b-[#F2EEE4] mob:pb-[3vw] mob:mb-[4.1vw] p-[1.1vw] top-[0] flex flex-col gap-[1.1vw] bg-white z-[1]"
    >
      {products.isProductListLoading ? (
        <DropdownAndPillsSkeleton />
      ) : (
        <>
          <Dropdown
            value={filters.category}
            valueId={filters.scid}
            name={'category'}
            placeholder={''}
            handler={handleStateChange}
            list={dropdownList}
          />
          <SubCategoryPills value={filters.subCategory} name={'subCategory'} handler={handleStateChange} />
        </>
      )}
    </div>
  );
};

export default CategoryAndSubCategory;

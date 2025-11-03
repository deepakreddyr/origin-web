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

const CategoryAndSubCategory = (props: Props) => {
  const { filters, setFilters } = props;
  const [dropdownList, setDropdownList] = useState([]);
  const shopCategories = useSelector((state: any) => state.shopCategories);
  const products = useSelector((state: any) => state.products);
  const router = useRouter();
  const { query, isReady } = router;

  useEffect(() => {
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
      url = `/shop/${value.name}/${value.id}/${subCategoryName}/${subCategoryId}`;
    } else if (name === 'subCategory') {
      url = `/shop/${filters.category}/${filters.cid}/${value.name}/${value.id}`;
    }

    router.push(url, undefined, { shallow: true, scroll: false });
  };
  
  const toTitleCase = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };

  return (
    <div
      className="
        font-[SofiaPro]
        sticky 
        z-[5]
        pt-4 md:pt-[1.5vw]
        pb-3 md:pb-[1.2vw]
        px-4 md:px-[1.1vw]
        flex 
        flex-col 
        gap-3 md:gap-[1.1vw]
        w-full
      "
      style={{
        // Inline styles as fallback
        position: 'sticky',
        top: '100px', // Adjust based on your header height
      }}
    >
      {products.isProductListLoading ? (
        <DropdownAndPillsSkeleton />
      ) : (
        <>
          <Dropdown
            value={toTitleCase(filters.category)}
            valueId={filters.scid}
            name={'category'}
            placeholder={''}
            handler={handleStateChange}
            list={dropdownList}
          />
          <SubCategoryPills 
            value={filters.subCategory} 
            name={'subCategory'} 
            handler={handleStateChange} 
          />
        </>
      )}
    </div>
  );
};

export default CategoryAndSubCategory;
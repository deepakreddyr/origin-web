import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Dropdown from './Dropdown';
import { useRouter } from 'next/router';
import SubCategoryPills from './SubCategoryPills';
import DropdownAndPillsSkeleton from '@/components/skeletonLoaders/shop/DropdownAndPillsSkeleton';
import { Flag } from '@mui/icons-material';

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
      url = `/shop/${value.name}/${value.id}/${subCategoryName}/${subCategoryId}`;
    } else if (name === 'subCategory') {
      url = `/shop/${filters.category}/${filters.cid}/${value.name}/${value.id}`;
    }

    router.push(url, undefined, { shallow: true, scroll: false });
  };

  const handleSubCategoryChange = (value: any, name: any) => {
    let url: any;
    url = `/shop/${filters.category}/${filters.cid}/${value.name}/${value.id}`;
    router.push(url, undefined, { shallow: true, scroll: false });
  };
  const toTitleCase = (str: string) => {
    // console.log(str);
    return str
      .replace(/-/g, ' ')                   // Replace hyphens with spaces
      .replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  };

  return (
    <div className="sticky top-0 pt-10 md:pt-[4vw] pb-3 md:pb-[1.2vw] mb-0 px-4 md:p-[1.1vw] flex flex-col gap-3 md:gap-[1.1vw] bg-[#FFF9E5] z-[1]">
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
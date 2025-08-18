import Layout from '@/components/Layout';
import ProductDetailsWrapper from '@/components/productDetails/ProductDetailsWrapper';
import { mainApiUrl, protectedUrl } from '@/url';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { GetServerSideProps } from 'next';
import CategorySection from '@/components/ShopV2/CategorySection';

const ProductDetailPage = (props: any) => {
  const { mainMenuItems, footerData, productData } = props;
  const mobile = useMediaQuery(600);

  return (
    <Layout mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={mobile ? false : true}>
      <ProductDetailsWrapper />
      <div className='mb-[25px]'>
      <CategorySection/>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  let productUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL + protectedUrl.searchForProduct + `/${id}`;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    // const response = await fetch(`localhost:3000/api/originApi`);

    const originApiData = await response.json();
    
    const { mainMenuItems, footerData } = originApiData;
    return {
      props: {
        mainMenuItems,
        footerData
      }
    };
  } catch (error) {
    console.error('Error fetching USP card data:', error);
    return {
      props: {
        mainMenuItems: [],
        footerData: {}
      }
    };
  }
};

export default ProductDetailPage;

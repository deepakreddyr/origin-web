import Layout from '@/components/Layout';
import ProductDetailsWrapper from '@/components/productDetails/ProductDetailsWrapper';
import { mainApiUrl, protectedUrl, unprotectedUrl } from '@/url';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { GetServerSideProps } from 'next';
import CategorySection from '@/components/ShopV2/CategorySection';

interface UOM {
  price: number;
  unit: string;
  uom_id: number;
  variant_id: number;
  is_default: boolean;
  is_available: boolean;
  is_visible: boolean;
  market_price: number;
  minimum_quantity: number;
  maximum_quantity: number;
  stepper_quantity: number;
  conversion_text: string;
  ripeness_types: any;
  [key: string]: any;
}

interface InfoDetail {
  description: string;
  [key: string]: any;
}

interface InfoSection {
  title: string;
  type: string;
  sub_title?: string;
  details: InfoDetail[];
}

interface ProductDetailPageProps {
  mainMenuItems: any[];
  footerData: any;
  initialProductDetails: any;
  seoData: {
    title: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    availability: string;
    url: string;
  };
}

const ProductDetailPage = (props: ProductDetailPageProps) => {
  const { mainMenuItems, footerData, initialProductDetails, seoData } = props;
  const mobile = useMediaQuery(600);

  return (
    <Layout mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={mobile ? false : true} useTopPadding={true}>
      <ProductDetailsWrapper />
      {/* <div className='mb-[25px]'>
        <CategorySection />
      </div> */}
    </Layout>
  );
};


export const getServerSideProps: GetServerSideProps = async () => {

  // console.log("hello");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
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
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
    <Layout mainMenuItems={mainMenuItems} footerData={footerData} isHeaderSticky={mobile ? false : true}>
      <ProductDetailsWrapper 
        initialProductDetails={initialProductDetails}
        seoData={seoData}
      />
      <div className='mb-[25px]'>
        <CategorySection/>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async (context) => {
  const { id } = context.params as { id: string };
  const { req } = context;

  try {
    // Fetch layout data (menu items, footer)
    const layoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/originApi`);
    const originApiData = await layoutResponse.json();
    const { mainMenuItems, footerData } = originApiData;

    // Get token from cookies if available
    const token = req.cookies.user_token || null;
    const storeId = req.cookies.store_id || null;

    let apiUrl: string;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Construct API URL based on authentication
    if (token) {
      apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${protectedUrl['searchForProduct']}/${id}`;
      headers['Authorization'] = `Bearer ${token}`;
      
      if (storeId) {
        headers['store-id'] = storeId;
      }
    } else {
      apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${unprotectedUrl['searchForProduct']}/${id}`;
    }

    // Fetch product data from API
    const productResponse = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });

    if (!productResponse.ok) {
      throw new Error(`API call failed: ${productResponse.status}`);
    }

    const apiData = await productResponse.json();
    const productData = apiData.data;

    // Extract SEO data
    const defaultUOM = productData.item.multiple_uoms?.find((uom: UOM) => uom.is_default) || productData.item.multiple_uoms?.[0];
    const aboutSection = productData.info?.info?.find((section: InfoSection) => section.type === 'normal' && section.title === 'About the Product');
    const description = aboutSection?.details?.[0]?.description || `Buy ${productData.item.name} online. Fresh and high-quality products delivered to your doorstep.`;

    // Prepare SEO data
    const seoData = {
      title: `${productData.item.name} - Buy Fresh Online | Origin Fresh`,
      description: description.substring(0, 160),
      image: productData.item.image,
      price: defaultUOM?.price || 0,
      currency: 'INR',
      availability: productData.item.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://originfresh.in/product/${id}`,
    };

    return {
      props: {
        mainMenuItems,
        footerData,
        initialProductDetails: productData,
        seoData,
      },
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    
    // Return 404 page if product not found
    return {
      notFound: true,
    };
  }
};

export default ProductDetailPage;
import React from 'react';
import { Product } from '../shared/UOMPopup';
import MangoItemCard from './MangoItemCard';

const highlightProducts: Product[] = [
  {
    id: 350,
    item_code: 'OG00026',
    name: 'Heirloom Tomatoes',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/CoXb9baRR0oGdQHl4Z7iFV30nmvEP06R7BigRc2w.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5HSPQTC4X46FOMJ%2F20260326%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260326T091713Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Signature=8c318b71bea408b6cf07e940aeaa2836c430a8f49080ab6c859806823902f15f',
    multiple_images: [
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/3z07UoTe4NMKRcd0GUlE0YqXFKv1Dy8ufuHnCZRy.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5HSPQTC4X46FOMJ%2F20260326%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260326T091713Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Signature=2dada6c4c13cc5f1805375396a1f22a23af4f5a21897594225968c0d5db953e6'
    ],
    bg_color: '#F9F0DA',
    navigation: {
      to: '/api/v5/public/skip-login/items/350'
    },
    is_greyed: false,
    is_available: true,
    is_orderable: false,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 1413,
        uom_id: 11,
        unit: '250g',
        minimum_quantity: 1,
        maximum_quantity: 15,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 895,
        conversion_text: '',
        ripeness_types: [],
        market_price: 1253,
        stepper_quantity: 1
      }
    ]
  },
  {
    id: 373,
    item_code: 'OG00062',
    name: 'Microgreens Clover',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/Lb2q3FmubBS2NpTD3xFT9ImGpIRk2sHFqnVCP024.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5HSPQTC4X46FOMJ%2F20260326%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260326T091713Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Signature=7a4cb1b55274ecfa1038926f211db198385b6b392de24162e0ded46237921847',
    multiple_images: [
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/vQkQrt5tHgGPSsvhxvepHA2H71RP8miJ0d9clNvm.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5HSPQTC4X46FOMJ%2F20260326%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260326T091713Z&X-Amz-SignedHeaders=host&X-Amz-Expires=18000&X-Amz-Signature=383aa71e7f9bf824fb93de46ff7844ba8d37dc3833daead57559a1222cac6ce8'
    ],
    bg_color: '#F9F0DA',
    navigation: {
      to: '/api/v5/public/skip-login/items/373'
    },
    is_greyed: false,
    is_available: true,
    is_orderable: false,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 1627,
        uom_id: 9,
        unit: '100g',
        minimum_quantity: 1,
        maximum_quantity: 15,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 195,
        conversion_text: '',
        ripeness_types: [],
        market_price: 273,
        stepper_quantity: 1
      }
    ]
  }
];

const MangoProductHighlight = () => {
  return (
    <section className="px-12 md:px-[7vw] pb-24 relative z-10 md:pt-[5vw]">
      {/* Align with max-w-2xl from Hero section */}
      <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlightProducts.map((product) => (
          <MangoItemCard key={product.id} itemDetails={product} />
        ))}
      </div>
    </section>
  );
};

export default MangoProductHighlight;

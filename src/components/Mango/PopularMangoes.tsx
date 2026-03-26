import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MangoItemCard from './MangoItemCard';
import { Product } from '../shared/UOMPopup';

const popularProducts: Product[] = [
  {
    id: 1001,
    item_code: 'MNGO01',
    name: 'Alphonso',
    description: 'The king of mangoes, sweet and creamy.',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/CoXb9baRR0oGdQHl4Z7iFV30nmvEP06R7BigRc2w.webp',
    multiple_images: [],
    bg_color: '#F9F0DA',
    navigation: { to: '/mango/products/alphonso' },
    is_greyed: false,
    is_available: true,
    is_orderable: true,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 2001,
        uom_id: 1,
        unit: '1 Kilogram',
        minimum_quantity: 1,
        maximum_quantity: 10,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 280,
        conversion_text: '',
        ripeness_types: [],
        market_price: 320,
        stepper_quantity: 1
      }
    ]
  },
  {
    id: 1002,
    item_code: 'MNGO02',
    name: 'Kesar',
    description: 'Saffron-hued, aromatic and intensely sweet.',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/3z07UoTe4NMKRcd0GUlE0YqXFKv1Dy8ufuHnCZRy.webp',
    multiple_images: [],
    bg_color: '#F9F0DA',
    navigation: { to: '/mango/products/kesar' },
    is_greyed: false,
    is_available: true,
    is_orderable: true,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 2002,
        uom_id: 1,
        unit: '1 Kilogram',
        minimum_quantity: 1,
        maximum_quantity: 10,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 260,
        conversion_text: '',
        ripeness_types: [],
        market_price: 300,
        stepper_quantity: 1
      }
    ]
  },
  {
    id: 1003,
    item_code: 'MNGO03',
    name: 'Dasheri',
    description: 'Thin-skinned, fiberless, and delicately sweet.',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/CoXb9baRR0oGdQHl4Z7iFV30nmvEP06R7BigRc2w.webp',
    multiple_images: [],
    bg_color: '#F9F0DA',
    navigation: { to: '/mango/products/dasheri' },
    is_greyed: false,
    is_available: true,
    is_orderable: true,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 2003,
        uom_id: 1,
        unit: '1 Kilogram',
        minimum_quantity: 1,
        maximum_quantity: 10,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 240,
        conversion_text: '',
        ripeness_types: [],
        market_price: 280,
        stepper_quantity: 1
      }
    ]
  },
  {
    id: 1004,
    item_code: 'MNGO04',
    name: 'Langra',
    description: 'Tangy-sweet with a greenish skin.',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/3z07UoTe4NMKRcd0GUlE0YqXFKv1Dy8ufuHnCZRy.webp',
    multiple_images: [],
    bg_color: '#F9F0DA',
    navigation: { to: '/mango/products/langra' },
    is_greyed: false,
    is_available: true,
    is_orderable: true,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 2004,
        uom_id: 1,
        unit: '1 Kilogram',
        minimum_quantity: 1,
        maximum_quantity: 10,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 220,
        conversion_text: '',
        ripeness_types: [],
        market_price: 260,
        stepper_quantity: 1
      }
    ]
  },
  {
    id: 1005,
    item_code: 'MNGO05',
    name: 'Hapoos',
    description: 'Full of juice and flavor, the classic choice.',
    image:
      'https://mm-devlopment.s3.ap-south-1.amazonaws.com/item-images/CoXb9baRR0oGdQHl4Z7iFV30nmvEP06R7BigRc2w.webp',
    multiple_images: [],
    bg_color: '#F9F0DA',
    navigation: { to: '/mango/products/hapoos' },
    is_greyed: false,
    is_available: true,
    is_orderable: true,
    tag_url: null,
    multiple_uoms: [
      {
        variant_id: 2005,
        uom_id: 1,
        unit: '1 Kilogram',
        minimum_quantity: 1,
        maximum_quantity: 10,
        is_visible: true,
        is_available: true,
        is_default: true,
        price: 300,
        conversion_text: '',
        ripeness_types: [],
        market_price: 350,
        stepper_quantity: 1
      }
    ]
  }
];

const PopularMangoes = () => {
  return (
    <section className="relative overflow-visible pt-12 pb-4 z-20">
      {/* Header Area - Constrained to site alignment */}
      <div className="max-w-[1440px] mx-auto px-12 md:px-[7vw] relative z-10 mb-10 md:mb-14">
        <div className="flex items-center justify-between">
          <h2 className="text-[32px] md:text-[50px] font-semibold text-[#1B1B1B]" style={{ fontFamily: 'Recoleta' }}>
            Must-try Mangoes
          </h2>
          <Link
            href="/mango/products"
            className="text-sm md:text-[24px] font-[SofiaPro] font-medium text-[#000000] bg-[#FFE9A1] py-3 md:py-4 px-6 md:px-10 rounded-full hover:bg-[#ffe482] transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Area - Full width with alignment padding */}
      <div className="w-full relative z-10">
        <div
          className="flex overflow-x-auto gap-6 md:gap-5 pb-12 no-scrollbar scroll-smooth"
          style={{
            paddingLeft: 'max(3rem, calc((100vw - 1440px) / 2 + 7vw))'
          }}
        >
          {popularProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[350px]">
              <MangoItemCard itemDetails={product} />
            </div>
          ))}
          {/* Large spacer at the end to allow for a "natural" stop point far to the right */}
          <div className="flex-shrink-0 w-12 md:w-[20vw]" />
        </div>
      </div>
    </section>
  );
};

export default PopularMangoes;

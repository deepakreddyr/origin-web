export interface HarvestItem {
  title: string;
  weight: string;
  icon?: string;
  description: string;
  tag?: string;
  isAlwaysIncluded?: boolean;
  isSwappable?: boolean;
}

export interface SubscriptionUOM {
  variant_id: number;
  uom_id: number;
  unit: string;
  weight: string;
  minimum_quantity: number;
  maximum_quantity: number;
  stepper_quantity: number;
  is_visible: boolean;
  is_available: boolean;
  is_default: boolean;
  single_price: number;
  price: number;
  per_delivery: number;
  formatted_price: string;
  cart_quantity: number;
  conversion_text: string | null;
  ripeness_types: any;
  cart_ripeness: any[];
  market_price: number;
  original_price?: number;
  harvest_items: HarvestItem[];
}

export interface SubscriptionItemData {
  id: number;
  item_code: string;
  name: string;
  display_title: string;
  item_description: string;
  image: string;
  website_image: string | null;
  multiple_images: string[];
  tag_url: string | null;
  tags: string[];
  bg_color: string;
  is_collaborate_item: boolean;
  title: string;
  description: string;
  provider_id: string | null;
  navigation: {
    to: string;
  };
  is_greyed: boolean;
  is_available: boolean;
  is_orderable: boolean;
  is_subscription: boolean;
  subscription_details: {
    title: string;
    description: string;
    discount_label?: string;
  };
  single_trail: {
    title: string;
    description: string;
  };
  ratings: {
    review_count: number;
    average_ratings: number;
  };
  multiple_uoms: SubscriptionUOM[];
}

export const MOCK_SUBSCRIPTION_ITEM: SubscriptionItemData = {
  id: 71,
  item_code: 'FST0005',
  name: 'Apple Granny Smith',
  display_title: 'Curated Mixed Basket',
  item_description:
    'A balanced bounty of wholesome seasonal vegetables and juicy orchard fruits curated for both daily cooking and fresh snacking.',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85',
  website_image: null,
  multiple_images: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=85',
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=85',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=85'
  ],
  tag_url: null,
  tags: ['COMMUNITY FAVORITE • BEST VALUE'],
  bg_color: '#F9F0DA',
  is_collaborate_item: false,
  title: "THIS WEEK'S SELECTION:",
  description: '500g Red Onion, 500g Pahari Potato, 500g Vine Tomatoes, Spinach bunches, 750g Royal',
  provider_id: null,
  navigation: {
    to: '/api/v5/user/items/71'
  },
  is_greyed: false,
  is_available: true,
  is_orderable: true,
  is_subscription: true,
  subscription_details: {
    title: 'Monthly Crate',
    description: '4 Sunday Deliveries',
    discount_label: 'SAVE 15%'
  },
  single_trail: {
    title: 'Single Trial',
    description: 'One-off 1 Sunday'
  },
  ratings: {
    review_count: 318,
    average_ratings: 4.94
  },
  multiple_uoms: [
    {
      variant_id: 15366,
      uom_id: 47,
      unit: 'Family 2',
      weight: '4.8 kg',
      minimum_quantity: 1,
      maximum_quantity: 10,
      stepper_quantity: 1,
      is_visible: true,
      is_available: true,
      is_default: true,
      single_price: 1050,
      price: 4200,
      original_price: 4800,
      per_delivery: 1050,
      formatted_price: '₹4,200',
      cart_quantity: 0,
      conversion_text: null,
      ripeness_types: null,
      cart_ripeness: [],
      market_price: 4800,
      harvest_items: [
        {
          title: 'Kitchen Staples',
          weight: '1.25 kg',
          icon: 'staples',
          description:
            'Sun-cured Nashik Red Onions (500g), unpolished Himalayan Pahadi Potatoes (500g), Vine-ripened Roma Tomatoes (250g).',
          tag: 'Always Included',
          isAlwaysIncluded: true
        },
        {
          title: 'Leafy Garden Greens',
          weight: '500 g',
          icon: 'greens',
          description:
            'Dew-picked baby Palak Spinach (250g) and tender aromatic Methi fenugreek bunches (250g). Washed with ozone mist.',
          tag: 'Swappable for Red Amaranth',
          isSwappable: true
        },
        {
          title: 'Seasonal Field Veggies',
          weight: '1.25 kg',
          icon: 'veggies',
          description:
            'Crunchy Orange Carrots (250g), crisp Bell Peppers (250g), tender Italian Green Zucchini (250g), baby Okra (250g), Cauliflower (250g).',
          tag: '5 Distinct Micro-crops',
          isAlwaysIncluded: true
        },
        {
          title: 'Orchard Sweet Fruits',
          weight: '750 g',
          icon: 'fruits',
          description:
            'Tree-ripened Kinnow Mandarin Oranges (250g), fragrant Robusta Bananas (250g), naturally waxed Shimla Royal Apples (250g).',
          tag: 'Swappable for Red Amaranth',
          isSwappable: true
        },
        {
          title: 'Aromatics & Herbs',
          weight: '500 g',
          icon: 'herbs',
          description:
            'Country Coriander & Pudina mint (2 bunches), freshly plucked curry leaves, plus 3 juicy seedless Kagzi limes.',
          tag: 'Fresh Root Clump',
          isAlwaysIncluded: true
        },
        {
          title: 'Piquant Accent Boosters',
          weight: '100 g',
          icon: 'spices',
          description:
            'Fibrous Mountain Ginger Root & pungent Single-clove Garlic bulbs with bird’s eye green chillies.',
          tag: 'Alternating Fortnight Booster',
          isAlwaysIncluded: true
        }
      ]
    },
    {
      variant_id: 15368,
      uom_id: 49,
      unit: 'Family 3',
      weight: '6.2 kg',
      minimum_quantity: 1,
      maximum_quantity: 10,
      stepper_quantity: 1,
      is_visible: true,
      is_available: true,
      is_default: false,
      single_price: 1350,
      price: 5400,
      original_price: 6200,
      per_delivery: 1350,
      formatted_price: '₹5,400',
      cart_quantity: 0,
      conversion_text: null,
      ripeness_types: null,
      cart_ripeness: [],
      market_price: 6200,
      harvest_items: [
        {
          title: 'Kitchen Staples',
          weight: '1.6 kg',
          icon: 'staples',
          description:
            'Sun-cured Nashik Red Onions (650g), unpolished Himalayan Pahadi Potatoes (650g), Vine-ripened Roma Tomatoes (300g).',
          tag: 'Always Included',
          isAlwaysIncluded: true
        },
        {
          title: 'Leafy Garden Greens',
          weight: '650 g',
          icon: 'greens',
          description:
            'Dew-picked baby Palak Spinach (350g) and tender aromatic Methi fenugreek bunches (300g). Washed with ozone mist.',
          tag: 'Swappable for Red Amaranth',
          isSwappable: true
        },
        {
          title: 'Seasonal Field Veggies',
          weight: '1.75 kg',
          icon: 'veggies',
          description:
            'Crunchy Orange Carrots (350g), crisp Bell Peppers (350g), tender Italian Green Zucchini (350g), baby Okra (350g), Cauliflower (350g).',
          tag: '5 Distinct Micro-crops',
          isAlwaysIncluded: true
        },
        {
          title: 'Orchard Sweet Fruits',
          weight: '950 g',
          icon: 'fruits',
          description:
            'Tree-ripened Kinnow Mandarin Oranges (350g), fragrant Robusta Bananas (300g), naturally waxed Shimla Royal Apples (300g).',
          tag: 'Swappable for Red Amaranth',
          isSwappable: true
        },
        {
          title: 'Aromatics & Herbs',
          weight: '650 g',
          icon: 'herbs',
          description:
            'Country Coriander & Pudina mint (3 bunches), freshly plucked curry leaves, plus 4 juicy seedless Kagzi limes.',
          tag: 'Fresh Root Clump',
          isAlwaysIncluded: true
        },
        {
          title: 'Piquant Accent Boosters',
          weight: '150 g',
          icon: 'spices',
          description:
            'Fibrous Mountain Ginger Root & pungent Single-clove Garlic bulbs with bird’s eye green chillies.',
          tag: 'Alternating Fortnight Booster',
          isAlwaysIncluded: true
        }
      ]
    },
    {
      variant_id: 15367,
      uom_id: 48,
      unit: 'Family 4',
      weight: '7.5 kg',
      minimum_quantity: 1,
      maximum_quantity: 10,
      stepper_quantity: 1,
      is_visible: true,
      is_available: true,
      is_default: false,
      single_price: 1550,
      price: 6200,
      original_price: 7200,
      per_delivery: 1550,
      formatted_price: '₹6,200',
      cart_quantity: 0,
      conversion_text: null,
      ripeness_types: null,
      cart_ripeness: [],
      market_price: 7200,
      harvest_items: [
        {
          title: 'Kitchen Staples',
          weight: '2.0 kg',
          icon: 'staples',
          description:
            'Sun-cured Nashik Red Onions (800g), unpolished Himalayan Pahadi Potatoes (800g), Vine-ripened Roma Tomatoes (400g).',
          tag: 'Always Included',
          isAlwaysIncluded: true
        },
        {
          title: 'Leafy Garden Greens',
          weight: '800 g',
          icon: 'greens',
          description:
            '2x Dew-picked baby Palak Spinach and tender aromatic Methi fenugreek bunches. Washed with ozone mist.',
          tag: 'Swappable for Red Amaranth',
          isSwappable: true
        },
        {
          title: 'Seasonal Field Veggies',
          weight: '2.2 kg',
          icon: 'veggies',
          description:
            'Crunchy Orange Carrots (500g), crisp Bell Peppers (500g), tender Italian Green Zucchini (400g), baby Okra (400g), Cauliflower (400g).',
          tag: '5 Distinct Micro-crops',
          isAlwaysIncluded: true
        },
        {
          title: 'Orchard Sweet Fruits',
          weight: '1.2 kg',
          icon: 'fruits',
          description:
            'Tree-ripened Kinnow Mandarin Oranges (400g), fragrant Robusta Bananas (400g), naturally waxed Shimla Royal Apples (400g).',
          tag: 'Swappable for Red Amaranth',
          isSwappable: true
        },
        {
          title: 'Aromatics & Herbs',
          weight: '800 g',
          icon: 'herbs',
          description:
            'Country Coriander & Pudina mint (4 bunches), freshly plucked curry leaves, plus 6 juicy seedless Kagzi limes.',
          tag: 'Fresh Root Clump',
          isAlwaysIncluded: true
        },
        {
          title: 'Piquant Accent Boosters',
          weight: '200 g',
          icon: 'spices',
          description:
            'Fibrous Mountain Ginger Root & pungent Single-clove Garlic bulbs with bird’s eye green chillies.',
          tag: 'Alternating Fortnight Booster',
          isAlwaysIncluded: true
        }
      ]
    }
  ]
};

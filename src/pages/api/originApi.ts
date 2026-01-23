// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  FooterDataType,
  MainMenuType,
  HowItWorksData,
  ProductFilters,
  ProductStockStatus,
  ProductTypeNames,
  Products,
  Testimonial,
  UspCardsData,
  CareersData,
  Blog,
  Recipe,
  Categories
} from '@/utilities/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  uspCardsData: UspCardsData;
  categories: any;
  recipes: Recipe[];
  products: Products;
  productFilters: ProductFilters;
  productStockStatusTypes: ProductStockStatus[];
  productTypeNames: ProductTypeNames[];
  testimonials: Testimonial[];
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
  howItWorks: HowItWorksData;
  careers: CareersData;
  blogs: Blog[];
};

const data: Data = {
  mainMenuItems: [
    {
      label: 'Explore Origin',
      submenu: [
        { label: 'Essentials', link: '/shop-all/essentials' },
        { label: 'Fresh Fruits', link: '/shop-all/fresh-fruits' },
        { label: 'Cut/Grated', link: '/shop-all/cut-grated' },
        { label: 'Indian Shop', link: '/shop-all/indian-shop' },
        { label: 'Essentials', link: '/shop-all/essentials' },
        { label: 'Fresh Fruits', link: '/shop-all/fresh-fruits' },
        { label: 'Cut/Grated', link: '/shop-all/cut-grated' },
        { label: 'Indian Shop', link: '/shop-all/indian-shop' },
        { label: 'Essentials', link: '/shop-all/essentials' },
        { label: 'Fresh Fruits', link: '/shop-all/fresh-fruits' },
        { label: 'Cut/Grated', link: '/shop-all/cut-grated' },
        { label: 'Indian Shop', link: '/shop-all/indian-shop' }
      ],
      link: '/shop'
    },
    {
      label: 'About Us',
      link: '/about'
    }
    // {
    //   label: 'Stores',
    //   link: '/stores'
    // }
  ],
  footerData: {
    footerLinksPrimary: [
      { text: 'Home', href: 'shop' },
      // { text: 'About Us', href: 'about' },
      { text: 'Explore Origin', href: 'shop' },
      // { text: 'Contact', href: 'contact' }
    ],
    footerLinksSecondary: [
      { text: 'Terms and Conditions', href: 'terms-and-conditions' },
      { text: 'Privacy policy', href: 'privacy-policy' }
      //   { text: 'Shipping Details', href: '#' },
      //   { text: 'Refund Policy', href: '#' }
    ],
    contactDetails: {
      address: '2nd floor, 838, 7th main road, 2nd stage, Indiranagar, Bengaluru, Bengaluru Urban, Karnataka, 560038',
      phone: '+91 9900508216',
      email: 'support@originfresh.in',
      whatsapp: '+91 8344621039'
    }
  },
  uspCardsData: [
    {
      icon: '/assets/icons/origin-icons/fresh.svg',
      title: 'Delivered within 48 hours of harvest '
    },
    {
      icon: '/assets/icons/origin-icons/recycle.svg',
      title: 'Less than 5% wastage'
    },
    {
      icon: '/assets/icons/origin-icons/truck.svg',
      title: 'Transparent Supply Chain'
    },
    {
      icon: '/assets/icons/origin-icons/earth.svg',
      title: 'Sourced Globally'
    }
  ],
  categories: [
    {
      actionLabel: 'Shop all',
      url: '/shop',
      title: 'Explore Origin',
      image: '/assets/images/categories/1.png'
    },
    {
      actionLabel: 'Shop all',
      url: '/shop',
      title: 'Fruits',
      image: '/assets/images/categories/2.png'
    },
    {
      actionLabel: 'Shop all',
      url: '/shop',
      title: 'Exotics',
      image: '/assets/images/categories/2.png'
    },
    {
      actionLabel: 'Shop all',
      url: '/shop',
      title: 'Veggies',
      image: '/assets/images/categories/3.png'
    },
    {
      actionLabel: 'Shop all',
      url: '/shop',
      title: 'Exclusive',
      image: '/assets/images/categories/4.png'
    }
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Leafy Vegetables",
    //   image: "/assets/images/categories/5.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Indian Greens",
    //   image: "/assets/images/categories/1.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Staples",
    //   image: "/assets/images/categories/2.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Essentials",
    //   image: "/assets/images/categories/2.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Fresh Fruits",
    //   image: "/assets/images/categories/3.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Cut/Grated",
    //   image: "/assets/images/categories/4.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Leafy Vegetables",
    //   image: "/assets/images/categories/5.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Indian Greens",
    //   image: "/assets/images/categories/1.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Staples",
    //   image: "/assets/images/categories/2.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Essentials",
    //   image: "/assets/images/categories/2.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Fresh Fruits",
    //   image: "/assets/images/categories/3.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Cut/Grated",
    //   image: "/assets/images/categories/4.png",
    // },
    // {
    //   actionLabel: "Shop all",
    //   url: "/shop",
    //   title: "Leafy Vegetables",
    //   image: "/assets/images/categories/5.png",
    // },
  ],
  products: [
    {
      popular: true,
      sku: 'origin0001',
      image: '/assets/images/products/product-2.png',
      name: 'Arugula (Rocket) Lettuce',
      shortDescription:
        'Lettuce, a symbol of freshness, is low in calories, hydrating, and packed with nutrients and antioxidants.',
      description:
        'Lettuce, a symbol of freshness, is low in calories, hydrating, and packed with nutrients and antioxidants.<br/> <b>Best for salads</b>, sandwiches, and wraps adds a crisp, healthy touch to your meals',
      weight: { value: 500.0, units: 'g' },
      price: { mrp: '', amount: 'Rs.250', currency: '₹' },
      stockStatus: 'IN_STOCK',
      configurableOptions: [
        {
          offer: 'Save 20%',
          weight: { value: 250.0, units: 'g' },
          price: { mrp: 'Rs.125', amount: 'Rs.105', currency: '₹' },
          quantity: 12,
          stockStatus: 'OUT_OF_STOCK',
          ripeStatus: 'ripe'
        },
        {
          offer: null,
          weight: { value: 1.0, units: 'kg' },
          price: { mrp: 'Rs.320', amount: 'Rs.500', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK',
          ripeStatus: 'semi-ripe'
        },
        {
          offer: 'Save 50%',
          weight: { value: 500.0, units: 'g' },
          price: { mrp: 'Rs.430', amount: 'Rs.200', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK',
          ripeStatus: 'semi-ripe'
        }
      ],
      productType: 'CONFIGURABLE_PRODUCT',
      quantity: 12,
      filters: ['get-sameday', 'recommended', 'combos']
    },
    {
      sku: 'origin0001',
      image: '/assets/images/products/product-1.png',
      name: 'Green Peas (Peeled)',
      description: '',
      shortDescription: 'A nutrient-rich produce, providing fiber, protein, vitamins, and essential minerals',
      weight: { value: 500.0, units: 'g' },
      price: { mrp: 'Rs.32', amount: 'Rs.25', currency: '₹' },
      stockStatus: 'OUT_OF_STOCK',
      configurableOptions: [
        {
          offer: 'Save 20%',
          weight: { value: 250.0, units: 'g' },
          price: { mrp: 'Rs.32', amount: 'Rs.25', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        },
        {
          offer: null,
          weight: { value: 1.0, units: 'kg' },
          price: { mrp: 'Rs.32', amount: 'Rs.50', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        },
        {
          offer: 'Save 50%',
          weight: { value: 500.0, units: 'g' },
          price: { mrp: 'Rs.43', amount: 'Rs.20', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        }
      ],
      productType: 'CONFIGURABLE_PRODUCT',
      quantity: 12,
      filters: ['get-sameday', 'recommended', 'combos']
    },
    {
      sku: 'origin0002',
      image: '/assets/images/products/product-1.png',
      name: 'Another Product Name',
      description: '',
      shortDescription: 'A nutrient-rich produce, providing fiber, protein, vitamins, and essential minerals',
      weight: { value: 250.0, units: 'g' },
      price: { mrp: 'Rs.20', amount: 'Rs.15', currency: '₹' },
      stockStatus: 'IN_STOCK',
      configurableOptions: [
        {
          offer: null,
          weight: { value: 1.0, units: 'kg' },
          price: { mrp: 'Rs.20', amount: 'Rs.30', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        },
        {
          offer: 'Save 40%',
          weight: { value: 500.0, units: 'kg' },
          price: { mrp: 'Rs.25', amount: 'Rs.12', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        }
      ],
      productType: 'CONFIGURABLE_PRODUCT',
      quantity: 12,
      filters: ['get-tomorrow', 'recommended', 'buyagain']
    },
    {
      sku: 'origin0003',
      image: '/assets/images/products/product-1.png',
      name: 'Yet Another Product',
      description: '',
      shortDescription: 'A nutrient-rich produce, providing fiber, protein, vitamins, and essential minerals',
      weight: { value: 750.0, units: 'g' },
      price: { mrp: 'Rs.45', amount: 'Rs.35', currency: '₹' },
      stockStatus: 'IN_STOCK',
      configurableOptions: [
        {
          offer: 'Save 15%',
          weight: { value: 750.0, units: 'g' },
          price: { mrp: 'Rs.45', amount: 'Rs.35', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        },
        {
          offer: null,
          weight: { value: 250.0, units: 'g' },
          price: { mrp: 'Rs.45', amount: 'Rs.50', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        },
        {
          offer: 'Save 30%',
          weight: { value: 1.0, units: 'kg' },
          price: { mrp: 'Rs.50', amount: 'Rs.30', currency: '₹' },
          quantity: 12,
          stockStatus: 'IN_STOCK'
        }
      ],
      productType: 'CONFIGURABLE_PRODUCT',
      quantity: 12,
      filters: ['get-sameday', 'recommended', 'buyagain', 'combos']
    },
    {
      sku: 'origin0003',
      image: '/assets/images/products/product-1.png',
      name: 'Yet Another Product',
      description: '',
      shortDescription: 'A nutrient-rich produce, providing fiber, protein, vitamins, and essential minerals',
      weight: { value: 750.0, units: 'g' },
      price: { mrp: 'Rs.45', amount: 'Rs.35', currency: '₹' },
      stockStatus: 'IN_STOCK',
      configurableOptions: null,
      productType: 'SIMPLE_PRODUCT',
      quantity: 12,
      filters: ['get-sameday', 'recommended']
    },
    {
      sku: 'origin0003',
      image: '/assets/images/products/product-1.png',
      name: 'Yet Another Product',
      description: '',
      shortDescription: 'A nutrient-rich produce, providing fiber, protein, vitamins, and essential minerals',
      weight: { value: 750.0, units: 'g' },
      price: { mrp: 'Rs.45', amount: 'Rs.35', currency: '₹' },
      stockStatus: 'OUT_OF_STOCK',
      configurableOptions: null,
      productType: 'SIMPLE_PRODUCT',
      quantity: 12,
      filters: ['get-tomorrow', 'recommended', 'combos']
    }
  ],
  productFilters: ['get-sameday', 'get-tomorrow', 'recommended', 'buyagain', 'combos'],
  productStockStatusTypes: ['IN_STOCK', 'OUT_OF_STOCK'],
  productTypeNames: ['SIMPLE_PRODUCT', 'CONFIGURABLE_PRODUCT'],
  blogs: [
    {
      tag: 'Healthy Diet',
      title: 'Balancing Act: The Key to a Healthy Diet',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      link: '/blogs/balancing-act-the-key-to-a-healthy-diet',
      imgSrc: '/assets/images/blogs/blog-6.png',
      date: '4th Nov 23',
      slug: 'balancing-act-the-key-to-a-healthy-diet',
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you."
    },
    {
      tag: 'Healthy Diet',
      title: 'Superfoods: Separating Fact from Fiction',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      link: '/blogs/superfoods-separating-fact-from-fiction',
      imgSrc: '/assets/images/blogs/blog-2.png',
      date: '4th Nov 23',
      slug: 'superfoods-separating-fact-from-fiction',
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you."
    },
    {
      tag: 'Recipe',
      title: 'Zesty Quinoa and Black Bean Salad',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      link: '/blogs/zesty-quinoa-and-black-bean-salad',
      imgSrc: '/assets/images/blogs/blog-3.png',
      date: '4th Nov 23',
      slug: 'zesty-quinoa-and-black-bean-salad',
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you."
    },
    {
      tag: 'Healthy Diet',
      title: 'Eating for Energy: Foods That Boost Your Vitality',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      link: '/blogs/eating-for-energy-foods-that-boost-your-vitality',
      imgSrc: '/assets/images/blogs/blog-4.png',
      date: '4th Nov 23',
      slug: 'eating-for-energy-foods-that-boost-your-vitality',
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you."
    },
    {
      tag: 'Nutrition',
      title: 'Food for Thought: How Nutrition Impacts Mental Health',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      link: '/blogs/food-for-thought-how-nutrition-impacts-mental-health',
      imgSrc: '/assets/images/blogs/blog-5.png',
      date: '4th Nov 23',
      slug: 'food-for-thought-how-nutrition-impacts-mental-health',
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you."
    },
    {
      tag: 'Nutrition',
      title: 'Food for Thought: How Nutrition Impacts Mental Health',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/food-for-thought-how-nutrition-impacts-mental-health',
      imgSrc: '/assets/images/blogs/blog-1.png',
      date: '4th Nov 23',
      slug: 'food-for-thought-how-nutrition-impacts-mental-health'
    },
    {
      tag: 'Healthy Diet',
      title: 'Balancing Act: The Key to a Healthy Diet',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/balancing-act-the-key-to-a-healthy-diet',
      imgSrc: '/assets/images/blogs/blog-6.png',
      date: '4th Nov 23',
      popular: true,
      slug: 'balancing-act-the-key-to-a-healthy-diet'
    },
    {
      tag: 'Healthy Diet',
      title: 'Superfoods: Separating Fact from Fiction',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/superfoods-separating-fact-from-fiction',
      imgSrc: '/assets/images/blogs/blog-2.png',
      date: '4th Nov 23',
      popular: true,
      slug: 'superfoods-separating-fact-from-fiction'
    },
    {
      tag: 'Recipe',
      title: 'Zesty Quinoa and Black Bean Salad',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/zesty-quinoa-and-black-bean-salad',
      imgSrc: '/assets/images/blogs/blog-3.png',
      date: '4th Nov 23',
      popular: true,
      slug: 'zesty-quinoa-and-black-bean-salad'
    },
    {
      tag: 'Healthy Diet',
      title: 'Eating for Energy: Foods That Boost Your Vitality',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/eating-for-energy-foods-that-boost-your-vitality',
      imgSrc: '/assets/images/blogs/blog-4.png',
      date: '4th Nov 23',
      popular: true,
      slug: 'eating-for-energy-foods-that-boost-your-vitality'
    },
    {
      tag: 'Nutrition',
      title: 'Food for Thought: How Nutrition Impacts Mental Health',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/food-for-thought-how-nutrition-impacts-mental-health',
      imgSrc: '/assets/images/blogs/blog-5.png',
      date: '4th Nov 23',
      popular: true,
      slug: 'food-for-thought-how-nutrition-impacts-mental-health'
    },
    {
      tag: 'Nutrition',
      title: 'Food for Thought: How Nutrition Impacts Mental Health',
      shortDescription:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task.",
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      description:
        "In the hustle and bustle of modern life, maintaining a balanced and healthy diet can often seem like a challenging tightrope walk. But here's the good news: it doesn't have to be a daunting task. Achieving a balanced diet is all about making mindful choices that nourish both your body and your taste buds.<br><br><p style='font-size:18px;font-weight:700'>Understanding the Basics</p><br>The foundation of a balanced diet lies in incorporating a variety of foods from different food groups. Think of it as assembling a vibrant palette of colors and flavors on your plate. Start with a healthy mix of fruits and vegetables, which provide essential vitamins and minerals. Add lean proteins like poultry, fish, or plant-based alternatives for sustained energy. Don't forget whole grains, which offer fiber and complex carbohydrates to keep you feeling full and satisfied.<br><br><p style='font-size:18px;font-weight:700'>Portion Control</p><br>Balancing your diet is not just about what you eat but also how much you eat. Portion control is a critical component. Be mindful of serving sizes to prevent overindulgence, and listen to your body's hunger cues. Eating slowly and savoring each bite can help you recognize when you're satisfied, reducing the temptation to overeat.<br><br><p style='font-size:18px;font-weight:700'>The Sweet Spot</p><br>While it's important to limit added sugars, a balanced diet also allows room for enjoyment. Treat yourself occasionally to foods you love, but do so in moderation. This way, you can savor your favorite indulgences without derailing your overall dietary goals.<br><br><p style='font-size:18px;font-weight:700'>Hydration Matters</p><br>Don't forget about the importance of hydration. Water is an integral part of a balanced diet. Staying properly hydrated helps regulate your body's functions and can even help control appetite. Try to drink water throughout the day and consider herbal teas or infusions for added variety.<br><br><p style='font-size:18px;font-weight:700'>Flexibility and Consistency</p><br>Maintaining a balanced diet is not about perfection; it's about consistency. Flexibility is key, allowing you to adapt to your lifestyle and preferences. It's perfectly normal to occasionally veer from your dietary routine. The important thing is to return to your balanced habits without guilt.<br><br>Remember, the key to a healthy diet is not a rigid formula but a dynamic equilibrium. It's about nourishing your body, embracing variety, and enjoying your meals. By making mindful choices and striving for balance, you can savor the journey toward a healthier you.",
      link: '/blogs/food-for-thought-how-nutrition-impacts-mental-health',
      imgSrc: '/assets/images/blogs/blog-1.png',
      date: '4th Nov 23',
      popular: true,
      slug: 'food-for-thought-how-nutrition-impacts-mental-health'
    }
  ],
  recipes: [
    {
      id: 1,
      slug: 'baked-salmon-with-lemon-dill-sauce',
      popular: true,
      imgSrc: '/assets/images/blogs/blog-1.png',
      link: '/recipes/baked-salmon-with-lemon-dill-sauce',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ipsa deserunt consectetur mollitia laboriosam dolorem architecto saepe ut at tenetur!',
      tag: 'Salad',
      title: 'Baked Salmon with Lemon-Dill Sauce',
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      date: 'Nov 23, 2023',
      ingredients: ['1 lb salmon fillet', '1 lemon, juiced', '1 tbsp fresh dill, chopped', 'Salt and pepper to taste'],
      instructions: [
        {
          id: 1,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 1',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 1',
          description: 'Preheat oven to 425 degrees F (220 degrees C).'
        },
        {
          id: 2,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 2',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 2',
          description:
            'In a large bowl, combine flour and salt. Cut in butter until mixture resembles coarse crumbs. Stir in water, a tablespoon at a time, until mixture forms a ball. Wrap in plastic and refrigerate for 4 hours or overnight.'
        },
        {
          id: 3,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 3',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 3',
          description:
            'Roll dough out to fit a 9 inch pie plate. Place crust in pie plate. Press the dough evenly into the bottom and sides of the pie plate.'
        }
      ]
    },
    {
      id: 2,
      popular: true,
      slug: 'shoofly-pie-recipe',
      imgSrc: '/assets/images/blogs/blog-7.png',
      link: '/recipes/shoofly-pie-recipe',
      description:
        "Shoofly pie is often thought of as the cake baked in a pie shell, or so wrote Jean Hewitt, The New York Times food writer who offered this recipe in the paper in 1965. This pie was served at a Pennsylvania Dutch luncheon hosted by the International Cuisine Group of the College Woman’s Club of Westfield, N.J., in the spring of that year. One of the organizers dug up the recipe from her mother’s “Housekeeper’s Scrap Book, 1896.” There were four versions of the pie in the book; this was the one marked: 'We like this one better.'",
      tag: 'Healthy Diet',
      title: 'Shoofly Pie Recipe',
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      date: '15th Feb 23',
      ingredients: [
        '1½cups flour',
        '½cup dark brown sugar',
        '1teaspoon cinnamon',
        '½teaspoon nutmeg',
        '⅛teaspoon salt',
        '¼pound (1 stick) cold unsalted butter',
        '¾cup molasses'
      ],
      instructions: [
        {
          id: 1,
          media: {
            videoSrc: '/assets/videos.mp4',
            alt: 'Video Thumbnail 1',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 1',
          description: 'Heat oven to 450 degrees.'
        },
        {
          id: 2,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 2',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 2',
          description:
            'Make the crumb topping: Mix flour, sugar, cinnamon, nutmeg and salt together in a bowl. Cut in the butter with a pastry cutter until the consistency resembles cornmeal.'
        },
        {
          id: 3,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 3',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 3',
          description:
            'Combine molasses, water and baking soda and pour into pastry shell. Spoon the crumb mixture evenly over the top. Bake 15 minutes, lower the heat to 350 degrees and bake 20 minutes longer, or until set and firm.ward a healthier you.'
        }
      ]
    },
    {
      id: 3,
      popular: true,
      slug: 'baked-salmon-with-lemon-dill-sauce',
      imgSrc: '/assets/images/blogs/blog-1.png',
      link: '/recipes/baked-salmon-with-lemon-dill-sauce',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ipsa deserunt consectetur mollitia laboriosam dolorem architecto saepe ut at tenetur!',
      tag: 'Salad',
      title: 'Baked Salmon with Lemon-Dill Sauce',
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      date: 'Nov 23, 2023',
      ingredients: ['1 lb salmon fillet', '1 lemon, juiced', '1 tbsp fresh dill, chopped', 'Salt and pepper to taste'],
      instructions: [
        {
          id: 1,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 1',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 1',
          description: 'Preheat oven to 425 degrees F (220 degrees C).'
        },
        {
          id: 2,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 2',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 2',
          description:
            'In a large bowl, combine flour and salt. Cut in butter until mixture resembles coarse crumbs. Stir in water, a tablespoon at a time, until mixture forms a ball. Wrap in plastic and refrigerate for 4 hours or overnight.'
        },
        {
          id: 3,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 3',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 3',
          description:
            'Roll dough out to fit a 9 inch pie plate. Place crust in pie plate. Press the dough evenly into the bottom and sides of the pie plate.'
        }
      ]
    },
    {
      id: 4,
      slug: 'shoofly-pie-recipe',
      imgSrc: '/assets/images/blogs/blog-7.png',
      link: '/recipes/shoofly-pie-recipe',
      description:
        "Shoofly pie is often thought of as the cake baked in a pie shell, or so wrote Jean Hewitt, The New York Times food writer who offered this recipe in the paper in 1965. This pie was served at a Pennsylvania Dutch luncheon hosted by the International Cuisine Group of the College Woman’s Club of Westfield, N.J., in the spring of that year. One of the organizers dug up the recipe from her mother’s “Housekeeper’s Scrap Book, 1896.” There were four versions of the pie in the book; this was the one marked: 'We like this one better.'",
      tag: 'Healthy Diet',
      title: 'Shoofly Pie Recipe',
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      date: '15th Feb 23',
      ingredients: [
        '1½cups flour',
        '½cup dark brown sugar',
        '1teaspoon cinnamon',
        '½teaspoon nutmeg',
        '⅛teaspoon salt',
        '¼pound (1 stick) cold unsalted butter',
        '¾cup molasses'
      ],
      instructions: [
        {
          id: 1,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 1',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 1',
          description: 'Heat oven to 450 degrees.'
        },
        {
          id: 2,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 2',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 2',
          description:
            'Make the crumb topping: Mix flour, sugar, cinnamon, nutmeg and salt together in a bowl. Cut in the butter with a pastry cutter until the consistency resembles cornmeal.'
        },
        {
          id: 3,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 3',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 3',
          description:
            'Combine molasses, water and baking soda and pour into pastry shell. Spoon the crumb mixture evenly over the top. Bake 15 minutes, lower the heat to 350 degrees and bake 20 minutes longer, or until set and firm.ward a healthier you.'
        }
      ]
    },
    {
      id: 5,
      popular: true,
      slug: 'baked-salmon-with-lemon-dill-sauce',
      imgSrc: '/assets/images/blogs/blog-1.png',
      link: '/recipes/baked-salmon-with-lemon-dill-sauce',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ipsa deserunt consectetur mollitia laboriosam dolorem architecto saepe ut at tenetur!',
      tag: 'Salad',
      title: 'Baked Salmon with Lemon-Dill Sauce',
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      date: 'Nov 23, 2023',
      ingredients: ['1 lb salmon fillet', '1 lemon, juiced', '1 tbsp fresh dill, chopped', 'Salt and pepper to taste'],
      instructions: [
        {
          id: 1,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 1',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 1',
          description: 'Preheat oven to 425 degrees F (220 degrees C).'
        },
        {
          id: 2,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 2',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 2',
          description:
            'In a large bowl, combine flour and salt. Cut in butter until mixture resembles coarse crumbs. Stir in water, a tablespoon at a time, until mixture forms a ball. Wrap in plastic and refrigerate for 4 hours or overnight.'
        },
        {
          id: 3,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 3',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 3',
          description:
            'Roll dough out to fit a 9 inch pie plate. Place crust in pie plate. Press the dough evenly into the bottom and sides of the pie plate.'
        }
      ]
    },
    {
      id: 6,
      slug: 'baked-salmon-with-lemon-dill-sauce',
      popular: true,
      imgSrc: '/assets/images/blogs/blog-1.png',
      link: '/recipes/baked-salmon-with-lemon-dill-sauce',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ipsa deserunt consectetur mollitia laboriosam dolorem architecto saepe ut at tenetur!',
      tag: 'Salad',
      title: 'Baked Salmon with Lemon-Dill Sauce',
      author: {
        name: 'Influencer Name',
        image: '/assets/images/author.png'
      },
      date: 'Nov 23, 2023',
      ingredients: ['1 lb salmon fillet', '1 lemon, juiced', '1 tbsp fresh dill, chopped', 'Salt and pepper to taste'],
      instructions: [
        {
          id: 1,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 1',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 1',
          description: 'Preheat oven to 425 degrees F (220 degrees C).'
        },
        {
          id: 2,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 2',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 2',
          description:
            'In a large bowl, combine flour and salt. Cut in butter until mixture resembles coarse crumbs. Stir in water, a tablespoon at a time, until mixture forms a ball. Wrap in plastic and refrigerate for 4 hours or overnight.'
        },
        {
          id: 3,
          media: {
            videoSrc: '/assets/videos/video.mp4',
            alt: 'Video Thumbnail 3',
            thumb: '/assets/videos/video-thumb.png'
          },
          title: 'Step 3',
          description:
            'Roll dough out to fit a 9 inch pie plate. Place crust in pie plate. Press the dough evenly into the bottom and sides of the pie plate.'
        }
      ]
    }
    // Add more recipes following the same structure
  ],
  testimonials: [
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Turpis sapien sed vestibulum nisi diam. Dictum quam urna risus feugiat feugiat. Dui lectus magnis arcu massa egestas. A interdum maecenas odio habitasse quis in varius quam. Eget amet massa netus ut adipiscing vel eget non. Volutpat id facilisi malesuada nisl vivamus aliquam mauris. Non egestas mi eget consectetur faucibus.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Turpis sapien sed vestibulum nisi diam. Dictum quam urna risus feugiat feugiat. Dui lectus magnis arcu massa egestas. A interdum maecenas odio habitasse quis in varius quam. Eget amet massa netus ut adipiscing vel eget non. Volutpat id facilisi malesuada nisl vivamus aliquam mauris. Non egestas mi eget consectetur faucibus.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor.Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis. Tempor pellentesque at nulla sem,tortor leo nisi nisl. Tempor pellentesque at nulla sem, Arcu vitae felis tortor leo nisi nisl. Tempor tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor.Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis. Tempor pellentesque at nulla sem,tortor leo nisi nisl. Tempor pellentesque at nulla sem, Arcu vitae felis tortor leo nisi nisl. Tempor tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisLorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisLorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis tortor leo nisi nisl. Tempor.Arcu vitae felis tortor leo nisi nisl. Tempor pellentesque at nulla sem tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    },
    {
      user: {
        image: '/assets/images/avatars/avatar.png',
        title: 'Ram jayan',
        subtitle: 'Koramangala'
      },
      content:
        'Lorem ipsum dolor sit amet consectetur. Arcu vitae felis. Tempor pellentesque at nulla sem,tortor leo nisi nisl. Tempor pellentesque at nulla sem, Arcu vitae felis tortor leo nisi nisl. Tempor tristique. Mi interdum scelerisque turpis quisque venenatis pellentesque. Ut nibh in eu ornare.'
    }
  ],
  howItWorks: {
    banner: {
      title: 'How it works',
      desc: "Let's go to the Origin of fresh!",
      bannerImage: {
        url: '/assets/images/commitment.png',
        alt: 'How it works',
        title: 'How it works'
      }
    },
    list: [
      {
        image: {
          url: '/assets/images/howitworks/how-1.png',
          alt: 'Harvest',
          title: 'Harvest'
        },
        title: 'Seamless harvest of fresh produce',
        desc: 'Handpicked fresh and sent to the collection centre every morning'
      },
      {
        image: {
          url: '/assets/images/howitworks/how-2.png',
          alt: 'Sifting, cleaning, sorting',
          title: 'Sifting, cleaning, sorting'
        },
        title: 'Sifting, cleaning, sorting',
        desc: 'Stringent quality checks for each and every piece so that all you get is fresh!'
      },
      {
        image: {
          url: '/assets/images/howitworks/how-3.png',
          alt: 'Placing order',
          title: 'Placing order'
        },
        title: 'Placing an order',
        desc: 'Navigating through the app, customers place an order'
      },
      {
        image: {
          url: '/assets/images/howitworks/how-4.png',
          alt: 'Packing',
          title: 'Packing'
        },
        title: 'Packing',
        desc: 'The order is identified, packed and assigned to a delivery partner'
      },
      {
        image: {
          url: '/assets/images/howitworks/how-5.png',
          alt: 'Enjoy',
          title: 'Enjoy'
        },
        title: 'Enjoy!',
        desc: 'Top notch quality fresh produce is delivered to your doorstep within mins of placing an order'
      }
    ]
  },
  careers: {
    banner: {
      title: 'Careers',
      desc: "Let's <br /> grow together.",
      bannerImage: {
        url: '/assets/images/careers/lets-grow.png',
        alt: 'Careers banner',
        title: 'Careers banner'
      },
      button: {
        label: 'See open roles',
        data: '7'
      }
    },
    banner2: {
      title: 'Our <br/> Foundations',
      desc: 'At Origin, we believe in creating an inclusive environment that nurtures the seeds of innovation & collaboration. A place where every voice is heard & every achievement celebrated!',
      bannerImage: {
        url: '/assets/images/careers/our-foundation.png',
        alt: 'Careers banner 2',
        title: 'Careers banner 2'
      }
    },
    overlapCards: [
      {
        title: 'Growth mindset',
        desc: 'At Origin, we want you to celebrate your failures, embrace challenges and emphasise on the importance of collaboration and feedback. Through this we foster a culture full of learning, innovation and creativity.',
        bannerImage: {
          url: '/assets/images/careers/overlap/1.png',
          alt: 'Growth mindset',
          title: 'Growth mindset'
        }
      },
      {
        title: 'Full ownership',
        desc: 'Enabling a better future for the next generation is a huge responsibility. Hence each one of us believes in taking ownership and responsibility in making sure that we deliver on our commitment.',
        bannerImage: {
          url: '/assets/images/careers/overlap/2.png',
          alt: 'Full ownership',
          title: 'Full ownership'
        }
      },
      {
        title: 'Boundless Creativity',
        desc: 'We see ourselves as an edutainment company, so coming up with out-of-the box ideas for every problem has become almost a second nature for each one of us.',
        bannerImage: {
          url: '/assets/images/careers/overlap/3.png',
          alt: 'Boundless Creativity',
          title: 'Boundless Creativity'
        }
      },
      {
        title: '?  -------',
        desc: 'These principles reflect how we worked untill now, we are enroute to build a robust culture, where you can be part of in setting the principles.',
        bannerImage: {
          url: '/assets/images/careers/overlap/4.png',
          alt: 'Overlap card 4',
          title: 'Overlap card 4'
        }
      }
    ],
    infoCards: {
      title: 'We will go the extra mile for you',
      desc: "Do you get upset when the Pani Puri guy doesn't give you a free 'sookha puri'? Then read the below...",
      cardLists: [
        {
          title: 'Competitive Compensation',
          desc: 'Biannual, Unbiased Reviews',
          bannerImage: {
            url: '/assets/images/careers/stickers/1.svg',
            alt: 'Competitive Compensation',
            title: 'Competitive Compensation'
          }
        },
        {
          title: 'Comprehensive Benefits',
          desc: 'Easy health insurance, free annual dental & eye check ups',
          bannerImage: {
            url: '/assets/images/careers/stickers/2.svg',
            alt: 'Comprehensive Benefits',
            title: 'Comprehensive Benefits'
          }
        },
        {
          title: 'Adaptable Work Setting',
          desc: 'Flexibility at its Core',
          bannerImage: {
            url: '/assets/images/careers/stickers/3.svg',
            alt: 'Adaptable Work Setting',
            title: 'Adaptable Work Setting'
          }
        },
        {
          title: 'Continuous Growth',
          desc: 'Employee Development Plans, opporutnities to work on exciting project',
          bannerImage: {
            url: '/assets/images/careers/stickers/4.svg',
            alt: 'Continuous Growth',
            title: 'Continuous Growth'
          }
        },
        {
          title: 'Family matters',
          desc: 'Unlimited leaves*, paid vacations*',
          bannerImage: {
            url: '/assets/images/careers/stickers/5.svg',
            alt: 'Family matters',
            title: 'Family matters'
          }
        },
        {
          title: 'Monthly Perks',
          desc: 'Product discounts, coupons',
          bannerImage: {
            url: '/assets/images/careers/stickers/6.svg',
            alt: 'Monthly Perks',
            title: 'Monthly Perks'
          }
        }
      ]
    },
    joinOurTeam: {
      title: 'Join our team',
      desc: 'Find the below open roles in our organisation',
      openRoles: [
        {
          role: 'Agricultural Science & Operations Talent Network',
          city: 'Bangalore',
          link: '#'
        },
        {
          role: 'Maintenance Technician',
          city: 'Bangalore',
          link: '#'
        },
        {
          role: 'Maintenance Technician',
          city: 'Bangalore',
          link: '#'
        },
        {
          role: 'Packhouse Production Assistant',
          city: 'Bangalore',
          link: '#'
        }
      ]
    }
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json(data);
}

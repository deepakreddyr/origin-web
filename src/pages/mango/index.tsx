import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import {
  Leaf,
  Hand,
  ShieldCheck,
  Award,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Check,
  Clock,
  Gift,
  Truck,
  Play,
  ExternalLink,
  LucideIcon
} from 'lucide-react';

// Assets
const ASSETS = {
  logo: 'https://customer-assets.emergentagent.com/job_3bfbe3b8-68bd-495b-950e-efb084189fea/artifacts/68005h9x_Origin%20fresh%20logo-02.png',
  productOpenBox:
    'https://customer-assets.emergentagent.com/job_3bfbe3b8-68bd-495b-950e-efb084189fea/artifacts/dblk3hvz_ChatGPT%20Image%20Mar%2018%2C%202026%2C%2012_38_53%20PM.png',
  productClosedBox:
    'https://customer-assets.emergentagent.com/job_3bfbe3b8-68bd-495b-950e-efb084189fea/artifacts/4cw0araj_ChatGPT%20Image%20Mar%2018%2C%202026%2C%2012_38_59%20PM.png',
  productPackaging:
    'https://customer-assets.emergentagent.com/job_3bfbe3b8-68bd-495b-950e-efb084189fea/artifacts/6o000rtc_PHOTO-2026-03-18-12-13-55.jpg',
  farmVideo:
    'https://customer-assets.emergentagent.com/job_origin-mango-vault/artifacts/pvi56ciu_ground-level-view-of-a-mango-farm-plantation-see-2025-12-17-09-31-11-utc.mov',
  mangoCutout:
    'https://customer-assets.emergentagent.com/job_origin-mango-vault/artifacts/r054eg3b_close-up-freshly-cut-mango-cubes.jpg'
};

interface Recipe {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  time: string;
  category: string;
}

// Recipe data for Pinterest-style grid - Mango specific dishes (7 recipes for even grid)
const recipeData: Recipe[] = [
  {
    id: 1,
    title: 'Aamras',
    subtitle: 'The Pure Essence',
    description:
      'Silky smooth Alphonso puree served chilled — the traditional Maharashtrian way to savor the king of fruits.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    time: '10 mins',
    category: 'Traditional'
  },
  {
    id: 2,
    title: 'Mango Shrikhand',
    subtitle: 'Amrakhand',
    description: 'Velvety hung curd infused with Alphonso, cardamom, and saffron — a festive indulgence.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    time: '20 mins',
    category: 'Dessert'
  },
  {
    id: 3,
    title: 'Mango Kulfi',
    subtitle: 'Frozen Gold',
    description: 'Dense, creamy Indian ice cream made with reduced milk and fresh Ratnagiri mango pulp.',
    image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=800&q=80',
    time: '4 hrs',
    category: 'Frozen'
  },
  {
    id: 4,
    title: 'Mango Sticky Rice',
    subtitle: 'Thai Meets India',
    description: 'Coconut-infused glutinous rice crowned with ripe Alphonso slices and toasted sesame.',
    image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=800&q=80',
    time: '30 mins',
    category: 'Fusion'
  },
  {
    id: 5,
    title: 'Mango Lassi',
    subtitle: 'Liquid Sunshine',
    description: 'Thick, creamy yogurt smoothie blended with ripe Alphonso — the perfect summer cooler.',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
    time: '5 mins',
    category: 'Beverage'
  },
  {
    id: 6,
    title: 'Mango Phirni',
    subtitle: 'Royal Indulgence',
    description: 'Creamy rice pudding infused with Alphonso, topped with pistachios and silver leaf.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    time: '35 mins',
    category: 'Dessert'
  },
  {
    id: 7,
    title: 'Mango Panna',
    subtitle: 'Summer Elixir',
    description: 'Tangy raw mango cooler spiced with cumin and mint — the ultimate heat beater.',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
    time: '15 mins',
    category: 'Beverage'
  }
];

const WHATSAPP_PHONE = '919900508216';
const getWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

const ORDER_LINK = getWhatsAppLink(
  "Hi Origin Fresh! I'd like to order a box of your premium Ratnagiri Alphonso Mangoes. Please let me know the process."
);
const CORPORATE_LINK = getWhatsAppLink(
  "Hi Origin Fresh! I'm interested in corporate gifting options for your Alphonso Mangoes. Can you share more details?"
);

// Animation variants
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const stagger: Variants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } }
};

interface USPItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

// USP Data
const uspData: USPItem[] = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'Grown without chemicals in the fertile soils of Ratnagiri. No pesticides, no shortcuts.'
  },
  {
    icon: ShieldCheck,
    title: 'Carbide Free',
    description: 'Naturally ripened under the warm coastal sun. Never artificially induced.'
  },
  {
    icon: Hand,
    title: 'Hand Picked',
    description: 'Each mango is carefully selected at peak ripeness by experienced farmers.'
  },
  {
    icon: Award,
    title: 'GI Tagged',
    description: 'Authentically certified Ratnagiri Alphonso. The genuine article, traceable to origin.'
  }
];

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// Testimonials Data
const testimonials: Testimonial[] = [
  {
    quote: "These aren't just mangoes. They're memories of summer afternoons, wrapped in the finest velvet skin.",
    author: 'Priya Sharma',
    role: 'Food Connoisseur, Mumbai'
  },
  {
    quote: "I've tasted Alphonsos from every corner of Maharashtra. Origin Fresh delivers the definitive experience.",
    author: 'Rahul Mehta',
    role: 'Chef & Restaurateur'
  },
  {
    quote: 'The perfect corporate gift. Our clients were absolutely delighted. Will order again.',
    author: 'Ananya Krishnan',
    role: 'Director, Premium Hospitality'
  }
];

// Navigation Component
const Navigation: React.FC = () => (
  <nav className="nav-header" data-testid="navigation">
    <Link href="/" data-testid="nav-logo-link">
      <Image src={ASSETS.logo} alt="Origin Fresh" className="nav-logo" width={180} height={60} priority />
    </Link>
    <div style={{ position: 'relative' }}>
      <div
        className="radial-glow"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150px',
          height: '150px',
          opacity: 0.6
        }}
      />
      <a
        href={ORDER_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary nav-cta"
        data-testid="nav-buy-button"
        style={{ position: 'relative', zIndex: 2 }}
      >
        ORDER NOW
      </a>
    </div>
  </nav>
);

// 3D Rotating Mango Component - Using actual mango image cutout
const RotatingMango3D: React.FC = () => (
  <div className="mango-3d-container">
    <div className="mango-3d-wrapper">
      <div className="mango-glow-3d"></div>
      <div className="mango-3d">
        <Image
          src={ASSETS.mangoCutout}
          alt="Premium Alphonso Mango"
          className="mango-cutout-image"
          width={400}
          height={400}
        />
      </div>
      {/* Glitter particles */}
      <div className="glitter-particles-3d">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="glitter-3d"
            style={
              {
                '--delay': `${Math.random() * 4}s`,
                '--x': `${15 + Math.random() * 70}%`,
                '--y': `${10 + Math.random() * 80}%`,
                '--duration': `${2 + Math.random() * 3}s`,
                '--size': `${3 + Math.random() * 4}px`
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  </div>
);

// Hero Section with Parallax
const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  return (
    <section className="hero-section" data-testid="hero-section">
      <div className="radial-glow" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }} />

      <motion.div
        className="hero-content"
        initial="initial"
        whileInView="whileInView"
        variants={stagger}
        viewport={{ once: true }}
      >
        <motion.p className="caption" variants={fadeInUp} style={{ y }}>
          Ratnagiri Alphonso · GI Tagged · Small Batch
        </motion.p>

        <motion.h1 className="hero-tagline" variants={fadeInUp} style={{ y, opacity }}>
          The{' '}
          <span className="gold-text" style={{ fontWeight: 300 }}>
            Crown Jewel
          </span>{' '}
          of Fruits
        </motion.h1>

        <motion.p className="hero-subtitle" variants={fadeInUp} style={{ y }}>
          Organically grown, hand-picked at dawn, and delivered to your doorstep. Experience the King of Mangoes in its
          purest form.
        </motion.p>

        <motion.div className="hero-image-container" variants={fadeInUp}>
          <Image
            src={ASSETS.productOpenBox}
            alt="Origin Fresh Alphonso Mango Box"
            className="h-[90vh] mob:h-full"
            data-testid="hero-product-image"
            width={1000}
            height={800}
            priority
          />
        </motion.div>

        <motion.p className="hero-price" variants={fadeInUp}>
          ₹4,999 <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>for a box of twelve</span>
        </motion.p>

        <motion.a
          href={ORDER_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          data-testid="hero-buy-button"
        >
          Reserve Your Box
        </motion.a>
      </motion.div>
    </section>
  );
};

// USP Section - Two Column Layout with Text Left (Icons only, no cards), Mango Image Right
const USPSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="usp-section-new" data-testid="usp-section">
      <div className="usp-container-new">
        {/* Left Column - Text Content with Icons Only */}
        <motion.div
          className="usp-text-column"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p className="section-caption" style={{ marginBottom: '16px', y }}>
            The Distinction
          </motion.p>
          <motion.h2 className="usp-main-title" style={{ y }}>
            What Sets Us <span className="gold-text">Apart</span>
          </motion.h2>

          <div className="usp-list-minimal">
            {uspData.map((usp, index) => (
              <motion.div
                key={index}
                className="usp-item-minimal"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`usp-card-${index}`}
              >
                <div className="usp-icon-minimal">
                  <usp.icon strokeWidth={1.5} />
                </div>
                <div className="usp-content-minimal">
                  <h3>{usp.title}</h3>
                  <p>{usp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Real Mango Image Cutout */}
        <motion.div
          className="usp-mango-column"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <RotatingMango3D />
        </motion.div>
      </div>
    </section>
  );
};

// Story Section with Parallax
const StorySection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section className="story-section" data-testid="story-section" ref={ref}>
      <div className="radial-glow" style={{ top: '50%', right: '-200px', transform: 'translateY(-50%)' }} />

      <div className="story-container">
        <motion.div
          className="story-content"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ y }}
        >
          <p className="caption" style={{ marginBottom: '16px' }}>
            The Origin Story
          </p>
          <h2 className="story-title">
            Why <span className="gold-text">These</span> Mangoes?
          </h2>

          <p className="story-text">
            In the sun-drenched orchards of Ratnagiri, where the Arabian Sea breeze meets ancient volcanic soil, a rare
            alchemy occurs. Here, the Alphonso mango reaches its pinnacle—a flavor so profound, it's been sought after
            by connoisseurs for centuries.
          </p>

          <p className="story-text">
            We source exclusively from heritage farms that have been perfecting this craft for generations. No mass
            production. No compromises. Just small batches of perfection, picked at the precise moment of ripeness.
          </p>

          <p className="story-text" style={{ color: 'var(--gold-primary)', fontWeight: 500 }}>
            This isn't fruit. This is liquid gold.
          </p>
        </motion.div>

        <motion.div
          className="story-image-wrapper"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ y: imageY }}
        >
          <Image
            src="https://images.pexels.com/photos/4955253/pexels-photo-4955253.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Juicy sliced Alphonso mango"
            className="story-image"
            data-testid="story-image"
            width={800}
            height={600}
          />
          <div className="story-image-overlay"></div>
        </motion.div>
      </div>
    </section>
  );
};

// Pinterest-style Recipe Section with Parallax
const RecipeSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section className="recipe-section" data-testid="recipe-section" ref={ref}>
      <div className="section-header">
        <motion.p
          className="section-caption"
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
          style={{ y }}
        >
          Culinary Inspiration
        </motion.p>
        <motion.h2
          className="section-title"
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
          style={{ y }}
        >
          Indulge in <span className="gold-text">Alphonso</span> Creations
        </motion.h2>
      </div>

      <div className="pinterest-grid">
        {recipeData.map((recipe, index) => (
          <motion.article
            key={recipe.id}
            className={`recipe-card recipe-card-${index + 1}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            data-testid={`recipe-card-${index}`}
          >
            <div className="recipe-image-wrapper">
              <Image src={recipe.image} alt={recipe.title} className="recipe-image" width={400} height={200} />
              <div className="recipe-overlay">
                <Clock size={14} />
                <span className="recipe-time">{recipe.time}</span>
              </div>
            </div>
            <div className="recipe-content">
              <span className="recipe-category">{recipe.category}</span>
              <h3 className="recipe-title">{recipe.title}</h3>
              <span className="recipe-subtitle">{recipe.subtitle}</span>
              <p className="recipe-description">{recipe.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

// Video Section with Star Wars Crawl - Auto-play with Loop
const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log('Auto-play prevented:', e));
    }
  }, []);

  return (
    <section className="video-section" data-testid="video-section">
      <div className="radial-glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <motion.div
        className="video-content"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p className="caption" style={{ marginBottom: '16px', textAlign: 'center' }}>
          From Our Orchards
        </p>
        <h2 className="video-title">
          Where <span className="gold-text">Excellence</span> Grows
        </h2>
        <p className="video-subtitle">
          Walk through the sun-drenched groves of Ratnagiri, where every Alphonso begins its journey.
        </p>
      </motion.div>

      <motion.div
        className="video-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <video
          ref={videoRef}
          className="farm-video"
          src={ASSETS.farmVideo}
          playsInline
          loop
          muted
          autoPlay
          data-testid="farm-video"
        />

        {/* Star Wars Style Crawl Overlay - Always visible, looping */}
        <div className="star-wars-container">
          <div className="star-wars-fade"></div>
          <motion.div
            className="star-wars-crawl"
            data-testid="star-wars-crawl"
            initial={{ top: '100%' }}
            whileInView={{ top: '-250%' }}
            transition={{
              duration: 35,
              ease: 'linear',
              repeat: Infinity
            }}
            viewport={{ margin: '20% 0px' }}
          >
            <div className="crawl-content">
              <p className="crawl-intro">Origin Fresh Presents</p>
              <h3 className="crawl-title">THE ALPHONSO LEGACY</h3>
              <div className="crawl-text">
                <p>
                  In the coastal belt of Maharashtra, where the Arabian Sea breeze meets ancient volcanic soil, lies the
                  birthplace of the world's finest mango.
                </p>
                <p>
                  Our Alphonsos are sourced in small, exclusive batches from heritage farms in Devgad and Ratnagiri —
                  regions celebrated for producing the most aromatic mangoes on Earth.
                </p>
                <p>
                  Every fruit carries the GI Tag — a mark of authenticity that certifies its origin and unmatched
                  quality.
                </p>
                <p className="crawl-highlight">ORIGIN AUTHENTIC</p>
                <p>Carbide-free. Hand-picked at dawn. Delivered within 48 hours of harvest.</p>
                <p className="crawl-tagline">This is not just fruit. This is liquid gold.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="video-border" />
      </motion.div>
    </section>
  );
};

// Testimonials Section with Parallax
const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonials-section" data-testid="testimonials-section" ref={ref}>
      <div className="testimonials-container">
        <motion.p
          className="section-caption"
          style={{ marginBottom: '48px', y }}
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          The Connoisseurs Speak
        </motion.p>

        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          style={{ y }}
        >
          <p className="testimonial-quote" data-testid="testimonial-quote">
            {testimonials[activeIndex].quote}
          </p>
          <p className="testimonial-author">{testimonials[activeIndex].author}</p>
          <p className="testimonial-role">{testimonials[activeIndex].role}</p>
        </motion.div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              data-testid={`testimonial-dot-${index}`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Gifting Section
const GiftingSection: React.FC = () => (
  <section className="gifting-section" data-testid="gifting-section">
    <div
      className="radial-glow"
      style={{ top: '50%', left: '-200px', transform: 'translateY(-50%)' } as React.CSSProperties}
    />

    <div className="gifting-container">
      <motion.div
        className="gifting-image-wrapper"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Image
          src={ASSETS.productClosedBox}
          alt="Origin Fresh Gift Box"
          className="gifting-image"
          data-testid="gifting-image"
          width={700}
          height={500}
        />
      </motion.div>

      <motion.div
        className="gifting-content"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className="caption" style={{ marginBottom: '16px' }}>
          Luxurious Gifting
        </p>
        <h2 className="gifting-title">
          A Gift That <span className="gold-text">Speaks Volumes</span>
        </h2>

        <p className="gifting-text">
          Elevate your corporate gifting or surprise loved ones with the most prestigious fruit in India. Our signature
          black box is designed to make an impression before it's even opened.
        </p>

        <div className="gifting-features">
          <div className="gifting-feature">
            <Gift className="gifting-feature-icon" strokeWidth={1.5} />
            <span>Premium matte black presentation box</span>
          </div>
          <div className="gifting-feature">
            <Check className="gifting-feature-icon" strokeWidth={1.5} />
            <span>12 hand-selected premium grade mangoes</span>
          </div>
          <div className="gifting-feature">
            <Clock className="gifting-feature-icon" strokeWidth={1.5} />
            <span>Express delivery available</span>
          </div>
          <div className="gifting-feature">
            <Truck className="gifting-feature-icon" strokeWidth={1.5} />
            <span>Temperature-controlled shipping</span>
          </div>
        </div>

        <a
          href={CORPORATE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          data-testid="gifting-enquiry-button"
        >
          Corporate Enquiries
        </a>
      </motion.div>
    </div>
  </section>
);

// Delivery Section
const DeliverySection: React.FC = () => (
  <section className="delivery-section" data-testid="delivery-section">
    <div className="delivery-container">
      <motion.h2
        className="delivery-title"
        initial="initial"
        whileInView="whileInView"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        Swift Delivery, <span className="gold-text">Preserved Freshness</span>
      </motion.h2>

      <motion.div
        className="delivery-grid"
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div className="delivery-item" variants={fadeInUp}>
          <p className="delivery-time">2 hrs</p>
          <p className="delivery-location">Bangalore & Chennai</p>
        </motion.div>
        <motion.div className="delivery-item" variants={fadeInUp}>
          <p className="delivery-time">48 hrs</p>
          <p className="delivery-location">Pan-India Delivery</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// CTA Section
const CTASection: React.FC = () => (
  <section className="cta-section" data-testid="cta-section">
    <div
      className="radial-glow"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } as React.CSSProperties}
    />

    <motion.div
      className="cta-container"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="cta-title">
        Limited Season. <span className="gold-text">Limited Batches.</span>
      </h2>
      <p className="cta-text">
        The Alphonso season waits for no one. Reserve your box now and experience why the discerning few call this the
        finest mango in the world.
      </p>
      <a
        href={ORDER_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        data-testid="cta-buy-button"
      >
        ORDER NOW · ₹4,999
      </a>
    </motion.div>
  </section>
);

// Footer Component
const Footer: React.FC = () => (
  <footer className="footer" data-testid="footer">
    <div className="footer-container">
      <div className="footer-top">
        <div>
          <Image src={ASSETS.logo} alt="Origin Fresh" className="footer-logo" width={150} height={48} />
          <p className="footer-tagline">
            Curating the finest organic produce from farms across India. Fresh, authentic, uncompromised.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-links">
            <li>
              <a href="tel:+919900508216" className="footer-link" data-testid="footer-phone-1">
                <Phone size={14} style={{ display: 'inline', marginRight: '8px' }} />
                +91 99005 08216
              </a>
            </li>
            <li>
              <a href="tel:+919900507318" className="footer-link" data-testid="footer-phone-2">
                <Phone size={14} style={{ display: 'inline', marginRight: '8px' }} />
                +91 99005 07318
              </a>
            </li>
            <li>
              <a href="mailto:support@originfresh.in" className="footer-link" data-testid="footer-email">
                <Mail size={14} style={{ display: 'inline', marginRight: '8px' }} />
                support@originfresh.in
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/originfresh.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              data-testid="footer-instagram"
              aria-label="Instagram"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.linkedin.com/company/origin-fresh-tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              data-testid="footer-linkedin"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.youtube.com/@origin_fresh"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              data-testid="footer-youtube"
              aria-label="YouTube"
            >
              <Youtube size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">© 2026 Origin Fresh. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a
            href="https://originfresh.in/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Terms & Conditions
          </a>
          <a
            href="https://originfresh.in/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Main App Component
const Mango: React.FC = () => {
  return (
    <div className="App bg-[#050505]" data-testid="app-container">
      <div className="noise-overlay" />
      <Navigation />
      <main>
        <HeroSection />
        <VideoSection />
        <USPSection />
        <StorySection />
        <RecipeSection />
        <TestimonialsSection />
        <GiftingSection />
        <DeliverySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Mango;

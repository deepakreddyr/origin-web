import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FooterDataType } from '../../utilities/types';
import SocialLinks from './SocialLinks';

type FooterProps = {
  footerData?: FooterDataType;
};

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  if (!footerData) return null;

  const { footerLinksPrimary, footerLinksSecondary } = footerData;

  return (
    <footer className="bg-ink text-cream relative overflow-hidden section-pad pb-[40px] w-full">
      <div className="wrap relative z-10 flex flex-col md:flex-row gap-[60px] md:gap-[120px]">
        {/* Left side: Newsletter / Logo */}
        <div className="flex flex-col gap-[20px] max-w-[360px]">
          <div className="w-[140px] h-[36px] relative mb-[4px]">
            <Image
              src="/assets/images/neworiginlogo.png"
              alt="Origin Fresh"
              fill
              className="object-contain object-left invert"
            />
          </div>
          <p className="font-Recoleta text-[24px] text-brand-yellow-200 m-0 leading-tight">
            Stay Fresh: Join Our Newsletter
          </p>
          <p className="text-[14px] text-cream/60 m-0 leading-[1.6]">
            First access to seasonal drops, market events, and OG-only offers.
          </p>
          <form className="flex gap-[10px] mt-[10px]" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 py-[13px] px-[18px] rounded-full border border-cream/25 bg-transparent text-paper placeholder:text-cream/40 focus:outline-none focus:border-brand-yellow-200 transition-colors text-[14px]"
            />
            <button className="btn btn-yellow px-[24px]" type="submit">
              Subscribe
            </button>
          </form>

          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>

        {/* Right side: Navigation columns */}
        <div className="flex flex-wrap gap-[40px] md:gap-[80px] flex-1 md:justify-end">
          <div className="flex flex-col gap-[12px]">
            <h4 className="font-Recoleta text-[18px] text-brand-yellow-200 m-0 mb-[8px]">Shop</h4>
            <Link href="/shop" className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]">
              All Products
            </Link>
            <Link href="/shop" className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]">
              Just Landed
            </Link>
            <Link href="/shop" className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]">
              In Season
            </Link>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h4 className="font-Recoleta text-[18px] text-brand-yellow-200 m-0 mb-[8px]">Origin Fresh</h4>
            <Link href="/about" className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]">
              Our Story
            </Link>
            <Link href="/events" className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]">
              Events
            </Link>
            {footerLinksPrimary?.map((link, i) => (
              <Link
                key={i}
                href={`/${link.href}`}
                className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]"
              >
                {link.text}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-[12px]">
            <h4 className="font-Recoleta text-[18px] text-brand-yellow-200 m-0 mb-[8px]">Support</h4>
            {footerLinksSecondary?.map((link, i) => (
              <Link
                key={i}
                href={`/${link.href}`}
                className="text-cream/70 hover:text-brand-yellow-200 transition-colors text-[14px]"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap relative z-10 mt-[80px] pt-[30px] border-t border-cream/10 flex flex-col md:flex-row gap-[12px] text-[14px] text-cream/40 justify-between">
        <span>© {new Date().getFullYear()} Origin Fresh. Ethically Sourced. 60 Minute Delivery.</span>
        {/* <span>Anna Nagar · Besant Nagar · Chennai</span> */}
      </div>
    </footer>
  );
};

export default Footer;

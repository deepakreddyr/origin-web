import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import storeMockup from '/public/assets/images/origin_fresh_pune_store.png';
import { request, ResponseError } from '@/utilities/request';

interface ComingSoonViewProps {
  cityLabel: string;
}

const ComingSoonView = ({ cityLabel }: ComingSoonViewProps) => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side phone validation: starts with 6-9 and exactly 10 digits
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage('Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (typeof window !== 'undefined') {
        const selectedAddress = localStorage.getItem('selected_address');
        if (selectedAddress) {
          try {
            const parsed = JSON.parse(selectedAddress);
            if (parsed.latitude && parsed.longitude) {
              latitude = Number(parsed.latitude);
              longitude = Number(parsed.longitude);
            }
          } catch (e) {
            console.error('Error parsing selected_address', e);
          }
        }
      }

      const payload: any = {
        phone,
        location: cityLabel,
        type: 'existing'
      };

      if (latitude !== undefined) payload.latitude = latitude;
      if (longitude !== undefined) payload.longitude = longitude;

      await request('/api/v1/public/store-location-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      setSubmitted(true);
      setPhone('');
    } catch (err: any) {
      console.error('Error submitting store location request:', err);
      if (err instanceof ResponseError) {
        try {
          const errorData = await err.response.json();
          if (errorData.errors && errorData.errors.phone) {
            setErrorMessage(errorData.errors.phone[0]);
          } else if (errorData.message) {
            setErrorMessage(errorData.message);
          } else {
            setErrorMessage('Failed to submit request. Please try again.');
          }
        } catch (jsonErr) {
          setErrorMessage('Failed to submit request. Please try again.');
        }
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF8EF] py-[5vw] md:py-[5vw]">
      <div className="max-w-[1340px] mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-[36px]">
        {/* Grid Item 1: Main Teaser */}
        <div className="md:col-span-8 bg-[#FAF3E5] rounded-[36px] p-[45px] flex flex-col justify-center relative overflow-hidden">
          {/* Decorative faint background element if needed */}
          <div className="absolute top-0 right-[10%] opacity-[0.03] pointer-events-none w-[300px] h-[300px]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M4 6h16v2H4zm2 4h12v12H6z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-start">
            <span className="font-[SofiaPro] font-semibold text-[#5A4E27] text-[12px] md:text-[14px] uppercase tracking-[1px] bg-[#F8E19B] px-4 py-1.5 rounded-full mb-[24px]">
              Coming Soon
            </span>

            <span className="font-[SofiaPro] font-bold text-[36px] md:text-[54px] text-[#FAC510] leading-tight md:leading-[63px] tracking-[-1.08px] mb-[20px] max-w-[580px]">
              Origin Fresh is Coming to {cityLabel}
            </span>

            <p className="font-[SofiaPro] text-[#4A4A4A] text-[16px] md:text-[21px] leading-[1.6] mb-[32px] max-w-[647px]">
              We're bringing our farm-to-customer experience to the{' '}
              {cityLabel === 'Pune' ? 'Oxford of the East' : cityLabel}. Get ready for premium organic produce, exotic
              imports, and an elevated boutique shopping experience in Koregaon Park.
            </p>

            <Link href="/shop" legacyBehavior>
              <a className="bg-primary text-black text-center font-[SofiaPro] font-semibold rounded-full py-[14px] px-[32px] text-[20px] transition-colors shadow-md">
                Shop Online Now
              </a>
            </Link>
          </div>
        </div>

        {/* Grid Item 2: Image */}
        <div className="md:col-span-4 rounded-[36px] overflow-hidden min-h-[300px] md:min-h-[450px] relative">
          <Image
            src={storeMockup}
            alt={`${cityLabel} store storefront concept`}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Grid Item 3: Notify Form */}
        <div className="md:col-span-5 bg-primary rounded-[36px] p-[45px] flex flex-col justify-center min-h-[395px]">
          <span className="font-[SofiaPro] font-medium text-[26px] md:text-[26px] text-black mb-[24px]">
            Get notified when we launch
          </span>
          <p className="font-[SofiaPro] text-black font-regular text-[18px] leading-[1.5] mb-[40px]">
            Be the first to receive an exclusive invite to our {cityLabel} private opening event and early-access
            discounts.
          </p>

          {submitted ? (
            <div className="bg-[#E8F5EE] border border-[#00855B] text-[#00855B] font-[SofiaPro] px-6 py-4 rounded-full font-semibold">
              ✓ Request submitted successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/90 border border-transparent rounded-full px-5 py-[14px] font-[SofiaPro] text-[16px] focus:outline-none focus:border-black placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-primary font-[SofiaPro] font-semibold rounded-full px-6 py-[14px] text-[16px] hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Stay Updated'}
              </button>
              {errorMessage && (
                <p className="text-red-700 font-[SofiaPro] text-[14px] px-2 mt-1 font-medium">{errorMessage}</p>
              )}
            </form>
          )}
        </div>

        {/* Grid Item 4: Finding the perfect spot */}
        <div className="md:col-span-7 bg-[#E8E6E0] rounded-[36px] p-[45px] relative overflow-hidden flex flex-col justify-center min-h-[395px]">
          <div className="relative z-10 max-w-[400px]">
            <h4 className="font-[Recoleta] font-bold text-[28px] md:text-[32px] text-black mb-[24px]">
              Finding the perfect spot
            </h4>
            <p className="font-[SofiaPro] text-gray-700 text-[16px] leading-[1.5] mb-[40px]">
              We're currently finalizing our flagship location in {cityLabel}. Want to suggest a neighborhood? We're
              listening.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/50 px-5 py-3 rounded-full text-[15px] font-[SofiaPro] font-semibold text-gray-800 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#F3B600]"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.797 3.218-8.217C19.5 6.112 16.13 3 12 3s-7.5 3.112-7.5 6.75c0 3.42 1.274 6.138 3.218 8.217a19.58 19.58 0 002.683 2.282c.387.276.792.54 1.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Koregaon Park / Kalyani Nagar
            </div>
          </div>

          {/* Faint placeholder overlay graphic for the right side */}
          <div className="absolute right-[-10%] bottom-[-20%] w-[350px] h-[350px] opacity-[0.05] pointer-events-none rounded-full border-[40px] border-black"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonView;

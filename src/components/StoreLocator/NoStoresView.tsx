import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { request, ResponseError } from '@/utilities/request';
import FutureDestinationTeaser from './FutureDestinationTeaser';
import Image from 'next/image';

interface NoStoresViewProps {
  cityLabel: string;
}

const NoStoresView = ({ cityLabel }: NoStoresViewProps) => {
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
        type: 'suggestion'
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
    <div className="w-full bg-[#FFF8EF] py-[6vw] mob:py-[15vw]">
      <div className="max-w-[70vw] mob:max-w-[90vw] mx-auto text-center">
        {/* Map Icon Pin with slash (mockup style) */}
        <div className="flex justify-center mb-[2vw] mob:mb-[6vw]">
          <div className="w-[4.5vw] h-[4.5vw] mob:w-[15vw] mob:h-[15vw] rounded-full bg-[#F3EFE0] flex items-center justify-center">
            <Image src="/assets/svg/storenotfound.svg" alt="Store Not Found" width={30} height={30} />
          </div>
        </div>

        <span className="font-[SofiaPro] font-bold text-[36px] md:text-[54px] text-black mb-[1vw] mob:mb-[3vw] tracking-[-0.5px]">
          No stores found in this area yet
        </span>
        <p className="font-[SofiaPro] font-medium text-gray-700 text-[16px] md:text-[20px] max-w-[550px] mx-auto mb-[4vw] mob:mb-[10vw] leading-[1.6]">
          Origin Fresh hasn't reached {cityLabel} just yet. We're busy hand-picking the best farms to serve you soon.
        </p>

        {/* Notify Me Card - Centered */}
        <div className="w-[490.5px] max-w-full h-[343px] mob:h-auto rounded-[36px] border-[1.13px] border-[#E8DFD3] p-[36px] mob:p-[24px] bg-[#FAF3E5] mx-auto flex flex-col justify-between text-left mb-[6vw] mob:mb-[15vw]">
          <div>
            <span className="font-[SofiaPro] font-medium text-[27px] text-black mb-[16px] flex items-center gap-[8px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              Notify Me
            </span>
            <p className="font-[SofiaPro] text-black text-[18px] font-regular leading-[1.5] mb-[24px]">
              Be the first to know when we open our doors in {cityLabel}. No spam, just fresh updates.
            </p>
          </div>
          <div className="w-full mt-auto">
            {submitted ? (
              <div className="text-[#00855B] bg-[#E8F5EE] border border-[#00855B] font-[SofiaPro] px-6 py-4 rounded-full font-semibold text-center">
                ✓ Thank you! We will notify you when we launch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-[12px]">
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#FCFBF7] border border-gray-200 rounded-[100px] px-[24px] py-[16px] font-[SofiaPro] text-[16px] focus:outline-none focus:border-black placeholder-gray-500"
                />
                {errorMessage && <p className="text-red-500 font-[SofiaPro] text-[14px] px-[12px]">{errorMessage}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-black font-[SofiaPro] font-bold rounded-[100px] py-[16px] text-[18px] hover:bg-[#FFC107] transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {loading ? 'Submitting...' : 'Notify Me'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Nearest Locations Section — outside the 70vw wrapper, using same 92vw as FutureDestinationTeaser */}
      {/* <div className="w-full max-w-[92vw] mx-auto border-t border-gray-200 pt-[3vw] mob:pt-[5vw] flex flex-col items-center">
        <span className="font-[SofiaPro] font-semibold text-[22px] md:text-[24px] text-black mb-[32px] text-center w-full">
          Or visit our nearest available locations
        </span>

        <div className="flex justify-center mob:justify-start gap-[24px] mob:gap-[12px] w-full mob:overflow-x-auto snap-x hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          Bangalore Card
          <div className="w-[280px] mob:w-[calc(50%-6px)] shrink-0 snap-center bg-white rounded-[24px] mob:rounded-[16px] border border-gray-200 overflow-hidden flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600&auto=format&fit=crop"
              alt="Bangalore"
              className="w-full h-[180px] mob:h-[120px] object-cover"
            />
            <div className="p-[24px] mob:p-[16px] flex flex-col items-start bg-white">
              <h4 className="font-[SofiaPro] font-medium text-[22px] mob:text-[18px] text-black">Bangalore</h4>
              <p className="font-[SofiaPro] text-[15px] text-gray-700 mt-[4px]">3 Active Stores</p>
              <Link href="/stores/bengaluru" legacyBehavior>
                <a className="font-[SofiaPro] text-[14px] font-bold text-primary mt-[24px] flex items-center gap-1 hover:underline">
                  View on Map
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>

          Chennai Card
          <div className="w-[280px] mob:w-[calc(50%-6px)] shrink-0 snap-center bg-white rounded-[24px] mob:rounded-[16px] border border-gray-200 overflow-hidden flex flex-col">
            <img
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?q=80&w=600&auto=format&fit=crop"
              alt="Chennai"
              className="w-full h-[180px] mob:h-[120px] object-cover"
            />
            <div className="p-[24px] mob:p-[16px] flex flex-col items-start bg-white">
              <h4 className="font-[SofiaPro] font-medium text-[22px] mob:text-[18px] text-black">Chennai</h4>
              <p className="font-[SofiaPro] text-[15px] text-gray-700 mt-[4px]">2 Active Stores</p>
              <Link href="/stores/chennai" legacyBehavior>
                <a className="font-[SofiaPro] text-[14px] font-bold text-primary mt-[24px] flex items-center gap-1 hover:underline">
                  View on Map
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      {/* Future Destinations Section */}
      {/* <div className="w-full mt-[4vw]">
        <FutureDestinationTeaser />
      </div> */}
    </div>
  );
};

export default NoStoresView;

import React, { useState } from 'react';
import { request, ResponseError } from '@/utilities/request';

const FutureDestinationTeaser = () => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

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
        location: 'Pune',
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
    <div className="w-full max-w-[92vw] mx-auto mt-[4vw] mob:mt-[8vw] mb-[2vw]">
      <div className="relative bg-[#FEF5E3] rounded-[36px] mob:rounded-[5vw] py-[6vw] px-[4vw] mob:p-[8vw] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Decorative corner graphics (approximate based on screenshot) */}
        <div className="absolute top-0 right-0 w-[20vw] h-[20vw] bg-[#0532030D] rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-[12vw] h-[12vw] bg-[#0532030D] rounded-tr-full"></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-[80vw]">
          <span className="bg-[#F8E19B] text-[#5A4E27] font-[SofiaPro] font-normal text-[15.75px] leading-[22.5px] tracking-[0.79px] uppercase px-4 py-1.5 rounded-full mb-[2vw] mob:mb-[4vw]">
            Future Destinations
          </span>

          <h2 className="font-[Recoleta] text-[#F3B600] font-semibold text-[32px] md:text-[54px] leading-tight md:leading-[63px] tracking-[-1.08px] mb-[1.5vw] mob:mb-[4vw]">
            Pune, We're Growing Towards You
          </h2>

          <p className="font-[SofiaPro] text-[#4A4A4A] font-normal text-[16px] md:text-[20.25px] leading-[1.5] md:leading-[31.5px] tracking-[0px] mb-[3vw] mob:mb-[6vw] max-w-[750px]">
            We are currently curating the finest exotic produce sources for our upcoming flagship store in Pune. Stay
            tuned for the freshest experience in the city.
          </p>

          <div className="w-full max-w-[700px] mx-auto relative z-20">
            {submitted ? (
              <div className="bg-[#E8F5EE] border border-[#00855B] text-[#00855B] font-[SofiaPro] px-6 py-4 rounded-full font-semibold">
                ✓ Thank you! We will notify you when we launch.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <div className="relative">
                  <div className="w-full sm:w-[432px] max-w-[432px] h-[60.75px] pt-[20.25px] pr-[27px] pb-[20.25px] pl-[27px] rounded-[11248.88px] border-[1.13px] border-[#C2C9BB] bg-white flex items-center">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Get notified when we launch"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 w-full bg-transparent outline-none text-black placeholder-gray-500 text-[14px] md:text-[18px]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary w-full sm:w-auto h-[60.75px] text-black font-semibold rounded-full px-8 md:px-10 text-[15px] md:text-[18px] hover:bg-[#FFC107] transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Notify Me'}
                </button>
              </form>
            )}
            {errorMessage && !submitted && (
              <p className="text-red-500 font-[SofiaPro] text-[14px] text-left px-4 mt-2">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureDestinationTeaser;

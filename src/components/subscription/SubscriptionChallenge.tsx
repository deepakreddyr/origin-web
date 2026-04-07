import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setSubscriptionItem, setIsSubscriptionActive } from '@/store/slice/SubscriptionCartSlice';
import { setIsSidebarOpen, setTabType } from '@/store/slice/loginSlice';
import { TabTypeConstant } from '../Login/constants/tabTypeContent';
import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';

const bgColors = [
  '#FCF2B7', // 1
  '#F9E27D', // 2
  '#F9883E', // 3
  '#F9883E', // 4
  '#F9E27D', // 5
  '#FCF2B7', // 6
  '#F9E27D' // 7
];

const bgColorsMobile = [
  '#FCF2B7', // Monday
  '#F9883E', // Tuesday
  '#F9E27D', // Wednesday
  '#FCF2B7', // Thursday
  '#F9883E', // Friday
  '#F9E27D', // Saturday
  '#FCF2B7' // Sunday
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getNextSaturday4PM = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 6 = Sat
  const daysUntil = (6 - day + 7) % 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntil);
  next.setHours(16, 0, 0, 0); // Saturday 4:00 PM

  if (now > next) {
    next.setDate(next.getDate() + 7);
  }
  return next;
};

const getNextSunday8AM = () => {
  const cutoff = getNextSaturday4PM();
  const next = new Date(cutoff);
  next.setDate(cutoff.getDate() + 1);
  next.setHours(8, 0, 0, 0);
  return next;
};

const SubscriptionChallenge = ({ item, comboItems, maxQty }: { item?: any; comboItems?: any[]; maxQty: number }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, min: 0, sec: 0 });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isPastCutoff, setIsPastCutoff] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(768);

  const colors = isMobile ? bgColorsMobile : bgColors;

  const handleOrderNow = () => {
    if (!item) return;
    const itemPrice = item?.price_inclusive_of_all_taxes ?? item?.multiple_uoms?.[0]?.price ?? 89;
    const cartItem = {
      id: item?.id,
      item_code: item?.item_code,
      variant_id: item?.multiple_uoms?.[0]?.variant_id || '',
      uom_id: item?.multiple_uoms?.[0]?.uom_id || '',
      name: item?.name,
      image: item?.image,
      price: itemPrice,
      price_inclusive_of_all_taxes: itemPrice,
      quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
      minimum_quantity: item?.multiple_uoms?.[0]?.minimum_quantity || 1,
      max_qty: item?.multiple_uoms?.[0]?.maximum_quantity || item?.max_qty || 10,
      stepper_quantity: item?.multiple_uoms?.[0]?.stepper_quantity || 1,
      combo_items: comboItems ?? []
    };

    dispatch(setSubscriptionItem(cartItem));
    dispatch(setIsSubscriptionActive(true));
    dispatch(setTabType(TabTypeConstant.CART));
    dispatch(setIsSidebarOpen(true));
  };

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = getNextSunday8AM();
      const diff = target.getTime() - now.getTime();

      // Check if we are past this week's Saturday 4 PM cutoff
      const day = now.getDay();
      const thisSat = new Date(now);
      thisSat.setDate(now.getDate() + (6 - day));
      thisSat.setHours(16, 0, 0, 0);
      setIsPastCutoff(now > thisSat);

      setDeliveryDate(
        target.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })
      );

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, min: 0, sec: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        min: Math.floor((diff / (1000 * 60)) % 60),
        sec: Math.floor((diff / 1000) % 60)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  // Use combo items from API; create placeholder slots if fewer than 7 or none
  const items = comboItems && comboItems.length > 0 ? comboItems : [];
  const slots = items.length > 0 ? items : Array(7).fill(null);

  return (
    <section className="bg-[#FFDD7E] py-0">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {/* Sidebar */}
        <div className="bg-[#FFDD7E] flex flex-col justify-start md:justify-between gap-5 md:gap-0 p-4 md:p-6 min-h-[210px] md:min-h-[400px]">
          {/* Title */}
          <p
            className="font-[600] text-center mt-[2vw] md:text-left text-[6vw] md:text-[3vw] md:pl-[1vw] leading-[1.3] text-black uppercase"
            style={{ fontFamily: 'Recoleta' }}
          >
            WHAT'S
            <br />
            INSIDE THE
            <br />
            CHALLENGE?
          </p>

          {/* Timer + Button */}
          <div className="flex flex-col items-center md:items-stretch mt-auto md:mt-0 md:ml-[1vw]">
            <div className="bg-white p-2.5 md:p-4 mb-5 md:mb-10 shadow-sm w-full max-w-[260px] md:max-w-[280px] rounded-[10px]">
              <span className="text-[0.4rem] md:text-[0.55rem] font-[700] opacity-40 block mb-2 md:mb-3 uppercase tracking-widest text-center">
                NEXT DELIVERY IN
              </span>
              <div className="flex justify-between gap-1.5 md:gap-2.5 font-[Recoleta]">
                {[
                  [pad(timeLeft.days), 'Days'],
                  [pad(timeLeft.hours), 'Hours'],
                  [pad(timeLeft.min), 'Min'],
                  [pad(timeLeft.sec), 'Sec']
                ].map(([val, label]) => (
                  <div
                    key={label}
                    className="flex-1 text-center bg-[#F9F9F9] p-1.5 md:p-3.5 rounded-lg md:rounded-xl min-w-0"
                  >
                    <div className="text-[1rem] md:text-[1.4rem] font-[900] leading-none tabular-nums text-black">
                      {val}
                    </div>
                    <div className="text-[0.35rem] md:text-[0.45rem] uppercase opacity-50 mt-1.5 md:mt-2 font-[SofiaPro] font-[700] tracking-wider">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Date Bagde */}
              {/* <div className="mt-4 pt-3.5 border-t border-black/[0.05] flex flex-col items-center justify-center gap-1">
                <span className="text-[0.4rem] md:text-[0.5rem] font-[800] uppercase opacity-30 tracking-[0.1em]">
                  {isPastCutoff ? 'EXPRESS DELIVERY ON' : 'Expected Delivery'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
                  <span className="text-[0.6rem] md:text-[0.75rem] font-[800] uppercase text-black">
                    {deliveryDate}
                  </span>
                </div>
              </div> */}
            </div>
            <button
              className="w-full max-w-[150px] md:max-w-[280px] bg-black text-[#FFDD7E] py-2.5 md:py-4 rounded-[10px] md:rounded-[15px] font-[800] text-[0.85rem] md:text-[1.1rem] tracking-[0.05em] hover:bg-[#222] transition-colors uppercase"
              onClick={handleOrderNow}
            >
              ORDER NOW
            </button>
          </div>
        </div>

        {/* Combo Item Cards */}
        {slots.map((comboItem: any, index: number) => (
          <div
            key={comboItem ? comboItem.item_name : `placeholder-${index}`}
            className="relative flex flex-col justify-end overflow-hidden min-h-[280px] md:min-h-[400px]"
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            {/* Item image — centered */}
            <div className="absolute inset-0 bottom-[100px] md:bottom-[80px] flex items-center justify-center">
              <div className="relative w-[70%] md:w-[65%] h-full">
                {comboItem ? (
                  <Image
                    src={comboItem.image}
                    alt={comboItem.item_name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 40vw, 20vw"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/assets/images/subdragon.png"
                    alt="Coming Soon"
                    fill
                    className="object-contain opacity-30"
                    sizes="(max-width: 768px) 40vw, 20vw"
                  />
                )}
              </div>
            </div>

            {/* Bottom info strip */}
            <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between px-4 mob:pb-5 md:pb-9 bg-transparent text-center md:text-left">
              <div className="mb-3 md:mb-0">
                <div
                  className="font-[800] text-[0.85rem] md:text-[0.95rem] uppercase leading-tight tracking-wide"
                  style={{ fontFamily: 'SofiaPro' }}
                >
                  {comboItem ? comboItem.item_name : '—'}
                </div>
                <div className="text-[0.65rem] font-[500] md:text-[0.7rem] mt-0.5">
                  {comboItem ? `${comboItem.uom}` : ''}
                </div>
              </div>

              {/* Day Label Bubble */}
              <div className="bg-black font-[SofiaPro] font-semibold text-white px-6 py-1.5 md:px-6 md:py-2 rounded-[6px] text-[3vw] md:text-[0.75rem] tracking-wider">
                {DAYS[index]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionChallenge;

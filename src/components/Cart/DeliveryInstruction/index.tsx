'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { updateInstructions } from '@/store/slice/placeOrderDetails';
import { useState, useEffect } from 'react';

const givetosecurity = '/assets/svg/give-to-security.svg';
const NoCalling = '/assets/svg/avoid-calling.svg';
const LeaveAtdoor = '/assets/svg/leave-at-door.svg';

const deliveryInstructions = [
  {
    slug: 'Give_to_Security',
    name: 'Give to Security',
    image: givetosecurity,
  },
  {
    slug: 'Leave_at_door',
    name: 'Leave at door',
    image: LeaveAtdoor,
  },
  {
    slug: 'Avoid_Calling',
    name: 'Avoid Calling',
    image: NoCalling,
  },
];

const DeliveryInstruction = () => {
  const dispatch = useDispatch();
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);

  // Update Redux whenever selections change
  useEffect(() => {
    const instructionsString = selectedInstructions
      .map((slug, index) => {
        const instruction = deliveryInstructions.find(inst => inst.slug === slug);
        if (!instruction) return '';
        
        if (index === selectedInstructions.length - 1 && selectedInstructions.length > 1) {
          return `and ${instruction.name}`;
        } else if (index === selectedInstructions.length - 1) {
          return instruction.name;
        } else if (index === selectedInstructions.length - 2) {
          return `${instruction.name} `;
        } else {
          return `${instruction.name}, `;
        }
      })
      .join('');
    
    dispatch(updateInstructions(instructionsString));
  }, [selectedInstructions, dispatch]);

  const handleInstructions = (slug: string) => {
    setSelectedInstructions(prev => {
      if (prev.includes(slug)) {
        // Remove if already selected
        return prev.filter(s => s !== slug);
      } else {
        // Add if not selected
        return [...prev, slug];
      }
    });
  };

  return (
    <div className="bg-[#FFFCDE] border border-black mob:rounded-[2vw] rounded-[0.5vw] p-4 flex flex-col gap-3">
      <h1 className="font-slab font-semibold text-[1.1vw] text-black mb-2 mob:text-[4.1vw]">
        Delivery Instructions
      </h1>

      <div className="grid grid-cols-3 gap-[0.8rem]">
        {deliveryInstructions.map((item) => {
          const isActive = selectedInstructions.includes(item.slug);

          return (
            <div
              key={item.slug}
              onClick={() => handleInstructions(item.slug)}
              className={`relative cursor-pointer flex flex-col mob:rounded-[2vw] items-center justify-center rounded-[0.5vw] border-[1px] transition-all duration-200 ${
                isActive
                  ? 'border-[#F9CE24]'
                  : 'border-[#E5E1D8]'
              } p-3 w-full text-center hover:border-[#F9CE24] hover:bg-[#FFF9E5]`}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={35}
                height={35}
                className="mb-1"
              />
              <span className="text-[0.5rem] font-[SofiaPro] font-semibold text-[#1E1E1E] leading-tight">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryInstruction;
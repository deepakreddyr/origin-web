import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // ✅ import the chevron
import Image from 'next/image';

const Dropdown = (props: any) => {
  const { value, valueName, placeholder, handler, list, name } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-[.97vw] mob:gap-[2vw] cursor-pointer"
      >
        <h1 className="text-black font-semibold text-[1.67vw] mob:text-[5.1vw]">{value}</h1>
        <div className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown size={40} className="text-black w-[1.6vw] h-[1.6vw] mob:w-[6vw] mob:h-[6vw]" />
        </div>
      </div>

      {showDropdown && (
        <ul className="absolute top-[7vw] bg-white flex rounded-[2vw] mob:rounded-[4vw] w-[15vw] mob:w-[50vw] items-start flex-col shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] mob:p-[5.1vw] p-[1.67vw] z-[10]">
          {list.map((data: any) => (
            <li key={data.id} className="py-[.7vw] mob:py-[2.5vw] w-full last:pb-0 first:pt-0">
              <button
                onClick={() => {
                  handler(data, name);
                  setShowDropdown(false);
                }}
                className={`font-[SofiaPro] text-start w-full font-semibold text-[1.25vw] mob:text-[4.5vw] ${
                  value === data.name ? 'text-secondary' : 'text-black'
                }`}
              >
                {data.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

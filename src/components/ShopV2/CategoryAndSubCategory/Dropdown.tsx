import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dropdownIcon from '/public/assets/icons/dropdownIcon.png';
import Image from 'next/image';
const Dropdown = (props: any) => {
  const { value, valueName, placeholder, handler, list, name } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-[.97vw] mob:gap-[2vw]">
        <p className="text-[#FFFCDE] font-slab font-semibold text-[50px] mob:text-[5.1vw]">{value}</p>
        {/* <div>
          <div
            className={`w-[1.6vw] mob:w-[4.6vw] mon:h-[4vw] h-[1.4vw] mob:mt-[-3vw] relative ${showDropdown ? 'rotate-180' : 'rotate-0'} `}
          >
            <Image src={dropdownIcon} alt="dropdownicon" />
          </div>
        </div> */}
      </div>
      {/* {showDropdown && (
        <ul className="absolute top-[1.8vw] bg-[#FFFCDE] flex rounded-[2vw] mob:rounded-[4vw] w-[15vw] mob:w-[50vw] items-start flex-col  shadow-[4px_4px_32px_0px_rgba(0,0,0,0.08)] mob:p-[5.1vw] p-[1.67vw] z-[10]">
          {list.map((data: any) => (
            <li className="py-[.7vw] mob:py-[2.5vw]  w-full last:pb-0 first:pt-0 ">
              <button
                onClick={() => {
                  handler(data, name);
                  setShowDropdown(false);
                }}
                className={`font-[SofiaPro] text-start w-full font-semibold text-[1.25vw] mob:text-[4.5vw] ${value === data.name ? 'text-secondary' : 'text-black'} `}
                key={data.id}
              >
                {data.name}
              </button>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default Dropdown;

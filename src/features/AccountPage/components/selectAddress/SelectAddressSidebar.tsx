import { addressAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { editAddress } from '@/features/AddressEditDetails/services/editAddress';
import { useDispatch } from 'react-redux';
import { setIsSidebarOpen } from '@/store/slice/loginSlice';
import type Address from '../../types/Address';
import Image from 'next/image';
import { ADDRESS_ICON_MAP_PNG } from '@/utilities/maps';
import Other from '/public/assets/icons/addressIcons/others.png';

const SelectAddressSidebar = () => {
  const [address, setAddress] = useAtom(addressAtom);
  const dispatch = useDispatch();

  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null); // Track hovered item by its ID

  const handleSetAddress = async (address: any) => {
    let apiData = {
      ...address,
      is_default: true
    };
    await editAddress(apiData as Address, setAddress);
    dispatch(setIsSidebarOpen(false));
  };

  if (address.loading) return <>Loading</>;

  return (
    <div>
      {address.address?.map((data: any) => (
        <li
          key={data.address_id}
          onClick={() => handleSetAddress(data)}
          onMouseEnter={() => setHoveredItemId(data.address_id)}
          onMouseLeave={() => setHoveredItemId(null)}
          className={`flex w-full text-start cursor-pointer gap-[.6vw] mob:gap-[3vw]  last:border-b-0 last:mb-0 border-b border-b-beige-200   ${
            hoveredItemId === data.address_id ? 'bg-[#F2EEE4]' : ''
          } transition-all py-[1vw] mob:py-[4.1vw] mob:pl-[0vw] pl-[1vw] mob:w-full duration-100`}
        >
          <div>
            <div className="flex items-center justify-center w-[3vw] mob:w-[10vw] mob:h-[10vw] h-[3vw] bg-[#F8F4E9] mob:rounded-[2vw] rounded-[.6vw] border border-[#F2EEE4]">
              <div className="opacity-80 relative w-[1.2vw] mob:w-[5vw] mob:h-[5vw]  h-[1.2vw] ">
                <Image
                  src={ADDRESS_ICON_MAP_PNG[data.address_name] ? ADDRESS_ICON_MAP_PNG[data.address_name] : Other}
                  fill
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="w-[22vw] mob:w-[80vw] ">
            <p className="font-[SofiaPro] text-[.97vw] mob:text-[3.6vw] font-semibold">{data.address_name}</p>
            <p className="text-[.83vw] mob:text-[3vw] font-[SofiaPro] text-black-op-80">{data.address}</p>
          </div>
        </li>
      ))}
    </div>
  );
};

export default SelectAddressSidebar;

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
import { Button } from '@mui/material';

// Import the required atoms and enums for new address functionality
import {
  addressDetailsAtom,
  isAddressIsOpen,
  isEditingAddress,
  addressSidebarDetails
} from '@/features/AddressEditDetails/context/atoms';
import { manageAddressScreens } from '../../enums/ActiveSidebar';
import TabType from '@/features/AddressEditDetails/enums/TabType';

const SelectAddressSidebar = () => {
  const [address, setAddress] = useAtom(addressAtom);
  const [, setAddressDetails] = useAtom(addressDetailsAtom);
  const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
  const [, setAddressSidebarDetails] = useAtom(addressSidebarDetails);
  const [editingDetails, setIsEditingAddress] = useAtom(isEditingAddress);
  
  const dispatch = useDispatch();

  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  const handleSetAddress = async (address: any) => {
    let apiData = {
      ...address,
      is_default: true
    };
    await editAddress(apiData as Address, setAddress);
    dispatch(setIsSidebarOpen(false));
  };

  const addNewAddressHandler = () => {
    // Reset address details to empty values (same as ManageAddress component)
    setAddressDetails({
      address_name: '',
      formatted_address: '',
      address: '',
      door_no: '',
      locality: '',
      landmark: '',
      latitude: 0,
      longitude: 0,
      deliverable: false,
      address_id: null,
      earliest_timeslot: '',
      store_id: '',
      is_default: ''
    });

    // Set editing mode to inactive (we're adding, not editing)
    setIsEditingAddress({
      ...editingDetails,
      isActive: false
    });

    // Switch to address edit flow - start with serviceability check
    setAddressSidebarDetails({
      tabType: TabType.SERVICEABILITY // You might need to add this to your TabType enum
    });

    // Open the address sidebar
    setIsAddressOpen(true);
  };

  const addAddressCTA = () => {
    return (
      <Button
        variant="contained"
        color="success"
        sx={{
          width: '100%',
          backgroundColor: '#FFDD00',
          position: 'sticky',
          bottom: '0',
          color: 'black',
          fontFamily: 'SofiaPro',
          fontSize: '16px',
          borderRadius: '100px',
          height: '48px',
          fontWeight: 600,
          textTransform: 'capitalize',
          boxShadow: 'none',
          margin: '16px 0',
          ':hover': {
            backgroundColor: '#ffdd00a6',
            color: 'black',
            boxShadow: 'none'
          }
        }}
        onClick={addNewAddressHandler}
      >
        + New Address
      </Button>
    );
  };

  if (address.loading) return <>Loading</>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
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
      
      {/* Add the + New Address button at the bottom
      <div className="px-[1vw] mob:px-[4vw] pb-[1vw] mob:pb-[4vw]">
        {addAddressCTA()}
      </div> */}
    </div>
  );
};

export default SelectAddressSidebar;
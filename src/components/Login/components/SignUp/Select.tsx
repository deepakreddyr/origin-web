import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import greenDropdownIcon from '/public/assets/images/greenDropdownIcon.png';
import Image from 'next/image';
interface Props {
  name: String;
  handler: any;

  value: any;
  errors: any;
  setErrors: any;
}

const genderList = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Other' },
  { id: 4, name: "Don't wish to specify" }
];

const SelectDropdown = (props: Props) => {
  const { name, value, errors, setErrors, handler } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Box className="form-group">
      {/* 1. Added Label for consistency with Name/Email */}
      <Typography
        sx={{
          fontSize: '16px',
          lineHeight: '1.6',
          fontWeight: 600,
          fontFamily: 'SofiaPro',
          color: '#231F20',
          paddingBottom: '12px'
        }}
      >
        Gender
      </Typography>

      <div className="relative">
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-primary-100 min-h-[48px] px-[3.6vw] md:px-[1.67vw] flex justify-between items-center gap-[5px] rounded-full cursor-pointer"
        >
          {value === '' ? (
            <p className="font-[SofiaPro] text-[#231F2099] text-[14px] md:text-[.97vw]">Select gender</p>
          ) : (
            <p className="font-[SofiaPro] text-[14px] md:text-[.97vw]">{value}</p>
          )}
          <div
            className={`relative w-[1.1vw] mob:w-[4.1vw] transition-all ease-in-out ${
              showDropdown ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <Image src={greenDropdownIcon} alt="dropdown icon" />
          </div>
        </div>

        {showDropdown && (
          <div className="bg-[#000] z-[10] rounded-[10px] p-[16px] min-w-[200px] absolute mt-[.8vw] right-0 shadow-xl">
            <ul className="ps-0 m-0">
              {genderList.map((data) => (
                <li
                  onClick={() => {
                    setShowDropdown(false);
                    handler(name, data.name);
                  }}
                  className="list-none cursor-pointer pl-0 flex items-center py-[10px] first:pt-0 last:pb-0 gap-[10px] border-b border-b-[#545458A6] last:border-none"
                  key={data.id}
                >
                  <p className={`${value === data.name ? 'text-[#FFA500]' : 'text-transparent'}`}>✓</p>
                  <button
                    className={`font-[SofiaPro] text-sm ${value === data.name ? 'text-[#FFA500]' : 'text-white'}`}
                  >
                    {data.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. ADDED ERROR MESSAGE DISPLAY HERE */}
      {errors.gender && (
        <Typography
          variant="body2"
          sx={{
            color: '#C70000',
            fontWeight: 'normal',
            display: 'block',
            fontFamily: 'SofiaPro',
            marginTop: '4px'
          }}
        >
          {errors.gender}
        </Typography>
      )}
    </Box>
  );
};
export default SelectDropdown;

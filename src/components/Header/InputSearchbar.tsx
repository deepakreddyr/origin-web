import React, { useState } from 'react';
import serachIcon from '/public/assets/images/searchbar.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
const InputSearchbar = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  const { asPath, query } = router;
  return (
    <div
      onClick={() => {
        if (asPath === '/search') return;
        else router.push('/search');
      }}
      className="flex items-center rounded-full w-[25vw] bg-primary-200 pr-[1.1vw]"
    >
      <input
        className="outline-none h-[2.6vw] text-black placeholder:text-black px-[1.1vw] text-[.83vw] font-[SofiaPro] placeholder:text-[.83vw] rounded-full w-[23.9vw] bg-primary-200"
        placeholder="Search Products "
      />
      <div className="relative w-[1.1vw] h-[1.1vw] ">
        <Image src={serachIcon} alt="searchbar icon" />
      </div>
    </div>
  );
};

export default InputSearchbar;

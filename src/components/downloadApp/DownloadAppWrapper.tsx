import React from 'react';
import originIcon from '/public/assets/images/originIcon.png';
import mobileDownload from '/public/assets/images/mobileDownload.png';
import appStore from '/public/assets/images/appStore.png';
import googlePlaystore from '/public/assets/images/googlePlaystore.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
const DownloadAppWrapper = () => {
  const router = useRouter();
  return (
    <div className="bg-beige-200 w-full min-h-screen relative">
      <div className="bg-white w-full  pb-0 rounded-t-[10vw] absolute bottom-0 ">
        <div className="px-[8vw] pt-[6vw] ">
          <p className="font-[SofiaPro] text-[5.12vw] font-semibold text-black text-center ">
            Change your idea of fresh! Download the Origin app
          </p>
          <div className="flex items-center justify-center gap-[3vw] mob:py-[6vw] ">
            <div className="w-[9vw] h-[9vw] relative ">
              <Image src={originIcon} alt="origin icon" />
            </div>

            <p className="font-[SofiaPro] text-[3.6vw] font-semibold  ">Origin Fresh </p>
          </div>
        </div>
        <div className="relative w-screen h-[60vh] ">
          <Image src={mobileDownload} alt="download icon" fill />
        </div>
        <div className="p-[4.1vw]">
          <p className="font-[SofiaPro] text-center text-[4.1vw] font-medium ">#FRESHORNOTHING</p>
          <div className="flex items-center justify-center gap-[6vw] py-[3vw] ">
            <button
              onClick={() => router.push('https://apps.apple.com/in/app/origin-fresh-fruits-veggies/id6505096700')}
              className="relative w-[28vw] h-[8vw] "
            >
              <Image src={appStore} alt="" />
            </button>
            <button
              onClick={() =>
                router.push('https://play.google.com/store/apps/details?id=com.originfresh.user&hl=en_IN&pli=1')
              }
              className="relative w-[28vw] h-[8vw] "
            >
              <Image src={googlePlaystore} alt="" />
            </button>
          </div>
          <div className="font-[SofiaPro] font-medium text-[#7B7979] text-[3vw] text-center">
            <Link className="hover:underline" href={'/terms-and-conditions'}>
              Terms and Conditions
            </Link>{' '}
            <span>| </span>
            <Link className="hover:underline" href={'/terms-and-conditions'}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppWrapper;

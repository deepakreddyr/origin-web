import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { Marquee } from '@devnomic/marquee';
import { Box, Container, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

const featureList = [
  { text: '150+ Exotics ', icon: '/assets/images/primaryFeature1.svg' },
  { text: '100+ Locally Grown Varieties ', icon: '/assets/images/primaryFeature2.svg' },
  { text: 'Easy Refunds/Returns', icon: '/assets/images/primaryFeature3.svg' }
];

const PrimaryFeature = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(600);
  return (
    <div className="flex items-center justify-center">
      <div className="relative z-20 flex items-center justify-around px-[3.3vw] w-[80vw] mob:w-screen mob:h-[15vw] bg-primary-100 top-[-5vw] h-[7vw] rounded-full mob:rounded-none md:overflow-[unset] overflow-x-auto noscrollbar">
        {mobile ? (
          <Marquee className="gap-[3rem] [--duration:15s] text-nowrap" innerClassName="gap-[3rem] [--gap:3rem]">
            {featureList.map((item, index) => (
              <div key={index} className="flex items-center w-max text-[3vw] font-[SofiaPro] whitespace-nowrap">
                <div className="relative w-[8vw] h-[8vw]">
                  <Image src={item.icon} alt={item.text} fill className="object-contain" />
                </div>
                {item.text}
              </div>
            ))}
          </Marquee>
        ) : (
          featureList.map((item, index) => (
            <div key={index} className="flex items-center font-[SofiaPro] w-max text-[1.25vw] whitespace-nowrap">
              <div className="relative w-[3vw] h-[3vw]">
                <Image src={item.icon} alt={item.text} fill className="object-contain" />
              </div>
              {item.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default PrimaryFeature;

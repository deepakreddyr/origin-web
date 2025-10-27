import { useMediaQuery } from '@/utilities/hooks/useMediaQuery';
import { Marquee } from '@devnomic/marquee';
import { Box, Container, Typography, useTheme } from '@mui/material';

const featureList = ['🥑 More than 500 products', '⏰ Priority Deliveries', '🚛 Easy Refunds/Returns'];

const PrimaryFeature = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(600);
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-around px-[3.3vw] w-[80vw] mob:w-screen mob:h-[15vw] bg-primary-100 top-[-5vw] h-[7vw] rounded-full mob:rounded-none md:overflow-[unset] overflow-x-auto noscrollbar">
        {mobile ? (
          <Marquee className="gap-[3rem] [--duration:15s] text-nowrap" innerClassName="gap-[3rem] [--gap:3rem]">
            {featureList.map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-3 w-max text-[1.25vw] font-slab whitespace-nowrap"
              >
                <span className="font-slab text-[5vw] font-medium">{text.split(' ')[0]}</span>
                {text.slice(2)}
              </div>
            ))}
          </Marquee>
        ) : (
          featureList.map((text, index) => (
            <div key={index} className="flex items-center gap-3 font-slab w-max text-[1.25vw] whitespace-nowrap">
              <span className="text-[1.389vw]  font-slab font-medium ">{text.split(' ')[0]}</span>
              {text.slice(2)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default PrimaryFeature;

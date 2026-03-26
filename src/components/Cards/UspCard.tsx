import Image from 'next/image';

type USPPROPS = {
  cardData: {
    icon: string;
    title: string;
  };
};

const UspCard = ({ cardData }: USPPROPS) => {
  const { icon, title } = cardData;
  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-4 md:py-[25px] border-2 border-dashed rounded-[1vw] mob:rounded-[2vw] border-primary h-17 mob:h-[40vw]">
      {/* Icon Container */}
      <div className="w-14 h-14 md:w-20 md:h-20 relative mb-4 md:mb-4">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>

      {/* Title Text */}
      <div className="w-full">
        <p className="font-[SofiaPro] font-semibold text-[13px] md:text-[20px] leading-snug text-center text-black px-1 md:px-2">
          {title}
        </p>
      </div>
    </div>
  );
};

export default UspCard;

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
    <div className="flex flex-col items-center justify-center p-3 md:p-3 border-2 border-dashed rounded-[1vw] mob:rounded-[2vw] border-primary h-17 mob:h-[40vw]">
      {/* Icon Container */}
      <div className="w-14 h-14 md:w-28 md:h-28 relative mb-4 md:mb-8">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>

      {/* Title Text */}
      <div className="w-full">
        <p className="font-[SofiaPro] font-bold text-[13px] md:text-[22px] leading-snug text-center text-black px-1 md:px-2">
          {title}
        </p>
      </div>
    </div>
  );
};

export default UspCard;

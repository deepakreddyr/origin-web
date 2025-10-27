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
    <div className="flex flex-col items-center w-[16.319vw] mob:w-full  ">
      <div className="w-[7vw] mob:w-[26.67vw] mob:h-[26.67vw]  h-[7vw] relative ">
        <Image src={icon} alt={title} fill />
      </div>
      <div className="h-[6vw] mt-[1.67vw] mob:w-[25.5vw] ">
        <p className="font-slab font-medium text-[1.52vw] mob:text-[3.6vw] text-center ">{title}</p>
      </div>
    </div>
  );
};

export default UspCard;

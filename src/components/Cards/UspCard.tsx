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
    <div className="relative w-full aspect-[1.5/1] md:w-full md:h-[15vw] mob:h-[35vw]">
      <Image src={icon} alt={title} fill className="object-contain" />
    </div>
  );
};

export default UspCard;

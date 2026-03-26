import Image from 'next/image';

const featureList = [
  { text: '150+ Exotics', icon: '/assets/images/primaryFeature1.svg' },
  { text: '100+ Locally Grown Varieties', icon: '/assets/images/primaryFeature2.svg' },
  { text: 'No Dark Stores', icon: '/assets/images/primaryFeature4.svg' },
  { text: 'Easy Refunds/Returns', icon: '/assets/images/primaryFeature3.svg' }
];

const PrimaryFeature = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Mobile Auto-scrolling Marquee */}
      <div className="hidden mob:flex w-full">
        <div className="flex animate-infinite-scroll gap-4 items-center whitespace-nowrap">
          {[...featureList, ...featureList, ...featureList].map((item, index) => (
            <div key={index} className="flex items-center gap-4 px-6 py-3 bg-[#fcefae] rounded-full shrink-0">
              <div className="relative w-6 h-6">
                <Image src={item.icon} alt={item.text} fill className="object-contain scale-125" />
              </div>
              <span className="text-[#1A202C] font-bold text-lg whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Static View */}
      <div className="flex mob:hidden items-center justify-center gap-4 w-full">
        {featureList.map((item, index) => (
          <div key={index} className="flex items-center gap-3 px-10 py-2 bg-[#fcefae] rounded-full">
            <div className="relative w-6 h-6">
              <Image src={item.icon} alt={item.text} fill className="object-contain scale-125" />
            </div>
            <span className="text-[#1A202C] font-semibold text-sm lg:text-[1.2vw] whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryFeature;

import { StoreLocation } from '@/utilities/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DirectionsIcon from '@mui/icons-material/Directions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import locationBanner from '/public/assets/images/store/locationBanner.png';

interface StoreListProps {
  stores: StoreLocation[];
  selectedStoreId: number | null;
  onSelectStore: (id: number) => void;
}

const StoreList = ({ stores, selectedStoreId, onSelectStore }: StoreListProps) => {
  const getDirectionsUrl = (store: StoreLocation) =>
    `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;

  const getStoreTags = (slug: string) => {
    if (slug.includes('koramangala')) return ['Organic Only', 'Farm Direct'];
    return ['Exotic Fruits', 'Fresh Daily'];
  };

  const getStoreImage = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('annanagar') || s.includes('anna-nagar')) return '/assets/images/store/Annanagar.webp';
    if (s.includes('besant')) return '/assets/images/store/BesantNagar.webp';
    if (s.includes('frazer') || s.includes('ulsoor')) return '/assets/images/store/Ulsoor.webp';
    if (s.includes('mysuru') || s.includes('mysore')) return '/assets/images/store/Mysore.webp';
    if (s.includes('pune')) return '/assets/images/store/Pune.jpeg';
    if (s.includes('phoenix')) return '/assets/images/neworiginlogo.png';
    return locationBanner;
  };

  return (
    <div className="flex flex-col gap-5">
      {stores.map((store, i) => {
        const isSelected = selectedStoreId === store.id;
        const tags = getStoreTags(store.slug);
        const storeImage = getStoreImage(store.slug);

        return (
          <motion.div
            key={store.id}
            id={`store-card-${store.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => onSelectStore(store.id)}
            className="cursor-pointer border-gray-100 bg-white transition-all duration-200 overflow-hidden mx-auto mob:w-[350px] mob:h-[222.5px] w-full"
            style={{
              borderRadius: '24.42px',
              borderWidth: '0.76px',
              padding: '18.31px'
            }}
          >
            <div className="flex flex-row gap-3 sm:gap-4 h-full">
              <div className="w-[110px] sm:w-[130px] h-[110px] sm:h-[130px] shrink-0 rounded-[16px] overflow-hidden relative bg-gray-100">
                <Image
                  src={storeImage}
                  alt={store.name}
                  layout="fill"
                  objectFit={typeof storeImage === 'string' && storeImage.includes('logo') ? 'contain' : 'cover'}
                  className="rounded-[16px]"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-start gap-1 mb-1">
                  <h3 className="font-[Recoleta] font-bold text-[#D3A021] text-[18px] sm:text-[22px] leading-[1.1] truncate whitespace-normal line-clamp-2">
                    {store.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
                    <span className="text-[#00855B] text-[9px] font-bold tracking-wide whitespace-nowrap">
                      OPEN NOW
                    </span>
                  </div>
                </div>

                <p className="font-[SofiaPro] text-[#333333] text-[12px] leading-[1.3] mb-2 line-clamp-2">
                  {store.address}
                </p>

                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#FCF9EC] text-[#8C7A5A] text-[9px] font-[SofiaPro] font-bold px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-black font-[SofiaPro] font-medium text-[11px] mb-2">
                  <AccessTimeIcon style={{ fontSize: 14 }} />
                  07:00 AM - 10:00 PM
                </div>

                <div className="mt-auto">
                  <a
                    href={getDirectionsUrl(store)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex justify-center items-center gap-1.5 bg-[#fac510] hover:opacity-90 text-black font-semibold font-[SofiaPro] text-[12px] rounded-full py-2 transition-all"
                  >
                    <DirectionsIcon style={{ fontSize: 16 }} />
                    GetDirections
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StoreList;

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

  return (
    <div className="flex flex-col gap-5">
      {stores.map((store, i) => {
        const isSelected = selectedStoreId === store.id;
        const tags = getStoreTags(store.slug);

        return (
          <motion.div
            key={store.id}
            id={`store-card-${store.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => onSelectStore(store.id)}
            className="cursor-pointer rounded-[24px] border border-gray-100 bg-white transition-all duration-200 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
              {/* Image Section */}
              <div className="w-full sm:w-[130px] h-[160px] sm:h-[130px] shrink-0 rounded-[16px] overflow-hidden relative bg-gray-100">
                <Image
                  src={locationBanner}
                  alt={store.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-[16px]"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-between pt-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-[Recoleta] font-bold text-[#D3A021] text-[20px] sm:text-[22px] leading-[1.1]">
                    {store.name}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
                    <span className="text-[#00855B] text-[10px] font-bold tracking-[0.1em]">OPEN NOW</span>
                  </div>
                </div>

                <p className="font-[SofiaPro] text-[#333333] text-[14px] leading-[1.3] max-w-[90%] mb-3">
                  {store.address.split(',')[0]}, {store.address.split(',')[1] || store.address}
                </p>

                {/* <div className="flex gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-[#FDF9F3] text-[#8C7A5A] text-[11px] font-[SofiaPro] font-bold px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div> */}

                <div className="flex items-center gap-1.5 text-black font-[SofiaPro] font-medium text-[13px] mb-1">
                  <AccessTimeIcon style={{ fontSize: 16 }} />
                  07:00 AM - 10:00 PM
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
              <a
                href={getDirectionsUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex justify-center items-center gap-2 bg-[#FFB600] hover:bg-[#FFC107] text-black font-bold font-[SofiaPro] text-[15px] rounded-full py-[14px] transition-colors"
              >
                <DirectionsIcon style={{ fontSize: 20 }} />
                Get Directions
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StoreList;

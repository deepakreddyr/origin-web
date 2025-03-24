import Image from 'next/image';
import React from 'react';
import AddItemBtn from './AddItemBtn/AddItemBtn';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const ItemCard = (props: any) => {
  const { itemDetails } = props;
  const router = useRouter();
  const defaultUOM = itemDetails?.multiple_uoms.find((uom: any) =>
    uom?.is_default === true ? uom : itemDetails.multiple_uoms[0]
  );
  if (!defaultUOM) return;
  return (
    <button
      disabled={!defaultUOM.is_available}
      onClick={() => {
        router.push(`/${itemDetails.item_name.replace(/ /g, '-').toLowerCase()}/${itemDetails.id}`);
      }}
      className={`cursor-pointer w-[16.67vw] mob:w-[40vw] text-start ${!defaultUOM.is_available ? 'opacity-50' : 'opacity-100'}`}
    >
      <div
        className={`relative bg-primary-100 flex items-center justify-center w-[16.67vw] mob:h-[38vw] mob:w-[40vw] h-[14.5vw] rounded-[1.67vw] mob:rounded-[4.1vw] `}
      >
        <div className="relative w-[12.6vw] h-[12vw] mob:w-[24vw] mob:h-[22vw] ">
          <Image src={itemDetails.image} alt={itemDetails.name ? itemDetails.name : 'cart image'} fill />
        </div>
        {!defaultUOM.is_available && (
          <div className="bg-black-op-50 absolute bottom-0 px-[1.1vw] mob:px-[4.1vw] py-[.7vw] mob:py-[2vw] rounded-t-[1.1vw] mob:rounded-t-[4.1vw] ">
            <p className="text-[.78vw] mob:text-[3vw] font-[SofiaPro] font-semibold text-white ">OUT OF STOCK</p>
          </div>
        )}
      </div>
      <div className="h-[5.5vw] mob:h-[15vw]">
        <p className="font-[SofiaPro] font-semibold text-[1.25vw] mob:text-[3.6vw] pt-[1.389vw] ">{itemDetails.name}</p>
      </div>
      <div className="flex items-end justify-between ">
        <div>
          <p className="font-[SofiaPro] text-[.97vw] mob:text-[2.8vw]  text-black-op-50 ">{defaultUOM.unit}</p>
          <p className="font-[SofiaPro] font-medium text-[1.25vw] mob:text-[3vw] mob:pt-[01vw] pt-[.4vw] text-black ">
            {defaultUOM.formatted_price}
          </p>
        </div>
        <div>
          <AddItemBtn
            product={itemDetails}
            varientId={defaultUOM.variant_id}
            varientPrice={defaultUOM.price}
            stepperQuantity={defaultUOM.stepper_quantity}
            buttonType={'white'}
          />
        </div>
      </div>
    </button>
  );
};

export default ItemCard;

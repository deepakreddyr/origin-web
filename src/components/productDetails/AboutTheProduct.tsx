import React from 'react';

const AboutTheProduct = (props: any) => {
  const { productDetails } = props;
  if (!productDetails.item.description) return;
  return (
    <div className=" border rounded-[1.1vw] border-beige-200 p-[1.1vw]">
      <p className="font-[Stinger] text-[1.25vw] font-semibold text-black-op-80">About</p>
      <p>{productDetails.item.description}</p>
    </div>
  );
};

export default AboutTheProduct;

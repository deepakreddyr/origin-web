import Link from 'next/link';
import React from 'react';

const BreadCrumbNavigation = (props: any) => {
  const { productDetails } = props;
  return (
    <div className="font-[SofiaPro] text-[.83vw] font-medium text-secondary">
      <Link className="" href={'/shop'}>
        Home
      </Link>{' '}
      /{' '}
      <Link className="" href={'/'}>
        p
      </Link>{' '}
      /{' '}
      <Link className=" text-black" href={'/'}>
        d
      </Link>
    </div>
  );
};

export default BreadCrumbNavigation;

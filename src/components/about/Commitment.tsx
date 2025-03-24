import React from 'react';
import commitmentImg from '/public/assets/images/about/commitment.webp';
import Image from 'next/image';

const Commitment = () => {
  return (
    <div className=" pb-[5vw] mob:pb-[10vw] w-full bg-primary relative flex items-center mob:flex-col mob:justify-start justify-between">
      <div className=" w-[38.5vw] mob:w-[95vw] h-[57vw] mob:h-[120vw] mob:ml-[-5vw] relative">
        <Image src={commitmentImg} alt="commitment image" fill />
      </div>
      <div className="w-[40.5vw] mob:w-full mr-[10vw] mob:mr-[0vw] mob:p-[4.1vw] ">
        <p className="text-[4.4vw] mob:text-[10.2vw] font-[Stinger] leading-none font-bold  pb-[2vw] pt-[4vw]">
          Commitment <br /> to Freshness
        </p>
        <p className="font-[SofiaPro] font-light text-[1.25vw] mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw]  ">
          At Origin, our commitment to freshness is more than just a catchphrase; it&apos;s a way of life. We&apos;re
          dedicated to transforming &apos;fresh&apos; from a mere buzzword into an everyday reality. Our mission is
          simple yet profound: we want every meal you enjoy to be a testament to the power of freshness.
        </p>
        <p className="font-[SofiaPro] font-light text-[1.25vw] mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw] mob:py-[5vw] py-[2.2vw]">
          But what does this commitment mean to us? It&apos;s about more than just offering fresh produce; it&apos;s a
          holistic approach that enriches our community, supports local farmers, and reduces food waste. When you choose
          Origin, you&apos;re not just selecting groceries; you're joining a vibrant community that understands the true
          value of fresh. Our goal is to break the traditional pattern, building trust, fostering referrals, elevating
          your fresh produce purchase experience, and ensuring your lasting satisfaction.{' '}
        </p>
        <p className="font-[SofiaPro] font-light text-[1.25vw]  mob:text-[4.1vw] leading-[2vw] mob:leading-[6vw] ">
          Welcome to Origin, where freshness isn&apos;t just a promise; it&apos;s a standard we uphold every day.
        </p>
      </div>
    </div>
  );
};

export default Commitment;

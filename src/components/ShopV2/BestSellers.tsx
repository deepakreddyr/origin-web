import { ShopDataType } from '@/utilities/types'
import React from 'react'
import OriginButton from '../OriginButton'
import CarouselButtons from '../CarouselButtons'
import { Box } from '@mui/material'
import SliderCarousel from '../shared/SliderCarousel'
import ItemCard from '../shared/ItemCard'
import CA from 'classnames'

interface CategorySectionProps {
    shopData: ShopDataType
}
const BestSellers = (props: CategorySectionProps) => {
    const { shopData } = props

    const mainCategoryList =
        shopData.find((item: any) => item.title === 'Best Sellers')?.data || []
    return (
        <div className="bg-[#F2EEE433] relative left-[7.5vw] border-r-0  border-primary-200 w-[83.6vw] bg-white py-0 md:py-9 border pt-[72px] md:pb-0 pl-[2.7vw] lg:rounded-l-[48px] ltransition-all duration-50 ease-in-out">
            <h1 className="font-Stinger text-[1.944vw] font-bold py-[1.1vw] ">
                Bestsellers
            </h1>
            <div className="">
                <SliderCarousel
                    className={CA('poBlogs-slider')}
                    slides={mainCategoryList?.map((item: any) => (
                        <ItemCard itemDetails={item} key={item.id} />
                    ))}
                    // slidesPerView={3.85}
                    // spaceBetween={53}
                    freeMode={{ enabled: true }}
                    mousewheel={{
                        forceToAxis: true,
                    }}
                    speed={1000}
                    navigation={{
                        nextEl: '.poBlogsRight',
                        prevEl: '.poBlogsLeft',
                    }}
                />
            </div>

            <Box className="flex items-center justify-between py-[2vw] pr-[3vw]">
                <OriginButton
                    // handleClick={() => router.push('/blogs')}
                    variant="outlined"
                    buttonText="Shop all products"
                    classes={{ iconButton: 'py-2 px-4 md:py-4 md:px-7' }}
                />
                <CarouselButtons
                    leftButtonClass="poBlogsRight"
                    rightButtonClass="poBlogsLeft"
                />
            </Box>
        </div>
    )
}

export default BestSellers

import React from 'react'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import OriginButton from '../OriginButton'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Category } from '../../utilities/types'

type IMAGE_CARD_PROPS = {
    ICardData: Category
    className?: string
}

const ImageCard = ({ ICardData, className }: any) => {
    const { image, title, title: category, actionLabel, url } = ICardData
    const router = useRouter()

    return (
        <Link
            href={url}
            className={`group relative aspect-[33/40] md:aspect-[unset] flex flex-col items-center justify-between pb-5 bg-primary-100 rounded-[15px] md:rounded-[30px] w-full h-full min-h-[150px] md:min-h-[282px] overflow-hidden group ${className}`}
        >
            <Typography
                variant="body1"
                className="block mb-2 md:mb-3 px-6 md:px-14 p-5 md:pt-14 w-full md:w-auto font-slab font-medium text-base text-left md:text-center md:text-lg cursor-pointer"
            >
                {title}
            </Typography>
            <div className="relative w-[250px] h-[250px] ">
                <Image
                    className="group-hover:scale-105 -right-12 -bottom-12 absolute w-40 sm:w-44 md:w-48 h-auto origin-center transition-transform duration-200 aspect-square ease-in-out"
                    src={image}
                    alt={category}
                    // width={250}
                    // height={250}
                    priority={true}
                    fill
                />
            </div>
            <OriginButton
                buttonText={actionLabel}
                handleClick={() => {
                    router.push(url)
                }}
                classes={{
                    iconButton: 'opacity-0 group-hover:opacity-100',
                }}
            />
        </Link>
    )
}

export default ImageCard

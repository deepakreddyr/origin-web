import { SxProps, Theme } from '@mui/material'
import classNames from 'classnames'
import React from 'react'
import { OriginLogoDark } from '../../../Icons/OriginIcons'
type Props = { className?: string; sx?: SxProps<Theme> }

const Logo = ({ className, sx }: Props) => {
    return (
        <OriginLogoDark
            sx={sx}
            className={classNames(
                'pt-1 ms-5 w-20 md:w-[120px] h-auto md:h-[70px]',
                className
            )}
        />
    )
}

export default Logo

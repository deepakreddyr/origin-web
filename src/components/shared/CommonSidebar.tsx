import React from 'react'
import Cross from '/public/assets/svg/xmark.svg'
import backIcon from '/public/assets/icons/backIcon.png'
import Image from 'next/image'
import { IconButton } from '@mui/material'
const CommonSidebar = (props: any) => {
    const { children, onClose, onBack, isBackButtonEnabled } = props
    // box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.08);

    return (
        <div className="fixed flex items-center justify-end inset-0 bg-[#15151580]  z-[100]">
            <div className="bg-white h-screen w-[30vw]  ">
                <div className="flex items-center justify-between shadow-[0px_4px_32px_0px_rgba(0,0,0,0.08)] py-[.5vw] px-[.5vw] ">
                    <div className="flex items-center ">
                        {isBackButtonEnabled && (
                            <IconButton
                                className="w-[3vw] h-[3vw] relative "
                                onClick={() => {
                                    // onClickBackButton()
                                }}
                            >
                                <Image src={backIcon} alt="cross" />
                            </IconButton>
                        )}
                        <div>heading</div>
                    </div>
                    <IconButton className="w-[3vw] h-[3vw] relative ">
                        <Image src={Cross} alt="cross" />
                    </IconButton>
                </div>
                <div className="p-[1.25vw]">{children}</div>
            </div>
        </div>
    )
}

export default CommonSidebar

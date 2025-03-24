import { Box } from '@mui/material'
import { useAtom } from 'jotai'
import React from 'react'

import AccountSidebarLayout from '../../../../components/AccountLayout/AccountSidebarLayout'
import { activeAccountsPageAtom, isAccountIsOpen } from '../../context/atoms'
import ActiveSidebar from '../../enums/ActiveSidebar'
import AccountIntro from './AccountIntro'
import AccountSettings from './AccountSettings'
import SidebarWrapper from '@/components/Login/components/SidebarWrapper'

const AccountMain = () => {
    const [isOpen, setIsOpen] = useAtom(isAccountIsOpen)
    const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom)

    const onClickBackButton = () => {}
    let isBackButtonEnable = true
    return (
        <Box
            // className="account-main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                paddingBottom: '20spx',
            }}
        >
            {/* <AccountSidebarLayout
                isOpen={isOpen}
                title="My Account"
                onClose={() => {
                    setIsOpen(false)
                }}
            > */}

            <AccountIntro />
            <AccountSettings />
            {/* </AccountSidebarLayout> */}
        </Box>
    )
}

export default AccountMain

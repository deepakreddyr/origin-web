import { TabTypeConstant } from '@/components/Login/constants/tabTypeContent'

export const getHeaderSidebarName = (tabType: string) => {
    switch (tabType) {
        case TabTypeConstant.ENTER_MOBILE_NUMBER:
        case TabTypeConstant.ENTER_OTP:
            return 'Login / Sign up'

        case TabTypeConstant.REGISTER:
            return 'Registration'

        case TabTypeConstant.ACCOUNT_MAIN:
        case TabTypeConstant.EDIT_ACCOUNT:
            return 'My Account'

        case TabTypeConstant.YOUR_ORDERS:
            return 'My Orders'

        case TabTypeConstant.MANAGE_ADDRESS:
        case TabTypeConstant.ADDRESS_LIST:
        case TabTypeConstant.SERVICEABILITY:
        case TabTypeConstant.COMPLETE_ADDRESS:
        case TabTypeConstant.MANUAL_ADDRESS:
        case TabTypeConstant.NO_DATA:
            return 'Manage Address'

        case TabTypeConstant.SETTING:
            return 'Settings'
        case TabTypeConstant.HELP_FAQ:
            return 'Faqs & Help'
        case TabTypeConstant.CART:
            return 'Your cart'
        default:
            return 'Login / Sign up'
    }
}

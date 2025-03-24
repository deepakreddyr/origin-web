import { Box, Button, Typography } from "@mui/material"
import { useAtom } from "jotai"

import { isCartPageIsOpen } from "../../../CartPage/context/atoms"
import {
    addressDetailsAtom,
    addressSidebarDetails,
    isAddressIsOpen,
    isEditingAddress,
    saveAddressAtom,
} from "../../context/atoms"
import TabType from "../../enums/TabType"
import styles from "./style.module.css"

export default function DeliveryChangeConfirmation() {
    const [, setIsOpen] = useAtom(isAddressIsOpen)
    const [, setIsOpenCart] = useAtom(isCartPageIsOpen)
    const [editingDetails, setIsEditingAddress] = useAtom(isEditingAddress)
    const [sidebarDetails, setSidebarDetails] = useAtom(addressSidebarDetails)
    const [, setAddressDetails] = useAtom(addressDetailsAtom)
    const [, setAddressAtom] = useAtom(saveAddressAtom)

    const onClose = () => {
        if (!editingDetails.isActive) {
            if (sidebarDetails.tabType === TabType.COMPLETE_ADDRESS) {
                setSidebarDetails((prevProps) => ({
                    ...prevProps,
                    tabType: TabType.ADDRESS_SELECTION,
                }))
                return
            }
            setIsEditingAddress({
                isActive: false,
                addressDetails: null,
            })
            // setAddressDetails(() => ({
            //   address_name: '',
            //   address_id: '',
            //   address: '',
            //   door_no: '',
            //   locality: '',
            //   landmark: '',
            //   latitude: 0,
            //   longitude: 0,
            //   formatted_address: '',
            //   deliverable: false
            // }));
            setIsOpen(false)
            setAddressAtom((prevState: any) => ({
                ...prevState,
                isSaved: false,
            }))
            return
        }

        setIsOpen(false)
        setIsOpenCart(true)
    }

    return (
        <Box className={styles["main-container"]}>
            <Typography className={styles["delivery-change-heading"]}>
                Delivery Location changed!
            </Typography>
            <Typography className={styles["delivery-change-content"]}>
                This might affect the maximum item limit, prices and
                availability based on changed location.
            </Typography>
            <Typography className={styles["review-cart-content"]}>
                Please review your cart & continue.
            </Typography>
            <Button onClick={onClose}>Alright</Button>
        </Box>
    )
}

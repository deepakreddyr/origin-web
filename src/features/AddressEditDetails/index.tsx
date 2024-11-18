import { Box } from '@mui/material';
import { useAtom } from 'jotai';

import { isAddressListIsOpen } from '../Address/context/atoms';
import { isCartPageIsOpen } from '../CartPage/context/atoms';
import CheckServiceability from './components/CheckServiceability';
import CompleteAddress from './components/CompleteAddress';
import DeliveryChangeConfirmation from './components/DeliveryChangeConfirmation';
import {
  addressDetailsAtom,
  addressSidebarDetails,
  goBackToAddressAtom,
  isAddressIsOpen,
  isEditingAddress,
  saveAddressAtom
} from './context/atoms';
import GoBack from './enums/GoBack';
import TabType from './enums/TabType';
import AddressSidebarLayout from '@/components/CartLayout/AddressSidebarLayout';

const Address = () => {
  const [isOpen, setIsOpen] = useAtom(isAddressIsOpen);
  const [sidebarDetails, setSidebarDetails] = useAtom(addressSidebarDetails);
  const [, setIsOpenCart] = useAtom(isCartPageIsOpen);
  const [goBackAddress, setGoBackAddress] = useAtom(goBackToAddressAtom);

  const [addressAtom, setAddressAtom] = useAtom(saveAddressAtom);
  const [, setIsAddressListOpen] = useAtom(isAddressListIsOpen);
  const [addressDetails, setAddressDetails] = useAtom(addressDetailsAtom);
  const [, setIsEditingAddress] = useAtom(isEditingAddress);

  const onBack = () => {
    switch (goBackAddress) {
      case GoBack.ADDRESS_LIST_SIDEBAR: {
        setIsOpen(false);
        setGoBackAddress(GoBack.PAYMENT_SIDEBAR);
        setIsAddressListOpen(true);
        break;
      }

      case GoBack.PAYMENT_SIDEBAR: {
        if (addressAtom.isSaved) {
          setAddressAtom((prevState: any) => ({
            ...prevState,
            isSaved: false
          }));
          return;
        }

        switch (sidebarDetails.tabType) {
          case TabType.ADDRESS_SELECTION: {
            setIsOpen(false);
            setIsOpenCart(true);
            break;
          }
          case TabType.COMPLETE_ADDRESS: {
            setSidebarDetails((prevProps: any) => ({
              ...prevProps,
              tabType: TabType.ADDRESS_SELECTION
            }));
            break;
          }
          default: {
            break;
          }
        }
        break;
      }

      case GoBack.MANAGE_ADDRESS_PAGE: {
        if (sidebarDetails.tabType === TabType.COMPLETE_ADDRESS) {
          setSidebarDetails((prevProps: any) => ({
            ...prevProps,
            tabType: TabType.ADDRESS_SELECTION
          }));
          return;
        }
        setIsEditingAddress({
          isActive: false,
          addressDetails: null
        });
        setAddressDetails(() => ({
          address_name: '',
          address: '',
          door_no: '',
          locality: '',
          landmark: '',
          latitude: 0,
          longitude: 0,
          formatted_address: '',
          deliverable: false,
          address_id: null
        }));
        setIsOpen(false);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <AddressSidebarLayout
      isOpen={isOpen}
      title={addressAtom.isSaved ? '' : sidebarDetails.tabType}
      onClose={() => {
        setIsOpen(false);
      }}
      onBack={onBack}
      isBackEnable={true}
    >
      to be removed
      {/* <Box
        className="body-inner"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
      </Box> */}
    </AddressSidebarLayout>
  );
};

export default Address;
